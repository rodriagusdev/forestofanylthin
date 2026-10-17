import { useContext, useState } from 'react';
import { playerUndead } from '../../data/playerInitialStack/undeadStart';
import { playerDryeldar } from '../../data/playerInitialStack/dryeldarStart';
import { BattleContext } from '../../context/BattleContext';
import { useCampaignStore } from '../../store/useCampaignStore';
import { Army, UnitStats } from '../../types';
import { useUnitPreview } from '../../features/UnitPreview/useUnitPreview';
import { DarkBackgroundWrapper } from '../DarkBackgroundWrapper';
import { UnitPreview } from '../PlayerUI/UnitPreview';
import { useSkillPreview } from '../../features/SkillPreview';
import { SkillPreview } from '../SkillPreview';
import SkillIcon from '../SkillPreview/SkillIcon/SkillIcon';
import { useActionSound } from '../../hooks';

import gloomyForestBg from '../../assets/images/map/gloomyforest.jpg';
import cemeteryBg from '../../assets/images/map/cemetery.jpg';

import healthIcon from '../../assets/images/stats/health.png';
import damageIcon from '../../assets/images/stats/damage.png';
import armorIcon from '../../assets/images/stats/armor.png';
import hourglassIcon from '../../assets/images/stats/hourglass.png';
import { INTRO_DIALOGUE_DRYELDAR } from '@/data/story/introCinematic';

interface Props {
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

type FactionKey = 'dryeldar' | 'undead';

interface FactionData {
  key: FactionKey;
  race: string;
  name: string;
  subName: string;
  title: string;
  tagline: string;
  description: string;
  lore: string;
  bgImage: string;
  theme: {
    accentColor: string;
    badgeBg: string;
    borderActive: string;
    bannerGradient: string;
    buttonGradient: string;
    cornerColor: string;
    glowShadow: string;
  };
  army: Army;
  hero: UnitStats;
}

export const HeroSelection = ({ setIsPlaying }: Props) => {
  const { setPlayerArmy, setPlayerRace } = useContext(BattleContext);
  const { handleUnitPreview, handleExitUnitPreview, previewUnit } =
    useUnitPreview();
  const { previewSkill, handleSkillPreview, handleExitSkillPreview } =
    useSkillPreview();
  const { playPreviewSound } = useActionSound();

  const [selectedFaction, setSelectedFaction] =
    useState<FactionKey>('dryeldar');

  const factions: Record<FactionKey, FactionData> = {
    dryeldar: {
      key: 'dryeldar',
      race: 'dryeldar',
      name: 'DRYELDAR COVENANT',
      subName: 'The Shadow Lady',
      title: 'Dryeldar Sorceress',
      tagline: 'Elemental Destruction • Dark Magic',
      description:
        'Vengeful elves from the lands of Atro. They deal in dark magic and destruction, and are very powerful combatants.',
      lore: 'Elisith, Shadow Lady, wields primeval destruction sorceries from the land of Atro. She is in a journey seeking to learn about the people of An-Uhluah.',
      bgImage: gloomyForestBg,
      theme: {
        accentColor: 'text-emerald-300',
        badgeBg: 'bg-emerald-950/90 border-emerald-500 text-emerald-200',
        borderActive: 'border-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.5),inset_0_0_20px_rgba(5,150,105,0.3)] ring-1 ring-emerald-400/60',
        bannerGradient: 'from-[#042013]/95 via-[#021009]/95 to-black/95',
        buttonGradient:
          'from-emerald-950 via-emerald-800 to-emerald-950 hover:from-emerald-900 hover:to-emerald-700 border-emerald-400 text-emerald-100 hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]',
        cornerColor: 'text-emerald-400',
        glowShadow: 'shadow-[0_0_25px_rgba(16,185,129,0.4)]',
      },
      army: playerDryeldar,
      hero: playerDryeldar[0],
    },
    undead: {
      key: 'undead',
      race: 'undead',
      name: 'NECROPOLIS OF SILORN',
      subName: 'The Deathless Horde',
      title: 'Lord of Silorn',
      tagline: 'Necromancy • Vampiric Drain',
      description:
        'Nicolai of Silorn rules an unyielding kingdom of bone and sorcery. By binding restless spirits and draining vitality from the living, defeat only multiplies his legions upon the battlefield.',
      lore: 'Ancient deathless legions resurrected under the command of Lord Nicolai, who himself has risen from the dead, and by virtue of the amazons of An-Uhluah was barely left to his workings in Silorn.',
      bgImage: cemeteryBg,
      theme: {
        accentColor: 'text-fuchsia-300',
        badgeBg: 'bg-purple-950/90 border-fuchsia-500 text-pink-200',
        borderActive: 'border-fuchsia-500 shadow-[0_0_35px_rgba(217,70,239,0.5),inset_0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-pink-400/60',
        bannerGradient: 'from-[#260528]/95 via-[#120215]/95 to-black/95',
        buttonGradient:
          'from-purple-950 via-fuchsia-900 to-purple-950 hover:from-purple-900 hover:to-fuchsia-800 border-pink-400 text-pink-100 hover:shadow-[0_0_25px_rgba(217,70,239,0.8)]',
        cornerColor: 'text-pink-400',
        glowShadow: 'shadow-[0_0_25px_rgba(217,70,239,0.4)]',
      },
      army: playerUndead,
      hero: playerUndead[0],
    },
  };

  const current = factions[selectedFaction];

  const handleSelectFaction = (key: FactionKey) => {
    playPreviewSound();
    setSelectedFaction(key);
  };

  const startNewCampaign = useCampaignStore((state) => state.startNewCampaign);

  const handleEmbark = () => {
    playPreviewSound();
    startNewCampaign(current.race, current.army, current.hero);
    setIsPlaying(true);
    setPlayerArmy(current.army);
    setPlayerRace(current.race);
    if (current.race === 'dryeldar') {
      useCampaignStore.getState().startDialogue(INTRO_DIALOGUE_DRYELDAR);
    }
  };

  const handleUnitClick = (unit: UnitStats) => {
    playPreviewSound();
    handleUnitPreview(unit);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden text-zinc-200 font-outfit select-none bg-black">
      {/* Jeweled Ambient Atmosphere Glows */}
      <div className="pointer-events-none fixed -top-40 left-1/4 w-[600px] h-[600px] bg-purple-700/20 rounded-full blur-[110px] animate-atmospheric-drift" />
      <div className="pointer-events-none fixed -bottom-40 right-1/4 w-[600px] h-[600px] bg-fuchsia-700/15 rounded-full blur-[110px] animate-atmospheric-drift" style={{ animationDelay: '-4s' }} />

      {/* Dynamic Background Image with Dark Fantasy Vignette */}
      <div
        className="fixed inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
        style={{
          backgroundImage: `url(${current.bgImage})`,
          filter: 'brightness(0.3) contrast(1.2) saturate(0.9)',
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-t from-black via-black/80 to-[#08020e]/85 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 w-full pt-6 pb-3 px-6 sm:px-12 flex flex-col items-center text-center">
        <h1 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-black tracking-[0.12em] uppercase text-white drop-shadow-[0_0_20px_rgba(244,114,182,0.6)] mt-1">
          FOREST OF AN-YLTHIN
        </h1>

        {/* Crystalline Divider */}
        <div className="w-full max-w-4xl flex items-center justify-center gap-4 text-pink-400/60 my-3">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/40 to-pink-300/20" />
          <span className="text-xs text-pink-400">❖</span>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-fuchsia-500/40 to-pink-300/20" />
        </div>
      </header>

      {/* Main Selection Area */}
      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 flex-1 flex flex-col justify-between max-w-[1720px] mx-auto pb-6">
        {/* Faction Dual Selection Banners */}
        <nav aria-label="Faction Selection" className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-5">
          {/* Dryeldar Covenant Banner */}
          <button
            type="button"
            onClick={() => handleSelectFaction('dryeldar')}
            className={`group relative text-left p-4 sm:p-5 rounded-sm border-2 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl ${selectedFaction === 'dryeldar'
              ? 'bg-gradient-to-r from-[#042013]/95 via-[#021009]/95 to-black/95 border-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.5),inset_0_0_20px_rgba(5,150,105,0.3)] ring-1 ring-emerald-400/60'
              : 'bg-black/60 border-zinc-800/80 hover:border-emerald-500/50 hover:bg-zinc-950/80'
              }`}
          >
            {/* Corner Crystals */}
            <span className="absolute -top-1 -left-1 text-xs text-emerald-400 font-serif">✦</span>
            <span className="absolute -top-1 -right-1 text-xs text-emerald-400 font-serif">✦</span>
            <span className="absolute -bottom-1 -left-1 text-xs text-emerald-400 font-serif">✦</span>
            <span className="absolute -bottom-1 -right-1 text-xs text-emerald-400 font-serif">✦</span>

            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={factions.dryeldar.hero.face}
                  alt="Elisith"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-emerald-400 p-0.5 shadow-[0_0_12px_rgba(16,185,129,0.6)] group-hover:scale-105 transition-transform"
                />
                {selectedFaction === 'dryeldar' && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                    ✓
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="font-cinzel text-base sm:text-lg font-black tracking-wider text-emerald-200 group-hover:text-white">
                    DRYELDAR COVENANT
                  </h2>
                  <span className="text-[10px] font-cinzel font-black px-2 py-0.5 rounded-sm border border-emerald-500/60 text-emerald-300 bg-emerald-950/80 shadow">
                    Shadow & Fire
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-light mt-0.5">
                  <span className="text-emerald-300 font-semibold">Elisith</span> • Shadow Lady
                </p>
              </div>
            </div>
          </button>

          {/* Necropolis of Silorn Banner */}
          <button
            type="button"
            onClick={() => handleSelectFaction('undead')}
            className={`group relative text-left p-4 sm:p-5 rounded-sm border-2 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-xl ${selectedFaction === 'undead'
              ? 'bg-gradient-to-r from-[#260528]/95 via-[#120215]/95 to-black/95 border-fuchsia-500 shadow-[0_0_35px_rgba(217,70,239,0.5),inset_0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-pink-400/60'
              : 'bg-black/60 border-zinc-800/80 hover:border-fuchsia-500/50 hover:bg-zinc-950/80'
              }`}
          >
            {/* Corner Crystals */}
            <span className="absolute -top-1 -left-1 text-xs text-pink-400 font-serif">✦</span>
            <span className="absolute -top-1 -right-1 text-xs text-pink-400 font-serif">✦</span>
            <span className="absolute -bottom-1 -left-1 text-xs text-pink-400 font-serif">✦</span>
            <span className="absolute -bottom-1 -right-1 text-xs text-pink-400 font-serif">✦</span>

            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={factions.undead.hero.face}
                  alt="Nicolai"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-fuchsia-400 p-0.5 shadow-[0_0_12px_rgba(217,70,239,0.6)] group-hover:scale-105 transition-transform"
                />
                {selectedFaction === 'undead' && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-fuchsia-500 text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                    ✓
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="font-cinzel text-base sm:text-lg font-black tracking-wider text-pink-200 group-hover:text-white">
                    NECROPOLIS OF SILORN
                  </h2>
                  <span className="text-[10px] font-cinzel font-black px-2 py-0.5 rounded-sm border border-fuchsia-500/60 text-pink-300 bg-purple-950/80 shadow">
                    Death & Necromancy
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-light mt-0.5">
                  <span className="text-fuchsia-300 font-semibold">Nicolai of Silorn</span> • Fallen Lord of Silorn
                </p>
              </div>
            </div>
          </button>
        </nav>

        {/* 3-Column Showcase Dashboard */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Column 1: Commander Portrait & Inscribed Lore */}
          <section
            aria-label="Commander Lore"
            className="lg:col-span-3 flex flex-col justify-between p-5 rounded-sm smoked-velvet-canvas border-2 border-fuchsia-600/50 backdrop-blur-2xl relative shadow-[0_0_35px_rgba(217,70,239,0.25)]"
          >
            <span className={`absolute -top-1 -left-1 text-xs font-serif ${current.theme.cornerColor}`}>✦</span>
            <span className={`absolute -top-1 -right-1 text-xs font-serif ${current.theme.cornerColor}`}>✦</span>
            <span className={`absolute -bottom-1 -left-1 text-xs font-serif ${current.theme.cornerColor}`}>✦</span>
            <span className={`absolute -bottom-1 -right-1 text-xs font-serif ${current.theme.cornerColor}`}>✦</span>

            <div className="flex flex-col items-center text-center">
              {/* Portrait Frame */}
              <div className="relative p-1 border-2 border-fuchsia-400/80 rounded-full bg-black shadow-[0_0_25px_rgba(244,114,182,0.5)] mb-3 group">
                <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden">
                  <img
                    src={current.hero.portrait}
                    alt={current.hero.name}
                    className="w-full h-full object-cover object-top filter brightness-100 contrast-110 group-hover:scale-105 transition-transform duration-500 rounded-full"
                  />
                </div>
              </div>

              <h2 className="font-cinzel text-xl font-black text-white">
                {current.hero.name}
              </h2>
              <p className={`text-xs font-semibold ${current.theme.accentColor} mt-0.5`}>
                {current.title}
              </p>

              {/* Inscribed Lore Scroll */}
              <div className="mt-4 pt-3 border-t border-fuchsia-900/60 text-left w-full">
                <p className="text-xs text-zinc-300 font-serif italic leading-relaxed tracking-wide">
                  “{current.lore}”
                </p>
              </div>
            </div>
          </section>

          {/* Column 2: Starting Battalion Cohorts */}
          <section
            aria-label="Starting Battalion"
            className="lg:col-span-5 flex flex-col justify-between p-5 rounded-sm smoked-velvet-canvas border-2 border-fuchsia-600/50 backdrop-blur-2xl relative shadow-[0_0_35px_rgba(217,70,239,0.25)]"
          >
            <span className={`absolute -top-1 -left-1 text-xs font-serif ${current.theme.cornerColor}`}>✦</span>
            <span className={`absolute -top-1 -right-1 text-xs font-serif ${current.theme.cornerColor}`}>✦</span>
            <span className={`absolute -bottom-1 -left-1 text-xs font-serif ${current.theme.cornerColor}`}>✦</span>
            <span className={`absolute -bottom-1 -right-1 text-xs font-serif ${current.theme.cornerColor}`}>✦</span>

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-fuchsia-900/60 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-pink-300 text-xs">✦</span>
                  <h3 className="font-cinzel text-sm sm:text-base font-black tracking-wider text-white uppercase">
                    Starting Battalion
                  </h3>
                </div>
                <span className="text-[10px] font-cinzel font-black text-pink-200 px-2.5 py-0.5 bg-purple-950/80 border border-fuchsia-500/60 rounded-sm shadow">
                  4 Divisions
                </span>
              </div>

              {/* Troop Cards List with Faction Framing */}
              <div className="space-y-2.5">
                {current.army.map((unit) => {
                  const isHero = unit.type === 'Hero';
                  return (
                    <button
                      key={unit.id}
                      type="button"
                      onClick={() => handleUnitClick(unit)}
                      className={`w-full text-left group flex items-center justify-between p-2.5 sm:p-3 rounded-sm border-2 transition-all duration-200 cursor-pointer relative bg-black/70 ${selectedFaction === 'dryeldar'
                        ? 'border-emerald-500/70 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                        : 'border-fuchsia-500/70 hover:border-pink-400 hover:shadow-[0_0_20px_rgba(217,70,239,0.5)]'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={unit.face}
                            alt={unit.name}
                            className={`w-12 h-12 object-cover rounded-full border-2 p-0.5 group-hover:scale-105 transition-transform ${selectedFaction === 'dryeldar' ? 'border-emerald-400' : 'border-fuchsia-400'
                              }`}
                          />
                          {!isHero && (
                            <span
                              className={`absolute -top-1 -left-1 min-w-[20px] h-[20px] px-1 text-[9.5px] font-mono font-black rounded-full flex items-center justify-center shadow-lg border ${selectedFaction === 'dryeldar'
                                ? 'bg-emerald-950 text-emerald-200 border-emerald-400'
                                : 'bg-purple-950 text-pink-200 border-fuchsia-400'
                                }`}
                            >
                              {unit.stack}x
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white group-hover:text-pink-200">
                              {unit.name}
                            </h4>
                            {isHero && (
                              <span className="text-[9px] text-pink-200 border border-fuchsia-500/60 px-1.5 py-0.2 rounded-sm bg-purple-950/80 font-cinzel font-bold">
                                Hero
                              </span>
                            )}
                          </div>
                          <p className="text-[10.5px] text-zinc-400 font-mono">
                            {isHero ? 'Commander Division' : `Tier ${unit.level || 1} ${unit.type} • Stack ${unit.stack}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 text-[11px] font-mono">
                        <span className="flex items-center gap-1 text-rose-300 font-bold" title="Total Stack Health">
                          <img src={healthIcon} alt="HP" className="w-3.5 h-3.5 object-contain" />
                          {unit.health * (unit.stack || 1)}
                        </span>
                        <span className="flex items-center gap-1 text-amber-300 font-bold" title="Total Stack Attack">
                          <img src={damageIcon} alt="ATK" className="w-3.5 h-3.5 object-contain" />
                          {unit.damage * (unit.stack || 1)}
                        </span>
                        <span className="flex items-center gap-1 text-pink-300 font-bold" title="Armor Rating">
                          <img src={armorIcon} alt="ARM" className="w-3.5 h-3.5 object-contain" />
                          {unit.armor}
                        </span>
                        <span className="text-[10px] font-cinzel font-black text-pink-300/80 group-hover:text-pink-200 ml-1">
                          [Inspect]
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Faction Tactics Excerpt */}
            <div className="mt-4 pt-3 border-t border-fuchsia-900/60 text-xs text-zinc-300">
              <span className="text-pink-300 font-cinzel font-bold mr-2">
                ✦ Tactical Doctrine:
              </span>
              <span className="font-serif italic">{current.description}</span>
            </div>
          </section>

          {/* Column 3: Commander Attributes & Grimoire Sorceries */}
          <section
            aria-label="Attributes and Sorceries"
            className="lg:col-span-4 flex flex-col justify-between p-5 rounded-sm smoked-velvet-canvas border-2 border-fuchsia-600/50 backdrop-blur-2xl relative shadow-[0_0_35px_rgba(217,70,239,0.25)]"
          >
            <span className={`absolute -top-1 -left-1 text-xs font-serif ${current.theme.cornerColor}`}>✦</span>
            <span className={`absolute -top-1 -right-1 text-xs font-serif ${current.theme.cornerColor}`}>✦</span>
            <span className={`absolute -bottom-1 -left-1 text-xs font-serif ${current.theme.cornerColor}`}>✦</span>
            <span className={`absolute -bottom-1 -right-1 text-xs font-serif ${current.theme.cornerColor}`}>✦</span>

            <div>
              {/* Attribute Status Header */}
              <div className="flex items-center justify-between pb-3 border-b border-fuchsia-900/60 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-pink-300 text-xs">✦</span>
                  <h3 className="font-cinzel text-sm sm:text-base font-black tracking-wider text-white uppercase">
                    Commander Attributes
                  </h3>
                </div>
                <span className="text-[10px] font-cinzel font-black text-pink-300">STATUS</span>
              </div>

              {/* Attributes Reliquary Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-4 font-mono">
                <div className="flex items-center justify-between p-2 rounded-sm bg-black/60 border border-zinc-800">
                  <span className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                    <img src={healthIcon} alt="Vigor" className="w-4 h-4 object-contain" /> Vitality (HP)
                  </span>
                  <span className="font-bold text-rose-300">{current.hero.health}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-sm bg-black/60 border border-zinc-800">
                  <span className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                    <img src={damageIcon} alt="Strength" className="w-4 h-4 object-contain" /> Attack (ATK)
                  </span>
                  <span className="font-bold text-amber-300">{current.hero.damage}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-sm bg-black/60 border border-zinc-800">
                  <span className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                    <img src={armorIcon} alt="Armor" className="w-4 h-4 object-contain" /> Armor (DEF)
                  </span>
                  <span className="font-bold text-pink-300">{current.hero.armor}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-sm bg-black/60 border border-zinc-800">
                  <span className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                    <span className="text-fuchsia-400">✦</span> Mana (MP)
                  </span>
                  <span className="font-bold text-fuchsia-300">{current.hero.magic}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-sm bg-black/60 border border-zinc-800">
                  <span className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                    <img src={hourglassIcon} alt="Speed" className="w-4 h-4 object-contain" /> Speed (INIT)
                  </span>
                  <span className="font-bold text-purple-300">{current.hero.initiative}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-sm bg-black/60 border border-zinc-800">
                  <span className="text-zinc-300 flex items-center gap-1.5 text-[11px]">
                    <span className="text-indigo-400">✦</span> Spellpower
                  </span>
                  <span className="font-bold text-indigo-300">{current.hero.spellpower}</span>
                </div>
              </div>

              {/* Memorized Sorceries */}
              <div className="pt-3 border-t border-fuchsia-900/60">
                <div className="text-[10.5px] uppercase tracking-[0.2em] text-pink-300 font-cinzel font-black mb-2.5">
                  MEMORIZED INCANTATIONS
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {current.hero.skills
                    .filter((s) => s.formattedName !== 'Clear Action')
                    .map((skill) => (
                      <button
                        key={skill.name}
                        type="button"
                        onClick={() => {
                          playPreviewSound();
                          handleSkillPreview(skill);
                        }}
                        className="group flex items-center gap-2 p-2 rounded-sm bg-black/70 border border-zinc-800 hover:border-pink-400 transition-all cursor-pointer text-left shadow-sm hover:shadow-[0_0_12px_rgba(244,114,182,0.4)]"
                      >
                        <div className="w-8 h-8 flex-shrink-0">
                          <SkillIcon skill={skill} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-zinc-200 group-hover:text-pink-200 truncate">
                            {skill.formattedName}
                          </h4>
                          <span className="text-[9.5px] text-zinc-400 block font-mono">
                            {skill.type}
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Embark Expedition Button */}
            <div className="mt-5 pt-3 border-t border-fuchsia-900/60">
              <button
                type="button"
                onClick={handleEmbark}
                className={`w-full py-3.5 px-6 rounded-sm font-cinzel text-sm sm:text-base font-black tracking-[0.2em] uppercase bg-gradient-to-r ${current.theme.buttonGradient} border-2 hover:brightness-125 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer shadow-xl`}
              >
                <span>EMBARK EXPEDITION</span>
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Unit Detail Preview Modal */}
      {previewUnit !== undefined && (
        <DarkBackgroundWrapper onClose={handleExitUnitPreview}>
          <UnitPreview
            handleExitUnitPreview={handleExitUnitPreview}
            previewUnit={previewUnit}
          />
        </DarkBackgroundWrapper>
      )}

      {/* Skill Detail Preview Modal */}
      {typeof previewSkill !== 'string' && (
        <DarkBackgroundWrapper onClose={handleExitSkillPreview}>
          <SkillPreview
            handleExitSkillPreview={handleExitSkillPreview}
            previewSkill={previewSkill}
          />
        </DarkBackgroundWrapper>
      )}
    </div>
  );
};

export default HeroSelection;
