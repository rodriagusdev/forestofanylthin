import React, { useContext } from 'react';
import { BattleContext } from '../../../context/BattleContext';
import { UnitStats } from '../../../types';

interface BoardUnitItemProps {
  unit: UnitStats;
  index: number;
  isPlaying: boolean;
  isHovered: boolean;
  onPreview: (unit: UnitStats) => void;
  onHoverStart: (id: string) => void;
  onHoverEnd: () => void;
}

const BoardUnitItem: React.FC<BoardUnitItemProps> = React.memo(
  ({ unit, index, isPlaying, isHovered, onPreview, onHoverStart, onHoverEnd }) => {
    const isPlayer = unit.belongsTo === 'player';

    return (
      <div
        className={`relative group flex flex-col items-center cursor-pointer transition-all duration-300 select-none flex-shrink-0 pt-2 ${
          isPlaying
            ? 'scale-105 z-30'
            : isHovered
            ? 'scale-115 z-30 animate-ethereal-beacon'
            : 'opacity-75 hover:opacity-100 hover:scale-105'
        }`}
        onClick={() => onPreview(unit)}
        onMouseEnter={() => onHoverStart(unit.id)}
        onMouseLeave={onHoverEnd}
      >
        {/* Maximalist Crystalline Halo on Active Combatant */}
        {isPlaying && (
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-300 to-pink-600 animate-spin blur-sm -z-10 opacity-70 duration-3000" />
        )}

        {/* Turn Number Tag on Hover */}
        {isHovered && !isPlaying && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-xs bg-gradient-to-r from-purple-950 to-indigo-950 border border-pink-400 text-pink-200 text-[7px] font-cinzel font-black tracking-widest whitespace-nowrap shadow-[0_0_10px_rgba(244,114,182,0.9)] z-40">
            TURN #{index + 1}
          </div>
        )}

        {/* Ornate Frame Container with Faction Framing (Green for allies, Red for enemies) */}
        <div
          className={`relative p-0.5 rounded-full transition-all duration-300 mt-0.5 ${
            isPlaying
              ? 'bg-gradient-to-b from-pink-400 via-fuchsia-600 to-purple-800 p-[2px] shadow-[0_0_18px_rgba(244,114,182,0.9)] ring-2 ring-pink-400'
              : isHovered
              ? 'bg-gradient-to-b from-pink-300 via-purple-600 to-pink-400 p-[2px] shadow-[0_0_20px_rgba(244,114,182,1)] ring-2 ring-pink-300'
              : isPlayer
              ? 'bg-gradient-to-b from-emerald-400 via-emerald-700 to-emerald-950 p-[1px] shadow-[0_0_12px_rgba(16,185,129,0.6)] ring-1 ring-emerald-500/70'
              : 'bg-gradient-to-b from-rose-500 via-rose-800 to-rose-950 p-[1px] shadow-[0_0_12px_rgba(244,63,94,0.6)] ring-1 ring-rose-500/70'
          }`}
        >
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-black/80 bg-black">
            <img
              src={unit.face}
              alt={unit.name}
              className="w-full h-full object-cover object-top filter brightness-95 group-hover:scale-110 transition-transform"
            />
          </div>

          {/* Troop Multiplier Seal */}
          {unit.type !== 'Hero' && (
            <span className="absolute -bottom-1 -right-1 px-1 py-0.2 crystal-thorn-badge text-pink-200 text-[12px] font-mono font-bold rounded shadow-md">
              {Math.ceil(unit.stack)}
            </span>
          )}
        </div>

        {/* Active Combatant Crystal Ribbon */}
        {isPlaying && (
          <span className="mt-0.5 px-1 py-0.2 rounded-sm crystal-thorn-badge text-pink-100 text-[7px] font-cinzel font-black tracking-widest uppercase shadow-[0_0_10px_rgba(244,114,182,0.8)]">
            ⚔ ACTIVE ⚔
          </span>
        )}
      </div>
    );
  }
);

export const BattleBoard = () => {
  const { unitsInBoard, unitPosition, handleUnitPreview, hoveredUnitId, setHoveredUnitId } =
    useContext(BattleContext);

  return (
    <div className="w-full flex flex-col items-center select-none py-0.5">
      {/* Ornate Header Filigree */}
      <div className="flex items-center justify-center gap-2.5 text-pink-300 text-[9px] tracking-[0.2em] font-cinzel uppercase font-black mb-0.5 drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]">
        <span className="h-[1px] w-10 sm:w-20 bg-gradient-to-r from-transparent via-fuchsia-400 to-pink-300" />
        <span className="flex items-center gap-1">
          <span>✦</span>
          <span>TURN TABLE</span>
          <span>✦</span>
        </span>
        <span className="h-[1px] w-10 sm:w-20 bg-gradient-to-l from-transparent via-fuchsia-400 to-pink-300" />
      </div>

      {/* Archway Carousel Chamber */}
      <div className="relative w-full max-w-5xl rounded-sm smoked-velvet-canvas border-2 border-fuchsia-600/70 px-2 sm:px-3 py-1 shadow-[0_0_35px_rgba(217,70,239,0.35),inset_0_0_15px_rgba(112,26,117,0.6)] backdrop-blur-2xl">
        {/* Top Center Glowing Amethyst Talisman Orb */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-b from-fuchsia-500 via-purple-700 to-purple-950 border border-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.9)] flex items-center justify-center text-[9px] z-30">
          🔮
        </div>

        {/* Crystal Thorn Corner Accents */}
        <span className="absolute -top-1 -left-1 text-[10px] text-pink-400 font-serif">✦</span>
        <span className="absolute -top-1 -right-1 text-[10px] text-pink-400 font-serif">✦</span>
        <span className="absolute -bottom-1 -left-1 text-[10px] text-pink-400 font-serif">✦</span>
        <span className="absolute -bottom-1 -right-1 text-[10px] text-pink-400 font-serif">✦</span>

        <div className="w-full overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-2 sm:gap-3 w-max min-w-full justify-center min-h-[70px]">
            {unitsInBoard.map((unit, index) => (
              <BoardUnitItem
                key={`${unit.id}_${index}`}
                unit={unit}
                index={index}
                isPlaying={index === unitPosition}
                isHovered={hoveredUnitId === unit.id}
                onPreview={handleUnitPreview}
                onHoverStart={(id) => setHoveredUnitId(id)}
                onHoverEnd={() => setHoveredUnitId(null)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleBoard;