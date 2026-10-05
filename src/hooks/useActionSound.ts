import { useState, useEffect, useCallback, useMemo } from 'react';
import { soundEngine } from '../services/audio/soundEngine';

export const useActionSound = () => {
  const [volume, setVolumeState] = useState(soundEngine.getVolume());
  const [isMuted, setIsMutedState] = useState(soundEngine.isMuted());

  useEffect(() => {
    return soundEngine.subscribe(() => {
      setVolumeState(soundEngine.getVolume());
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
    volume,
    isMuted,
    setVolume: (vol: number) => soundEngine.setVolume(vol),
    setMuted: (muted: boolean) => soundEngine.setMuted(muted),
    toggleMute: () => soundEngine.toggleMute(),
    startBattleMusic: () => soundEngine.startBattleMusic(),
    stopBattleMusic: () => soundEngine.stopBattleMusic(),
  };
};
