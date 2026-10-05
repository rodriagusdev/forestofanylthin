import { useContext } from 'react';
import { BattleContext } from '../../../context/BattleContext';
import { Unit } from '../../Unit/Unit';
import { CommandDeck } from '../CommandDeck/CommandDeck';

export const PlayerStack = () => {
  const { playerArmy } = useContext(BattleContext);

  return (
    <div className="w-full">
      {/* Crystal Thorn Allied Banner */}
      <div className="flex items-center justify-center max-w-6xl mx-auto px-2 mb-0.5 text-[11px] font-cinzel font-black uppercase tracking-wider">
        <div className="flex items-center gap-1.5 text-pink-300 drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]">
          <span className="text-xs">✦</span>
          <span>◈ ALLIED COVENANT DIVISION ◈</span>
          <span className="text-xs">✦</span>
        </div>
      </div>

      {/* Allied Units Row with Docked Right Command Medallion Wheel */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 w-full max-w-6xl mx-auto px-2 py-0.5">
        <div className="flex-1 min-w-0 overflow-x-auto overflow-y-visible px-1 py-3 no-scrollbar rounded-sm">
          <div className="flex gap-2.5 sm:gap-3.5 w-max min-w-full justify-center">
            {playerArmy.map((unit) => (
              <Unit unit={unit} key={unit.id} />
            ))}
          </div>
        </div>

        {/* Circular HOMM V Spell Medallion docked directly to the right */}
        <div className="flex-shrink-0 pl-1">
          <CommandDeck />
        </div>
      </div>
    </div>
  );
};

export default PlayerStack;

