export type EquipmentSlot = 'helm' | 'armor' | 'ring1' | 'ring2';
export type ItemSlotType = 'helm' | 'armor' | 'ring';
export type ItemRarity = 'Common' | 'Rare' | 'Epic' | 'Relic';

export interface ItemStatBonus {
  health?: number;
  damage?: number;
  armor?: number;
  magic?: number;
  spellpower?: number;
  initiative?: number;
  magicResistance?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  slot: ItemSlotType;
  rarity: ItemRarity;
  icon?: string;
  image?: string;
  description: string;
  lore?: string;
  stats: ItemStatBonus;
}

export interface EquipmentState {
  helm: InventoryItem | null;
  armor: InventoryItem | null;
  ring1: InventoryItem | null;
  ring2: InventoryItem | null;
}
