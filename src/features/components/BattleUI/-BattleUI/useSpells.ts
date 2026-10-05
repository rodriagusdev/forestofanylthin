import { useContext } from 'react';
import { BattleContext } from '../../../../context/BattleContext';
import { Unit } from '../../../../types';
import {
  calculatePhysicalAttack,
  calculateShatterArmorPower,
  calculateWeaknessMultiplier,
  calculateRainOfFirePower,
  calculateIceSpearDamage,
  calculateRetaliationStrike,
  applyVampiricHeal,
} from '../../../../helpers/combat/damageCalculations';

export interface CombatActionResult {
  updatedCaster: Unit;
  updatedTarget?: Unit;
  updatedEnemyArmy?: Unit[];
  isTargetDead: boolean;
  isAttackerDead: boolean;
  deadUnits: Unit[];
  damageDealt: number;
  stacksLost: number;
  vampiricHealAmount?: number;
  retaliation?: {
    occurred: boolean;
    damage: number;
    stacksLost: number;
    isAttackerDead: boolean;
    isCursed: boolean;
  };
}

export const useSpells = () => {
  const { enemyArmy } = useContext(BattleContext);

  // * Combat Skills: Physical Attack with Armor Mitigation, Vampiric Drain & Retaliation
  const attackUnit = (attackingUnit: Unit, attackedUnit: Unit): CombatActionResult => {
    const attackResult = calculatePhysicalAttack(attackingUnit, attackedUnit);

    let updatedAttacker: Unit = { ...attackingUnit };

    // Consume curse if the attacker was cursed
    if (attackResult.isCursed) {
      updatedAttacker.cursed = false;
    }

    // Apply Vampiric Heal
    if (attackResult.vampiricHealAmount > 0) {
      const healRes = applyVampiricHeal(
        updatedAttacker,
        attackResult.vampiricHealAmount
      );
      updatedAttacker.updatedHealth = healRes.updatedHealth;
      updatedAttacker.stack = healRes.newStack;
      updatedAttacker.updatedDamage = healRes.newDamage;
    }

    let updatedTarget: Unit = {
      ...attackedUnit,
      updatedHealth: attackResult.newTargetHealth,
      updatedDamage: attackResult.newTargetDamage,
      stack: attackResult.newTargetStack,
    };

    let isAttackerDead = false;
    let retaliationInfo: CombatActionResult['retaliation'] = undefined;

    // Defender Retaliation Strike (if defender survived and has not retaliated yet this round)
    if (!attackResult.isTargetDead && !attackedUnit.hasRetaliated) {
      const retResult = calculateRetaliationStrike(updatedTarget, updatedAttacker);
      if (retResult.canRetaliate) {
        updatedTarget = {
          ...updatedTarget,
          hasRetaliated: true,
          cursed: retResult.isCursed ? false : updatedTarget.cursed,
        };

        if (retResult.vampiricHealAmount > 0) {
          const retHealRes = applyVampiricHeal(
            updatedTarget,
            retResult.vampiricHealAmount
          );
          updatedTarget.updatedHealth = retHealRes.updatedHealth;
          updatedTarget.stack = retHealRes.newStack;
          updatedTarget.updatedDamage = retHealRes.newDamage;
        }

        updatedAttacker = {
          ...updatedAttacker,
          updatedHealth: retResult.newAttackerHealth,
          updatedDamage: retResult.newAttackerDamage,
          stack: retResult.newAttackerStack,
        };

        isAttackerDead = retResult.isAttackerDead;

        retaliationInfo = {
          occurred: true,
          damage: retResult.actualDamage,
          stacksLost: retResult.stacksLost,
          isAttackerDead: retResult.isAttackerDead,
          isCursed: retResult.isCursed,
        };
      }
    }

    const deadUnits: Unit[] = [];
    if (attackResult.isTargetDead) deadUnits.push(updatedTarget);
    if (isAttackerDead) deadUnits.push(updatedAttacker);

    return {
      updatedCaster: updatedAttacker,
      updatedTarget,
      isTargetDead: attackResult.isTargetDead,
      isAttackerDead,
      deadUnits,
      damageDealt: attackResult.actualDamage,
      stacksLost: attackResult.stacksLost,
      vampiricHealAmount: attackResult.vampiricHealAmount,
      retaliation: retaliationInfo,
    };
  };

  // * Dark Magic Skills
  const castShatterArmor = (castingUnit: Unit, targetUnit: Unit): CombatActionResult => {
    const power = calculateShatterArmorPower(castingUnit);
    const updatedTarget: Unit = {
      ...targetUnit,
      armor: targetUnit.armor - power,
    };
    const updatedCaster: Unit = {
      ...castingUnit,
      magic: Math.max(0, castingUnit.magic - 3),
    };

    return {
      updatedCaster,
      updatedTarget,
      isTargetDead: false,
      isAttackerDead: false,
      deadUnits: [],
      damageDealt: 0,
      stacksLost: 0,
    };
  };

  const castBreachResistances = (castingUnit: Unit, targetUnit: Unit): CombatActionResult => {
    const power = 4;
    const updatedTarget: Unit = {
      ...targetUnit,
      magicResistance: targetUnit.magicResistance - power,
    };
    const updatedCaster: Unit = {
      ...castingUnit,
      magic: Math.max(0, castingUnit.magic - 3),
    };

    return {
      updatedCaster,
      updatedTarget,
      isTargetDead: false,
      isAttackerDead: false,
      deadUnits: [],
      damageDealt: 0,
      stacksLost: 0,
    };
  };

  const castWeakness = (castingUnit: Unit, targetUnit: Unit): CombatActionResult => {
    const multiplier = calculateWeaknessMultiplier(castingUnit);
    const updatedTarget: Unit = {
      ...targetUnit,
      weaknessDamage: multiplier,
      updatedDamage: Math.max(1, Math.ceil(targetUnit.updatedDamage * multiplier)),
    };
    const updatedCaster: Unit = {
      ...castingUnit,
      magic: Math.max(0, castingUnit.magic - 2),
    };

    return {
      updatedCaster,
      updatedTarget,
      isTargetDead: false,
      isAttackerDead: false,
      deadUnits: [],
      damageDealt: 0,
      stacksLost: 0,
    };
  };

  const castCurse = (castingUnit: Unit, targetUnit: Unit): CombatActionResult => {
    const updatedTarget: Unit = { ...targetUnit, cursed: true };
    const updatedCaster: Unit = {
      ...castingUnit,
      magic: Math.max(0, castingUnit.magic - 4),
    };

    return {
      updatedCaster,
      updatedTarget,
      isTargetDead: false,
      isAttackerDead: false,
      deadUnits: [],
      damageDealt: 0,
      stacksLost: 0,
    };
  };

  // * Necromancy Skills
  const castReanimate = (castingUnit: Unit, targetUnit: Unit): CombatActionResult => {
    const isSelfCast = castingUnit.id === targetUnit.id;
    const updatedTarget: Unit = {
      ...targetUnit,
      updatedHealth: targetUnit.maxHealth,
      updatedDamage: targetUnit.damage * targetUnit.maxStack,
      stack: targetUnit.maxStack,
      weaknessDamage: 1,
      cursed: false,
      magic: isSelfCast
        ? Math.max(0, castingUnit.magic - 6)
        : targetUnit.magic,
    };
    const updatedCaster: Unit = isSelfCast
      ? updatedTarget
      : {
          ...castingUnit,
          magic: Math.max(0, castingUnit.magic - 6),
        };

    return {
      updatedCaster,
      updatedTarget,
      isTargetDead: false,
      isAttackerDead: false,
      deadUnits: [],
      damageDealt: 0,
      stacksLost: 0,
    };
  };

  const castVampiricLust = (castingUnit: Unit, targetUnit: Unit): CombatActionResult => {
    const isSelfCast = castingUnit.id === targetUnit.id;
    const updatedTarget: Unit = {
      ...targetUnit,
      vampiricHeal: true,
      magic: isSelfCast
        ? Math.max(0, castingUnit.magic - 6)
        : targetUnit.magic,
    };
    const updatedCaster: Unit = isSelfCast
      ? updatedTarget
      : {
          ...castingUnit,
          magic: Math.max(0, castingUnit.magic - 6),
        };

    return {
      updatedCaster,
      updatedTarget,
      isTargetDead: false,
      isAttackerDead: false,
      deadUnits: [],
      damageDealt: 0,
      stacksLost: 0,
    };
  };

  // * Destruction Skills
  const castRainOfFire = (
    castingUnit: Unit,
    targetEnemies: Unit[] = enemyArmy
  ): CombatActionResult => {
    const power = calculateRainOfFirePower(castingUnit);
    const updatedCaster: Unit = {
      ...castingUnit,
      magic: Math.max(0, castingUnit.magic - 10),
    };

    const deadUnits: Unit[] = [];
    const updatedEnemyArmy = targetEnemies.map((unit) => {
      const unitStackLost = Math.floor(power / unit.health);
      const unitDamageLost = unitStackLost * unit.damage * (unit.weaknessDamage ?? 1);

      let unitUpdatedDamage = unit.updatedDamage - unitDamageLost;
      if (unitUpdatedDamage < 1 && unit.stack > 0) unitUpdatedDamage = 1;

      const newHp = unit.updatedHealth - power;
      const updatedUnit: Unit = {
        ...unit,
        updatedHealth: newHp,
        updatedDamage: Math.ceil(unitUpdatedDamage),
        stack: Math.max(0, unit.stack - power / unit.health),
      };

      if (newHp <= 0) {
        deadUnits.push(updatedUnit);
      }
      return updatedUnit;
    });

    return {
      updatedCaster,
      updatedEnemyArmy,
      isTargetDead: deadUnits.length > 0,
      isAttackerDead: false,
      deadUnits,
      damageDealt: power,
      stacksLost: 0,
    };
  };

  const castIceSpear = (castingUnit: Unit, targetUnit: Unit): CombatActionResult => {
    const damage = calculateIceSpearDamage(targetUnit);
    const stacksLost = Math.floor(damage / targetUnit.health);
    const weaknessMultiplier = targetUnit.weaknessDamage ?? 1;

    let newDamage =
      targetUnit.updatedDamage - targetUnit.damage * stacksLost * weaknessMultiplier;
    if (newDamage < 1 && targetUnit.stack > 0) newDamage = 1;

    const updatedTarget: Unit = {
      ...targetUnit,
      updatedHealth: targetUnit.updatedHealth - damage,
      updatedDamage: Math.ceil(newDamage),
      stack: Math.max(0, targetUnit.stack - damage / targetUnit.health),
    };
    const updatedCaster: Unit = {
      ...castingUnit,
      magic: Math.max(0, castingUnit.magic - 7),
    };

    const isTargetDead = updatedTarget.updatedHealth <= 0;

    return {
      updatedCaster,
      updatedTarget,
      isTargetDead,
      isAttackerDead: false,
      deadUnits: isTargetDead ? [updatedTarget] : [],
      damageDealt: damage,
      stacksLost,
    };
  };

  return {
    attackUnit,
    castShatterArmor,
    castWeakness,
    castCurse,
    castBreachResistances,
    castRainOfFire,
    castIceSpear,
    castReanimate,
    castVampiricLust,
  };
};
