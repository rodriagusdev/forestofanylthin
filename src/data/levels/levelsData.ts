import { LevelConfig, LocationConfig } from './levelTypes';
import lvlsacre from '../../assets/images/map/sacre.jpg';
import lvlcemetery from '../../assets/images/map/cemetery.jpg';
import lvlgloomyforest from '../../assets/images/map/gloomyforest.jpg';
import lvlLostGlade from '../../assets/images/map/lostglade.jpg';
import eldarePortrait from '../../assets/images/portraits/undead/eldare.jpg';
import mapForestOfAnYlthin16_9 from '../../assets/images/map/forestofanylthin_16_9.jpg';
import {
  cemetery,
  lostGlade,
  forgottenCrypt,
  gloomyForest,
  eldareBatallion
} from '../enemyStacks';
import { skeleton } from '../unitstats/undead/undead';
import { dryexaRanger } from '../unitstats/dryexa/dryexa';

const locationsLevel_1: LocationConfig[] = [
  {
    id: 'Cemetery',
    name: 'Desolate Cemetery',
    subtitle: 'The cemetery of the townfolk of the human city of Hithair.',
    tier: 'I',
    description:
      'The necromancer Velish Acarys passed by this untended cemetery, and with her dark powers she raised the dead to serve her. Some linger still in their graves, lucky souls that escaped her grasp.',
    image: lvlcemetery,
    enemies: cemetery,
    accent: 'text-stone-300',
    borderHover: 'hover:border-stone-500',
    glowHover: 'hover:shadow-[0_0_25px_rgba(168,162,158,0.2)]',
    coordinates: { x: 18.5, y: 23 },
    connections: ['Lost Glade', 'Gloomy Forest', 'Sacrelthar'],
    reward: {
      type: 'unit',
      raceBonus: 'undead',
      unit: skeleton,
      count: 50,
      description: '+50 Skeletons (Undead Faction)',
    },
  },
  {
    id: 'Lost Glade',
    name: 'The Lost Glade',
    subtitle: 'Velish had left behind a great amount of soldiers to protect this border.',
    tier: 'II',
    description:
      'This once peaceful grove was overrun by wandering skeletal thralls roaming aimlessly through the bone-strewn mist.',
    image: lvlLostGlade,
    enemies: lostGlade,
    accent: 'text-stone-300',
    borderHover: 'hover:border-stone-500',
    glowHover: 'hover:shadow-[0_0_25px_rgba(168,162,158,0.2)]',
    coordinates: { x: 64.5, y: 22 },
    connections: ['Cemetery', 'Sacrelthar', 'Gloomy Forest'],
  },
  {
    id: 'Gloomy Forest',
    name: 'The Gloomy Forest',
    subtitle: 'Haven of Displaced Wardens',
    tier: 'Shadowed Thicket',
    description:
      'A suffocating canopy where exiled Dryexa bowmen hide among the thorns, watching for anyone with the strength to break the siege.',
    image: lvlgloomyforest,
    enemies: gloomyForest,
    accent: 'text-stone-300',
    borderHover: 'hover:border-stone-500',
    glowHover: 'hover:shadow-[0_0_25px_rgba(168,162,158,0.2)]',
    coordinates: { x: 77.5, y: 74 },
    connections: ['Cemetery', 'Sacrelthar', 'Lost Glade'],
    reward: {
      type: 'unit',
      raceBonus: 'all',
      unit: dryexaRanger,
      count: 14,
      description: '+14 Dryexa Rangers',
    },
  },
  {
    id: 'Dark Knight',
    name: 'Dark Knight Eldare',
    subtitle: 'Batallion',
    tier: 'Batallion',
    description:
      'The Undead Knight Eldare protects the passage to Sacrelthar.',
    image: eldarePortrait,
    enemies: eldareBatallion,
    accent: 'text-stone-300',
    borderHover: 'hover:border-stone-500',
    glowHover: 'hover:shadow-[0_0_25px_rgba(168,162,158,0.2)]',
    coordinates: { x: 66, y: 60 },
    connections: ['Cemetery', 'Gloomy Forest', 'Lost Glade'],
    isBoss: false,
  },
  {
    id: 'Sacrelthar',
    name: 'Sacrelthar Citadel',
    subtitle: 'Corrupted Sylvan Fortress of Velish Acarys',
    tier: 'Dread Stronghold',
    description:
      'The rotting tree fortress of Velish Acarys. Decaying liches and shadow warlocks stand vigil before the lord of the crypt amidst ancient corrupted roots.',
    image: lvlsacre,
    enemies: forgottenCrypt,
    accent: 'text-stone-300',
    borderHover: 'hover:border-stone-500',
    glowHover: 'hover:shadow-[0_0_25px_rgba(168,162,158,0.2)]',
    coordinates: { x: 41, y: 67 },
    connections: ['Cemetery', 'Gloomy Forest', 'Lost Glade'],
    isBoss: true,
    unlockCondition: {
      anyOf: ['Gloomy Forest', 'Dark Knight'],
      description: 'Clear The Gloomy Forest or defeat Dark Knight Eldare to breach Sacrelthar Citadel.',
    },
  },
];

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    code: 'level-1',
    name: 'A favor for the Dryexa',
    subtitle: 'Forest of An-Ylthin',
    description:
      'The Forest of An-Ylthin has been tainted by the shadow of the necromancer Velish Acarys. ',
    mapImage: mapForestOfAnYlthin16_9,
    locations: locationsLevel_1,
  },
];

export const TOTAL_LEVELS = LEVELS.length;

export const getLevelById = (levelId: number): LevelConfig | undefined => {
  return LEVELS.find((l) => l.id === levelId);
};

export const getLocationById = (
  levelId: number,
  locationId: string
): LocationConfig | undefined => {
  const level = getLevelById(levelId);
  return level?.locations.find((loc) => loc.id === locationId);
};

export const findLocation = (
  locationId: string
): { level: LevelConfig; location: LocationConfig } | undefined => {
  for (const level of LEVELS) {
    const loc = level.locations.find((l) => l.id === locationId);
    if (loc) {
      return { level, location: loc };
    }
  }
  return undefined;
};
