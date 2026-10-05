import { useContext, useEffect } from 'react';
import { BattleContext } from '../../../../context/BattleContext';
import { UnitStats } from '../../../../types';

interface Props {
  handleUnitPreview: (unit: UnitStats) => void;
}

export const useBoardDisplay = ({ handleUnitPreview }: Props) => {
  const { unitsInBoard, setTurn, unitPosition } = useContext(BattleContext);

  const mapUnitsInBoard = unitsInBoard.map((unit, index) => {
    if (!unit) return null;
    const isPlaying = index === unitPosition;
    const isPlayer = unit.belongsTo === 'player';

    return (
      <div
        key={`${unit.id}_${index}`}
        className={`relative group flex flex-col items-center cursor-pointer transition-all duration-300 select-none flex-shrink-0 pt-2 ${
          isPlaying
            ? 'scale-105 z-30'
            : 'opacity-75 hover:opacity-100 hover:scale-105'
        }`}
        onClick={() => handleUnitPreview(unit)}
      >
        {/* Maximalist Crystalline Halo on Active Combatant */}
        {isPlaying && (
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-300 to-pink-600 animate-spin blur-sm -z-10 opacity-70 duration-3000" />
        )}

        {/* Heraldic Turn Badge */}
        <div className="absolute top-0 z-20 flex items-center justify-center">
          <span
            className={`px-1.5 py-0.2 rounded-sm text-[9px] font-cinzel font-black border shadow-lg ${
              isPlaying
                ? 'crystal-thorn-badge text-pink-100 border-pink-300 scale-105'
                : 'bg-zinc-950 text-pink-300/80 border-fuchsia-600/50'
            }`}
          >
            #{index + 1}
          </span>
        </div>

        {/* Ornate Frame Container with Faction Framing (Green for allies, Red for enemies) */}
        <div
          className={`relative p-1 rounded-full transition-all duration-300 mt-1 ${
            isPlaying
              ? 'bg-gradient-to-b from-pink-400 via-fuchsia-600 to-purple-800 p-[2.5px] shadow-[0_0_18px_rgba(244,114,182,0.9)] ring-2 ring-pink-400'
              : isPlayer
              ? 'bg-gradient-to-b from-emerald-400 via-emerald-700 to-emerald-950 p-[1.5px] shadow-[0_0_12px_rgba(16,185,129,0.6)] ring-1 ring-emerald-500/70'
              : 'bg-gradient-to-b from-rose-500 via-rose-800 to-rose-950 p-[1.5px] shadow-[0_0_12px_rgba(244,63,94,0.6)] ring-1 ring-rose-500/70'
          }`}
        >
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-black/80 bg-black">
            <img
              src={unit.face}
              alt={unit.name}
              className="w-full h-full object-cover object-top filter brightness-95 group-hover:scale-110 transition-transform"
            />
          </div>

          {/* Troop Multiplier Seal */}
          {unit.type !== 'Hero' && (
            <span className="absolute -bottom-1 -right-1 px-1 py-0.2 crystal-thorn-badge text-pink-200 text-[9px] font-mono font-bold rounded shadow-md">
              {Math.ceil(unit.stack)}x
            </span>
          )}
        </div>

        {/* Active Combatant Crystal Ribbon */}
        {isPlaying && (
          <span className="mt-0.5 px-1.5 py-0.2 rounded-sm crystal-thorn-badge text-pink-100 text-[7.5px] font-cinzel font-black tracking-widest uppercase shadow-[0_0_10px_rgba(244,114,182,0.8)]">
            ⚔ ACTIVE ⚔
          </span>
        )}
      </div>
    );
  });

  useEffect(() => {
    if (unitsInBoard && unitsInBoard.length > 0 && unitPosition === 0) {
      if (unitsInBoard[0]?.belongsTo === 'player') {
        setTurn('player');
      } else {
        setTurn('enemy');
      }
    }
  }, [unitsInBoard]);

  return { mapUnitsInBoard };
};
