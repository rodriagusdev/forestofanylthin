import { useContext } from 'react';
import { BattleContext } from '../../../context/BattleContext';
import { Unit } from '../../Unit/Unit';

export const EnemyStack = () => {
  const { enemyArmy } = useContext(BattleContext);

  return (
    <div className="w-full">
      {/* Crystal Thorn Hostile Banner */}
      <div className="flex items-center justify-center max-w-5xl mx-auto px-2 mb-0.5 text-[11px] font-cinzel font-black uppercase tracking-wider">
        <div className="flex items-center gap-1.5 text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]">
          <span className="text-xs">☠</span>
          <span>◈ HOSTILE ENEMY BATTALION ◈</span>
          <span className="text-xs">☠</span>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto overflow-x-auto overflow-y-visible px-1 py-3 no-scrollbar rounded-sm">
        <div className="flex gap-2.5 sm:gap-3.5 w-max min-w-full justify-center">
          {enemyArmy.map((unit) => (
            <Unit unit={unit} key={unit.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnemyStack;
