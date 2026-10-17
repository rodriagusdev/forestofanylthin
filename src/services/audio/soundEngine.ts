import { Howl, Howler } from 'howler';
import { MUSIC_TRACKS, MusicTrackKey } from '../../data/audio/musicRegistry';

// Spell SFX
import spellcurse from '../../assets/sounds/spellcurse.mp3';
import spellweakness from '../../assets/sounds/spellweakness.mp3';
import spellshatterarmor from '../../assets/sounds/spellshatterarmor.mp3';
import spellrainoffire from '../../assets/sounds/spellrainoffire.mp3';
import spellicespear from '../../assets/sounds/spellicespear.mp3';
import spellbreachresistances from '../../assets/sounds/spellbreachresistance.mp3';
import spellreanimate from '../../assets/sounds/spellreanimate.mp3';
import spellvampirism from '../../assets/sounds/spellvampirism.mp3';

// UI SFX
import previewclick from '../../assets/sounds/previewclick.mp3';

// Unit Attack SFX
import attackroynis from '../../assets/sounds/attackroynis.mp3';
import attackelisith from '../../assets/sounds/attackelisith.mp3';
import attackdarkmatron from '../../assets/sounds/attackdarkmatron.mp3';
import attacktwistedjin from '../../assets/sounds/attacktwistedjin.mp3';
import attacklich from '../../assets/sounds/attacklich.mp3';
import attacknicolai from '../../assets/sounds/attacknicolai.mp3';
import attackundeadwarlock from '../../assets/sounds/attackundeadwarlock.mp3';
import attackvelish from '../../assets/sounds/attackvelish.mp3';
import attackranger from '../../assets/sounds/attackranger.mp3';

// Unit Hit SFX
import hittedroynis from '../../assets/sounds/hittedroynis.mp3';
import hittedelisith from '../../assets/sounds/hittedelisith.mp3';
import hitteddarkmatron from '../../assets/sounds/hitteddarkmatron.mp3';
import hittedtwistedjin from '../../assets/sounds/hittedtwistedjin.mp3';
import hittedskeleton from '../../assets/sounds/hittedskeleton.mp3';
import hittedlich from '../../assets/sounds/hittedlich.mp3';
import hittednicolai from '../../assets/sounds/hittednicolai.mp3';
import hittedundeadwarlock from '../../assets/sounds/hittedundeadwarlock.mp3';
import hittedvelish from '../../assets/sounds/hittedvelish.mp3';
import hittedranger from '../../assets/sounds/hittedranger.mp3';

// Unit Death SFX
import deathroynis from '../../assets/sounds/deathroynis.mp3';
import deathdarkmatron from '../../assets/sounds/deathdarkmatron.mp3';
import deathtwistedjin from '../../assets/sounds/deathtwistedjin.mp3';
import deathskeleton from '../../assets/sounds/deathskeleton.mp3';
import deathlich from '../../assets/sounds/deathlich.mp3';
import deathnicolai from '../../assets/sounds/deathnicolai.mp3';
import deathundeadwarlock from '../../assets/sounds/deathundeadwarlock.mp3';
import deathvelish from '../../assets/sounds/deathvelish.mp3';
import deathranger from '../../assets/sounds/deathranger.mp3';

export const SOUND_SOURCES = {
  // Spells
  spell_curse: spellcurse,
  spell_weakness: spellweakness,
  spell_shatterarmor: spellshatterarmor,
  spell_rainoffire: spellrainoffire,
  spell_icespear: spellicespear,
  spell_breachresistances: spellbreachresistances,
  spell_reanimate: spellreanimate,
  spell_vampiric_lust: spellvampirism,

  // UI
  ui_click: previewclick,

  // Attacks
  attack_sword: attackroynis,
  attack_roynis: attackroynis,
  attack_elisith: attackelisith,
  attack_darkmatron: attackdarkmatron,
  attack_twistedjin: attacktwistedjin,
  attack_skeleton: attackroynis,
  attack_lich: attacklich,
  attack_nicolai: attacknicolai,
  attack_undeadwarlock: attackundeadwarlock,
  attack_velish: attackvelish,
  attack_ranger: attackranger,

  // Hits
  hit_roynis: hittedroynis,
  hit_elisith: hittedelisith,
  hit_darkmatron: hitteddarkmatron,
  hit_twistedjin: hittedtwistedjin,
  hit_skeleton: hittedskeleton,
  hit_lich: hittedlich,
  hit_nicolai: hittednicolai,
  hit_undeadwarlock: hittedundeadwarlock,
  hit_velish: hittedvelish,
  hit_ranger: hittedranger,

  // Deaths
  death_roynis: deathroynis,
  death_elisith: deathroynis,
  death_darkmatron: deathdarkmatron,
  death_twistedjin: deathtwistedjin,
  death_skeleton: deathskeleton,
  death_lich: deathlich,
  death_nicolai: deathnicolai,
  death_undeadwarlock: deathundeadwarlock,
  death_velish: deathvelish,
  death_ranger: deathranger,
} as const;

export type SoundKey = keyof typeof SOUND_SOURCES;

class SoundEngine {
  private sfxCache: Map<SoundKey, Howl> = new Map();
  private musicCache: Map<string, Howl> = new Map();

  // Multi-channel Audio Volumes
  private masterVolume: number = 0.8;
  private musicVolume: number = 0.8;
  private sfxVolume: number = 0.8;
  private muted: boolean = false;

  private listeners: Set<() => void> = new Set();

  // Active Music State & 2-Channel Crossfader
  private activeMusicKey: MusicTrackKey | null = null;
  private currentMusicHowl: Howl | null = null;
  private previousMusicHowl: Howl | null = null;
  private fadeTimeout: NodeJS.Timeout | null = null;

  constructor() {
    // Load persisted volume & mute settings
    try {
      const savedMaster = localStorage.getItem('foa_master_volume') || localStorage.getItem('foa_volume');
      if (savedMaster !== null) this.masterVolume = parseFloat(savedMaster);

      const savedMusic = localStorage.getItem('foa_music_volume');
      if (savedMusic !== null) this.musicVolume = parseFloat(savedMusic);

      const savedSfx = localStorage.getItem('foa_sfx_volume');
      if (savedSfx !== null) this.sfxVolume = parseFloat(savedSfx);

      const savedMuted = localStorage.getItem('foa_muted');
      if (savedMuted !== null) this.muted = savedMuted === 'true';

      Howler.volume(this.muted ? 0 : this.masterVolume);
    } catch {
      // Storage fallback
    }

    // Handle browser tab visibility change
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.currentMusicHowl && this.currentMusicHowl.playing()) {
            this.currentMusicHowl.volume(this.getEffectiveMusicVolume() * 0.2);
          }
        } else {
          if (this.currentMusicHowl && this.currentMusicHowl.playing() && this.activeMusicKey) {
            const trackDef = MUSIC_TRACKS[this.activeMusicKey] || MUSIC_TRACKS['main_menu'];
            this.currentMusicHowl.volume(this.getEffectiveMusicVolume() * trackDef.defaultVolume);
          }
        }
      });
    }
  }

  // Effective Volume Calculations
  public getEffectiveMasterVolume(): number {
    return this.muted ? 0 : this.masterVolume;
  }

  public getEffectiveMusicVolume(): number {
    return this.muted ? 0 : this.masterVolume * this.musicVolume;
  }

  public getEffectiveSfxVolume(): number {
    return this.muted ? 0 : this.masterVolume * this.sfxVolume;
  }

  /**
   * Sound Effects (SFX) Subsystem with Web Audio API caching
   */
  private getHowl(key: SoundKey): Howl {
    let howl = this.sfxCache.get(key);
    if (!howl) {
      const src = SOUND_SOURCES[key];
      howl = new Howl({
        src: [src],
        html5: false, // Web Audio API for instantaneous SFX
        preload: true,
      });
      this.sfxCache.set(key, howl);
    }
    return howl;
  }

  public play(key: SoundKey, volumeScale: number = 1): number | undefined {
    if (this.muted || this.masterVolume === 0 || this.sfxVolume === 0) return undefined;
    try {
      const howl = this.getHowl(key);
      const id = howl.play();
      const finalVol = this.getEffectiveSfxVolume() * volumeScale;
      howl.volume(finalVol, id);
      return id;
    } catch (err) {
      console.warn(`[SoundEngine] Could not play sound "${key}":`, err);
      return undefined;
    }
  }

  /**
   * Dialogue & Cutscene Voiceover Management
   */
  private currentVoiceHowl: Howl | null = null;

  public playVoiceover(src: string, volumeScale: number = 1): number | undefined {
    if (this.muted || this.masterVolume === 0 || this.sfxVolume === 0) return undefined;
    try {
      this.stopVoiceover();
      this.currentVoiceHowl = new Howl({
        src: [src],
        html5: false,
        volume: this.getEffectiveSfxVolume() * volumeScale,
      });
      return this.currentVoiceHowl.play();
    } catch (err) {
      console.warn('[SoundEngine] Could not play voiceover:', err);
      return undefined;
    }
  }

  public stopVoiceover() {
    if (this.currentVoiceHowl) {
      try {
        this.currentVoiceHowl.stop();
        this.currentVoiceHowl.unload();
      } catch {}
      this.currentVoiceHowl = null;
    }
  }

  /**
   * Universal Dynamic 2-Channel Crossfading Music Engine
   * Seamlessly fades out the active track and fades in the requested track.
   */
  public playMusic(
    trackKey: MusicTrackKey,
    options?: { crossfadeMs?: number; volumeScale?: number }
  ) {
    if (this.activeMusicKey === trackKey && this.currentMusicHowl?.playing()) {
      return;
    }

    const crossfade = options?.crossfadeMs ?? 1000;

    try {
      // 1. Clear any pending crossfade timeout
      if (this.fadeTimeout) {
        clearTimeout(this.fadeTimeout);
        this.fadeTimeout = null;
      }

      // 2. Crossfade out the currently playing music channel
      if (this.currentMusicHowl && this.currentMusicHowl.playing()) {
        this.previousMusicHowl = this.currentMusicHowl;
        const curVol = this.previousMusicHowl.volume();
        this.previousMusicHowl.fade(curVol, 0, crossfade);

        const oldHowl = this.previousMusicHowl;
        this.fadeTimeout = setTimeout(() => {
          oldHowl.stop();
        }, crossfade + 50);
      }

      // 3. Retrieve or lazily instantiate target Howl
      let targetHowl = this.musicCache.get(trackKey);
      const trackDef = MUSIC_TRACKS[trackKey] || MUSIC_TRACKS['main_menu'];

      if (!targetHowl) {
        targetHowl = new Howl({
          src: trackDef.src,
          html5: true, // HTML5 audio for smooth streaming of music tracks
          loop: trackDef.loop ?? true,
          volume: 0,
          preload: true,
        });
        this.musicCache.set(trackKey, targetHowl);
      }

      // 4. Update active track and initiate fade-in
      this.activeMusicKey = trackKey;
      this.currentMusicHowl = targetHowl;

      const targetVolume =
        this.getEffectiveMusicVolume() *
        trackDef.defaultVolume *
        (options?.volumeScale ?? 1);

      if (!targetHowl.playing()) {
        targetHowl.volume(0);
        targetHowl.play();
        targetHowl.fade(0, targetVolume, crossfade);
      } else {
        const cur = targetHowl.volume();
        targetHowl.fade(cur, targetVolume, crossfade);
      }
    } catch (err) {
      console.warn(`[SoundEngine] Could not play music "${trackKey}":`, err);
    }
  }

  /**
   * Stop Music with smooth fade-out
   */
  public stopMusic(crossfadeMs: number = 800) {
    if (!this.currentMusicHowl || !this.currentMusicHowl.playing()) {
      this.activeMusicKey = null;
      return;
    }

    try {
      if (this.fadeTimeout) {
        clearTimeout(this.fadeTimeout);
        this.fadeTimeout = null;
      }

      const curVol = this.currentMusicHowl.volume();
      this.currentMusicHowl.fade(curVol, 0, crossfadeMs);

      const targetHowl = this.currentMusicHowl;
      this.fadeTimeout = setTimeout(() => {
        targetHowl.stop();
      }, crossfadeMs + 50);

      this.activeMusicKey = null;
      this.currentMusicHowl = null;
    } catch (err) {
      console.warn('[SoundEngine] Could not stop music:', err);
    }
  }

  public getActiveMusicKey(): MusicTrackKey | null {
    return this.activeMusicKey;
  }

  // Backward-compatible aliases
  public startAmbientMusic(faction?: string) {
    const key = faction === 'dryeldar' ? 'ambient_dryeldar' : 'ambient_undead';
    this.playMusic(key);
  }

  public startBattleMusic(faction?: string) {
    const key = faction === 'dryeldar' ? 'battle_dryeldar' : 'battle_undead';
    this.playMusic(key);
  }

  public stopAmbientMusic() {
    this.stopMusic();
  }

  public stopBattleMusic() {
    this.stopMusic();
  }

  public stopAllMusic() {
    this.stopMusic();
  }

  /**
   * Spell & Action SFX Helpers
   */
  public playCurse() {
    this.play('spell_curse');
  }

  public playWeakness() {
    this.play('spell_weakness');
  }

  public playShatterArmor() {
    this.play('spell_shatterarmor');
  }

  public playRainOfFire() {
    this.play('spell_rainoffire');
  }

  public playIceSpear() {
    this.play('spell_icespear');
  }

  public playBreachResistances() {
    this.play('spell_breachresistances');
  }

  public playReanimate() {
    this.play('spell_reanimate');
  }

  public playVampiricLust() {
    this.play('spell_vampiric_lust');
  }

  public playClick() {
    this.play('ui_click', 0.6);
  }

  /**
   * Channel Volume Controls
   */
  public getVolume(): number {
    return this.masterVolume;
  }

  public setVolume(vol: number) {
    this.setMasterVolume(vol);
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    Howler.volume(this.getEffectiveMasterVolume());
    this.updateActiveMusicVolume();
    try {
      localStorage.setItem('foa_master_volume', this.masterVolume.toString());
      localStorage.setItem('foa_volume', this.masterVolume.toString());
    } catch {}
    this.notify();
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public setMusicVolume(vol: number) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    this.updateActiveMusicVolume();
    try {
      localStorage.setItem('foa_music_volume', this.musicVolume.toString());
    } catch {}
    this.notify();
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('foa_sfx_volume', this.sfxVolume.toString());
    } catch {}
    this.notify();
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    Howler.mute(muted);
    this.updateActiveMusicVolume();
    try {
      localStorage.setItem('foa_muted', muted.toString());
    } catch {}
    this.notify();
  }

  public toggleMute() {
    this.setMuted(!this.muted);
  }

  private updateActiveMusicVolume() {
    if (this.currentMusicHowl && this.currentMusicHowl.playing() && this.activeMusicKey) {
      const trackDef = MUSIC_TRACKS[this.activeMusicKey] || MUSIC_TRACKS['main_menu'];
      const target = this.getEffectiveMusicVolume() * trackDef.defaultVolume;
      this.currentMusicHowl.volume(target);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const soundEngine = new SoundEngine();
