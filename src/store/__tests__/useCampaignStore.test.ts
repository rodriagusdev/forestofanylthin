import { describe, it, expect, beforeEach } from 'vitest';
import { useCampaignStore, DialogueSequence } from '../useCampaignStore';
import { UnitStats, Army } from '../../types';

const mockHero: UnitStats = {
  id: 'elisith',
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
  vampiricHeal: false,
  soundAttack: () => {},
  soundHitted: () => {},
  soundDeath: () => {},
};

const mockArmy: Army = [mockHero];

describe('Zustand Campaign Store', () => {
  beforeEach(() => {
    useCampaignStore.getState().resetCampaign();
  });

  it('starts a new campaign with starting faction and resources', () => {
    const store = useCampaignStore.getState();
    store.startNewCampaign('dryeldar', mockArmy, mockHero);

    const state = useCampaignStore.getState();
    expect(state.isPlaying).toBe(true);
    expect(state.playerRace).toBe('dryeldar');
    expect(state.playerArmy.length).toBe(1);
    expect(state.currentLevelId).toBe(1);
    expect(state.gold).toBe(150);
    expect(state.storyFlags['intro_completed_dryeldar']).toBe(true);
  });

  it('completes a location and adds to completed list', () => {
    const store = useCampaignStore.getState();
    store.startNewCampaign('undead', mockArmy, mockHero);

    store.completeLocation(1, 'Cemetery', mockArmy);

    const state = useCampaignStore.getState();
    expect(state.completedLocationsByLevel[1]).toContain('Cemetery');
    expect(state.storyFlags['location_cleared_Cemetery']).toBe(true);
  });

  it('manages gold economy correctly', () => {
    const store = useCampaignStore.getState();
    store.startNewCampaign('dryeldar', mockArmy, mockHero);

    store.addGold(50);
    expect(useCampaignStore.getState().gold).toBe(200);

    const spentSuccess = store.spendGold(75);
    expect(spentSuccess).toBe(true);
    expect(useCampaignStore.getState().gold).toBe(125);

    const spentFail = store.spendGold(500);
    expect(spentFail).toBe(false);
    expect(useCampaignStore.getState().gold).toBe(125);
  });

  it('sets and retrieves story flags for quest branching', () => {
    const store = useCampaignStore.getState();
    expect(store.hasStoryFlag('met_velish')).toBe(false);

    store.setStoryFlag('met_velish', true);
    expect(store.hasStoryFlag('met_velish')).toBe(true);
  });

  it('handles dialogue sequences and branching choices', () => {
    const store = useCampaignStore.getState();

    const testDialogue: DialogueSequence = {
      id: 'test_dialogue',
      title: 'The Crossroads',
      startNodeId: 'node_1',
      nodes: {
        node_1: {
          id: 'node_1',
          speaker: { name: 'Mysterious Wanderer', avatar: '' },
          text: 'Halt, traveler. Do you seek the ancient citadel?',
          choices: [
            {
              id: 'choice_yes',
              text: 'Yes, I shall cleanse it.',
              nextNodeId: 'node_2',
            },
            {
              id: 'choice_no',
              text: 'No, I turn back.',
              actionType: 'close',
            },
          ],
        },
        node_2: {
          id: 'node_2',
          speaker: { name: 'Mysterious Wanderer', avatar: '' },
          text: 'Take this blessing, and may shadow guide you.',
        },
      },
    };

    store.startDialogue(testDialogue);
    expect(useCampaignStore.getState().activeDialogue?.id).toBe('test_dialogue');
    expect(useCampaignStore.getState().currentDialogueNodeId).toBe('node_1');

    store.selectDialogueChoice({
      id: 'choice_yes',
      text: 'Yes, I shall cleanse it.',
      nextNodeId: 'node_2',
    });

    expect(useCampaignStore.getState().currentDialogueNodeId).toBe('node_2');

    store.advanceDialogueNode();
    expect(useCampaignStore.getState().activeDialogue).toBeNull();
  });
});
