import { Unit } from '../../types';

/**
 * Forest of An-Ylthin: Pure Combat & Damage Calculations
 */

export interface AttackResult {
  rawDamage: number;
  mitigatedDamage: number;
  actualDamage: number;
  isCursed: boolean;
  vampiricHealAmount: number;
  newTargetHealth: number;
  newTargetDamage: number;
  newTargetStack: number;
  stacksLost: number;
  isTargetDead: boolean;
}

export interface VampiricHealResult {
  updatedHealth: number;
  newStack: number;
  newDamage: number;
  healApplied: number;
}

/**
 * Calculates health, stack, and damage restoration when a unit heals via Vampiric Drain.
 */
export function applyVampiricHeal(
  unit: Unit,
  healAmount: number
): VampiricHealResult {
  if (healAmount <= 0) {
    return {
      updatedHealth: unit.updatedHealth,
      newStack: unit.stack,
      newDamage: unit.updatedDamage,
      healApplied: 0,
    };
  }

  const maxHealth =
    unit.maxHealth || (unit.health * (unit.maxStack || unit.stack || 1));
  const newHealth = Math.min(maxHealth, unit.updatedHealth + healAmount);
  const healApplied = newHealth - unit.updatedHealth;

  if (unit.type === 'Hero') {
    const weaknessMultiplier = unit.weaknessDamage ?? 1;
    return {
      updatedHealth: newHealth,
      newStack: 1,
      newDamage: Math.ceil(unit.damage * weaknessMultiplier),
      healApplied,
    };
  }

  const maxStack = unit.maxStack || unit.stack || 1;
  const singleUnitHealth = unit.health || 1;
  const newStack = Math.min(maxStack, newHealth / singleUnitHealth);
  const weaknessMultiplier = unit.weaknessDamage ?? 1;
  const newDamage = Math.max(
    1,
    Math.ceil(unit.damage * newStack * weaknessMultiplier)
  );

  return {
    updatedHealth: newHealth,
    newStack,
    newDamage,
    healApplied,
  };
}

/**
 * Calculates physical attack damage with armor mitigation, curse nullification, and stack depletion.
 *
 * Formula:
 * - mitigatedDamage = attackingUnit.updatedDamage * max(0, 1 - (attackedUnit.armor / 10))
 * - If cursed: damage = 0 (curse is consumed).
 * - Vampiric heal (if enabled): 60% of damage dealt.
 */
export function calculatePhysicalAttack(
  attackingUnit: Unit,
  attackedUnit: Unit
): AttackResult {
  const isCursed = Boolean(attackingUnit.cursed);
  const armorMitigationRatio = Math.max(0, 1 - attackedUnit.armor / 10);
  const rawDamage = Math.ceil(attackingUnit.updatedDamage);
  const mitigatedDamage = Math.round(rawDamage * armorMitigationRatio);
  const actualDamage = isCursed ? 0 : mitigatedDamage;

  const isVampiric = Boolean(attackingUnit.vampiricHeal);
  const vampiricHealAmount = isVampiric ? Math.round(actualDamage * 0.6) : 0;

  const stacksLost = Math.floor(actualDamage / attackedUnit.health);
  const weaknessMultiplier = attackedUnit.weaknessDamage ?? 1;

  let newTargetDamage =
    attackedUnit.updatedDamage -
    attackedUnit.damage * stacksLost * weaknessMultiplier;
  if (newTargetDamage < 1 && attackedUnit.stack > 0) {
    newTargetDamage = 1;
  }

  const newTargetHealth = attackedUnit.updatedHealth - actualDamage;
  const newTargetStack = Math.max(
    0,
    attackedUnit.stack - actualDamage / attackedUnit.health
  );

  return {
    rawDamage,
    mitigatedDamage,
    actualDamage,
    isCursed,
    vampiricHealAmount,
    newTargetHealth,
    newTargetDamage: Math.ceil(newTargetDamage),
    newTargetStack,
    stacksLost,
    isTargetDead: newTargetHealth <= 0,
  };
}

/**
 * Calculates Dark Magic: Shatter Armor reduction power.
 *
 * Formula:
 * - Hero: 1 + (1 * spellpower)
 * - Non-Hero: 1 + (0.7 * stack) + (level / 2)
 */
export function calculateShatterArmorPower(caster: Unit): number {
  if (caster.type === 'Hero') {
    const sp = caster.spellpower ?? 0;
    return 1 + sp;
  }
  const level = caster.level ?? 1;
  return 1 + 0.7 * caster.stack + level / 2;
}

/**
 * Calculates Dark Magic: Weakness damage multiplier.
 *
 * Formula:
 * - Hero: 0.7 - (0.07 * spellpower)
 * - Non-Hero: 0.8 - (0.03 * stack) - (level * 0.05)
 */
export function calculateWeaknessMultiplier(caster: Unit): number {
  if (caster.type === 'Hero') {
    const sp = caster.spellpower ?? 0;
    return Math.max(0.1, 0.7 - 0.07 * sp);
  }
  const level = caster.level ?? 1;
  return Math.max(0.1, 0.8 - 0.03 * caster.stack - level * 0.05);
}

/**
 * Calculates Destruction: Rain of Fire AoE damage power.
 *
 * Formula:
 * - Hero: 30 + (5 * spellpower)
 * - Non-Hero: 10 + (3 * stack) + (level * 3)
 */
export function calculateRainOfFirePower(caster: Unit): number {
  if (caster.type === 'Hero') {
    const sp = caster.spellpower ?? 0;
    return 30 + 5 * sp;
  }
  const level = caster.level ?? 1;
  return 10 + 3 * caster.stack + level * 3;
}

/**
 * Calculates Destruction: Ice Spear single-target burst damage.
 *
 * Formula:
 * - Base damage: 95
 * - Resistance Multiplier: 1 - (magicResistance / 10)
 *   (e.g., breached resistance of -4 turns multiplier into 1.4x = 133 damage)
 */
export function calculateIceSpearDamage(target: Unit): number {
  const resistanceMultiplier = 1 - target.magicResistance / 10;
  return Math.round(95 * resistanceMultiplier);
}

export interface CombatForecast {
  projectedDamage: number;
  projectedKills: number;
  isFatal: boolean;
  effectLabel: string;
}

/**
 * Calculates estimated damage, casualties, and status impact on target hover during targeting mode.
 */
export function calculateCombatForecast(
  attacker: Unit,
  target: Unit,
  actionName: string
): CombatForecast {
  if (actionName === 'Combat: Attack') {
    const result = calculatePhysicalAttack(attacker, target);
    const projectedKills = result.isCursed
      ? 0
      : Math.min(Math.ceil(target.stack), result.stacksLost);
    return {
      projectedDamage: result.actualDamage,
      projectedKills,
      isFatal: result.isTargetDead,
      effectLabel: result.isCursed
        ? 'Curse Absorbs (0 DMG)'
        : `${result.actualDamage} DMG`,
    };
  }

  if (actionName === 'Destruction: Ice Spear') {
    const dmg = calculateIceSpearDamage(target);
    const kills = Math.min(
      Math.ceil(target.stack),
      Math.floor(dmg / target.health)
    );
    const isFatal = target.updatedHealth - dmg <= 0;
    return {
      projectedDamage: dmg,
      projectedKills: kills,
      isFatal,
      effectLabel: `${dmg} Frost DMG`,
    };
  }

  if (actionName === 'Destruction: Rain of Fire') {
    const power = calculateRainOfFirePower(attacker);
    const kills = Math.min(
      Math.ceil(target.stack),
      Math.floor(power / target.health)
    );
    const isFatal = target.updatedHealth - power <= 0;
    return {
      projectedDamage: power,
      projectedKills: kills,
      isFatal,
      effectLabel: `${power} Fire DMG (All Enemies)`,
    };
  }

  if (actionName === 'Dark Magic: Shatter Armor') {
    const power = calculateShatterArmorPower(attacker);
    return {
      projectedDamage: 0,
      projectedKills: 0,
      isFatal: false,
      effectLabel: `-${power.toFixed(1)} Armor`,
    };
  }

  if (actionName === 'Dark Magic: Weakness') {
    const mult = calculateWeaknessMultiplier(attacker);
    return {
      projectedDamage: 0,
      projectedKills: 0,
      isFatal: false,
      effectLabel: `-${Math.round((1 - mult) * 100)}% ATK Power`,
    };
  }

  if (actionName === 'Dark Magic: Curse') {
    return {
      projectedDamage: 0,
      projectedKills: 0,
      isFatal: false,
      effectLabel: '0 DMG Next Strike',
    };
  }

  if (actionName === 'Dark Magic: Breach Resistances') {
    return {
      projectedDamage: 0,
      projectedKills: 0,
      isFatal: false,
      effectLabel: '-4 Magic Resist',
    };
  }

  if (actionName === 'Necromancy: Reanimate') {
    return {
      projectedDamage: 0,
      projectedKills: 0,
      isFatal: false,
      effectLabel: 'Full Revive & Restore',
    };
  }

  if (actionName === 'Necromancy: Vampiric Lust') {
    return {
      projectedDamage: 0,
      projectedKills: 0,
      isFatal: false,
      effectLabel: '+60% Life Drain on Hit',
    };
  }

  return {
    projectedDamage: 0,
    projectedKills: 0,
    isFatal: false,
    effectLabel: '',
  };
}

export interface RetaliationResult {
  canRetaliate: boolean;
  rawDamage: number;
  mitigatedDamage: number;
  actualDamage: number;
  isCursed: boolean;
  vampiricHealAmount: number;
  newAttackerHealth: number;
  newAttackerDamage: number;
  newAttackerStack: number;
  stacksLost: number;
  isAttackerDead: boolean;
}

/**
 * Calculates Retaliation Strike (Defender Counter-Attacks Attacker).
 * Defender can retaliate if:
 * - It survived the initial attack (updatedHealth > 0)
 * - It has not retaliated yet this round (hasRetaliated !== true)
 */
export function calculateRetaliationStrike(
  survivingDefender: Unit,
  attacker: Unit
): RetaliationResult {
  if (
    survivingDefender.updatedHealth <= 0 ||
    survivingDefender.hasRetaliated ||
    (attacker.isRanged && !survivingDefender.isRanged)
  ) {
    return {
      canRetaliate: false,
      rawDamage: 0,
      mitigatedDamage: 0,
      actualDamage: 0,
      isCursed: false,
      vampiricHealAmount: 0,
      newAttackerHealth: attacker.updatedHealth,
      newAttackerDamage: attacker.updatedDamage,
      newAttackerStack: attacker.stack,
      stacksLost: 0,
      isAttackerDead: false,
    };
  }

  const isCursed = Boolean(survivingDefender.cursed);
  const armorMitigationRatio = Math.max(0, 1 - attacker.armor / 10);
  const rawDamage = Math.ceil(survivingDefender.updatedDamage);
  const mitigatedDamage = Math.round(rawDamage * armorMitigationRatio);
  const actualDamage = isCursed ? 0 : mitigatedDamage;

  const isVampiric = Boolean(survivingDefender.vampiricHeal);
  const vampiricHealAmount = isVampiric ? Math.round(actualDamage * 0.6) : 0;

  const stacksLost = Math.floor(actualDamage / attacker.health);
  const weaknessMultiplier = attacker.weaknessDamage ?? 1;

  let newAttackerDamage =
    attacker.updatedDamage - attacker.damage * stacksLost * weaknessMultiplier;
  if (newAttackerDamage < 1 && attacker.stack > 0) {
    newAttackerDamage = 1;
  }

  const newAttackerHealth = attacker.updatedHealth - actualDamage;
  const newAttackerStack = Math.max(
    0,
    attacker.stack - actualDamage / attacker.health
  );

  return {
    canRetaliate: true,
    rawDamage,
    mitigatedDamage,
    actualDamage,
    isCursed,
    vampiricHealAmount,
    newAttackerHealth,
    newAttackerDamage: Math.ceil(newAttackerDamage),
    newAttackerStack,
    stacksLost,
    isAttackerDead: newAttackerHealth <= 0,
  };
}

