import { useContext, useEffect, lazy, Suspense } from 'react';
import { BattleContext } from './context/BattleContext';
import { useBattleHandler, useZonePreview } from './features/components/App';
import { PlayerUI } from './components/PlayerUI';
import { DarkBackgroundWrapper } from './components/DarkBackgroundWrapper';
import { AudioControl } from './components/AudioControl';
import { soundEngine } from './services/audio/soundEngine';
import { resolveMusicTrack } from './data/audio/musicRegistry';
import { findLocation } from './data/levels/levelsData';
import './App.css';

// Lazy-loaded routes & modal components for optimized initial bundle splitting
const BattleUI = lazy(() =>
  import('./components/BattleUI').then((m) => ({ default: m.BattleUI }))
);
const HeroSelection = lazy(() =>
  import('./components/HeroSelection').then((m) => ({ default: m.HeroSelection }))
);
const Map = lazy(() =>
  import('./components/Map').then((m) => ({ default: m.Map }))
);
const ZonePreview = lazy(() =>
  import('./components/ZonePreview').then((m) => ({ default: m.ZonePreview }))
);
const DialogueModal = lazy(() =>
  import('./components/Dialogue/DialogueModal').then((m) => ({ default: m.DialogueModal }))
);
const InventoryModal = lazy(() =>
  import('./components/Inventory').then((m) => ({ default: m.InventoryModal }))
);
const WinOrDefeat = lazy(() =>
  import('./components/WinOrDefeat').then((m) => ({ default: m.WinOrDefeat }))
);

function App() {
  const { playerRace, isInFight, playerArmy, currentZone } = useContext(BattleContext);

  const {
    currentLevel,
    completedLocationIds,
    isCampaignWon,
    handleInFight,
    isPlaying,
    setIsPlaying,
  } = useBattleHandler();

  const { previewLevelInfo, isVisible, handleVisibility, handlePreviewLevel } =
    useZonePreview();

  // Dynamic Multi-Faction & Zone-Aware Adaptive Music
  useEffect(() => {
    const locConfig = currentZone ? findLocation(currentZone)?.location : null;
    const targetTrack = resolveMusicTrack({
      isInFight,
      playerRace,
      locationConfig: locConfig,
      isCampaignWon,
      isPlaying,
      playerArmyCount: playerArmy.length,
    });

    if (targetTrack) {
      soundEngine.playMusic(targetTrack);
    } else {
      soundEngine.stopMusic();
    }
  }, [isInFight, playerRace, currentZone, isCampaignWon, isPlaying, playerArmy.length]);

  // Unlock audio on initial user gesture if browser blocked autoplay
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!isInFight && !isCampaignWon) {
        const targetTrack = resolveMusicTrack({
          isInFight: false,
          playerRace,
          isPlaying,
          playerArmyCount: playerArmy.length,
        });
        if (targetTrack) {
          soundEngine.playMusic(targetTrack);
        }
      }
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [playerRace, isPlaying, playerArmy.length]);

  return (
    <div className="bg-gradient-radial from-zinc-900 via-gray-800/20 to-zinc-900 w-screen min-h-screen">
      <AudioControl />

      <Suspense fallback={null}>
        <DialogueModal />
        <InventoryModal />

        {playerArmy.length < 1 && !isPlaying && (
          <HeroSelection setIsPlaying={setIsPlaying} />
        )}

        {playerArmy.length === 0 && isPlaying && (
          <DarkBackgroundWrapper opacity={1}>
            <WinOrDefeat text={'YOU HAVE LOST!'} />
          </DarkBackgroundWrapper>
        )}

        {isCampaignWon && (
          <DarkBackgroundWrapper opacity={1}>
            <WinOrDefeat text={'YOU HAVE WON!'} />
          </DarkBackgroundWrapper>
        )}

        {!isInFight && playerRace !== '' && playerArmy.length > 0 && (
          <PlayerUI race={playerRace} playerArmy={playerArmy} />
        )}

        {!isInFight && playerArmy.length > 0 && (
          <Map
            currentLevel={currentLevel}
            completedLocationIds={completedLocationIds}
            handleInFight={handleInFight}
            handlePreviewLevel={handlePreviewLevel}
          />
        )}

        {isVisible && previewLevelInfo && (
          <ZonePreview
            handleVisibility={handleVisibility}
            previewLevel={previewLevelInfo}
          />
        )}

        {isInFight && <BattleUI />}
      </Suspense>
    </div>
  );
}

export default App;
