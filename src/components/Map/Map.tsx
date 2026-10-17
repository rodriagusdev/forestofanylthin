import { useState, useMemo } from 'react';
import { Army } from '../../types';
import { LevelConfig, LocationConfig } from '../../data/levels/levelTypes';
import { LEVELS } from '../../data/levels/levelsData';
import { DarkBackgroundWrapper } from '../DarkBackgroundWrapper';
import { useActionSound } from '../../hooks';
import { useCampaignStore } from '../../store/useCampaignStore';
import { isLocationUnlocked } from '../../helpers/campaign/campaignProgression';
import defaultMapImg from '../../assets/images/map/forestofanylthin_16_9.jpg';

interface Props {
  handleInFight: (enemiesToAdd: Army, level?: string) => Promise<void>;
  handlePreviewLevel: (enemies: Army) => void;
  currentLevel?: LevelConfig;
  completedLocationIds?: string[];
  // Backward compatibility:
  isCemeteryCompleted?: boolean;
  isGloomyForestCompleted?: boolean;
  isLostGladeCompleted?: boolean;
  isSacreCompleted?: boolean;
}

export const Map = ({
  handleInFight,
  handlePreviewLevel,
  currentLevel = LEVELS[0],
  completedLocationIds = [],
  isCemeteryCompleted = false,
  isGloomyForestCompleted = false,
  isLostGladeCompleted = false,
  isSacreCompleted = false,
}: Props) => {
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [openLevelModal, setOpenLevelModal] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    currentLevel.locations[0]?.id || ''
  );
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

  const heroStats = useCampaignStore((state) => state.heroStats);
  const playerArmy = useCampaignStore((state) => state.playerArmy);
  const activeHero = heroStats || playerArmy.find((u) => u.type === 'Hero') || playerArmy[0];
  const heroFace = activeHero?.face || activeHero?.portrait;

  const { playPreviewSound } = useActionSound();

  const locations = currentLevel.locations;

  const isLocationCleared = (locId: string): boolean => {
    if (completedLocationIds && completedLocationIds.length > 0) {
      return completedLocationIds.includes(locId);
    }
    if (locId === 'Cemetery') return isCemeteryCompleted;
    if (locId === 'Gloomy Forest') return isGloomyForestCompleted;
    if (locId === 'Lost Glade') return isLostGladeCompleted;
    if (locId === 'Sacrelthar') return isSacreCompleted;
    return false;
  };

  const clearedLocationIds = useMemo(() => {
    return locations.filter((l) => isLocationCleared(l.id)).map((l) => l.id);
  }, [locations, completedLocationIds, isCemeteryCompleted, isGloomyForestCompleted, isLostGladeCompleted, isSacreCompleted]);

  const isLocationUnlockedForMap = (loc: LocationConfig): boolean => {
    return isLocationUnlocked(loc, clearedLocationIds);
  };

  const completedCount = locations.filter((loc) => isLocationCleared(loc.id)).length;
  const totalCount = locations.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const activeSelectedLocation = useMemo(() => {
    return locations.find((l) => l.id === selectedLocationId) || locations[0];
  }, [locations, selectedLocationId]);

  const handleSelectLocation = (loc: LocationConfig) => {
    playPreviewSound();
    setSelectedLocationId(loc.id);
  };

  const handleOpenAssaultModal = (loc: LocationConfig) => {
    playPreviewSound();
    setSelectedLocationId(loc.id);
    setOpenLevelModal(true);
  };

  const handleScoutClick = (enemies: Army) => {
    playPreviewSound();
    handlePreviewLevel(enemies);
  };

  const handleConfirmInvasion = () => {
    playPreviewSound();
    setOpenLevelModal(false);
    if (activeSelectedLocation) {
      handleInFight(activeSelectedLocation.enemies, activeSelectedLocation.id);
    }
  };

  const mapBgImage = currentLevel.mapImage || defaultMapImg;

  return (
    <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-6 py-6 font-outfit select-none text-zinc-300">
      {/* Campaign Map Header */}
      <div className="w-full text-center mb-6">


        <h2 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black tracking-[0.14em] text-stone-100 uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          {currentLevel.name}
        </h2>

        <p className="text-xs sm:text-sm font-serif italic text-stone-400 mt-1 max-w-2xl mx-auto leading-relaxed">
          {currentLevel.description}
        </p>

        {/* View Mode Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-5 px-4 py-2.5 bg-black/60 border border-stone-800/90 rounded-sm max-w-4xl mx-auto backdrop-blur-md">
          {/* View Mode Toggle */}
          <div className="flex justify-between items-center gap-1.5 bg-stone-950 p-1 rounded">
            <button
              type="button"
              onClick={() => {
                playPreviewSound();
                setViewMode('map');
              }}
              className={`px-3 py-1 text-[11px] font-cinzel tracking-wider rounded uppercase transition-all cursor-pointer ${viewMode === 'map'
                ? 'bg-amber-950/80 text-amber-200 border border-amber-700/60 shadow-[0_0_10px_rgba(217,119,6,0.3)]'
                : 'text-stone-400 hover:text-stone-200 bg-transparent border border-transparent'
                }`}
            >
              Overland Map
            </button>
            <button
              type="button"
              onClick={() => {
                playPreviewSound();
                setViewMode('grid');
              }}
              className={`px-3 py-1 text-[11px] font-cinzel tracking-wider rounded uppercase transition-all cursor-pointer ${viewMode === 'grid'
                ? 'bg-amber-950/80 text-amber-200 border border-amber-700/60 shadow-[0_0_10px_rgba(217,119,6,0.3)]'
                : 'text-stone-400 hover:text-stone-200 bg-transparent border border-transparent'
                }`}
            >
              Domain Cards
            </button>
          </div>
        </div>
      </div>

      {/* OVERLAND MAP VIEW */}
      {viewMode === 'map' && (
        <div className="w-full max-w-[1520px] mx-auto relative rounded-sm border-2 border-amber-900/40 bg-stone-950 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
          {/* Map Frame Header */}
          <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-4 py-2 bg-gradient-to-b from-black/90 via-black/60 to-transparent pointer-events-none">
            <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.25em] text-stone-400 uppercase font-semibold">
              {currentLevel.subtitle}
            </span>
          </div>

          {/* Map Canvas with Widescreen 16:9 Aspect Ratio */}
          <div className="relative w-full aspect-[16/9] min-h-[460px] sm:min-h-[580px] lg:min-h-[660px] bg-stone-950 select-none">
            {/* Illustrated World Map Image */}
            <img
              src={mapBgImage}
              alt={currentLevel.name}
              className="absolute inset-0 w-full h-full object-cover filter brightness-95 contrast-105 pointer-events-none"
            />

            {/* Dark Ambient Vignette & Texture Overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/15 to-black/70 pointer-events-none" />
            <div className="absolute inset-0 ring-1 ring-inset ring-amber-500/20 pointer-events-none" />

            {/* Hero Warband Starting Encampment (Top-Right Encampment) */}
            <div
              style={{ left: '82.5%', top: '35%' }}
              className="absolute z-25 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none flex flex-col items-center"
            >
              {/* Soft Ambient Glow */}
              <div className="absolute -inset-2 rounded-full bg-cyan-400/20 blur-md pointer-events-none" />

              {/* Hero Camp Token with Selected Hero Face */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-950 border-2 border-cyan-400 p-0.5 shadow-[0_0_16px_rgba(6,182,212,0.7)] flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                  {heroFace ? (
                    <img
                      src={heroFace}
                      alt={activeHero?.name || 'Hero'}
                      className="w-full h-full object-cover object-top rounded-full filter brightness-105 contrast-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-cyan-950 to-slate-900 flex items-center justify-center">
                      <span className="font-cinzel text-xs sm:text-sm font-black text-cyan-300">⚔</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Hero Label */}
              <div className="mt-1.5 whitespace-nowrap">
                <span className="px-2.5 py-0.5 rounded-xs font-cinzel text-[8.5px] sm:text-[9.5px] font-black tracking-widest uppercase bg-black/90 border border-cyan-500/80 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  {activeHero?.name ? `${activeHero.name.split(' ')[0].toUpperCase()} VANGUARD` : 'HERO VANGUARD'}
                </span>
              </div>
            </div>

            {/* Location Pins / Landmark Nodes */}
            {locations.map((loc) => {
              const isCleared = isLocationCleared(loc.id);
              const isUnlocked = isLocationUnlockedForMap(loc);
              const isSelected = selectedLocationId === loc.id;
              const isHovered = hoveredLocationId === loc.id;
              const coords = loc.coordinates || { x: 50, y: 50 };

              return (
                <div
                  key={loc.id}
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  onMouseEnter={() => {
                    setHoveredLocationId(loc.id);
                  }}
                  onMouseLeave={() => setHoveredLocationId(null)}
                  onClick={() => handleOpenAssaultModal(loc)}
                >
                  {/* Selection / Hover Reticle */}
                  {(isSelected || isHovered) && (
                    <div className="absolute -inset-3 rounded-full border-2 border-dashed border-amber-400 animate-spin-slow pointer-events-none shadow-[0_0_20px_rgba(245,158,11,0.7)]" />
                  )}

                  {/* Pin Landmark Icon / Token */}
                  <div
                    className={`relative w-13 h-13 sm:w-16 sm:h-16 rounded-full p-1 transition-all duration-300 flex items-center justify-center ${isCleared
                      ? 'bg-stone-900/90 border-2 border-emerald-600/80 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : !isUnlocked
                        ? 'bg-stone-950/95 border-2 border-stone-700/80 opacity-75 shadow-[0_4px_15px_rgba(0,0,0,0.9)]'
                        : loc.isBoss
                          ? 'bg-red-950/90 border-2 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.6)] group-hover:scale-110'
                          : 'bg-stone-950/95 border-2 border-amber-600/80 hover:border-amber-400 shadow-[0_4px_20px_rgba(0,0,0,0.85)] group-hover:scale-110'
                      }`}
                  >
                    {/* Inner Location Artwork Thumbnail */}
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      <img
                        src={loc.image}
                        alt={loc.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${isCleared
                          ? 'grayscale contrast-125 brightness-75'
                          : !isUnlocked
                            ? 'grayscale brightness-50 contrast-125'
                            : 'brightness-90 group-hover:scale-115'
                          }`}
                      />
                      {isCleared && (
                        <div className="absolute inset-0 bg-emerald-950/60 flex items-center justify-center">
                          <span className="text-emerald-300 text-base font-bold">✓</span>
                        </div>
                      )}
                      {!isCleared && !isUnlocked && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <span className="text-stone-400 text-xs sm:text-sm font-black">🔒</span>
                        </div>
                      )}
                      {loc.isBoss && !isCleared && isUnlocked && (
                        <div className="absolute top-0 right-0 bg-red-600 text-[9px] font-cinzel font-black text-white px-1.5 py-0.5 rounded-full shadow">
                          ☠
                        </div>
                      )}
                    </div>

                    {/* Tier or Status Mini Badge */}
                    <div
                      className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-cinzel font-bold tracking-widest uppercase border whitespace-nowrap shadow-md ${isCleared
                        ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                        : !isUnlocked
                          ? 'bg-stone-950 border-stone-700 text-stone-400'
                          : loc.isBoss
                            ? 'bg-red-950 border-red-600 text-red-200'
                            : 'bg-stone-950 border-amber-700/80 text-amber-200 group-hover:border-amber-400 group-hover:text-amber-100'
                        }`}
                    >
                      {isCleared ? 'PURIFIED' : !isUnlocked ? 'LOCKED' : loc.isBoss ? 'BOSS' : loc.tier}
                    </div>
                  </div>

                  {/* Landmark Name Banner */}
                  <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap">
                    <div
                      className={`px-2.5 py-0.5 rounded-xs font-cinzel text-[10px] sm:text-xs font-bold tracking-wide uppercase shadow-lg border transition-all ${isCleared
                        ? 'bg-black/85 border-emerald-900/60 text-emerald-400/80'
                        : !isUnlocked
                          ? 'bg-black/85 border-stone-800 text-stone-500'
                          : isHovered || isSelected
                            ? 'bg-stone-950 border-amber-500 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105'
                            : 'bg-black/85 border-stone-800 text-stone-300 group-hover:border-amber-600 group-hover:text-amber-100'
                        }`}
                    >
                      {loc.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Legend Footer Bar */}

        </div>
      )}

      {/* CLASSIC GRID CARD VIEW (Toggleable) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full animate-in fade-in duration-300">
          {locations.map((loc) => {
            const isCleared = isLocationCleared(loc.id);
            const isUnlocked = isLocationUnlockedForMap(loc);

            if (isCleared) {
              return (
                <div
                  key={loc.id}
                  className="relative rounded-sm border border-stone-800/80 bg-[#09080b]/90 p-5 shadow-lg flex flex-col justify-between min-h-[340px] opacity-75 hover:opacity-100 transition-opacity"
                >
                  <div>
                    <div className="relative h-40 w-full overflow-hidden border border-stone-800 mb-3 filter grayscale contrast-125 brightness-75">
                      <img
                        src={loc.image}
                        alt={loc.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="font-cinzel text-[11px] tracking-widest text-stone-300 font-bold border border-stone-700 px-3 py-1 bg-black/80">
                          PURIFIED
                        </span>
                      </div>
                    </div>

                    <h3 className="font-cinzel text-base font-bold text-stone-300">
                      {loc.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-serif italic mt-1">
                      Corruption dissipated. Peace restored to the soil.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-900 text-center text-[10px] text-stone-500 font-cinzel tracking-widest uppercase">
                    Dominion Secured
                  </div>
                </div>
              );
            }

            return (
              <div
                key={loc.id}
                className={`group relative rounded-sm border p-5 shadow-[0_4px_25px_rgba(0,0,0,0.7)] transition-all duration-300 flex flex-col justify-between min-h-[360px] ${!isUnlocked
                  ? 'border-stone-800/80 bg-[#070608]/90 opacity-80'
                  : 'border-stone-800 hover:border-amber-700/60 bg-[#0a080c]/95 hover:bg-[#0e0a12]'
                  }`}
              >
                <div>
                  {/* Location Artwork */}
                  <div
                    className="relative h-44 w-full overflow-hidden border border-stone-800/90 group-hover:border-stone-600 mb-3 cursor-pointer rounded-xs"
                    onClick={() => handleOpenAssaultModal(loc)}
                  >
                    <img
                      src={loc.image}
                      alt={loc.name}
                      className={`w-full h-full object-cover transition-transform duration-700 ${!isUnlocked
                        ? 'grayscale brightness-50 contrast-125'
                        : 'filter brightness-85 contrast-110 group-hover:scale-105'
                        }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Tier or Locked Badge */}
                    <span className={`absolute top-2 right-2 text-[9px] font-cinzel font-semibold tracking-widest px-2 py-0.5 border ${!isUnlocked
                      ? 'bg-black/90 border-stone-700 text-stone-400'
                      : 'bg-black/80 border-stone-700 text-stone-300'
                      }`}>
                      {!isUnlocked ? 'LOCKED' : loc.tier}
                    </span>
                  </div>

                  {/* Location Lore & Description */}
                  <div className="space-y-1">
                    <h3 className="font-cinzel text-base sm:text-lg font-bold tracking-wide text-stone-100 group-hover:text-amber-200 transition-colors">
                      {loc.name}
                    </h3>
                    <p className="text-[11px] font-cinzel text-stone-400">
                      {loc.subtitle}
                    </p>
                    <p className="text-xs text-stone-400 font-serif italic leading-relaxed pt-2">
                      “{loc.description}”
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 mt-3 border-t border-stone-900 flex flex-col gap-2">
                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => handleOpenAssaultModal(loc)}
                      className="w-full py-2 px-3 rounded-xs font-cinzel text-xs font-black tracking-[0.15em] uppercase text-stone-200 bg-stone-900/90 hover:bg-amber-950/80 border border-stone-700 hover:border-amber-600/80 hover:text-amber-100 active:scale-[0.99] transition-all cursor-pointer shadow"
                    >
                      ASSAULT DOMAIN
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenAssaultModal(loc)}
                      className="w-full py-2 px-3 rounded-xs font-cinzel text-xs font-bold tracking-[0.15em] uppercase text-stone-500 bg-stone-950/80 border border-stone-800 cursor-pointer text-center"
                    >
                      VIEW RECONNAISSANCE
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleScoutClick(loc.enemies)}
                    className="w-full py-1.5 px-2 rounded-xs font-cinzel text-[10px] tracking-wider text-stone-400 hover:text-stone-200 bg-transparent hover:bg-stone-900/40 border border-stone-800 hover:border-stone-700 transition-all cursor-pointer text-center"
                  >
                    SCOUT FORCES
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Repurposed Tactical Dossier & Expedition Mandate Modal */}
      {openLevelModal && activeSelectedLocation && (
        <DarkBackgroundWrapper zIndex={100000} onClose={() => setOpenLevelModal(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col w-[92%] sm:w-[520px] bg-[#0c0a0e]/95 border-2 border-stone-700 p-6 sm:p-7 rounded-sm shadow-[0_0_60px_rgba(0,0,0,0.95)] backdrop-blur-md select-none animate-in fade-in zoom-in-95 duration-200 z-50 text-stone-200"
          >
            {/* Dossier Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 text-xs">❖</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-cinzel font-bold">
                  TACTICAL DOSSIER
                </span>
              </div>
              <span
                className={`text-[9px] font-cinzel tracking-wider px-2 py-0.5 rounded border uppercase font-bold ${isLocationCleared(activeSelectedLocation.id)
                  ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300'
                  : !isLocationUnlockedForMap(activeSelectedLocation)
                    ? 'bg-stone-950 border-stone-700 text-stone-400'
                    : activeSelectedLocation.isBoss
                      ? 'bg-red-950/80 border-red-600 text-red-300'
                      : 'bg-stone-900 border-stone-700 text-stone-300'
                  }`}
              >
                {isLocationCleared(activeSelectedLocation.id)
                  ? 'PURIFIED'
                  : !isLocationUnlockedForMap(activeSelectedLocation)
                    ? 'PATH OBSTRUCTED'
                    : activeSelectedLocation.isBoss
                      ? 'BOSS STRONGHOLD'
                      : `TIER ${activeSelectedLocation.tier}`}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="mt-3 text-center">
              <h3 className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-stone-100 uppercase">
                {activeSelectedLocation.name}
              </h3>
              <p className="text-xs font-cinzel text-stone-400 mt-0.5">
                {activeSelectedLocation.subtitle}
              </p>
            </div>

            {/* Artwork Banner with Enemy Count */}
            <div className="my-4 relative border border-stone-800 bg-black overflow-hidden rounded-xs">
              <img
                src={activeSelectedLocation.image}
                alt={activeSelectedLocation.name}
                className={`w-full h-44 object-cover ${isLocationCleared(activeSelectedLocation.id)
                  ? 'grayscale contrast-125 brightness-75'
                  : !isLocationUnlockedForMap(activeSelectedLocation)
                    ? 'grayscale brightness-65 contrast-125'
                    : 'brightness-90 contrast-110'
                  }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {isLocationCleared(activeSelectedLocation.id) ? (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="font-cinzel text-xs tracking-widest text-emerald-300 font-bold border border-emerald-700 px-4 py-1.5 bg-black/80">
                    PURIFIED DOMINION ✓
                  </span>
                </div>
              ) : (
                <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center text-[11px] font-cinzel text-stone-300 bg-black/80 px-3 py-1.5 rounded backdrop-blur-sm border border-stone-800">
                  <span className="tracking-wider">HOSTILE FORCES:</span>
                  <span className="font-mono text-red-400 font-bold">
                    {activeSelectedLocation.enemies.length} Divisions Detected
                  </span>
                </div>
              )}
            </div>

            {/* Path Obstructed Notice if Locked */}
            {!isLocationCleared(activeSelectedLocation.id) && !isLocationUnlockedForMap(activeSelectedLocation) && (
              <div className="p-3 bg-stone-950/90 border border-stone-800 rounded mb-3 text-center">
                <span className="text-[10px] font-cinzel text-amber-400 font-bold uppercase tracking-wider block mb-0.5">
                  PATH OBSTRUCTED
                </span>
                <p className="text-xs text-stone-400 font-serif italic">
                  {activeSelectedLocation.unlockCondition?.description ||
                    'Defeat blocking garrisons or clear adjacent domains to unseal this passage.'}
                </p>
              </div>
            )}

            {/* Domain Lore */}
            <div className="bg-black/50 p-3 rounded border border-stone-900/80 mb-3">
              <p className="text-xs sm:text-sm text-stone-300 font-serif italic leading-relaxed">
                “{activeSelectedLocation.description}”
              </p>
            </div>

            {/* Victory Bounty Reward */}
            {activeSelectedLocation.reward && !isLocationCleared(activeSelectedLocation.id) && (
              <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded flex items-center justify-between mb-4">
                <div>
                  <div className="text-[9px] font-cinzel tracking-wider text-amber-400 uppercase font-semibold">
                    VICTORY BOUNTY
                  </div>
                  <div className="text-xs font-cinzel text-stone-200">
                    {activeSelectedLocation.reward.description}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 border-t border-stone-800 flex flex-col sm:flex-row gap-3">
              {isLocationCleared(activeSelectedLocation.id) ? (
                <button
                  type="button"
                  onClick={() => {
                    playPreviewSound();
                    setOpenLevelModal(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xs font-cinzel text-xs font-bold tracking-wider uppercase text-stone-300 bg-stone-900 hover:bg-stone-800 border border-stone-700 transition-all cursor-pointer"
                >
                  DISMISS
                </button>
              ) : (
                <>
                  {isLocationUnlockedForMap(activeSelectedLocation) ? (
                    <button
                      type="button"
                      onClick={handleConfirmInvasion}
                      className="flex-1 py-3 px-4 rounded-xs font-cinzel text-xs font-black tracking-[0.18em] uppercase text-stone-100 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 hover:from-amber-900 hover:to-amber-800 border border-amber-500 hover:border-amber-400 hover:text-amber-100 active:scale-[0.99] transition-all cursor-pointer shadow-[0_0_20px_rgba(217,119,6,0.4)]"
                    >
                      COMMENCE ASSAULT
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex-1 py-3 px-4 rounded-xs font-cinzel text-xs font-bold tracking-[0.18em] uppercase text-stone-500 bg-stone-900/50 border border-stone-800 cursor-not-allowed text-center"
                    >
                      PATH OBSTRUCTED
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleScoutClick(activeSelectedLocation.enemies)}
                    className="py-3 px-4 rounded-xs font-cinzel text-xs tracking-wider uppercase text-stone-300 hover:text-stone-100 bg-stone-900/80 hover:bg-stone-900 border border-stone-700 hover:border-stone-600 transition-all cursor-pointer"
                  >
                    SCOUT FORCES
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playPreviewSound();
                      setOpenLevelModal(false);
                    }}
                    className="py-3 px-4 rounded-xs font-cinzel text-xs tracking-wider uppercase text-stone-400 hover:text-stone-200 bg-transparent hover:bg-stone-900 border border-stone-800 hover:border-stone-700 transition-all cursor-pointer"
                  >
                    RETREAT
                  </button>
                </>
              )}
            </div>
          </div>
        </DarkBackgroundWrapper>
      )}
    </div>
  );
};

export default Map;


