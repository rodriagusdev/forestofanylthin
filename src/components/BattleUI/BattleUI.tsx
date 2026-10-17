import { useContext } from 'react';
import { BattleContext } from '../../context/BattleContext';
import { findLocation } from '../../data/levels/levelsData';
import { ZONES, ZoneId } from '../../data/zones/zones';
import { DarkBackgroundWrapper } from '../DarkBackgroundWrapper';
import { BattleBoard } from './BattleBoard';
import { PlayerStack } from './PlayerStack';
import { EnemyStack } from './EnemyStack';
import { BattleMessage } from './BattleMessage';
import { DeadUnit } from './DeadUnit';
import { CombatLog } from './CombatLog';
import { UnitPreview } from '../PlayerUI/UnitPreview';
import {
  useGetPlayingUnit,
  useHandleUnitsInBoard,
} from '../../features/components/BattleUI';

export const BattleUI = () => {
  const {
    isInFight,
    showBattleMessage,
    deadUnit,
    currentZone,
    currentZoneImage,
    previewUnit,
    handleExitUnitPreview,
    activeScreenShake,
    activeScreenFlash,
  } = useContext(BattleContext);
  useGetPlayingUnit();
  useHandleUnitsInBoard();

  const zoneBg =
    currentZoneImage ||
    findLocation(currentZone)?.location.image ||
    ZONES[(currentZone as ZoneId) || 'Cemetery']?.image;

  return (
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen w-full flex flex-col lg:flex-row gap-3 py-2 px-2 sm:px-4 select-none font-outfit text-zinc-100 bg-black overflow-x-hidden overflow-y-auto lg:overflow-hidden">
      {/* Jeweled Luminous Ambient Atmospheric FX */}
      <div className="pointer-events-none fixed -top-40 left-1/4 w-[550px] h-[550px] bg-purple-700/20 rounded-full blur-[100px] animate-atmospheric-drift" />
      <div className="pointer-events-none fixed -bottom-40 right-1/4 w-[550px] h-[550px] bg-fuchsia-700/15 rounded-full blur-[100px] animate-atmospheric-drift" style={{ animationDelay: '-4s' }} />
      <div className="pointer-events-none fixed top-1/3 right-1/10 w-[450px] h-[450px] bg-indigo-700/18 rounded-full blur-[90px] animate-atmospheric-drift" style={{ animationDelay: '-2s' }} />
      <div className="pointer-events-none fixed bottom-1/3 left-1/10 w-[450px] h-[450px] bg-violet-700/18 rounded-full blur-[90px] animate-atmospheric-drift" style={{ animationDelay: '-6s' }} />
      <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[350px] bg-purple-900/15 rounded-full blur-[120px]" />

      {/* Left Column: 1/4 Width Chronicles of War Combat Event Log */}
      <div className="w-full lg:w-[26%] xl:w-[23%] h-[320px] lg:h-full flex-shrink-0 z-20">
        <CombatLog />
      </div>

      {/* Right Column: 3/4 Width Crystalline Amethyst Frame Battlefield */}
      <div
        className={`w-full lg:w-[74%] xl:w-[77%] h-full flex flex-col justify-between painting-frame smoked-velvet-canvas p-1.5 sm:p-2.5 rounded-lg relative z-10 overflow-hidden ${activeScreenShake === 'apocalyptic'
            ? 'animate-combat-screen-shake-apocalyptic'
            : activeScreenShake === 'heavy'
              ? 'animate-combat-screen-shake-heavy'
              : activeScreenShake
                ? 'animate-combat-screen-shake'
                : ''
          }`}
      >
        {/* Dynamic Combat Impact Flash & Meteor FX Overlay */}
        {activeScreenFlash && (
          <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
            {activeScreenFlash === 'fire' ? (
              <div className="absolute inset-0 bg-gradient-to-b from-orange-600/70 via-red-600/50 to-black/80 shadow-[inset_0_0_150px_rgba(239,68,68,0.95)] animate-firestorm-flash">
                {/* Meteoric Fireball Cascades */}
                <div className="absolute left-[15%] top-0 w-8 h-20 bg-gradient-to-b from-amber-200 via-orange-500 to-transparent blur-[2px] rounded-full animate-meteor-1" />
                <div className="absolute left-[38%] top-0 w-12 h-28 bg-gradient-to-b from-yellow-200 via-red-600 to-transparent blur-[3px] rounded-full animate-meteor-2" />
                <div className="absolute left-[65%] top-0 w-10 h-24 bg-gradient-to-b from-amber-100 via-orange-600 to-transparent blur-[2px] rounded-full animate-meteor-3" />
                <div className="absolute left-[85%] top-0 w-9 h-22 bg-gradient-to-b from-yellow-300 via-red-500 to-transparent blur-[2px] rounded-full animate-meteor-4" />
                {/* Central Hellfire Shockwave Crown */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-radial from-orange-500/60 via-red-700/30 to-transparent rounded-full blur-xl animate-pulse" />
              </div>
            ) : activeScreenFlash === 'dark-magic' || activeScreenFlash === 'curse' ? (
              <div className="absolute inset-0 bg-gradient-to-b from-[#3b0764]/90 via-[#18042a]/75 to-[#3b0764]/90 shadow-[inset_0_0_140px_rgba(168,85,247,0.95)] animate-curse-flash">
                {/* Void Rune Shimmer */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[260px] bg-radial from-fuchsia-600/40 via-purple-900/20 to-transparent rounded-full blur-2xl animate-pulse" />
              </div>
            ) : activeScreenFlash === 'ruby' ? (
              <div className="absolute inset-0 bg-gradient-to-t from-rose-600/40 via-red-500/25 to-rose-600/40 animate-screen-flash" />
            ) : activeScreenFlash === 'arcane' || activeScreenFlash === 'ice' ? (
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/50 via-blue-500/30 to-fuchsia-600/40 shadow-[inset_0_0_80px_rgba(6,182,212,0.8)] animate-screen-flash" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/45 via-teal-500/30 to-emerald-600/45 shadow-[inset_0_0_80px_rgba(160,185,129,0.8)] animate-screen-flash" />
            )}
          </div>
        )}
        {/* Immersive Zone Location Battlefield Background with Dark Fantasy Vignette */}
        {zoneBg && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src={zoneBg}
              alt="Battlefield Environment"
              className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-125 saturate-125 transition-all duration-700"
            />
            {/* Dark fantasy radial and gradient depth overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08020e] via-transparent to-[#08020e]/85" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08020e]/85 via-transparent to-[#08020e]/85" />
            <div className="absolute inset-0 bg-[#2e1065]/25 mix-blend-color" />
          </div>
        )}

        {/* Crystal Thorn Corner Seals */}
        <span className="absolute top-2 left-2 text-base sm:text-lg text-pink-300 font-serif drop-shadow-[0_0_12px_rgba(244,114,182,0.9)] pointer-events-none z-30">
          ✦
        </span>
        <span className="absolute top-2 right-2 text-base sm:text-lg text-pink-300 font-serif drop-shadow-[0_0_12px_rgba(244,114,182,0.9)] pointer-events-none z-30">
          ✦
        </span>
        <span className="absolute bottom-2 left-2 text-base sm:text-lg text-pink-300 font-serif drop-shadow-[0_0_12px_rgba(244,114,182,0.9)] pointer-events-none z-30">
          ✦
        </span>
        <span className="absolute bottom-2 right-2 text-base sm:text-lg text-pink-300 font-serif drop-shadow-[0_0_12px_rgba(244,114,182,0.9)] pointer-events-none z-30">
          ✦
        </span>

        {/* Canvas Center Arena */}
        <main className="relative z-10 w-full flex-1 flex flex-col justify-between py-0.5 gap-1 overflow-visible">
          {/* Hostile Enemy Division Arena */}
          {isInFight && (
            <div className="flex-shrink-0">
              <EnemyStack />
            </div>
          )}

          {/* Allied Player Division (with docked HOMM V Runic Command Medallion on the right) */}
          {isInFight && (
            <div className="flex-shrink-0">
              <PlayerStack />
            </div>
          )}
        </main>

        {/* Turn Table Queue at the bottom of the canvas */}
        <footer className="relative z-20 w-full flex flex-col items-center flex-shrink-0 mt-0.5">
          <BattleBoard />
        </footer>
      </div>

      {/* Combat Duel Clash Modal */}
      {showBattleMessage && (
        <DarkBackgroundWrapper>
          <BattleMessage />
        </DarkBackgroundWrapper>
      )}

      {/* Casualty Memorial Modal */}
      {deadUnit && deadUnit.name !== undefined && (
        <DarkBackgroundWrapper>
          <DeadUnit deadUnit={deadUnit} />
        </DarkBackgroundWrapper>
      )}

      {/* Full Unit Codex Description Modal (Triggered by BattleBoard or Battlefield Cards) */}
      {previewUnit !== null && previewUnit !== undefined && (
        <DarkBackgroundWrapper onClose={handleExitUnitPreview}>
          <UnitPreview
            previewUnit={previewUnit}
            handleExitUnitPreview={handleExitUnitPreview}
          />
        </DarkBackgroundWrapper>
      )}
    </div>
  );
};

export default BattleUI;
