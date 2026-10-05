import { Skill } from '../../types';
import SkillIcon from './SkillIcon/SkillIcon';

interface Props {
  previewSkill: Skill;
  handleExitSkillPreview: () => void;
}

const SkillPreview = ({ previewSkill, handleExitSkillPreview }: Props) => {
  const isDestruction = previewSkill.type === 'Destruction';
  const isDarkMagic = previewSkill.type === 'Dark Magic';
  const isNecromancy = previewSkill.type === 'Necromancy';

  const themeClasses = isDestruction
    ? 'border-orange-500 shadow-[0_0_45px_rgba(249,115,22,0.6)] from-[#250d03] via-[#120601] to-black'
    : isDarkMagic
    ? 'border-fuchsia-500 shadow-[0_0_45px_rgba(217,70,239,0.6)] from-[#260527] via-[#120214] to-black'
    : isNecromancy
    ? 'border-emerald-500 shadow-[0_0_45px_rgba(16,185,129,0.6)] from-[#042013] via-[#021009] to-black'
    : 'border-amber-500 shadow-[0_0_45px_rgba(245,158,11,0.6)] from-[#251904] via-[#120c02] to-black';

  const cornerColor = isDestruction
    ? 'text-orange-400'
    : isDarkMagic
    ? 'text-fuchsia-400'
    : isNecromancy
    ? 'text-emerald-400'
    : 'text-amber-400';

  const titleColor = isDestruction
    ? 'text-orange-300'
    : isDarkMagic
    ? 'text-pink-300'
    : isNecromancy
    ? 'text-emerald-300'
    : 'text-amber-300';

  const badgeBorder = isDestruction
    ? 'border-orange-500/80 text-orange-200'
    : isDarkMagic
    ? 'border-fuchsia-500/80 text-pink-200'
    : isNecromancy
    ? 'border-emerald-500/80 text-emerald-200'
    : 'border-amber-500/80 text-amber-200';

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative flex flex-col items-center justify-between w-[92%] max-w-md p-6 rounded-sm border-2 bg-gradient-to-b ${themeClasses} backdrop-blur-2xl text-zinc-100 select-none animate-in fade-in zoom-in-95 duration-200 z-50`}
    >
      {/* Crystal Thorn Corner Accents */}
      <span className={`absolute -top-1 -left-1 text-xs font-serif ${cornerColor}`}>✦</span>
      <span className={`absolute -top-1 -right-1 text-xs font-serif ${cornerColor}`}>✦</span>
      <span className={`absolute -bottom-1 -left-1 text-xs font-serif ${cornerColor}`}>✦</span>
      <span className={`absolute -bottom-1 -right-1 text-xs font-serif ${cornerColor}`}>✦</span>

      {/* School & Tier Header */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`px-3 py-0.5 rounded-sm bg-black/80 border ${badgeBorder} text-[10px] font-cinzel font-black tracking-widest uppercase shadow-md`}
        >
          ✦ {previewSkill.schoolTier || previewSkill.type || 'Incantation'} ✦
        </span>
      </div>

      {/* Skill Icon Chamber */}
      <div className="relative p-2.5 rounded-full border-2 border-zinc-700 bg-black/90 shadow-[0_0_20px_rgba(0,0,0,0.8)] my-2">
        <SkillIcon skill={previewSkill} className="w-14 h-14" />
      </div>

      {/* Skill Name */}
      <h3
        className={`font-cinzel text-base sm:text-xl font-black tracking-wide text-center uppercase my-1 drop-shadow-md ${titleColor}`}
      >
        {previewSkill.formattedName || previewSkill.name}
      </h3>

      {/* Tactical Badges Row */}
      <div className="flex items-center gap-2 my-2">
        {previewSkill.targetType && (
          <span className="px-2 py-0.5 bg-black/70 border border-zinc-700 text-zinc-300 text-[10px] font-mono rounded-xs">
            🎯 {previewSkill.targetType}
          </span>
        )}
        <span className="px-2 py-0.5 bg-black/70 border border-zinc-700 text-amber-300 text-[10px] font-mono font-bold rounded-xs">
          💧 {previewSkill.manaCost !== undefined && previewSkill.manaCost > 0 ? `${previewSkill.manaCost} Mana` : '0 Mana'}
        </span>
      </div>

      {/* Mechanical Breakdown */}
      <div className="w-full my-3 px-3 py-2.5 rounded-xs bg-black/60 border border-zinc-800 text-left">
        <span className="text-[9px] font-cinzel text-zinc-400 font-bold uppercase tracking-wider block mb-1">
          ◈ Tactical Effect:
        </span>
        <p className="text-xs text-zinc-200 font-serif leading-relaxed">
          {previewSkill.mechanics || previewSkill.description}
        </p>

        {previewSkill.formula && (
          <div className="mt-2.5 pt-2 border-t border-zinc-800/80">
            <span className="text-[8.5px] font-cinzel text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">
              ◈ Scaling Formula:
            </span>
            <pre className="text-[10px] font-mono text-amber-200/90 whitespace-pre-wrap leading-tight">
              {previewSkill.formula}
            </pre>
          </div>
        )}
      </div>

      {/* Lore Quote */}
      {previewSkill.quote && (
        <p className="text-[11px] text-zinc-400 font-serif italic text-center leading-relaxed max-w-sm my-1 px-3">
          {previewSkill.quote}
        </p>
      )}

      {/* Dismiss Button */}
      <button
        type="button"
        onClick={handleExitSkillPreview}
        className="mt-3 w-full px-6 py-2 rounded-sm bg-black/80 hover:bg-zinc-900 border border-zinc-600 hover:border-zinc-400 text-zinc-200 hover:text-white font-cinzel font-bold text-xs tracking-widest uppercase transition-all shadow-md"
      >
        ✕ Close Codex
      </button>
    </div>
  );
};

export default SkillPreview;
