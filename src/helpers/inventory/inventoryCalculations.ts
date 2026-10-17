import {
  EquipmentSlot,
  EquipmentState,
  InventoryItem,
  ItemStatBonus,
  UnitStats,
} from '../../types';

/**
 * Aggregates all stat bonuses from currently equipped items.
 */
export const calculateEquipmentBonuses = (
  equipment: EquipmentState
): Required<ItemStatBonus> => {
  const totals: Required<ItemStatBonus> = {
    health: 0,
    damage: 0,
    armor: 0,
    magic: 0,
    spellpower: 0,
    initiative: 0,
    magicResistance: 0,
  };

  const equippedItems: (InventoryItem | null)[] = [
    equipment.helm,
    equipment.armor,
    equipment.ring1,
    equipment.ring2,
  ];

  for (const item of equippedItems) {
    if (!item || !item.stats) continue;
    if (item.stats.health) totals.health += item.stats.health;
    if (item.stats.damage) totals.damage += item.stats.damage;
    if (item.stats.armor) totals.armor += item.stats.armor;
    if (item.stats.magic) totals.magic += item.stats.magic;
    if (item.stats.spellpower) totals.spellpower += item.stats.spellpower;
    if (item.stats.initiative) totals.initiative += item.stats.initiative;
    if (item.stats.magicResistance) totals.magicResistance += item.stats.magicResistance;
  }

  return totals;
};

/**
 * Determines which equipment slot an item can occupy.
 */
export const resolveTargetSlot = (
  item: InventoryItem,
  currentEquipment: EquipmentState,
  preferredSlot?: EquipmentSlot
): EquipmentSlot | null => {
  if (item.slot === 'helm') return 'helm';
  if (item.slot === 'armor') return 'armor';
  if (item.slot === 'ring') {
    if (preferredSlot === 'ring1' || preferredSlot === 'ring2') return preferredSlot;
    // Auto-fill empty ring slot if available, else replace ring1
    if (!currentEquipment.ring1) return 'ring1';
    if (!currentEquipment.ring2) return 'ring2';
    return 'ring1';
  }
  return null;
};

/**
 * Pure function to equip an item from inventory to an equipment slot.
 */
export const equipItemToState = (
  equipment: EquipmentState,
  inventory: InventoryItem[],
  itemToEquip: InventoryItem,
  preferredSlot?: EquipmentSlot
): { newEquipment: EquipmentState; newInventory: InventoryItem[] } => {
  const targetSlot = resolveTargetSlot(itemToEquip, equipment, preferredSlot);
  if (!targetSlot) {
    return { newEquipment: equipment, newInventory: inventory };
  }

  const currentlyEquipped = equipment[targetSlot];
  const itemIndex = inventory.findIndex((i) => i.id === itemToEquip.id);

  // Remove the newly equipped item from inventory
  const nextInventory = [...inventory];
  if (itemIndex !== -1) {
    nextInventory.splice(itemIndex, 1);
  }

  // If there was an item already in the slot, put it back in inventory
  if (currentlyEquipped) {
    nextInventory.push(currentlyEquipped);
  }

  const nextEquipment: EquipmentState = {
    ...equipment,
    [targetSlot]: itemToEquip,
  };

  return { newEquipment: nextEquipment, newInventory: nextInventory };
};

/**
 * Pure function to unequip an item from a slot into inventory.
 */
export const unequipItemFromState = (
  equipment: EquipmentState,
  inventory: InventoryItem[],
  slotToUnequip: EquipmentSlot
): { newEquipment: EquipmentState; newInventory: InventoryItem[] } => {
  const item = equipment[slotToUnequip];
  if (!item) {
    return { newEquipment: equipment, newInventory: inventory };
  }

  const nextEquipment: EquipmentState = {
    ...equipment,
    [slotToUnequip]: null,
  };

  const nextInventory = [...inventory, item];

  return { newEquipment: nextEquipment, newInventory: nextInventory };
};

/**
 * Applies equipment bonuses to a base Hero UnitStats.
 */
export const applyEquipmentToHero = (
  baseHero: UnitStats,
  equipment: EquipmentState
): UnitStats => {
  const bonuses = calculateEquipmentBonuses(equipment);
  const baseInitiative = parseInt(baseHero.initiative || '5', 10);
  const finalInitiative = Math.max(1, baseInitiative + bonuses.initiative).toString();

  const finalHealth = Math.max(1, baseHero.health + bonuses.health);
  const finalDamage = Math.max(1, baseHero.damage + bonuses.damage);
  const finalArmor = Math.max(0, (baseHero.initialArmor ?? baseHero.armor) + bonuses.armor);
  const finalMagic = Math.max(0, (baseHero.maxMagic ?? baseHero.magic) + bonuses.magic);
  const finalSpellpower = Math.max(0, (baseHero.spellpower ?? 0) + bonuses.spellpower);
  const finalMagicResistance = (baseHero.magicResistance ?? 0) + bonuses.magicResistance;

  const stack = baseHero.stack || 1;

  return {
    ...baseHero,
    health: finalHealth,
    maxHealth: finalHealth * stack,
    updatedHealth: finalHealth * stack,
    damage: finalDamage,
    updatedDamage: finalDamage * stack,
    initialArmor: finalArmor,
    armor: finalArmor,
    magic: finalMagic,
    maxMagic: finalMagic,
    spellpower: finalSpellpower,
    magicResistance: finalMagicResistance,
    initiative: finalInitiative,
  };
};
