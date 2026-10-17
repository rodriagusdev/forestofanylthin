import { describe, it, expect, beforeEach } from 'vitest';
import { useBattleStore } from '../useBattleStore';
import { Unit } from '../../types';

const mockUnit: Unit = {
  id: 'elisith_1',
  name: 'Elisith',
  type: 'Hero',
  stack: 1,
  maxStack: 1,
  health: 145,
  maxHealth: 145,
  updatedHealth: 145,
  damage: 56,
  updatedDamage: 56,
  initialArmor: 5,
  armor: 5,
  magicResistance: 0,
  magic: 18,
  maxMagic: 18,
  initiative: '9',
  portrait: '',
  face: '',
  belongsTo: 'player',
  skills: [],
  weaknessDamage: 1,
  cursed: false,
  soundAttack: () => {},
  soundHitted: () => {},
  soundDeath: () => {},
};

const mockEnemy: Unit = {
  id: 'enemy_skeleton',
  name: 'Skeleton',
  type: 'Creature',
  stack: 10,
  maxStack: 10,
  health: 6,
  maxHealth: 60,
  updatedHealth: 60,
  damage: 3,
  updatedDamage: 30,
  initialArmor: 0,
  armor: 0,
  magicResistance: 0,
  magic: 0,
  maxMagic: 0,
  initiative: '4',
  portrait: '',
  face: '',
  belongsTo: 'enemy',
  skills: [],
  weaknessDamage: 1,
  cursed: false,
  soundAttack: () => {},
  soundHitted: () => {},
  soundDeath: () => {},
};

describe('Zustand Battle Store', () => {
  beforeEach(() => {
    useBattleStore.getState().resetBattleState();
  });

  it('initializes with default battle state and clean nulls', () => {
    const state = useBattleStore.getState();
    expect(state.isInFight).toBe(false);
    expect(state.unitPosition).toBe(0);
    expect(state.unitsInBoard).toEqual([]);
    expect(state.playingUnit).toBeNull();
    expect(state.targetUnit).toBeNull();
    expect(state.deadUnit).toBeNull();
    expect(state.action).toBe('Combat: Clear Action');
    expect(state.actionImage).toBeNull();
  });

  it('updates unit position, turn queue, and board units', () => {
    const store = useBattleStore.getState();
    store.setUnitsInBoard([mockUnit, mockEnemy]);
    store.setUnitPosition(1);

    const state = useBattleStore.getState();
    expect(state.unitsInBoard.length).toBe(2);
    expect(state.unitPosition).toBe(1);
  });

  it('records combat log entries with timestamps', () => {
    const store = useBattleStore.getState();
    store.addCombatLog({
      turnNumber: 1,
      actor: {
        name: 'Elisith',
        face: '',
        belongsTo: 'player',
      },
      target: {
        name: 'Skeleton',
        face: '',
        belongsTo: 'enemy',
      },
      actionName: 'Ice Spear',
      actionType: 'spell',
      description: 'Elisith casts Ice Spear',
      damageDealt: 95,
      isFatal: true,
    });

    const state = useBattleStore.getState();
    expect(state.combatLogs.length).toBe(1);
    expect(state.combatLogs[0].actionName).toBe('Ice Spear');
    expect(state.combatLogs[0].timestamp).toBeDefined();
  });

  it('records unit kills and tracks morale momentum for turn retention', () => {
    const store = useBattleStore.getState();
    expect(store.morale.consecutiveKills).toBe(0);
    expect(store.morale.moraleRetainedTurn).toBe(false);

    store.recordUnitKill(mockUnit, mockEnemy);

    const stateAfterKill = useBattleStore.getState();
    expect(stateAfterKill.morale.consecutiveKills).toBe(1);
    expect(stateAfterKill.morale.moraleRetainedTurn).toBe(true);
    expect(stateAfterKill.morale.moraleBonusUnitId).toBe('elisith_1');

    store.consumeMoraleExtraTurn();
    const stateAfterConsume = useBattleStore.getState();
    expect(stateAfterConsume.morale.moraleRetainedTurn).toBe(false);
    expect(stateAfterConsume.morale.consecutiveKills).toBe(1);

    store.resetMorale();
    expect(useBattleStore.getState().morale.consecutiveKills).toBe(0);
  });

  it('resets all ephemeral combat state on resetBattleState', () => {
    const store = useBattleStore.getState();
    store.setIsInFight(true);
    store.setUnitPosition(3);
    store.setPlayingUnit(mockUnit);
    store.setShowBattleMessage(true);

    store.resetBattleState();

    const state = useBattleStore.getState();
    expect(state.isInFight).toBe(false);
    expect(state.unitPosition).toBe(0);
    expect(state.playingUnit).toBeNull();
    expect(state.showBattleMessage).toBe(false);
  });
});
