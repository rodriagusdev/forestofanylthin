import { useContext, useEffect, useState } from 'react';
import { BattleContext } from '../../../context/BattleContext';
import { dryexaRanger } from '../../../data/unitstats/dryexa/dryexa';
import { skeleton } from '../../../data/unitstats/undead/undead';
import { ZONES, ZoneId } from '../../../data/zones/zones';
import { Army } from '../../../types';

const restoreArmy = (army: Army): Army => {
  return army.map((unit) => ({
    ...unit,
    stack: Math.ceil(unit.stack),
    maxStack: Math.ceil(unit.stack),
    updatedHealth: unit.health * Math.ceil(unit.stack),
    maxHealth: unit.health * Math.ceil(unit.stack),
    updatedDamage: unit.damage * Math.ceil(unit.stack),
    magic: unit.maxMagic,
    maxMagic: unit.maxMagic,
    cursed: false,
    vampiricHeal: false,
    weaknessDamage: 1,
  }));
};

export const useBattleHandler = () => {
  const {
    playerRace,
    isInFight,
    setIsInFight,
    setEnemyArmy,
    setUnitPosition,
    playerArmy,
    setPlayerArmy,
    setUnitsInBoard,
    enemyArmy,
    setAddedDryexaRanger,
    setAddedSkeletons,
    setCurrentZone,
    setCurrentZoneImage,
    setFallenAllies,
  } = useContext(BattleContext);

  const [isPlaying, setIsPlaying] = useState(false);
  const [levelsCompleted, setLevelsCompleted] = useState(0);

  const [activeZone, setActiveZone] = useState<ZoneId | null>(null);

  const [isCemeteryCompleted, setIsCemeteryCompleted] = useState(false);
  const [isGloomyForestCompleted, setIsGloomyForestCompleted] = useState(false);
  const [isLostGladeCompleted, setIsLostGladeCompleted] = useState(false);
  const [isSacreCompleted, setIsSacreCompleted] = useState(false);

  const handleInFight = async (enemiesToAdd: Army, level?: string) => {
    const zoneKey = (level as ZoneId) || 'Cemetery';
    if (ZONES[zoneKey]) {
      setCurrentZone(zoneKey);
      setCurrentZoneImage(ZONES[zoneKey].image);
    }

    setActiveZone(zoneKey);

    switch (zoneKey) {
      case 'Cemetery':
        setIsCemeteryCompleted(true);
        break;
      case 'Gloomy Forest':
        setIsGloomyForestCompleted(true);
        break;
      case 'Lost Glade':
        setIsLostGladeCompleted(true);
        break;
      case 'Sacrelthar':
        setIsSacreCompleted(true);
        break;
    }

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
      setLevelsCompleted((prev) => prev + 1);

      let updatedArmy = restoreArmy(playerArmy);

      if (activeZone === 'Cemetery' && playerRace === 'undead') {
        const hasSkeletons = updatedArmy.some((u) => u.id === 'nicolaiSkeleton');
        if (hasSkeletons) {
          updatedArmy = updatedArmy.map((unit) => {
            if (unit.id === 'nicolaiSkeleton') {
              const newStack = unit.stack + 50;
              return {
                ...unit,
                stack: newStack,
                maxStack: unit.maxStack + 50,
                updatedHealth: unit.updatedHealth + unit.health * 50,
                maxHealth: unit.health * newStack,
                updatedDamage: unit.updatedDamage + unit.damage * 50,
              };
            }
            return unit;
          });
        } else {
          updatedArmy = [
            ...updatedArmy,
            {
              ...skeleton,
              stack: 50,
              maxStack: 50,
              maxHealth: skeleton.health * (skeleton.stack + 50),
              updatedDamage: skeleton.damage * 50,
              updatedHealth: skeleton.health * 50,
              belongsTo: 'player',
            },
          ];
        }
        setAddedSkeletons(true);
      } else if (activeZone === 'Gloomy Forest') {
        updatedArmy = [
          ...updatedArmy,
          {
            ...dryexaRanger,
            stack: 14,
            maxStack: 14,
            maxHealth: dryexaRanger.health * (dryexaRanger.stack + 14),
            updatedDamage: dryexaRanger.damage * 14,
            updatedHealth: dryexaRanger.health * 14,
            belongsTo: 'player',
          },
        ];
        setAddedDryexaRanger(true);
      }

      setPlayerArmy(updatedArmy);
      setActiveZone(null);
    }
  }, [enemyArmy.length, playerArmy.length, isInFight, isPlaying]);

  return {
    isInCemetery: activeZone === 'Cemetery',
    isInGloomyForest: activeZone === 'Gloomy Forest',
    isInLostGlade: activeZone === 'Lost Glade',
    isInSacre: activeZone === 'Sacrelthar',
    isCemeteryCompleted,
    isGloomyForestCompleted,
    isLostGladeCompleted,
    isSacreCompleted,
    isPlaying,
    setIsPlaying,
    levelsCompleted,
    handleInFight,
  };
};
