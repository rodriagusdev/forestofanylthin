import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Army,
  UnitStats,
  EquipmentSlot,
  EquipmentState,
  InventoryItem,
} from '../types';
import { LocationReward, LevelConfig } from '../data/levels/levelTypes';
import { LEVELS, TOTAL_LEVELS, getLevelById } from '../data/levels/levelsData';
import {
  isLevelComplete,
  restoreArmy,
  applyLocationReward,
} from '../helpers/campaign/campaignProgression';
import {
  equipItemToState,
  unequipItemFromState,
  applyEquipmentToHero,
} from '../helpers/inventory/inventoryCalculations';
import { STARTING_EQUIPMENT_BY_RACE } from '../data/items/itemsData';

export interface DialogueSpeaker {
  name: string;
  avatar: string;
  title?: string;
  side?: 'left' | 'right';
}

export interface DialogueChoice {
  id: string;
  text: string;
  nextNodeId?: string;
  actionType?: 'continue' | 'reward' | 'battle' | 'close';
  reward?: LocationReward;
  conditionFlag?: string;
}

export interface DialogueNode {
  id: string;
  speaker: DialogueSpeaker;
  text: string;
  audio?: string; // Optional voiceover or sound clip for this line
  choices?: DialogueChoice[];
  nextNodeId?: string;
}

export interface DialogueSequence {
  id: string;
  title?: string;
  bgMusic?: string; // Optional background music track key during this cutscene
  nodes: Record<string, DialogueNode>;
  startNodeId: string;
}

export interface CampaignState {
  // Campaign lifecycle
  isPlaying: boolean;
  isCampaignWon: boolean;
  playerRace: string;
  heroStats: UnitStats | null;
  baseHero: UnitStats | null;
  playerArmy: Army;

  // Equipment & Inventory (Armor, Helm, Ring 1, Ring 2)
  equipment: EquipmentState;
  inventory: InventoryItem[];
  isInventoryOpen: boolean;

  // Level & Location Progression
  currentLevelId: number;
  completedLocationsByLevel: Record<number, string[]>;
  levelsCompleted: number;

  // Economy & Resources
  gold: number;
  manaCrystals: number;

  // Narrative, Story Flags & Dialogue
  storyFlags: Record<string, boolean>;
  activeDialogue: DialogueSequence | null;
  currentDialogueNodeId: string | null;

  // Recent Event Feedback
  lastAcquiredReward: LocationReward | null;

  // Core Actions
  startNewCampaign: (race: string, initialArmy: Army, hero?: UnitStats) => void;
  completeLocation: (
    levelId: number,
    locationId: string,
    survivingArmy: Army,
    reward?: LocationReward
  ) => void;
  advanceToNextLevel: () => void;
  setPlayerArmy: (army: Army | ((prev: Army) => Army)) => void;
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;

  // Equipment Actions
  equipItem: (item: InventoryItem, preferredSlot?: EquipmentSlot) => void;
  unequipItem: (slot: EquipmentSlot) => void;
  addItemToInventory: (item: InventoryItem) => void;
  removeItemFromInventory: (itemId: string) => void;
  openInventory: () => void;
  closeInventory: () => void;
  toggleInventory: () => void;

  setStoryFlag: (flag: string, value?: boolean) => void;
  hasStoryFlag: (flag: string) => boolean;
  startDialogue: (sequence: DialogueSequence) => void;
  selectDialogueChoice: (choice: DialogueChoice) => void;
  advanceDialogueNode: () => void;
  closeDialogue: () => void;
  clearRewardNotification: () => void;
  resetCampaign: () => void;
}

const INITIAL_CAMPAIGN_STATE = {
  isPlaying: false,
  isCampaignWon: false,
  playerRace: '',
  heroStats: null as UnitStats | null,
  baseHero: null as UnitStats | null,
  playerArmy: [] as Army,
  equipment: {
    helm: null,
    armor: null,
    ring1: null,
    ring2: null,
  } as EquipmentState,
  inventory: [] as InventoryItem[],
  isInventoryOpen: false,
  currentLevelId: 1,
  completedLocationsByLevel: { 1: [] } as Record<number, string[]>,
  levelsCompleted: 0,
  gold: 150,
  manaCrystals: 5,
  storyFlags: {} as Record<string, boolean>,
  activeDialogue: null as DialogueSequence | null,
  currentDialogueNodeId: null as string | null,
  lastAcquiredReward: null as LocationReward | null,
};

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      ...INITIAL_CAMPAIGN_STATE,

      startNewCampaign: (race, initialArmy, hero) => {
        const rawHero = hero || initialArmy.find((u) => u.type === 'Hero') || initialArmy[0];
        const startingGear = STARTING_EQUIPMENT_BY_RACE[race] || {
          equipped: { helm: null, armor: null, ring1: null, ring2: null },
          inventory: [],
        };

        const initialEquipment = { ...startingGear.equipped };
        const initialInventory = [...startingGear.inventory];
        const upgradedHero = rawHero
          ? applyEquipmentToHero(rawHero, initialEquipment)
          : null;

        // Apply upgraded hero to initial army
        const armyWithUpgradedHero = initialArmy.map((unit) => {
          if (unit.type === 'Hero' && upgradedHero) {
            return { ...upgradedHero };
          }
          return unit;
        });

        set({
          ...INITIAL_CAMPAIGN_STATE,
          isPlaying: true,
          playerRace: race,
          baseHero: rawHero ? { ...rawHero } : null,
          heroStats: upgradedHero,
          equipment: initialEquipment,
          inventory: initialInventory,
          playerArmy: restoreArmy(armyWithUpgradedHero),
          currentLevelId: 1,
          completedLocationsByLevel: { 1: [] },
          levelsCompleted: 0,
          isCampaignWon: false,
          gold: 150,
          manaCrystals: 5,
          storyFlags: {
            [`intro_completed_${race}`]: true,
          },
        });
      },

      completeLocation: (levelId, locationId, survivingArmy, reward) => {
        const state = get();
        let updatedArmy = restoreArmy(survivingArmy);
        let grantedReward: LocationReward | null = null;

        // Apply dynamic reward if present
        if (reward) {
          const rewardResult = applyLocationReward(
            updatedArmy,
            reward,
            state.playerRace
          );
          if (rewardResult.applied) {
            updatedArmy = rewardResult.updatedArmy;
            grantedReward = reward;
          }
        }

        const currentCompleted = state.completedLocationsByLevel[levelId] || [];
        const nextCompleted = currentCompleted.includes(locationId)
          ? currentCompleted
          : [...currentCompleted, locationId];

        const nextCompletedMap = {
          ...state.completedLocationsByLevel,
          [levelId]: nextCompleted,
        };

        // Check level completion
        const levelConfig = getLevelById(levelId) || LEVELS[0];
        const isThisLevelDone = isLevelComplete(levelConfig, nextCompleted);

        let nextLevelId = state.currentLevelId;
        let nextLevelsCompleted = state.levelsCompleted;
        let isWon = state.isCampaignWon;

        if (isThisLevelDone) {
          nextLevelsCompleted += 1;
          if (levelId < TOTAL_LEVELS) {
            nextLevelId = levelId + 1;
            if (!nextCompletedMap[nextLevelId]) {
              nextCompletedMap[nextLevelId] = [];
            }
          } else {
            isWon = true;
          }
        }

        set({
          playerArmy: updatedArmy,
          completedLocationsByLevel: nextCompletedMap,
          currentLevelId: nextLevelId,
          levelsCompleted: nextLevelsCompleted,
          isCampaignWon: isWon,
          lastAcquiredReward: grantedReward,
          storyFlags: {
            ...state.storyFlags,
            [`location_cleared_${locationId}`]: true,
          },
        });
      },

      advanceToNextLevel: () => {
        const state = get();
        if (state.currentLevelId < TOTAL_LEVELS) {
          set({
            currentLevelId: state.currentLevelId + 1,
          });
        } else {
          set({ isCampaignWon: true });
        }
      },

      setPlayerArmy: (armyOrUpdater) => {
        set((state) => ({
          playerArmy:
            typeof armyOrUpdater === 'function'
              ? (armyOrUpdater as (prev: Army) => Army)(state.playerArmy)
              : armyOrUpdater,
        }));
      },

      addGold: (amount) => {
        set((state) => ({ gold: Math.max(0, state.gold + amount) }));
      },

      spendGold: (amount) => {
        const current = get().gold;
        if (current >= amount) {
          set({ gold: current - amount });
          return true;
        }
        return false;
      },

      equipItem: (item, preferredSlot) => {
        const state = get();
        const { newEquipment, newInventory } = equipItemToState(
          state.equipment,
          state.inventory,
          item,
          preferredSlot
        );

        const base = state.baseHero || state.heroStats;
        const upgradedHero = base
          ? applyEquipmentToHero(base, newEquipment)
          : null;

        const updatedArmy = state.playerArmy.map((unit) => {
          if (unit.type === 'Hero' && upgradedHero) {
            return {
              ...upgradedHero,
              updatedHealth: Math.min(unit.updatedHealth, upgradedHero.maxHealth),
              updatedDamage: upgradedHero.damage,
            };
          }
          return unit;
        });

        set({
          equipment: newEquipment,
          inventory: newInventory,
          heroStats: upgradedHero,
          playerArmy: updatedArmy,
        });
      },

      unequipItem: (slot) => {
        const state = get();
        const { newEquipment, newInventory } = unequipItemFromState(
          state.equipment,
          state.inventory,
          slot
        );

        const base = state.baseHero || state.heroStats;
        const upgradedHero = base
          ? applyEquipmentToHero(base, newEquipment)
          : null;

        const updatedArmy = state.playerArmy.map((unit) => {
          if (unit.type === 'Hero' && upgradedHero) {
            return {
              ...upgradedHero,
              updatedHealth: Math.min(unit.updatedHealth, upgradedHero.maxHealth),
              updatedDamage: upgradedHero.damage,
            };
          }
          return unit;
        });

        set({
          equipment: newEquipment,
          inventory: newInventory,
          heroStats: upgradedHero,
          playerArmy: updatedArmy,
        });
      },

      addItemToInventory: (item) => {
        set((state) => ({
          inventory: [...state.inventory, item],
        }));
      },

      removeItemFromInventory: (itemId) => {
        set((state) => ({
          inventory: state.inventory.filter((i) => i.id !== itemId),
        }));
      },

      openInventory: () => {
        set({ isInventoryOpen: true });
      },

      closeInventory: () => {
        set({ isInventoryOpen: false });
      },

      toggleInventory: () => {
        set((state) => ({ isInventoryOpen: !state.isInventoryOpen }));
      },

      setStoryFlag: (flag, value = true) => {
        set((state) => ({
          storyFlags: {
            ...state.storyFlags,
            [flag]: value,
          },
        }));
      },

      hasStoryFlag: (flag) => {
        return !!get().storyFlags[flag];
      },

      startDialogue: (sequence) => {
        set({
          activeDialogue: sequence,
          currentDialogueNodeId: sequence.startNodeId,
        });
      },

      selectDialogueChoice: (choice) => {
        const state = get();
        if (choice.reward) {
          const rewardResult = applyLocationReward(
            state.playerArmy,
            choice.reward,
            state.playerRace
          );
          if (rewardResult.applied) {
            set({ playerArmy: rewardResult.updatedArmy });
          }
        }

        if (choice.nextNodeId && state.activeDialogue?.nodes[choice.nextNodeId]) {
          set({ currentDialogueNodeId: choice.nextNodeId });
        } else if (choice.actionType === 'close' || !choice.nextNodeId) {
          set({ activeDialogue: null, currentDialogueNodeId: null });
        }
      },

      advanceDialogueNode: () => {
        const state = get();
        if (!state.activeDialogue || !state.currentDialogueNodeId) return;

        const currentNode =
          state.activeDialogue.nodes[state.currentDialogueNodeId];
        if (currentNode?.nextNodeId && state.activeDialogue.nodes[currentNode.nextNodeId]) {
          set({ currentDialogueNodeId: currentNode.nextNodeId });
        } else {
          set({ activeDialogue: null, currentDialogueNodeId: null });
        }
      },

      closeDialogue: () => {
        set({ activeDialogue: null, currentDialogueNodeId: null });
      },

      clearRewardNotification: () => {
        set({ lastAcquiredReward: null });
      },

      resetCampaign: () => {
        set(INITIAL_CAMPAIGN_STATE);
      },
    }),
    {
      name: 'forest-of-anylthin-campaign-save',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            return window.localStorage;
          } catch {
            // fallback
          }
        }
        const memoryStorage = new Map<string, string>();
        return {
          getItem: (name: string) => memoryStorage.get(name) ?? null,
          setItem: (name: string, value: string) => {
            memoryStorage.set(name, value);
          },
          removeItem: (name: string) => {
            memoryStorage.delete(name);
          },
        };
      }),
      // Persist key state
      partialize: (state) => ({
        isPlaying: state.isPlaying,
        isCampaignWon: state.isCampaignWon,
        playerRace: state.playerRace,
        baseHero: state.baseHero,
        heroStats: state.heroStats,
        equipment: state.equipment,
        inventory: state.inventory,
        playerArmy: state.playerArmy,
        currentLevelId: state.currentLevelId,
        completedLocationsByLevel: state.completedLocationsByLevel,
        levelsCompleted: state.levelsCompleted,
        gold: state.gold,
        manaCrystals: state.manaCrystals,
        storyFlags: state.storyFlags,
      }),
    }
  )
);
