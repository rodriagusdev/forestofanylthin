import { useState } from 'react';
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
} from '../../data/enemyStacks';
import { DarkBackgroundWrapper } from '../DarkBackgroundWrapper';
import { useActionSound } from '../../hooks';

interface Props {
  handleInFight: (enemiesToAdd: Army, level?: string) => Promise<void>;
  handlePreviewLevel: (enemies: Army) => void;
  isCemeteryCompleted: boolean;
  isGloomyForestCompleted: boolean;
  isLostGladeCompleted: boolean;
  isSacreCompleted: boolean;
}

type LevelName = 'Cemetery' | 'Lost Glade' | 'Gloomy Forest' | 'Sacrelthar';

interface ZoneInfo {
  id: LevelName;
  name: string;
  subtitle: string;
  tier: string;
  description: string;
  image: string;
  enemies: Army;
  isCompleted: boolean;
  accent: string;
  borderHover: string;
  glowHover: string;
}

const Map = ({
  handleInFight,
  handlePreviewLevel,
  isCemeteryCompleted,
  isGloomyForestCompleted,
  isLostGladeCompleted,
  isSacreCompleted,
}: Props) => {
  const [openLevelModal, setOpenLevelModal] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<LevelName>('Cemetery');
  const [enemiesInLevel, setEnemiesInLevel] = useState<Army>([]);
  const { playPreviewSound } = useActionSound();

  const zones: ZoneInfo[] = [
    {
      id: 'Cemetery',
      name: 'Desolate Cemetery',
      subtitle: 'Ancient Sepulcher',
      tier: 'Tier I • Undead Crypt',
      description:
        'A quiet burial ground where skeletal guards and a lich guard the forgotten crypts.',
      image: lvlcemetery,
      enemies: cemetery,
      isCompleted: isCemeteryCompleted,
      accent: 'text-cyan-400',
      borderHover: 'hover:border-cyan-400/80',
      glowHover: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]',
    },
    {
      id: 'Lost Glade',
      name: 'The Lost Glade',
      subtitle: 'Overgrown Grove of Bones',
      tier: 'Tier II • Endless Swarm',
      description:
        'A sprawling battalion of 60 relentless skeletons roaming the twilight underbrush.',
      image: lvlLostGlade,
      enemies: lostGlade,
      isCompleted: isLostGladeCompleted,
      accent: 'text-amber-400',
      borderHover: 'hover:border-amber-400/80',
      glowHover: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    },
    {
      id: 'Gloomy Forest',
      name: 'The Gloomy Forest',
      subtitle: 'Cursed by Shadows',
      tier: 'Tier III • Ambush Vanguard',
      description:
        'Deep thicket infested with skeleton legions and dark warlocks.',
      image: lvlgloomyforest,
      enemies: gloomyForest,
      isCompleted: isGloomyForestCompleted,
      accent: 'text-emerald-400',
      borderHover: 'hover:border-emerald-400/80',
      glowHover: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
    },
    {
      id: 'Sacrelthar',
      name: 'Sacrelthar Citadel',
      subtitle: 'Stronghold of Velish Acarys',
      tier: 'Boss Citadel • High Peril',
      description:
        'The dread sanctuary of Velish Acarys, surrounded by liches, warlocks, and ancient skeletal phalanxes.',
      image: lvlsacre,
      enemies: forgottenCrypt,
      isCompleted: isSacreCompleted,
      accent: 'text-rose-400',
      borderHover: 'hover:border-rose-400/80',
      glowHover: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.35)]',
    },
  ];

  const completedCount = zones.filter((z) => z.isCompleted).length;
  const activeZones = zones.filter((z) => !z.isCompleted);

  const handleAskIfLevel = (zone: ZoneInfo) => {
    playPreviewSound();
    setCurrentLevel(zone.id);
    setEnemiesInLevel(zone.enemies);
    setOpenLevelModal(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScoutClick = (enemies: Army) => {
    playPreviewSound();
    handlePreviewLevel(enemies);
  };

  const handleConfirmInvasion = () => {
    playPreviewSound();
    setOpenLevelModal(false);
    handleInFight(enemiesInLevel, currentLevel);
  };

  const selectedZoneData = zones.find((z) => z.id === currentLevel) || zones[0];

  return (
    <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 py-8 font-outfit select-none text-zinc-200">
      {/* Campaign Map Header */}
      <div className="w-full text-center mb-8">
        <div className="flex items-center justify-center gap-3 text-amber-400/70 text-xs tracking-[0.3em] uppercase font-cinzel font-semibold mb-2">
          <span className="h-[1px] w-8 sm:w-20 bg-gradient-to-r from-transparent to-amber-400/50" />
          <span>◈ EXPEDITION MAP ◈</span>
          <span className="h-[1px] w-8 sm:w-20 bg-gradient-to-l from-transparent to-amber-400/50" />
        </div>

        <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-black tracking-[0.1em] text-amber-100 uppercase drop-shadow-[0_2px_10px_rgba(217,119,6,0.3)]">
          SELECT EXPEDITION DESTINATION
        </h2>

        {/* Ornate Divider */}
        <div className="w-full max-w-4xl mx-auto flex items-center justify-center gap-4 text-amber-500/40 my-4">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-amber-500/10" />
          <span className="text-xs">◈</span>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-amber-500/30 to-amber-500/10" />
        </div>
      </div>

      {/* Panoramic Territory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
        {zones.map((zone) => {
          if (zone.isCompleted) {
            return (
              <div
                key={zone.id}
                className="relative rounded-sm border-2 border-emerald-500/80 bg-gradient-to-b from-[#042013]/80 via-zinc-950/90 to-black p-5 backdrop-blur-md shadow-[0_0_25px_rgba(16,185,129,0.3)] flex flex-col justify-between min-h-[360px]"
              >
                <span className="absolute -top-1 -left-1 text-xs text-emerald-400 font-serif">✦</span>
                <span className="absolute -top-1 -right-1 text-xs text-emerald-400 font-serif">✦</span>
                <span className="absolute -bottom-1 -left-1 text-xs text-emerald-400 font-serif">✦</span>
                <span className="absolute -bottom-1 -right-1 text-xs text-emerald-400 font-serif">✦</span>

                <div>
                  <div className="relative h-44 w-full overflow-hidden border border-emerald-500/50 mb-3 filter grayscale contrast-125">
                    <img
                      src={zone.image}
                      alt={zone.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="font-cinzel text-xs tracking-widest text-emerald-200 font-bold border border-emerald-400/80 px-3 py-1 bg-emerald-950/90 shadow-[0_0_12px_rgba(16,185,129,0.6)]">
                        🛡 CLEANSED DOMAIN 🛡
                      </span>
                    </div>
                  </div>

                  <h3 className="font-cinzel text-lg font-bold text-emerald-300">
                    {zone.name}
                  </h3>
                  <p className="text-xs text-emerald-200/70 font-light mt-1">
                    Corruption eradicated. Allied dominion established.
                  </p>
                </div>

                <div className="pt-3 border-t border-emerald-900/60 text-center text-xs text-emerald-400 font-cinzel font-semibold">
                  [ Purified Territory ]
                </div>
              </div>
            );
          }

          return (
            <div
              key={zone.id}
              className="group relative rounded-sm border-2 border-rose-600/70 hover:border-rose-400 bg-gradient-to-b from-[#24060d]/90 via-zinc-950/90 to-black p-5 backdrop-blur-md shadow-[0_0_20px_rgba(244,63,94,0.25)] hover:shadow-[0_0_35px_rgba(244,63,94,0.5)] transition-all duration-300 flex flex-col justify-between min-h-[380px] hover:-translate-y-1"
            >
              {/* Crystal Thorn Corner Accents */}
              <span className="absolute -top-1 -left-1 text-xs text-rose-400 font-serif">✦</span>
              <span className="absolute -top-1 -right-1 text-xs text-rose-400 font-serif">✦</span>
              <span className="absolute -bottom-1 -left-1 text-xs text-rose-400 font-serif">✦</span>
              <span className="absolute -bottom-1 -right-1 text-xs text-rose-400 font-serif">✦</span>

              <div>
                {/* Territory Artwork */}
                <div
                  className="relative h-48 w-full overflow-hidden border border-rose-500/50 mb-4 cursor-pointer group/art rounded-xs shadow-inner"
                  onClick={() => handleAskIfLevel(zone)}
                >
                  <img
                    src={zone.image}
                    alt={zone.name}
                    className="w-full h-full object-cover filter brightness-90 contrast-110 group-hover/art:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <span className="absolute top-2 right-2 text-[10px] font-cinzel font-bold tracking-wider px-2 py-0.5 rounded-sm border border-rose-500/60 bg-rose-950/90 text-rose-200 shadow">
                    {zone.tier}
                  </span>
                </div>

                {/* Zone Details */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-cinzel text-lg sm:text-xl font-black tracking-wide text-rose-100 group-hover:text-rose-200 transition-colors">
                      {zone.name}
                    </h3>
                  </div>
                  <p className="text-xs font-semibold text-rose-400">
                    {zone.subtitle}
                  </p>
                  <p className="text-xs text-zinc-300 font-serif italic leading-relaxed pt-2">
                    {zone.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-rose-900/60 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => handleAskIfLevel(zone)}
                  className="w-full py-2.5 px-4 rounded-sm font-cinzel text-xs sm:text-sm font-black tracking-[0.15em] uppercase text-rose-100 bg-gradient-to-r from-rose-950 via-rose-800 to-rose-950 border border-rose-500 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.7)] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>⚔ ASSAULT DOMAIN ⚔</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleScoutClick(zone.enemies)}
                  className="w-full py-1.5 px-3 rounded-sm font-cinzel text-[11px] font-bold tracking-wider text-rose-200 bg-black/80 border border-rose-800/80 hover:border-rose-500 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
                >
                  <span>👁 SCOUT HOSTILE RANKS</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Elden Ring Style Invasion Confirmation Modal */}
      {openLevelModal && (
        <DarkBackgroundWrapper onClose={() => setOpenLevelModal(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col w-[92%] sm:w-[480px] bg-gradient-to-b from-[#25060e]/95 via-[#130307]/95 to-[#080103]/95 border-2 border-rose-600 p-6 sm:p-8 rounded-sm shadow-[0_0_55px_rgba(225,29,72,0.6)] ring-1 ring-rose-500/50 backdrop-blur-2xl text-center select-none animate-in fade-in zoom-in-95 duration-200 z-50"
          >
            {/* Modal Corner Crystals */}
            <span className="absolute -top-1 -left-1 text-sm text-rose-400 font-serif">✦</span>
            <span className="absolute -top-1 -right-1 text-sm text-rose-400 font-serif">✦</span>
            <span className="absolute -bottom-1 -left-1 text-sm text-rose-400 font-serif">✦</span>
            <span className="absolute -bottom-1 -right-1 text-sm text-rose-400 font-serif">✦</span>

            <div className="text-[11px] uppercase tracking-[0.25em] text-rose-400 font-cinzel font-black mb-1">
              ⚔ INVASION MANDATE ⚔
            </div>

            <h3 className="font-cinzel text-2xl sm:text-3xl font-black tracking-wider text-white uppercase mt-1">
              {selectedZoneData.name}
            </h3>

            <p className="text-xs font-semibold text-rose-400 mt-1">
              {selectedZoneData.tier}
            </p>

            <div className="my-4 p-1 border-2 border-rose-500/60 bg-black shadow-inner">
              <img
                src={selectedZoneData.image}
                alt={selectedZoneData.name}
                className="w-full h-36 object-cover filter brightness-90 contrast-110"
              />
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 font-serif italic max-w-sm mx-auto leading-relaxed">
              “{selectedZoneData.description}”
            </p>

            <div className="mt-6 pt-4 border-t border-rose-900/60 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleConfirmInvasion}
                className="flex-1 py-3 px-4 rounded-sm font-cinzel text-xs sm:text-sm font-black tracking-[0.15em] uppercase text-white bg-gradient-to-r from-rose-950 via-rose-800 to-rose-950 border border-rose-500 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.8)] active:scale-[0.99] transition-all cursor-pointer shadow-lg"
              >
                ⚔ COMMENCE ASSAULT ⚔
              </button>

              <button
                type="button"
                onClick={() => {
                  playPreviewSound();
                  setOpenLevelModal(false);
                }}
                className="py-3 px-6 rounded-sm font-cinzel text-xs font-bold tracking-wider text-zinc-300 bg-black/80 border border-zinc-700 hover:border-zinc-500 hover:text-white transition-all cursor-pointer"
              >
                RETREAT
              </button>
            </div>
          </div>
        </DarkBackgroundWrapper>
      )}
    </div>
  );
};

export default Map;
