import { useState, useEffect, useCallback, useMemo } from 'react';
import { soundEngine } from '../services/audio/soundEngine';
import { MusicTrackKey } from '../data/audio/musicRegistry';

export const useActionSound = () => {
  const [masterVolume, setMasterVolumeState] = useState(soundEngine.getMasterVolume());
  const [musicVolume, setMusicVolumeState] = useState(soundEngine.getMusicVolume());
  const [sfxVolume, setSfxVolumeState] = useState(soundEngine.getSfxVolume());
  const [isMuted, setIsMutedState] = useState(soundEngine.isMuted());

  useEffect(() => {
    return soundEngine.subscribe(() => {
      setMasterVolumeState(soundEngine.getMasterVolume());
      setMusicVolumeState(soundEngine.getMusicVolume());
      setSfxVolumeState(soundEngine.getSfxVolume());
      setIsMutedState(soundEngine.isMuted());
    });
  }, []);

  const playPreviewSound = useCallback(() => {
    soundEngine.playClick();
  }, []);

  const spellSounds = useMemo(
    () => ({
      curse: () => soundEngine.playCurse(),
      weakness: () => soundEngine.playWeakness(),
      shatterArmor: () => soundEngine.playShatterArmor(),
      rainOfFire: () => soundEngine.playRainOfFire(),
      reanimate: () => soundEngine.playReanimate(),
      vampiricLust: () => soundEngine.playVampiricLust(),
      iceSpear: () => soundEngine.playIceSpear(),
      breachResistances: () => soundEngine.playBreachResistances(),
    }),
    []
  );

  return {
    spellSounds,
    playPreviewSound,
    // Volumes
    volume: masterVolume, // Alias for backward compatibility
    masterVolume,
    musicVolume,
    sfxVolume,
    isMuted,
    setVolume: (vol: number) => soundEngine.setMasterVolume(vol),
    setMasterVolume: (vol: number) => soundEngine.setMasterVolume(vol),
    setMusicVolume: (vol: number) => soundEngine.setMusicVolume(vol),
    setSfxVolume: (vol: number) => soundEngine.setSfxVolume(vol),
    toggleMute: () => soundEngine.toggleMute(),
    setMuted: (muted: boolean) => soundEngine.setMuted(muted),

    // Music API
    playMusic: (trackKey: MusicTrackKey, options?: { crossfadeMs?: number; volumeScale?: number }) =>
      soundEngine.playMusic(trackKey, options),
    stopMusic: (crossfadeMs?: number) => soundEngine.stopMusic(crossfadeMs),
    getActiveMusicKey: () => soundEngine.getActiveMusicKey(),

    // Legacy helpers
    startBattleMusic: (faction?: string) => soundEngine.startBattleMusic(faction),
    stopBattleMusic: () => soundEngine.stopBattleMusic(),
    startAmbientMusic: (faction?: string) => soundEngine.startAmbientMusic(faction),
    stopAmbientMusic: () => soundEngine.stopAmbientMusic(),
    stopAllMusic: () => soundEngine.stopAllMusic(),
  };
};
