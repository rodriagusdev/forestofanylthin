// Audio Registry & Track Definitions
import mainthemeOgg from '../../assets/sounds/music/maintheme.ogg';
import battlethemeOgg from '../../assets/sounds/music/battletheme.ogg';
import { LocationConfig } from '../levels/levelTypes';

export interface MusicTrackDefinition {
  id: string;
  name: string;
  src: string[];
  defaultVolume: number;
  loop?: boolean;
}

export const MUSIC_TRACKS: Record<string, MusicTrackDefinition> = {
  // Main Theme / Menu
  main_menu: {
    id: 'main_menu',
    name: 'Forest of An-Ylthin Main Theme',
    src: [mainthemeOgg],
    defaultVolume: 0.4,
    loop: true,
  },

  // Faction Exploration / Ambient Tracks
  ambient_dryeldar: {
    id: 'ambient_dryeldar',
    name: 'Covenant Shadows (Dryeldar Ambient)',
    src: [mainthemeOgg],
    defaultVolume: 0.4,
    loop: true,
  },
  ambient_undead: {
    id: 'ambient_undead',
    name: 'Necropolis of Silorn (Undead Ambient)',
    src: [mainthemeOgg],
    defaultVolume: 0.4,
    loop: true,
  },
  ambient_dryexa: {
    id: 'ambient_dryexa',
    name: 'The Lost Glade (Dryexa Ambient)',
    src: [mainthemeOgg],
    defaultVolume: 0.4,
    loop: true,
  },

  // Faction Combat Tracks
  battle_dryeldar: {
    id: 'battle_dryeldar',
    name: 'Dryeldar Covenant War March',
    src: [battlethemeOgg],
    defaultVolume: 0.45,
    loop: true,
  },
  battle_undead: {
    id: 'battle_undead',
    name: 'Necropolis Assault Theme',
    src: [battlethemeOgg],
    defaultVolume: 0.45,
    loop: true,
  },
  battle_dryexa: {
    id: 'battle_dryexa',
    name: 'Rangers of the Lost Glade Battle',
    src: [battlethemeOgg],
    defaultVolume: 0.45,
    loop: true,
  },
  battle_boss: {
    id: 'battle_boss',
    name: 'Citadel of Sacrelthar Climax',
    src: [battlethemeOgg],
    defaultVolume: 0.5,
    loop: true,
  },
};

export type MusicTrackKey = keyof typeof MUSIC_TRACKS | string;

export interface FactionAudioProfile {
  ambientTheme: MusicTrackKey;
  battleTheme: MusicTrackKey;
  victoryTheme?: MusicTrackKey;
  defeatTheme?: MusicTrackKey;
}

export const FACTION_AUDIO_PROFILES: Record<string, FactionAudioProfile> = {
  dryeldar: {
    ambientTheme: 'ambient_dryeldar',
    battleTheme: 'battle_dryeldar',
  },
  undead: {
    ambientTheme: 'ambient_undead',
    battleTheme: 'battle_undead',
  },
  dryexa: {
    ambientTheme: 'ambient_dryexa',
    battleTheme: 'battle_dryexa',
  },
};

export const DEFAULT_AUDIO_PROFILE: FactionAudioProfile = {
  ambientTheme: 'main_menu',
  battleTheme: 'battle_undead',
};

/**
 * Pure Contextual Music Resolver
 * Evaluates current game state and returns the appropriate MusicTrackKey.
 * Scalable for any number of factions and custom location overrides.
 */
export function resolveMusicTrack({
  isInFight,
  playerRace,
  locationConfig,
  isCampaignWon,
  isPlaying,
  playerArmyCount,
}: {
  isInFight: boolean;
  playerRace?: string;
  locationConfig?: LocationConfig | null;
  isCampaignWon?: boolean;
  isPlaying?: boolean;
  playerArmyCount?: number;
}): MusicTrackKey | null {
  // Campaign Victory or Defeat
  if (isCampaignWon) {
    return null;
  }
  if (isPlaying && playerArmyCount === 0) {
    return null;
  }

  // Combat Mode
  if (isInFight) {
    // 1. Location-specific Boss or Custom Battle Theme Override
    if (locationConfig?.isBoss) {
      return 'battle_boss';
    }

    // 2. Faction-specific Battle Theme Lookup
    const profile = (playerRace && FACTION_AUDIO_PROFILES[playerRace]) || DEFAULT_AUDIO_PROFILE;
    return profile.battleTheme;
  }

  // Exploration / Menu Mode
  if (!isPlaying || !playerRace) {
    return 'main_menu';
  }

  const profile = FACTION_AUDIO_PROFILES[playerRace] || DEFAULT_AUDIO_PROFILE;
  return profile.ambientTheme;
}
