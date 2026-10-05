import { describe, it, expect } from 'vitest';
import {
  calculatePhysicalAttack,
  calculateShatterArmorPower,
  calculateWeaknessMultiplier,
  calculateRainOfFirePower,
  calculateIceSpearDamage,
  calculateRetaliationStrike,
  applyVampiricHeal,
} from '../damageCalculations';
import { Unit } from '../../../types';

const mockUnit = (overrides: Partial<Unit> = {}): Unit => ({
  name: 'Test Warrior',
  id: 'test-1',
  type: 'Hero',
  level: 1,
  damage: 50,
  initialArmor: 5,
  armor: 5,
  magicResistance: 0,
  health: 100,
  maxHealth: 100,
  magic: 20,
  maxMagic: 20,
  initiative: '5',
  spellpower: 5,
  portrait: '',
  face: '',
  stack: 1,
  maxStack: 1,
  belongsTo: 'player',
  skills: [],
  weaknessDamage: 1,
  cursed: false,
  soundAttack: () => {},
  soundHitted: () => {},
  soundDeath: () => {},
  updatedDamage: 50,
  updatedHealth: 100,
  ...overrides,
});

describe('Damage Calculations', () => {
  describe('calculatePhysicalAttack', () => {
    it('mitigates physical damage with armor correctly', () => {
      const attacker = mockUnit({ updatedDamage: 100 });
      const defender = mockUnit({ armor: 5, updatedHealth: 200, health: 200 }); // 50% mitigation

      const result = calculatePhysicalAttack(attacker, defender);
      expect(result.mitigatedDamage).toBe(50);
      expect(result.actualDamage).toBe(50);
      expect(result.newTargetHealth).toBe(150);
      expect(result.isTargetDead).toBe(false);
    });

    it('negates damage completely when attacker is cursed', () => {
      const attacker = mockUnit({ updatedDamage: 100, cursed: true });
      const defender = mockUnit({ armor: 0, updatedHealth: 100 });

      const result = calculatePhysicalAttack(attacker, defender);
      expect(result.actualDamage).toBe(0);
      expect(result.isCursed).toBe(true);
      expect(result.newTargetHealth).toBe(100);
    });

    it('calculates 60% vampiric healing on un-cursed hits', () => {
      const attacker = mockUnit({ updatedDamage: 100, vampiricHeal: true });
      const defender = mockUnit({ armor: 0, updatedHealth: 200 });

      const result = calculatePhysicalAttack(attacker, defender);
      expect(result.actualDamage).toBe(100);
      expect(result.vampiricHealAmount).toBe(60);
    });

    it('reduces stack and damage when casualties are sustained', () => {
      // 10 skeletons (10 HP each, 5 damage each = 100 HP, 50 DMG total)
      const attacker = mockUnit({ updatedDamage: 50 }); // deals 50 damage
      const defender = mockUnit({
        armor: 0,
        health: 10,
        damage: 5,
        stack: 10,
        updatedHealth: 100,
        updatedDamage: 50,
        type: 'Undead',
      });

      const result = calculatePhysicalAttack(attacker, defender);
      expect(result.stacksLost).toBe(5);
      expect(result.newTargetStack).toBe(5);
      expect(result.newTargetDamage).toBe(25);
      expect(result.newTargetHealth).toBe(50);
    });
  });

  describe('Spell Calculations', () => {
    it('calculates hero Shatter Armor power from spellpower', () => {
      const hero = mockUnit({ type: 'Hero', spellpower: 5 });
      expect(calculateShatterArmorPower(hero)).toBe(6); // 1 + 5
    });

    it('calculates hero Weakness multiplier from spellpower', () => {
      const hero = mockUnit({ type: 'Hero', spellpower: 5 });
      expect(calculateWeaknessMultiplier(hero)).toBeCloseTo(0.35); // 0.7 - (0.07 * 5)
    });

    it('calculates hero Rain of Fire power', () => {
      const hero = mockUnit({ type: 'Hero', spellpower: 5 });
      expect(calculateRainOfFirePower(hero)).toBe(55); // 30 + (5 * 5)
    });

    it('calculates Ice Spear with breached magic resistance', () => {
      const target = mockUnit({ magicResistance: -4 });
      // 95 * (1 - (-4)/10) = 95 * 1.4 = 133
      expect(calculateIceSpearDamage(target)).toBe(133);
    });
  });

  describe('calculateRetaliationStrike', () => {
    it('allows surviving defender to counter-attack once per round', () => {
      const attacker = mockUnit({ id: 'att-1', armor: 2, updatedHealth: 100 });
      const survivingDefender = mockUnit({
        id: 'def-1',
        updatedDamage: 40,
        updatedHealth: 60,
        hasRetaliated: false,
      });

      const ret = calculateRetaliationStrike(survivingDefender, attacker);
      expect(ret.canRetaliate).toBe(true);
      expect(ret.actualDamage).toBe(32); // 40 * (1 - 2/10) = 32
      expect(ret.newAttackerHealth).toBe(68);
      expect(ret.isAttackerDead).toBe(false);
    });

    it('blocks retaliation if defender was defeated or already retaliated', () => {
      const attacker = mockUnit({ updatedHealth: 100 });
      const deadDefender = mockUnit({ updatedHealth: 0, hasRetaliated: false });
      const alreadyRetaliatedDefender = mockUnit({ updatedHealth: 50, hasRetaliated: true });

      expect(calculateRetaliationStrike(deadDefender, attacker).canRetaliate).toBe(false);
      expect(calculateRetaliationStrike(alreadyRetaliatedDefender, attacker).canRetaliate).toBe(false);
    });

    it('nullifies retaliation damage when defender is cursed', () => {
      const attacker = mockUnit({ armor: 0, updatedHealth: 100 });
      const cursedDefender = mockUnit({ updatedHealth: 50, updatedDamage: 50, cursed: true, hasRetaliated: false });

      const ret = calculateRetaliationStrike(cursedDefender, attacker);
      expect(ret.canRetaliate).toBe(true);
      expect(ret.actualDamage).toBe(0);
      expect(ret.isCursed).toBe(true);
      expect(ret.newAttackerHealth).toBe(100);
    });

    it('prevents melee defender from retaliating against a ranged attacker', () => {
      const rangedAttacker = mockUnit({ isRanged: true, updatedHealth: 100 });
      const meleeDefender = mockUnit({ isRanged: false, updatedHealth: 50, updatedDamage: 40, hasRetaliated: false });

      const ret = calculateRetaliationStrike(meleeDefender, rangedAttacker);
      expect(ret.canRetaliate).toBe(false);
      expect(ret.actualDamage).toBe(0);
    });

    it('allows ranged defender to retaliate in melee engagement', () => {
      const meleeAttacker = mockUnit({ isRanged: false, armor: 0, updatedHealth: 100 });
      const rangedDefender = mockUnit({ isRanged: true, updatedHealth: 50, updatedDamage: 30, hasRetaliated: false });

      const ret = calculateRetaliationStrike(rangedDefender, meleeAttacker);
      expect(ret.canRetaliate).toBe(true);
      expect(ret.actualDamage).toBe(30);
      expect(ret.newAttackerHealth).toBe(70);
    });
  });

  describe('applyVampiricHeal', () => {
    it('heals a Hero and caps at maxHealth', () => {
      const hero = mockUnit({
        type: 'Hero',
        health: 210,
        maxHealth: 210,
        updatedHealth: 150,
        damage: 71,
        updatedDamage: 71,
      });

      const healResult = applyVampiricHeal(hero, 40);
      expect(healResult.updatedHealth).toBe(190);
      expect(healResult.newStack).toBe(1);
      expect(healResult.newDamage).toBe(71);
      expect(healResult.healApplied).toBe(40);

      // Over-healing caps at maxHealth
      const overHealResult = applyVampiricHeal(hero, 100);
      expect(overHealResult.updatedHealth).toBe(210);
      expect(overHealResult.healApplied).toBe(60);
    });

    it('heals a multi-troop stack and proportionally restores stack and total damage', () => {
      // 12 Skeletons: 6 HP each, 3 DMG each (Total max HP = 72, Max DMG = 36)
      // Depleted to 3 Skeletons: 18 HP, 9 DMG
      const depletedSkeletons = mockUnit({
        type: 'Undead',
        health: 6,
        maxHealth: 72,
        stack: 3,
        maxStack: 12,
        damage: 3,
        updatedHealth: 18,
        updatedDamage: 9,
        weaknessDamage: 1,
      });

      // Heals 30 HP -> New HP = 48 -> New Stack = 48 / 6 = 8 -> New DMG = 8 * 3 = 24
      const result = applyVampiricHeal(depletedSkeletons, 30);
      expect(result.updatedHealth).toBe(48);
      expect(result.newStack).toBe(8);
      expect(result.newDamage).toBe(24);
      expect(result.healApplied).toBe(30);
    });

    it('preserves weakness damage multiplier when restoring stack damage', () => {
      const weakenedSkeletons = mockUnit({
        type: 'Undead',
        health: 6,
        maxHealth: 72,
        stack: 2,
        maxStack: 12,
        damage: 3,
        updatedHealth: 12,
        updatedDamage: 3,
        weaknessDamage: 0.5, // 50% weakness debuff
      });

      // Heals 24 HP -> New HP = 36 -> New Stack = 6 -> New DMG = ceil(3 * 6 * 0.5) = 9
      const result = applyVampiricHeal(weakenedSkeletons, 24);
      expect(result.updatedHealth).toBe(36);
      expect(result.newStack).toBe(6);
      expect(result.newDamage).toBe(9);
    });

    it('returns unchanged values when healAmount is 0 or negative', () => {
      const unit = mockUnit({ updatedHealth: 50, updatedDamage: 25, stack: 5 });
      const result = applyVampiricHeal(unit, 0);
      expect(result.updatedHealth).toBe(50);
      expect(result.newStack).toBe(5);
      expect(result.newDamage).toBe(25);
      expect(result.healApplied).toBe(0);
    });
  });
});
