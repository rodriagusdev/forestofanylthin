import { describe, it, expect, beforeEach, vi } from 'vitest';
import { soundEngine, SOUND_SOURCES } from '../soundEngine';
import {
  MUSIC_TRACKS,
  FACTION_AUDIO_PROFILES,
  resolveMusicTrack,
} from '../../../data/audio/musicRegistry';

describe('SoundEngine Service & Audio Pipeline', () => {
  beforeEach(() => {
    soundEngine.setMuted(false);
    soundEngine.setMasterVolume(0.8);
    soundEngine.setMusicVolume(0.8);
    soundEngine.setSfxVolume(0.8);
  });

  it('should initialize with default multi-channel volumes', () => {
    expect(soundEngine.getMasterVolume()).toBe(0.8);
    expect(soundEngine.getMusicVolume()).toBe(0.8);
    expect(soundEngine.getSfxVolume()).toBe(0.8);
    expect(soundEngine.isMuted()).toBe(false);
  });

  it('should support multi-channel volume adjustments bounded between 0 and 1', () => {
    soundEngine.setMasterVolume(0.5);
    expect(soundEngine.getMasterVolume()).toBe(0.5);

    soundEngine.setMusicVolume(1.5);
    expect(soundEngine.getMusicVolume()).toBe(1);

    soundEngine.setSfxVolume(-0.5);
    expect(soundEngine.getSfxVolume()).toBe(0);
  });

  it('should calculate effective channel volumes correctly', () => {
    soundEngine.setMasterVolume(0.5);
    soundEngine.setMusicVolume(0.5);
    soundEngine.setSfxVolume(0.5);
    expect(soundEngine.getEffectiveMusicVolume()).toBe(0.25);
    expect(soundEngine.getEffectiveSfxVolume()).toBe(0.25);

    soundEngine.setMuted(true);
    expect(soundEngine.getEffectiveMasterVolume()).toBe(0);
    expect(soundEngine.getEffectiveMusicVolume()).toBe(0);
    expect(soundEngine.getEffectiveSfxVolume()).toBe(0);
  });

  it('should toggle mute state correctly', () => {
    expect(soundEngine.isMuted()).toBe(false);
    soundEngine.toggleMute();
    expect(soundEngine.isMuted()).toBe(true);
    soundEngine.toggleMute();
    expect(soundEngine.isMuted()).toBe(false);
  });

  it('should notify subscribers when volume or mute state changes', () => {
    const listener = vi.fn();
    const unsubscribe = soundEngine.subscribe(listener);

    soundEngine.setMasterVolume(0.3);
    expect(listener).toHaveBeenCalledTimes(1);

    soundEngine.setMuted(true);
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    soundEngine.setMasterVolume(0.9);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('should map all spell and attack sounds in SOUND_SOURCES', () => {
    expect(SOUND_SOURCES.spell_curse).toBeDefined();
    expect(SOUND_SOURCES.spell_rainoffire).toBeDefined();
    expect(SOUND_SOURCES.attack_roynis).toBeDefined();
    expect(SOUND_SOURCES.ui_click).toBeDefined();
  });

  it('should support dynamic playMusic, startBattleMusic, and stopMusic without throwing', () => {
    expect(() => soundEngine.playMusic('ambient_undead')).not.toThrow();
    expect(() => soundEngine.playMusic('battle_undead')).not.toThrow();
    expect(() => soundEngine.stopMusic()).not.toThrow();
  });

  describe('resolveMusicTrack Pure Helper', () => {
    it('should resolve main_menu when not in fight and not playing', () => {
      const track = resolveMusicTrack({
        isInFight: false,
        isPlaying: false,
      });
      expect(track).toBe('main_menu');
    });

    it('should resolve faction ambient themes during campaign exploration', () => {
      const dryeldarTrack = resolveMusicTrack({
        isInFight: false,
        playerRace: 'dryeldar',
        isPlaying: true,
        playerArmyCount: 4,
      });
      expect(dryeldarTrack).toBe(FACTION_AUDIO_PROFILES.dryeldar.ambientTheme);

      const undeadTrack = resolveMusicTrack({
        isInFight: false,
        playerRace: 'undead',
        isPlaying: true,
        playerArmyCount: 4,
      });
      expect(undeadTrack).toBe(FACTION_AUDIO_PROFILES.undead.ambientTheme);
    });

    it('should resolve faction battle themes when in combat', () => {
      const battleTrack = resolveMusicTrack({
        isInFight: true,
        playerRace: 'dryeldar',
        playerArmyCount: 4,
      });
      expect(battleTrack).toBe(FACTION_AUDIO_PROFILES.dryeldar.battleTheme);
    });

    it('should override with battle_boss when entering a boss zone', () => {
      const bossTrack = resolveMusicTrack({
        isInFight: true,
        playerRace: 'undead',
        locationConfig: {
          id: 'Sacre',
          name: 'Sacrelthar Citadel',
          subtitle: 'The Seat of Corruption',
          tier: 'Tier IV',
          description: '',
          image: '',
          enemies: [],
          accent: '',
          borderHover: '',
          glowHover: '',
          isBoss: true,
        },
      });
      expect(bossTrack).toBe('battle_boss');
    });

    it('should resolve null when campaign is won or army is wiped', () => {
      expect(resolveMusicTrack({ isInFight: false, isCampaignWon: true })).toBeNull();
      expect(
        resolveMusicTrack({
          isInFight: false,
          isPlaying: true,
          playerArmyCount: 0,
        })
      ).toBeNull();
    });
  });
});
