import { Howl, Howler } from 'howler';

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

// BGM Music Tracks
import battletheme from '../../assets/sounds/music/battletheme.mp3';

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
  private cache: Map<SoundKey, Howl> = new Map();
  private volume: number = 0.8;
  private muted: boolean = false;
  private listeners: Set<() => void> = new Set();
  private bgmHowl: Howl | null = null;
  private isBgmPlaying: boolean = false;

  constructor() {
    // Load persisted audio settings if available
    try {
      const savedVolume = localStorage.getItem('foa_volume');
      if (savedVolume !== null) {
        this.volume = parseFloat(savedVolume);
      }
      const savedMuted = localStorage.getItem('foa_muted');
      if (savedMuted !== null) {
        this.muted = savedMuted === 'true';
      }
      Howler.volume(this.muted ? 0 : this.volume);
    } catch {
      // Fallback for SSR or restricted storage
    }
  }

  /**
   * Get or instantiate a cached Howl instance for low-latency playback
   */
  private getHowl(key: SoundKey): Howl {
    let howl = this.cache.get(key);
    if (!howl) {
      const src = SOUND_SOURCES[key];
      howl = new Howl({
        src: [src],
        html5: false, // Use Web Audio API for fast, overlapping SFX
        preload: true,
      });
      this.cache.set(key, howl);
    }
    return howl;
  }

  /**
   * Play any sound by key with optional volume multiplier
   */
  public play(key: SoundKey, volumeScale: number = 1): number | undefined {
    if (this.muted) return undefined;
    try {
      const howl = this.getHowl(key);
      const id = howl.play();
      if (volumeScale !== 1) {
        howl.volume(this.volume * volumeScale, id);
      }
      return id;
    } catch (err) {
      console.warn(`[SoundEngine] Could not play sound "${key}":`, err);
      return undefined;
    }
  }

  /**
   * Spell Action helpers
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
   * Battle Background Music (BGM) Management
   */
  public startBattleMusic() {
    if (this.isBgmPlaying && this.bgmHowl) return;
    try {
      if (!this.bgmHowl) {
        this.bgmHowl = new Howl({
          src: [battletheme],
          html5: true, // HTML5 audio for smooth streaming of music tracks
          loop: true,
          volume: 0,
          preload: true,
        });
      }
      this.isBgmPlaying = true;
      const targetVolume = this.muted ? 0 : this.volume * 0.45;
      this.bgmHowl.play();
      this.bgmHowl.fade(0, targetVolume, 1200);
    } catch (err) {
      console.warn('[SoundEngine] Could not start battle BGM:', err);
    }
  }

  public stopBattleMusic() {
    if (!this.isBgmPlaying || !this.bgmHowl) return;
    this.isBgmPlaying = false;
    try {
      const currentVol = this.bgmHowl.volume();
      this.bgmHowl.fade(currentVol, 0, 800);
      setTimeout(() => {
        if (!this.isBgmPlaying && this.bgmHowl) {
          this.bgmHowl.stop();
        }
      }, 850);
    } catch (err) {
      console.warn('[SoundEngine] Could not stop battle BGM:', err);
    }
  }

  /**
   * Global Audio State Management
   */
  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (!this.muted) {
      Howler.volume(this.volume);
      if (this.bgmHowl && this.isBgmPlaying) {
        this.bgmHowl.volume(this.volume * 0.45);
      }
    }
    try {
      localStorage.setItem('foa_volume', this.volume.toString());
    } catch {}
    this.notify();
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    Howler.mute(muted);
    if (this.bgmHowl) {
      this.bgmHowl.mute(muted);
      if (!muted && this.isBgmPlaying) {
        this.bgmHowl.volume(this.volume * 0.45);
      }
    }
    try {
      localStorage.setItem('foa_muted', muted.toString());
    } catch {}
    this.notify();
  }

  public toggleMute() {
    this.setMuted(!this.muted);
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

// Global Singleton Instance
export const soundEngine = new SoundEngine();
