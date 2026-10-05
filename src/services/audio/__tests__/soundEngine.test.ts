import { describe, it, expect, beforeEach, vi } from 'vitest';
import { soundEngine, SOUND_SOURCES } from '../soundEngine';

describe('SoundEngine Service', () => {
  beforeEach(() => {
    soundEngine.setMuted(false);
    soundEngine.setVolume(0.8);
  });

  it('should initialize with default volume and unmuted state', () => {
    expect(soundEngine.getVolume()).toBe(0.8);
    expect(soundEngine.isMuted()).toBe(false);
  });

  it('should support volume adjustments bounded between 0 and 1', () => {
    soundEngine.setVolume(0.5);
    expect(soundEngine.getVolume()).toBe(0.5);

    soundEngine.setVolume(1.5);
    expect(soundEngine.getVolume()).toBe(1);

    soundEngine.setVolume(-0.5);
    expect(soundEngine.getVolume()).toBe(0);
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

    soundEngine.setVolume(0.3);
    expect(listener).toHaveBeenCalledTimes(1);

    soundEngine.setMuted(true);
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    soundEngine.setVolume(0.9);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('should map all spell and attack sounds in SOUND_SOURCES', () => {
    expect(SOUND_SOURCES.spell_curse).toBeDefined();
    expect(SOUND_SOURCES.spell_rainoffire).toBeDefined();
    expect(SOUND_SOURCES.attack_roynis).toBeDefined();
    expect(SOUND_SOURCES.ui_click).toBeDefined();
  });

  it('should support starting and stopping battle BGM safely without throwing', () => {
    expect(() => soundEngine.startBattleMusic()).not.toThrow();
    expect(() => soundEngine.stopBattleMusic()).not.toThrow();
  });
});
