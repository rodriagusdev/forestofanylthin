import { create } from 'zustand';
import {
  Unit,
  Army,
  Skill,
  ActionName,
  CombatLogEntry,
  FloatingCombatTextEvent,
} from '../types';

/**
 * Magic School Identifiers
 * Extensible for future schools (e.g. 'Primal', 'Light', 'Void', 'Blood')
 */
export type MagicSchoolType =
  | 'Combat'
  | 'Dark Magic'
  | 'Destruction'
  | 'Necromancy'
  | 'Primal'
  | 'Light'
  | 'Void'
  | 'Blood'
  | string;

/**
 * Morale & Momentum State
 * Prepared for Morale system additions (e.g. killing an enemy grants turn retention / morale boost)
 */
export interface MoraleState {
  consecutiveKills: number;
  moraleRetainedTurn: boolean;
  moraleBonusUnitId: string | null;
  lastKillerId: string | null;
}

export interface BattleStoreState {
  // Core combat status
  isInFight: boolean;
  currentZone: string;
  currentZoneImage: string;
  playerRace: string;

  // Turn Queue & Units
  turn: string;
  action: ActionName;
  actionImage: Skill | null;
  unitPosition: number;
  unitsInBoard: Army;
  playingUnit: Unit | null;
  targetUnit: Unit | null;
  deadUnit: Unit | null;
  heroStats: Unit | null;

  // Armies & Reinforcements
  playerArmy: Army;
  enemyArmy: Army;
  fallenAllies: Unit[];
  addedDryexaRanger: boolean;
  addedSkeletons: boolean;

  // Battle Message & Damage Animation State
  showBattleMessage: boolean;
  battleMessageText: string;
  isDamaging: boolean;
  magicUsedInTurn: number;

  // Visuals & Effects
  previewUnit: Unit | null;
  hoveredUnitId: string | null;
  activeScreenShake: boolean | 'light' | 'heavy' | 'apocalyptic';
  activeScreenFlash: 'ruby' | 'fire' | 'ice' | 'arcane' | 'emerald' | 'dark-magic' | 'curse' | null;
  combatLogs: CombatLogEntry[];
  floatingTexts: FloatingCombatTextEvent[];

  // Future Mechanics: Morale System
  morale: MoraleState;

  // Actions
  setIsInFight: (isInFight: boolean) => void;
  setCurrentZone: (zone: string) => void;
  setCurrentZoneImage: (image: string) => void;
  setPlayerRace: (race: string) => void;
  setTurn: (turn: string) => void;
  setAction: (action: ActionName) => void;
  setActionImage: (skill: Skill | null) => void;
  setUnitPosition: (pos: number | ((prev: number) => number)) => void;
  setUnitsInBoard: (units: Army | ((prev: Army) => Army)) => void;
  setPlayingUnit: (unit: Unit | null) => void;
  setTargetUnit: (unit: Unit | null) => void;
  setDeadUnit: (unit: Unit | null) => void;
  setHeroStats: (unit: Unit | null) => void;
  setPlayerArmy: (army: Army | ((prev: Army) => Army)) => void;
  setEnemyArmy: (army: Army | ((prev: Army) => Army)) => void;
  setFallenAllies: (allies: Unit[] | ((prev: Unit[]) => Unit[])) => void;
  setAddedDryexaRanger: (added: boolean) => void;
  setAddedSkeletons: (added: boolean) => void;
  setShowBattleMessage: (show: boolean) => void;
  setBattleMessageText: (text: string) => void;
  setIsDamaging: (damaging: boolean) => void;
  setMagicUsedInTurn: (magic: number) => void;
  setPreviewUnit: (unit: Unit | null) => void;
  setHoveredUnitId: (id: string | null) => void;
  setActiveScreenShake: (shake: boolean | 'light' | 'heavy' | 'apocalyptic') => void;
  setActiveScreenFlash: (flash: 'ruby' | 'fire' | 'ice' | 'arcane' | 'emerald' | 'dark-magic' | 'curse' | null) => void;
  setCombatLogs: (logs: CombatLogEntry[] | ((prev: CombatLogEntry[]) => CombatLogEntry[])) => void;
  addCombatLog: (entry: Omit<CombatLogEntry, 'id' | 'timestamp'>) => void;
  clearCombatLogs: () => void;
  triggerFloatingText: (event: Omit<FloatingCombatTextEvent, 'id'>) => void;

  // Morale System Actions
  recordUnitKill: (killerUnit: Unit, targetUnit: Unit) => void;
  consumeMoraleExtraTurn: () => void;
  resetMorale: () => void;

  // Battle Reset
  resetBattleState: () => void;
}

const initialMoraleState: MoraleState = {
  consecutiveKills: 0,
  moraleRetainedTurn: false,
  moraleBonusUnitId: null,
  lastKillerId: null,
};

export const useBattleStore = create<BattleStoreState>((set) => ({
  // Core State Defaults
  isInFight: false,
  currentZone: 'Cemetery',
  currentZoneImage: '',
  playerRace: '',

  turn: '',
  action: 'Combat: Clear Action',
  actionImage: null,
  unitPosition: 0,
  unitsInBoard: [],
  playingUnit: null,
  targetUnit: null,
  deadUnit: null,
  heroStats: null,

  playerArmy: [],
  enemyArmy: [],
  fallenAllies: [],
  addedDryexaRanger: false,
  addedSkeletons: false,

  showBattleMessage: false,
  battleMessageText: '',
  isDamaging: false,
  magicUsedInTurn: 0,

  previewUnit: null,
  hoveredUnitId: null,
  activeScreenShake: false,
  activeScreenFlash: null,
  combatLogs: [],
  floatingTexts: [],

  morale: initialMoraleState,

  // Setters
  setIsInFight: (isInFight) => set({ isInFight }),
  setCurrentZone: (currentZone) => set({ currentZone }),
  setCurrentZoneImage: (currentZoneImage) => set({ currentZoneImage }),
  setPlayerRace: (playerRace) => set({ playerRace }),
  setTurn: (turn) => set({ turn }),
  setAction: (action) => set({ action }),
  setActionImage: (actionImage) => set({ actionImage }),
  setUnitPosition: (updater) =>
    set((state) => ({
      unitPosition: typeof updater === 'function' ? updater(state.unitPosition) : updater,
    })),
  setUnitsInBoard: (updater) =>
    set((state) => ({
      unitsInBoard: typeof updater === 'function' ? updater(state.unitsInBoard) : updater,
    })),
  setPlayingUnit: (playingUnit) => set({ playingUnit }),
  setTargetUnit: (targetUnit) => set({ targetUnit }),
  setDeadUnit: (deadUnit) => set({ deadUnit }),
  setHeroStats: (heroStats) => set({ heroStats }),
  setPlayerArmy: (updater) =>
    set((state) => ({
      playerArmy: typeof updater === 'function' ? updater(state.playerArmy) : updater,
    })),
  setEnemyArmy: (updater) =>
    set((state) => ({
      enemyArmy: typeof updater === 'function' ? updater(state.enemyArmy) : updater,
    })),
  setFallenAllies: (updater) =>
    set((state) => ({
      fallenAllies: typeof updater === 'function' ? updater(state.fallenAllies) : updater,
    })),
  setAddedDryexaRanger: (addedDryexaRanger) => set({ addedDryexaRanger }),
  setAddedSkeletons: (addedSkeletons) => set({ addedSkeletons }),
  setShowBattleMessage: (showBattleMessage) => set({ showBattleMessage }),
  setBattleMessageText: (battleMessageText) => set({ battleMessageText }),
  setIsDamaging: (isDamaging) => set({ isDamaging }),
  setMagicUsedInTurn: (magicUsedInTurn) => set({ magicUsedInTurn }),
  setPreviewUnit: (previewUnit) => set({ previewUnit }),
  setHoveredUnitId: (hoveredUnitId) => set({ hoveredUnitId }),
  setActiveScreenShake: (activeScreenShake) => set({ activeScreenShake }),
  setActiveScreenFlash: (activeScreenFlash) => set({ activeScreenFlash }),
  setCombatLogs: (updater) =>
    set((state) => ({
      combatLogs: typeof updater === 'function' ? updater(state.combatLogs) : updater,
    })),

  addCombatLog: (entry) => {
    const now = new Date();
    const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newEntry: CombatLogEntry = {
      ...entry,
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp,
    };
    set((state) => ({
      combatLogs: [newEntry, ...state.combatLogs],
    }));
  },

  clearCombatLogs: () => set({ combatLogs: [] }),

  triggerFloatingText: (event) => {
    const id = `fct_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newEvent: FloatingCombatTextEvent = { ...event, id };
    set((state) => ({
      floatingTexts: [...state.floatingTexts, newEvent],
    }));
    setTimeout(() => {
      set((state) => ({
        floatingTexts: state.floatingTexts.filter((item) => item.id !== id),
      }));
    }, 1800);
  },

  // Morale System: Records unit kill and enables morale turn retention hook
  recordUnitKill: (killerUnit: Unit, _targetUnit: Unit) => {
    set((state) => ({
      morale: {
        consecutiveKills: state.morale.consecutiveKills + 1,
        moraleRetainedTurn: true,
        moraleBonusUnitId: killerUnit.id,
        lastKillerId: killerUnit.id,
      },
    }));
  },

  consumeMoraleExtraTurn: () => {
    set((state) => ({
      morale: {
        ...state.morale,
        moraleRetainedTurn: false,
        moraleBonusUnitId: null,
      },
    }));
  },

  resetMorale: () => set({ morale: initialMoraleState }),

  resetBattleState: () =>
    set({
      isInFight: false,
      unitPosition: 0,
      unitsInBoard: [],
      playingUnit: null,
      targetUnit: null,
      deadUnit: null,
      action: 'Combat: Clear Action',
      actionImage: null,
      showBattleMessage: false,
      battleMessageText: '',
      isDamaging: false,
      magicUsedInTurn: 0,
      activeScreenShake: false,
      activeScreenFlash: null,
      morale: initialMoraleState,
      floatingTexts: [],
    }),
}));
