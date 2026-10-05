import { Army } from '../../types';
import lvlsacre from '../../assets/images/map/sacre.jpg';
import lvlcemetery from '../../assets/images/map/cemetery.jpg';
import lvlgloomyforest from '../../assets/images/map/gloomyforest.jpg';
import lvlLostGlade from '../../assets/images/map/lostglade.jpg';
import {
  cemetery,
  lostGlade,
  forgottenCrypt,
  gloomyForest,
} from '../enemyStacks';

export type ZoneId = 'Cemetery' | 'Lost Glade' | 'Gloomy Forest' | 'Sacrelthar';

export interface ZoneReward {
  type: 'unit';
  raceBonus?: string;
  unitId: string;
  count: number;
  description: string;
}

export interface ZoneConfig {
  id: ZoneId;
  name: string;
  subtitle: string;
  tier: string;
  description: string;
  image: string;
  enemies: Army;
  accent: string;
  borderHover: string;
  glowHover: string;
  reward?: ZoneReward;
}

export const ZONES: Record<ZoneId, ZoneConfig> = {
  Cemetery: {
    id: 'Cemetery',
    name: 'Desolate Cemetery',
    subtitle: 'Ancient Sepulcher of Whispers',
    tier: 'Tier I • Undead Crypt',
    description:
      'A quiet burial ground where skeletal guards and necromantic liches guard the forgotten crypts.',
    image: lvlcemetery,
    enemies: cemetery,
    accent: 'text-cyan-400',
    borderHover: 'hover:border-cyan-400/80',
    glowHover: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]',
    reward: {
      type: 'unit',
      raceBonus: 'undead',
      unitId: 'nicolaiSkeleton',
      count: 50,
      description: '+50 Skeletons (Undead Faction)',
    },
  },
  'Lost Glade': {
    id: 'Lost Glade',
    name: 'The Lost Glade',
    subtitle: 'Overgrown Grove of Bones',
    tier: 'Tier II • Endless Swarm',
    description:
      'A sprawling battalion of 60 relentless skeletons roaming the twilight underbrush.',
    image: lvlLostGlade,
    enemies: lostGlade,
    accent: 'text-amber-400',
    borderHover: 'hover:border-amber-400/80',
    glowHover: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
  },
  'Gloomy Forest': {
    id: 'Gloomy Forest',
    name: 'The Gloomy Forest',
    subtitle: 'Cursed Canopy of Shadow',
    tier: 'Tier III • Ambush Vanguard',
    description:
      'Deep thicket infested with skeleton legions and dark warlocks weaving destructive hexes.',
    image: lvlgloomyforest,
    enemies: gloomyForest,
    accent: 'text-emerald-400',
    borderHover: 'hover:border-emerald-400/80',
    glowHover: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
    reward: {
      type: 'unit',
      unitId: 'dryexaRanger',
      count: 14,
      description: '+14 Dryexa Rangers',
    },
  },
  Sacrelthar: {
    id: 'Sacrelthar',
    name: 'Sacrelthar Citadel',
    subtitle: 'Stronghold of Velish Acarys',
    tier: 'Boss Citadel • High Peril',
    description:
      'The dread sanctuary of Velish Acarys, surrounded by liches, warlocks, and ancient skeletal phalanxes.',
    image: lvlsacre,
    enemies: forgottenCrypt,
    accent: 'text-rose-400',
    borderHover: 'hover:border-rose-400/80',
    glowHover: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.35)]',
  },
};

export const ZONES_LIST = Object.values(ZONES);
