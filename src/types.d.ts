export type ActionName =
  | 'Combat: Clear Action'
  | 'Combat: Attack'
  | 'Combat: Defend'
  | 'Combat: Wait'
  | 'Dark Magic: Curse'
  | 'Dark Magic: Weakness'
  | 'Dark Magic: Shatter Armor'
  | 'Dark Magic: Breach Resistances'
  | 'Destruction: Rain of Fire'
  | 'Destruction: Ice Spear'
  | 'Necromancy: Reanimate'
  | 'Necromancy: Vampiric Lust';

export interface Skill {
  name: ActionName;
  formattedName: string;
  description: string;
  image: string;
  type: string;
  targetType?: string;
  manaCost?: number;
  schoolTier?: string;
  quote?: string;
  mechanics?: string;
  formula?: string;
}

export interface UnitStats {
  id: string;
  name: string;
  type: string;
  stack: number;
  maxStack: number;
  health: number;
  maxHealth: number;
  updatedHealth: number;
  updatedDamage: number;
  damage: number;
  initialArmor: number;
  armor: number;
  magicResistance: number;
  magic: number;
  maxMagic: number;
  initiative: string;
  portrait: string;
  face: string;
  stack: number;
  belongsTo: string;
  skills: Skill[];
  weaknessDamage: number;
  cursed: boolean;
  soundAttack: () => void;
  soundHitted: () => void;
  soundDeath: () => void;
  vampiricHeal?: boolean;
  spellpower?: number;
  level?: number;
  defending?: boolean;
  hasWaited?: boolean;
  hasRetaliated?: boolean;
  isRanged?: boolean;
}

export type Army = UnitStats[];
export type Unit = UnitStats;

export interface CombatLogEntry {
  id: string;
  turnNumber: number;
  timestamp: string;
  actor: {
    name: string;
    face: string;
    belongsTo: string;
  };
  actionName: string;
  actionType: 'attack' | 'spell' | 'status' | 'death' | 'heal';
  target?: {
    name: string;
    face: string;
    belongsTo: string;
  };
  description: string;
  damageDealt?: number;
  stacksLost?: number;
  healAmount?: number;
  isFatal?: boolean;
}

export interface FloatingCombatTextEvent {
  id: string;
  unitId: string;
  text: string;
  type: 'damage' | 'heal' | 'curse' | 'buff' | 'debuff' | 'crit' | 'counter';
  subtext?: string;
}

export * from './types/inventory';


