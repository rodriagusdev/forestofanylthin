import { Army, UnitStats } from '../../types';
import { LevelConfig, LocationConfig, LocationReward } from '../../data/levels/levelTypes';

/**
 * Evaluates whether a location domain is unlocked based on its unlockCondition.
 */
export const isLocationUnlocked = (
  location: LocationConfig,
  completedLocationIds: string[]
): boolean => {
  if (!location.unlockCondition) return true;

  const { anyOf, allOf } = location.unlockCondition;

  // If anyOf is specified, at least one required location must be cleared
  if (anyOf && anyOf.length > 0) {
    const hasAny = anyOf.some((id) => completedLocationIds.includes(id));
    if (!hasAny) return false;
  }

  // If allOf is specified, all required locations must be cleared
  if (allOf && allOf.length > 0) {
    const hasAll = allOf.every((id) => completedLocationIds.includes(id));
    if (!hasAll) return false;
  }

  return true;
};

/**
 * Checks whether a level has been completed (either final boss cleared or all domains secured).
 */
export const isLevelComplete = (
  level: LevelConfig,
  completedLocationIds: string[]
): boolean => {
  if (!level || !level.locations || level.locations.length === 0) return false;
  const bossLocation = level.locations.find((l) => l.isBoss);
  if (bossLocation) {
    return completedLocationIds.includes(bossLocation.id);
  }
  return level.locations.every((loc) => completedLocationIds.includes(loc.id));
};

/**
 * Restores all surviving allied units to full health and magic after an encounter.
 */
export const restoreArmy = (army: Army): Army => {
  return army.map((unit) => {
    const currentStack = Math.ceil(unit.stack);
    return {
      ...unit,
      stack: currentStack,
      maxStack: currentStack,
      updatedHealth: unit.health * currentStack,
      maxHealth: unit.health * currentStack,
      updatedDamage: unit.damage * currentStack,
      magic: unit.maxMagic,
      maxMagic: unit.maxMagic,
      cursed: false,
      vampiricHeal: false,
      weaknessDamage: 1,
      defending: false,
      hasWaited: false,
      hasRetaliated: false,
    };
  });
};

/**
 * Dynamically applies a location reward to the player's army.
 */
export const applyLocationReward = (
  army: Army,
  reward: LocationReward | undefined,
  playerRace: string
): { updatedArmy: Army; applied: boolean } => {
  if (!reward) {
    return { updatedArmy: army, applied: false };
  }

  // Check race compatibility (if raceBonus is defined, it must match or be 'all')
  const isRaceEligible =
    !reward.raceBonus ||
    reward.raceBonus === 'all' ||
    reward.raceBonus.toLowerCase() === playerRace.toLowerCase();

  if (!isRaceEligible) {
    return { updatedArmy: army, applied: false };
  }

  const rewardUnit = reward.unit;
  const countToAdd = reward.count;

  // Check if player army already contains this unit type
  const existingUnitIndex = army.findIndex(
    (u) =>
      u.id === rewardUnit.id ||
      u.name.toLowerCase() === rewardUnit.name.toLowerCase()
  );

  if (existingUnitIndex !== -1) {
    const updated = army.map((unit, idx) => {
      if (idx === existingUnitIndex) {
        const newStack = unit.stack + countToAdd;
        return {
          ...unit,
          stack: newStack,
          maxStack: unit.maxStack + countToAdd,
          updatedHealth: unit.health * newStack,
          maxHealth: unit.health * newStack,
          updatedDamage: unit.damage * newStack,
        };
      }
      return unit;
    });
    return { updatedArmy: updated, applied: true };
  }

  // Otherwise, recruit as a new division in the army
  const newDivision: UnitStats = {
    id: rewardUnit.id,
    name: rewardUnit.name,
    type: rewardUnit.type || 'Infantry',
    stack: countToAdd,
    maxStack: countToAdd,
    health: rewardUnit.health,
    maxHealth: rewardUnit.health * countToAdd,
    updatedHealth: rewardUnit.health * countToAdd,
    damage: rewardUnit.damage,
    updatedDamage: rewardUnit.damage * countToAdd,
    initialArmor: rewardUnit.initialArmor ?? 0,
    armor: rewardUnit.armor ?? 0,
    magicResistance: rewardUnit.magicResistance ?? 0,
    magic: rewardUnit.magic ?? rewardUnit.maxMagic ?? 0,
    maxMagic: rewardUnit.maxMagic ?? 0,
    initiative: rewardUnit.initiative ?? '5',
    portrait: rewardUnit.portrait || '',
    face: rewardUnit.face || '',
    belongsTo: 'player',
    skills: rewardUnit.skills || [],
    cursed: false,
    vampiricHeal: false,
    weaknessDamage: 1,
    soundAttack: rewardUnit.soundAttack || (() => {}),
    soundHitted: rewardUnit.soundHitted || (() => {}),
    soundDeath: rewardUnit.soundDeath || (() => {}),
  };

  return { updatedArmy: [...army, newDivision], applied: true };
};
