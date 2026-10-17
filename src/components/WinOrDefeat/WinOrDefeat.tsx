interface Props {
  text: string;
}

const WinOrDefeat = ({ text }: Props) => {
  const isVictory = text.toLowerCase().includes('won') || text.toLowerCase().includes('win');

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative flex flex-col items-center justify-center p-8 sm:p-12 w-[92%] max-w-xl rounded-sm border-2 backdrop-blur-2xl text-zinc-100 select-none animate-in fade-in zoom-in-95 duration-300 ${
        isVictory
          ? 'border-emerald-400 bg-gradient-to-b from-[#042416]/95 via-[#02140c]/95 to-[#010805]/95 shadow-[0_0_70px_rgba(16,185,129,0.7),inset_0_0_40px_rgba(5,150,105,0.45)] ring-2 ring-emerald-400/60'
          : 'border-rose-600 bg-gradient-to-b from-[#29050d]/95 via-[#140206]/95 to-[#080103]/95 shadow-[0_0_70px_rgba(225,29,72,0.7),inset_0_0_40px_rgba(159,18,57,0.45)] ring-2 ring-rose-500/60'
      }`}
    >
      {/* Corner Crystal Accents */}
      <span
        className={`absolute -top-1 -left-1 text-base font-serif ${
          isVictory ? 'text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]' : 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]'
        }`}
      >
        ✦
      </span>
      <span
        className={`absolute -top-1 -right-1 text-base font-serif ${
          isVictory ? 'text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]' : 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]'
        }`}
      >
        ✦
      </span>
      <span
        className={`absolute -bottom-1 -left-1 text-base font-serif ${
          isVictory ? 'text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]' : 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]'
        }`}
      >
        ✦
      </span>
      <span
        className={`absolute -bottom-1 -right-1 text-base font-serif ${
          isVictory ? 'text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]' : 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]'
        }`}
      >
        ✦
      </span>

      {/* Emblem Header */}
      <div className="mb-4">
        <span
          className={`px-4 py-1 rounded-sm text-xs font-cinzel font-black tracking-[0.25em] uppercase border shadow-lg ${
            isVictory
              ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.8)]'
              : 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.8)]'
          }`}
        >
          {isVictory ? 'DOMAIN LIBERATED' : 'CAMPAIGN COLLAPSED'}
        </span>
      </div>

      {/* Heroic Title */}
      <h1
        className={`font-cinzel text-3xl sm:text-4xl font-black text-center uppercase tracking-widest my-2 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] ${
          isVictory ? 'text-emerald-100' : 'text-rose-100'
        }`}
      >
        {isVictory ? 'CAMPAIGN CONQUERED' : 'BATTALION FALLEN'}
      </h1>

      {/* Atmospheric Lore Inscription */}
      <p className="text-sm sm:text-base text-zinc-300 font-serif italic text-center max-w-md my-4 leading-relaxed">
        {isVictory
          ? '“The dark corruption of An-Ylthin has been purged. Your ancestral legacy echoes eternally across the ancient woodlands.”'
          : '“Your legions have fallen before the horrors of the forest. Restless shadows reclaim the expedition grounds.”'}
      </p>

      {/* Restart Button */}
      <div className="mt-4 w-full sm:w-auto">
        <button
          type="button"
          onClick={handleRestart}
          className={`w-full sm:w-auto px-10 py-3 rounded-sm font-cinzel font-black text-xs sm:text-sm tracking-[0.2em] uppercase transition-all duration-300 shadow-xl ${
            isVictory
              ? 'bg-gradient-to-r from-emerald-950 via-emerald-800 to-emerald-950 border-2 border-emerald-400 text-emerald-100 hover:text-white hover:border-emerald-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.9)]'
              : 'bg-gradient-to-r from-rose-950 via-rose-800 to-rose-950 border-2 border-rose-500 text-rose-100 hover:text-white hover:border-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.9)]'
          }`}
        >
          {isVictory ? 'BEGIN NEW EXPEDITION' : 'RECLAIM FALLEN HONOR'}
        </button>
      </div>
    </div>
  );
};

export default WinOrDefeat;
