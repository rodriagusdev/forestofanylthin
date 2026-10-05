import { useContext, useEffect } from 'react';
import { BattleContext } from './context/BattleContext';
import { useBattleHandler, useZonePreview } from './features/components/App';
import { BattleUI } from './components/BattleUI/-BattleUI';
import { PlayerUI } from './components/PlayerUI';
import { DarkBackgroundWrapper } from './components/DarkBackgroundWrapper';
import { HeroSelection } from './components/HeroSelection';
import { WinOrDefeat } from './components/WinOrDefeat';
import { ZonePreview } from './components/ZonePreview';
import { Map } from './components/Map';
import { AudioControl } from './components/AudioControl';
import { soundEngine } from './services/audio/soundEngine';
import './App.css';

function App() {
  const { playerRace, isInFight, playerArmy } = useContext(BattleContext);

  const {
    isCemeteryCompleted,
    isGloomyForestCompleted,
    isLostGladeCompleted,
    isSacreCompleted,
    handleInFight,
    levelsCompleted,
    isPlaying,
    setIsPlaying,
  } = useBattleHandler();

  const { previewLevelInfo, isVisible, handleVisibility, handlePreviewLevel } =
    useZonePreview();

  // Dynamic Adaptive Battle Music: ONLY active during tactical combat engagements
  useEffect(() => {
    if (isInFight && playerArmy.length > 0 && levelsCompleted < 4) {
      soundEngine.startBattleMusic();
    } else {
      soundEngine.stopBattleMusic();
    }
    return () => {
      soundEngine.stopBattleMusic();
    };
  }, [isInFight, playerArmy.length, levelsCompleted]);

  return (
    <div className="bg-gradient-radial from-zinc-900 via-gray-800/20 to-zinc-900 w-screen min-h-screen">
      <AudioControl />
      {playerArmy.length < 1 && !isPlaying && (
          <HeroSelection setIsPlaying={setIsPlaying} />
      )}

      {playerArmy.length == 0 && isPlaying && (
        <DarkBackgroundWrapper opacity={1}>
          <WinOrDefeat text={'YOU HAVE LOST!'} />
        </DarkBackgroundWrapper>
      )}

      {levelsCompleted == 4 && (
        <DarkBackgroundWrapper opacity={1}>
          <WinOrDefeat text={'YOU HAVE WON!'} />
        </DarkBackgroundWrapper>
      )}

      {isVisible && previewLevelInfo && (
        <ZonePreview
          handleVisibility={handleVisibility}
          previewLevel={previewLevelInfo}
        />
      )}

      {!isInFight && playerRace != '' && playerArmy.length > 0 && (
        <PlayerUI race={playerRace} playerArmy={playerArmy} />
      )}

      {!isInFight && playerArmy.length > 0 && (
        <Map
          isCemeteryCompleted={isCemeteryCompleted}
          isGloomyForestCompleted={isGloomyForestCompleted}
          isLostGladeCompleted={isLostGladeCompleted}
          isSacreCompleted={isSacreCompleted}
          handleInFight={handleInFight}
          handlePreviewLevel={handlePreviewLevel}
        />
      )}

      {isInFight && <BattleUI />}
    </div>
  );
}

export default App;
