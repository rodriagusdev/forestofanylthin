import { Army, UnitStats } from '../../types';

export interface LocationReward {
  type: 'unit';
  raceBonus?: 'undead' | 'dryeldar' | 'all' | string;
  unit: Partial<UnitStats> & { name: string; id: string; health: number; damage: number };
  count: number;
  description: string;
}

export interface LocationCoordinates {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
}

export interface LocationUnlockCondition {
  /** If set, completing ANY ONE of these location IDs unlocks this domain (OR logic) */
  anyOf?: string[];
  /** If set, ALL of these location IDs must be completed (AND logic) */
  allOf?: string[];
  /** Optional custom lore text explaining what obstructs the path */
  description?: string;
}

export interface LocationConfig {
  id: string;
  name: string;
  subtitle: string;
  tier: string;
  description: string;
  image: string;
  enemies: Army;
  accent: string;
  borderHover: string;
  glowHover: string;
  isBoss?: boolean;
  reward?: LocationReward;
  coordinates?: LocationCoordinates;
  connections?: string[];
  unlockCondition?: LocationUnlockCondition;
}

export interface LevelConfig {
  id: number;
  code: string;
  name: string;
  subtitle: string;
  description: string;
  mapImage?: string;
  bannerImage?: string;
  locations: LocationConfig[];
}

