import { describe, it, expect } from 'vitest';
import {
  isLocationUnlocked,
  isLevelComplete,
  restoreArmy,
  applyLocationReward,
} from '../campaignProgression';
import { LevelConfig, LocationConfig, LocationReward } from '../../../data/levels/levelTypes';
import { UnitStats, Army } from '../../../types';

const dummyUnit: UnitStats = {
  id: 'test_skeleton',
  name: 'Skeleton',
  type: 'Tier 1',
  stack: 10,
  maxStack: 10,
  health: 10,
  maxHealth: 100,
  updatedHealth: 50,
  updatedDamage: 30,
  damage: 5,
  initialArmor: 0,
  armor: 0,
  magicResistance: 0,
  magic: 0,
  maxMagic: 0,
  initiative: '10',
  portrait: '',
  face: '',
  belongsTo: 'player',
  skills: [],
  weaknessDamage: 0.5,
  cursed: true,
  vampiricHeal: true,
  soundAttack: () => {},
  soundHitted: () => {},
  soundDeath: () => {},
};

const dummyLevel: LevelConfig = {
  id: 1,
  code: 'level-1',
  name: 'Level 1: The Wilds',
  subtitle: 'Act I',
  description: 'Test level',
  locations: [
    {
      id: 'loc_a',
      name: 'Location A',
      subtitle: 'Sub A',
      tier: 'I',
      description: '',
      image: '',
      enemies: [],
      accent: '',
      borderHover: '',
      glowHover: '',
    },
    {
      id: 'loc_b',
      name: 'Location B',
      subtitle: 'Sub B',
      tier: 'II',
      description: '',
      image: '',
      enemies: [],
      accent: '',
      borderHover: '',
      glowHover: '',
    },
  ],
};

describe('Campaign Progression & Rewards', () => {
  it('correctly determines whether a level is complete', () => {
    expect(isLevelComplete(dummyLevel, [])).toBe(false);
    expect(isLevelComplete(dummyLevel, ['loc_a'])).toBe(false);
    expect(isLevelComplete(dummyLevel, ['loc_a', 'loc_b'])).toBe(true);
    expect(isLevelComplete(dummyLevel, ['loc_a', 'loc_b', 'loc_c'])).toBe(true);
  });

  it('restores army status, health, and removes debuffs after battle', () => {
    const army: Army = [dummyUnit];
    const restored = restoreArmy(army);

    expect(restored[0].cursed).toBe(false);
    expect(restored[0].vampiricHeal).toBe(false);
    expect(restored[0].weaknessDamage).toBe(1);
    expect(restored[0].updatedHealth).toBe(100);
    expect(restored[0].updatedDamage).toBe(50);
  });

  it('merges reward stacks into existing army division when unit matches', () => {
    const army: Army = [{ ...dummyUnit, stack: 10 }];
    const reward: LocationReward = {
      type: 'unit',
      raceBonus: 'undead',
      unit: { ...dummyUnit, id: 'test_skeleton' },
      count: 20,
      description: '+20 Skeletons',
    };

    const result = applyLocationReward(army, reward, 'undead');
    expect(result.applied).toBe(true);
    expect(result.updatedArmy.length).toBe(1);
    expect(result.updatedArmy[0].stack).toBe(30);
    expect(result.updatedArmy[0].maxStack).toBe(30);
    expect(result.updatedArmy[0].updatedDamage).toBe(150);
  });

  it('appends a new unit stack if unit does not already exist in army', () => {
    const army: Army = [dummyUnit];
    const newUnit: UnitStats = {
      ...dummyUnit,
      id: 'ranger_unit',
      name: 'Dryexa Ranger',
      health: 20,
      damage: 15,
    };
    const reward: LocationReward = {
      type: 'unit',
      raceBonus: 'all',
      unit: newUnit,
      count: 5,
      description: '+5 Rangers',
    };

    const result = applyLocationReward(army, reward, 'dryeldar');
    expect(result.applied).toBe(true);
    expect(result.updatedArmy.length).toBe(2);
    expect(result.updatedArmy[1].name).toBe('Dryexa Ranger');
    expect(result.updatedArmy[1].stack).toBe(5);
  });

  it('rejects reward if race bonus does not match player race', () => {
    const army: Army = [dummyUnit];
    const reward: LocationReward = {
      type: 'unit',
      raceBonus: 'undead',
      unit: dummyUnit,
      count: 50,
      description: 'Undead Only',
    };

    const result = applyLocationReward(army, reward, 'dryeldar');
    expect(result.applied).toBe(false);
    expect(result.updatedArmy.length).toBe(1);
    expect(result.updatedArmy[0].stack).toBe(10);
  });

  it('evaluates location unlock conditions with anyOf (OR logic)', () => {
    const sacrelthar: LocationConfig = {
      id: 'Sacrelthar',
      name: 'Sacrelthar Citadel',
      subtitle: '',
      tier: '',
      description: '',
      image: '',
      enemies: [],
      accent: '',
      borderHover: '',
      glowHover: '',
      unlockCondition: {
        anyOf: ['Gloomy Forest', 'Dark Knight'],
      },
    };

    // Initially locked when neither required node is cleared
    expect(isLocationUnlocked(sacrelthar, ['Cemetery', 'Lost Glade'])).toBe(false);

    // Unlocked if Gloomy Forest is cleared
    expect(isLocationUnlocked(sacrelthar, ['Gloomy Forest'])).toBe(true);

    // Unlocked if Dark Knight Eldare is cleared instead
    expect(isLocationUnlocked(sacrelthar, ['Dark Knight'])).toBe(true);

    // Unlocked if both are cleared
    expect(isLocationUnlocked(sacrelthar, ['Gloomy Forest', 'Dark Knight'])).toBe(true);
  });
});
