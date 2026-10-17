import { useContext, useEffect, useState } from 'react';
import { BattleContext } from '../../../context/BattleContext';
import { useCampaignStore } from '../../../store/useCampaignStore';
import {
  LEVELS,
  TOTAL_LEVELS,
  getLevelById,
  findLocation,
} from '../../../data/levels/levelsData';
import { restoreArmy } from '../../../helpers/campaign/campaignProgression';
import { Army } from '../../../types';

export const useBattleHandler = () => {
  const {
    isInFight,
    setIsInFight,
    setEnemyArmy,
    setUnitPosition,
    playerArmy,
    setPlayerArmy,
    setUnitsInBoard,
    enemyArmy,
    setCurrentZone,
    setCurrentZoneImage,
    setFallenAllies,
    setPlayerRace,
  } = useContext(BattleContext);

  // Zustand Campaign Store Selectors & Actions
  const isPlaying = useCampaignStore((state) => state.isPlaying);
  const isCampaignWon = useCampaignStore((state) => state.isCampaignWon);
  const currentLevelId = useCampaignStore((state) => state.currentLevelId);
  const completedLocationsByLevel = useCampaignStore(
    (state) => state.completedLocationsByLevel
  );
  const levelsCompleted = useCampaignStore((state) => state.levelsCompleted);
  const campaignPlayerArmy = useCampaignStore((state) => state.playerArmy);
  const campaignPlayerRace = useCampaignStore((state) => state.playerRace);
  const completeLocation = useCampaignStore((state) => state.completeLocation);
  const resetCampaign = useCampaignStore((state) => state.resetCampaign);

  const [activeLocationId, setActiveLocationId] = useState<string | null>(null);

  const currentLevel = getLevelById(currentLevelId) || LEVELS[0];
  const completedLocationIds = completedLocationsByLevel[currentLevelId] || [];

  // Sync campaign player race & army to BattleContext when outside combat
  useEffect(() => {
    if (campaignPlayerRace) {
      setPlayerRace(campaignPlayerRace);
    }
    if (!isInFight && campaignPlayerArmy && campaignPlayerArmy.length > 0) {
      setPlayerArmy(campaignPlayerArmy);
    }
  }, [campaignPlayerRace, campaignPlayerArmy, isInFight, setPlayerArmy, setPlayerRace]);

  const handleInFight = async (enemiesToAdd: Army, locationId?: string) => {
    const locId = locationId || currentLevel.locations[0]?.id || 'Cemetery';
    const locationData = findLocation(locId)?.location;

    if (locationData) {
      setCurrentZone(locationData.name);
      setCurrentZoneImage(locationData.image);
    }

    // Always synchronize playerArmy from latest Zustand campaign state (equipped gear + stats)
    if (campaignPlayerArmy && campaignPlayerArmy.length > 0) {
      setPlayerArmy(restoreArmy(campaignPlayerArmy));
    }

    setActiveLocationId(locId);
    setIsInFight(true);
    setEnemyArmy([...enemiesToAdd]);
    setFallenAllies([]);
    setUnitPosition(0);
  };

  useEffect(() => {
    if (!isInFight || !isPlaying) return;

    // Defeat Condition
    if (playerArmy.length === 0) {
      setIsInFight(false);
      setUnitsInBoard([]);
      setUnitPosition(0);
      return;
    }

    // Victory Condition
    if (enemyArmy.length === 0) {
      setIsInFight(false);
      setUnitsInBoard([]);
      setUnitPosition(0);

      const survivingArmy = restoreArmy(playerArmy);

      if (activeLocationId) {
        const locInfo = findLocation(activeLocationId)?.location;
        // Commit victory, update persistent army & grant rewards in Zustand
        completeLocation(
          currentLevelId,
          activeLocationId,
          survivingArmy,
          locInfo?.reward
        );
      }

      setPlayerArmy(survivingArmy);
      setActiveLocationId(null);
    }
  }, [
    enemyArmy.length,
    playerArmy.length,
    isInFight,
    isPlaying,
    activeLocationId,
    currentLevelId,
    completeLocation,
    setPlayerArmy,
    setIsInFight,
    setUnitsInBoard,
    setUnitPosition,
  ]);

  return {
    currentLevel,
    currentLevelId,
    completedLocationIds,
    isLocationCompleted: (locId: string) => completedLocationIds.includes(locId),
    isCampaignWon,
    levelsCompleted,
    isPlaying,
    setIsPlaying: (playingOrUpdater: React.SetStateAction<boolean>) => {
      const current = useCampaignStore.getState().isPlaying;
      const next =
        typeof playingOrUpdater === 'function'
          ? (playingOrUpdater as (prev: boolean) => boolean)(current)
          : playingOrUpdater;
      if (!next) {
        resetCampaign();
      } else {
        useCampaignStore.setState({ isPlaying: true });
      }
    },
    handleInFight,
    totalLevels: TOTAL_LEVELS,

    // Backward-compatibility props:
    isCemeteryCompleted: completedLocationIds.includes('Cemetery'),
    isGloomyForestCompleted: completedLocationIds.includes('Gloomy Forest'),
    isLostGladeCompleted: completedLocationIds.includes('Lost Glade'),
    isSacreCompleted: completedLocationIds.includes('Sacrelthar'),
    isInCemetery: activeLocationId === 'Cemetery',
    isInGloomyForest: activeLocationId === 'Gloomy Forest',
    isInLostGlade: activeLocationId === 'Lost Glade',
    isInSacre: activeLocationId === 'Sacrelthar',
  };
};
