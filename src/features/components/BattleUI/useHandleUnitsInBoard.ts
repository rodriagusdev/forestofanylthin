import { useContext, useEffect } from 'react';
import { BattleContext } from '../../../context/BattleContext';

export const useHandleUnitsInBoard = () => {
  const { setUnitsInBoard, setTurn, setUnitPosition, playerArmy, enemyArmy, isInFight } =
    useContext(BattleContext);

  useEffect(() => {
    if (isInFight && playerArmy.length > 0 && enemyArmy.length > 0) {
      const combined = [...playerArmy, ...enemyArmy];
      // Numeric initiative sort: highest initiative first
      const sorted = combined.sort(
        (a, b) => Number(b.initiative) - Number(a.initiative)
      );
      setUnitsInBoard(sorted);
      setUnitPosition(0);

      const firstUnit = sorted[0];
      if (firstUnit?.belongsTo === 'player') {
        setTurn('player');
      } else {
        const enemyTurnToken = `enemy_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        setTurn(enemyTurnToken);
      }
    }
  }, [isInFight]);

  return {};
};
