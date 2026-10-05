import { UnitStats } from '../../../types';

interface Props {
  deadUnit: UnitStats;
}

const DeadUnit = ({ deadUnit }: Props) => {
  const isAllied = deadUnit.belongsTo === 'player';

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative flex flex-col items-center p-6 sm:p-8 w-[92%] max-w-sm rounded-sm border-2 backdrop-blur-2xl text-center select-none animate-in fade-in zoom-in-95 duration-200 z-50 ${
        isAllied
          ? 'border-emerald-500/80 bg-gradient-to-b from-[#042013]/95 via-zinc-950/95 to-black shadow-[0_0_55px_rgba(16,185,129,0.5)]'
          : 'border-rose-600/80 bg-gradient-to-b from-[#25060e]/95 via-zinc-950/95 to-black shadow-[0_0_55px_rgba(244,63,94,0.5)]'
      }`}
    >
      {/* Crystal Thorn Corner Accents */}
      <span className={`absolute -top-1 -left-1 text-xs font-serif ${isAllied ? 'text-emerald-400' : 'text-rose-400'}`}>✦</span>
      <span className={`absolute -top-1 -right-1 text-xs font-serif ${isAllied ? 'text-emerald-400' : 'text-rose-400'}`}>✦</span>
      <span className={`absolute -bottom-1 -left-1 text-xs font-serif ${isAllied ? 'text-emerald-400' : 'text-rose-400'}`}>✦</span>
      <span className={`absolute -bottom-1 -right-1 text-xs font-serif ${isAllied ? 'text-emerald-400' : 'text-rose-400'}`}>✦</span>

      <div className="mb-2">
        <span
          className={`px-3 py-0.5 rounded-sm text-[9.5px] font-cinzel font-black tracking-[0.2em] uppercase border shadow-md ${
            isAllied
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500 text-rose-200'
          }`}
        >
          ◈ CASUALTY REPORT ◈
        </span>
      </div>

      <h2
        className={`font-cinzel text-xl sm:text-2xl font-black uppercase tracking-wider mb-4 ${
          isAllied ? 'text-emerald-200' : 'text-rose-200'
        }`}
      >
        {deadUnit.name} VANQUISHED
      </h2>

      <div
        className={`relative p-1 border-2 bg-black shadow-2xl mb-3 ${
          isAllied ? 'border-emerald-500/60' : 'border-rose-500/60'
        }`}
      >
        <img
          className="w-36 h-36 sm:w-40 sm:h-40 object-cover object-top filter grayscale contrast-125 brightness-75"
          src={deadUnit.portrait || deadUnit.face}
          alt={deadUnit.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end justify-center pb-2">
          <span className="font-cinzel text-[10px] tracking-widest text-zinc-300 font-bold">
            DIVISION DESTROYED
          </span>
        </div>
      </div>

      <p className="text-xs text-zinc-400 font-serif italic max-w-xs leading-relaxed">
        “The division has collapsed under enemy onslaught.”
      </p>
    </div>
  );
};

export default DeadUnit;
