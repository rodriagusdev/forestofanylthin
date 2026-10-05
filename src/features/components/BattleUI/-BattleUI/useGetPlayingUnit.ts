import { useContext, useEffect } from 'react';
import { BattleContext } from '../../../../context/BattleContext';
import { useBattle } from './useBattle';

export const useGetPlayingUnit = () => {
  const { unitsInBoard, unitPosition, playerArmy, turn, isInFight } =
    useContext(BattleContext);

  const { selectUnit } = useBattle();

  useEffect(() => {
    if (!isInFight || !unitsInBoard || unitsInBoard.length === 0) return;

    const playingUnit = unitsInBoard[unitPosition];
    if (!playingUnit) return;

    const unitIsEnemy = playingUnit.belongsTo === 'enemy';

    if (unitIsEnemy && playerArmy.length > 0) {
      // Pick a random target from living player units
      const targetIndex = Math.floor(Math.random() * playerArmy.length);
      const targetUnit = playerArmy[targetIndex];

      if (targetUnit) {
        const timer = setTimeout(() => {
          selectUnit(targetUnit);
        }, 600);

        return () => clearTimeout(timer);
      }
    }
  }, [turn, unitPosition, isInFight]);

  return {};
};
