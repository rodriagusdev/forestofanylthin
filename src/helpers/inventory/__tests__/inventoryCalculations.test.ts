import { describe, it, expect } from 'vitest';
import {
  calculateEquipmentBonuses,
  equipItemToState,
  unequipItemFromState,
  applyEquipmentToHero,
} from '../inventoryCalculations';
import { EquipmentState, InventoryItem, UnitStats } from '../../../types';

const mockHelm: InventoryItem = {
  id: 'test_helm',
  name: 'Iron Helm',
  slot: 'helm',
  rarity: 'Common',
  description: '+2 Armor, +20 HP',
  stats: { armor: 2, health: 20 },
};

const mockArmor: InventoryItem = {
  id: 'test_armor',
  name: 'Steel Plate',
  slot: 'armor',
  rarity: 'Rare',
  description: '+4 Armor, +50 HP',
  stats: { armor: 4, health: 50, damage: 5 },
};

const mockRing1: InventoryItem = {
  id: 'test_ring1',
  name: 'Ring of Power',
  slot: 'ring',
  rarity: 'Epic',
  description: '+2 Spellpower, +4 Magic',
  stats: { spellpower: 2, magic: 4 },
};

const mockRing2: InventoryItem = {
  id: 'test_ring2',
  name: 'Ring of Swiftness',
  slot: 'ring',
  rarity: 'Rare',
  description: '+2 Initiative, +10 Attack',
  stats: { initiative: 2, damage: 10 },
};

const mockHero: UnitStats = {
  id: 'hero_elisith',
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
  spellpower: 5,
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

describe('Inventory & Equipment Calculations', () => {
  it('calculates total stat bonuses across all 4 equipment slots', () => {
    const equipment: EquipmentState = {
      helm: mockHelm,
      armor: mockArmor,
      ring1: mockRing1,
      ring2: mockRing2,
    };

    const bonuses = calculateEquipmentBonuses(equipment);
    expect(bonuses.health).toBe(70); // 20 + 50
    expect(bonuses.armor).toBe(6); // 2 + 4
    expect(bonuses.damage).toBe(15); // 5 + 10
    expect(bonuses.spellpower).toBe(2);
    expect(bonuses.magic).toBe(4);
    expect(bonuses.initiative).toBe(2);
    expect(bonuses.magicResistance).toBe(0);
  });

  it('correctly equips an item and updates inventory list', () => {
    const initialEquipment: EquipmentState = {
      helm: null,
      armor: null,
      ring1: null,
      ring2: null,
    };
    const initialInventory: InventoryItem[] = [mockHelm, mockArmor];

    const { newEquipment, newInventory } = equipItemToState(
      initialEquipment,
      initialInventory,
      mockHelm
    );

    expect(newEquipment.helm?.id).toBe('test_helm');
    expect(newInventory.length).toBe(1);
    expect(newInventory[0].id).toBe('test_armor');
  });

  it('swaps existing item back to inventory when replacing an occupied slot', () => {
    const existingHelm: InventoryItem = {
      id: 'old_helm',
      name: 'Rusty Cap',
      slot: 'helm',
      rarity: 'Common',
      description: '',
      stats: { armor: 1 },
    };

    const currentEquipment: EquipmentState = {
      helm: existingHelm,
      armor: null,
      ring1: null,
      ring2: null,
    };

    const { newEquipment, newInventory } = equipItemToState(
      currentEquipment,
      [mockHelm],
      mockHelm
    );

    expect(newEquipment.helm?.id).toBe('test_helm');
    expect(newInventory.length).toBe(1);
    expect(newInventory[0].id).toBe('old_helm');
  });

  it('correctly unequips an item into inventory', () => {
    const currentEquipment: EquipmentState = {
      helm: mockHelm,
      armor: null,
      ring1: null,
      ring2: null,
    };

    const { newEquipment, newInventory } = unequipItemFromState(
      currentEquipment,
      [],
      'helm'
    );

    expect(newEquipment.helm).toBeNull();
    expect(newInventory.length).toBe(1);
    expect(newInventory[0].id).toBe('test_helm');
  });

  it('applies equipment stat bonuses to hero attributes', () => {
    const equipment: EquipmentState = {
      helm: mockHelm, // +20 HP, +2 Armor
      armor: mockArmor, // +50 HP, +4 Armor, +5 Damage
      ring1: mockRing1, // +2 Spellpower, +4 Magic
      ring2: mockRing2, // +2 Initiative, +10 Damage
    };

    const upgradedHero = applyEquipmentToHero(mockHero, equipment);

    expect(upgradedHero.health).toBe(215); // 145 + 70
    expect(upgradedHero.armor).toBe(11); // 5 + 6
    expect(upgradedHero.damage).toBe(71); // 56 + 15
    expect(upgradedHero.spellpower).toBe(7); // 5 + 2
    expect(upgradedHero.magic).toBe(22); // 18 + 4
    expect(upgradedHero.initiative).toBe('11'); // 9 + 2
  });
});
