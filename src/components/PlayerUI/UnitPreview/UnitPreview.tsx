import { DarkBackgroundWrapper } from '../../DarkBackgroundWrapper';
import { UnitStats } from '../../../types';
import { useSkillPreview } from '../../../features/SkillPreview';
import { SkillPreview } from '../../SkillPreview';
import damageIcon from '../../../assets/images/stats/damage.png';
import armorIcon from '../../../assets/images/stats/armor.png';
import hourglassIcon from '../../../assets/images/stats/hourglass.png';
import healthIcon from '../../../assets/images/stats/health.png';
import SkillIcon from '../../SkillPreview/SkillIcon/SkillIcon';

interface Props {
  previewUnit: UnitStats;
  handleExitUnitPreview: () => void;
}

const UnitPreview = ({ previewUnit, handleExitUnitPreview }: Props) => {
  const { previewSkill, handleSkillPreview, handleExitSkillPreview } =
    useSkillPreview();

  const isEnemy = previewUnit.belongsTo === 'enemy';
  const isAllied = previewUnit.belongsTo === 'player' || !isEnemy;

  const maxHp = previewUnit.health * (previewUnit.maxStack || 1);
  const currentTotalHp = Math.max(
    0,
    previewUnit.updatedHealth !== undefined
      ? Math.ceil(previewUnit.updatedHealth)
      : previewUnit.health * (previewUnit.stack || 1)
  );

  return (
    <div
      className={`relative w-full max-w-lg mx-auto rounded-sm p-4 sm:p-6 select-none font-outfit text-zinc-100 z-50 backdrop-blur-2xl transition-all duration-300 ${
        isEnemy
          ? 'border-2 border-rose-600 bg-gradient-to-b from-[#25060e]/95 via-[#130307]/95 to-[#080103]/95 shadow-[0_0_55px_rgba(225,29,72,0.6),inset_0_0_35px_rgba(159,18,57,0.45)] ring-1 ring-rose-500/50'
          : 'border-2 border-emerald-500 bg-gradient-to-b from-[#042214]/95 via-[#02130b]/95 to-[#010805]/95 shadow-[0_0_55px_rgba(16,185,129,0.55),inset_0_0_35px_rgba(5,150,105,0.4)] ring-1 ring-emerald-400/50'
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Faceted Corner Crystal Thorn Accents */}
      <span
        className={`absolute -top-1 -left-1 text-sm font-serif ${
          isEnemy ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]' : 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]'
        }`}
      >
        ✦
      </span>
      <span
        className={`absolute -top-1 -right-1 text-sm font-serif ${
          isEnemy ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]' : 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]'
        }`}
      >
        ✦
      </span>
      <span
        className={`absolute -bottom-1 -left-1 text-sm font-serif ${
          isEnemy ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]' : 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]'
        }`}
      >
        ✦
      </span>
      <span
        className={`absolute -bottom-1 -right-1 text-sm font-serif ${
          isEnemy ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]' : 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]'
        }`}
      >
        ✦
      </span>

      {/* Faction Alignment Header Badge */}
      <div className="flex items-center justify-center mb-3">
        <span
          className={`px-3 py-0.5 rounded-sm text-[10px] font-cinzel font-black tracking-[0.2em] uppercase border shadow-lg ${
            isEnemy
              ? 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.7)]'
              : 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.7)]'
          }`}
        >
          {isEnemy ? '⚔ HOSTILE ENEMY DIVISION ⚔' : '🛡 ALLIED PLAYER DIVISION 🛡'}
        </span>
      </div>

      {/* Main Unit Header: Portrait + Identity */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pb-3 border-b border-zinc-800">
        {/* Grand Portrait Chamber */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 p-1 bg-black ${
              isEnemy
                ? 'border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.7)]'
                : 'border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.7)]'
            }`}
          >
            <img
              src={previewUnit.face || previewUnit.portrait}
              alt={previewUnit.name}
              className="w-full h-full object-cover object-top rounded-full filter brightness-105 contrast-110"
            />
          </div>

          {/* Troop Count Stack Badge */}
          {previewUnit.type !== 'Hero' && previewUnit.stack > 0 && (
            <span
              className={`absolute bottom-0 right-0 px-2 py-0.5 rounded text-[11px] font-mono font-black border shadow-lg ${
                isEnemy
                  ? 'bg-rose-950 text-rose-200 border-rose-500'
                  : 'bg-emerald-950 text-emerald-200 border-emerald-400'
              }`}
            >
              {Math.ceil(previewUnit.stack)}x
            </span>
          )}
        </div>

        {/* Identity & Rank */}
        <div className="flex-1 text-center sm:text-left space-y-1">
          <h2 className="font-cinzel text-lg sm:text-xl font-black text-white tracking-wide drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            {previewUnit.name}
          </h2>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded-sm bg-zinc-900 border border-zinc-700 text-zinc-300">
              {previewUnit.type === 'Hero' ? '👑 Hero Commander' : `Tier ${previewUnit.level || 1} ${previewUnit.type || 'Unit'}`}
            </span>

            {previewUnit.spellpower !== undefined && (
              <span className="px-2 py-0.5 rounded-sm bg-purple-950/80 border border-purple-500/80 text-pink-300">
                🔮 Spellpower: {previewUnit.spellpower}
              </span>
            )}
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1 justify-center sm:justify-start text-[9px] font-bold">
            {previewUnit.cursed && (
              <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-400 text-purple-200 shadow-[0_0_8px_rgba(192,132,252,0.6)]">
                ☠ Cursed (0 DMG next hit)
              </span>
            )}
            {previewUnit.vampiricHeal && (
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-400 text-emerald-200 shadow-[0_0_8px_rgba(52,211,153,0.6)]">
                🩸 Vampiric Lust (60% Life Drain)
              </span>
            )}
            {previewUnit.magicResistance < 0 && (
              <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-400 text-rose-200 shadow-[0_0_8px_rgba(251,113,133,0.6)]">
                ⚡ Breached Magic Resistance
              </span>
            )}
            {previewUnit.weaknessDamage < 1 && (
              <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-400 text-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.6)]">
                🌀 Weakened Attack Output
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Combat Attributes Reliquary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4 text-xs font-mono">
        {/* Health */}
        <div className="flex flex-col items-center p-2 rounded-sm bg-black/60 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-rose-300 mb-0.5">
            <img src={healthIcon} alt="HP" className="w-4 h-4 object-contain" />
            <span className="text-[10px] font-bold uppercase">Vitality</span>
          </div>
          <span className="font-bold text-white text-xs">
            {currentTotalHp} <span className="text-[10px] text-zinc-400">/ {maxHp}</span>
          </span>
          <span className="text-[9px] text-zinc-500">
            ({previewUnit.health} HP/unit)
          </span>
        </div>

        {/* Attack */}
        <div className="flex flex-col items-center p-2 rounded-sm bg-black/60 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-amber-300 mb-0.5">
            <img src={damageIcon} alt="ATK" className="w-4 h-4 object-contain" />
            <span className="text-[10px] font-bold uppercase">Attack</span>
          </div>
          <span className="font-bold text-white text-xs">
            {previewUnit.updatedDamage !== undefined
              ? previewUnit.updatedDamage.toFixed(0)
              : previewUnit.damage}{' '}
            <span className="text-[10px] text-zinc-400">DMG</span>
          </span>
          <span className="text-[9px] text-zinc-500">
            (Base: {previewUnit.damage})
          </span>
        </div>

        {/* Armor */}
        <div className="flex flex-col items-center p-2 rounded-sm bg-black/60 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-pink-300 mb-0.5">
            <img src={armorIcon} alt="ARM" className="w-4 h-4 object-contain" />
            <span className="text-[10px] font-bold uppercase">Armor</span>
          </div>
          <span className="font-bold text-white text-xs">
            {previewUnit.armor}{' '}
            <span className="text-[10px] text-zinc-400">ARM</span>
          </span>
          <span className="text-[9px] text-zinc-500">
            (-{Math.min(100, Math.round(previewUnit.armor * 10))}% Phys DMG)
          </span>
        </div>

        {/* Initiative */}
        <div className="flex flex-col items-center p-2 rounded-sm bg-black/60 border border-zinc-800">
          <div className="flex items-center gap-1.5 text-purple-300 mb-0.5">
            <img
              src={hourglassIcon}
              alt="INIT"
              className="w-4 h-4 object-contain"
            />
            <span className="text-[10px] font-bold uppercase">Initiative</span>
          </div>
          <span className="font-bold text-white text-xs">
            {previewUnit.initiative}{' '}
            <span className="text-[10px] text-zinc-400">SPD</span>
          </span>
          <span className="text-[9px] text-zinc-500">Turn Priority</span>
        </div>
      </div>

      {/* Secondary Stats Row: Mana & Magic Resistance */}
      <div className="flex flex-wrap justify-between gap-2 px-3 py-2 rounded-sm bg-black/40 border border-zinc-800/80 text-[10px] font-mono text-zinc-300 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-fuchsia-400 font-bold">✦ MANA RESERVE:</span>
          <span className="text-white font-bold">
            {previewUnit.magic || 0} / {previewUnit.maxMagic || 0} MP
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-indigo-400 font-bold">⚡ MAGIC RESISTANCE:</span>
          <span className="text-white font-bold">
            {previewUnit.magicResistance}
          </span>
        </div>
      </div>

      {/* Memorized Grimoire Spells & Combat Abilities */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-cinzel font-black tracking-widest text-zinc-300 uppercase">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-700" />
          <span>Memorized Spells & Skills</span>
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-700" />
        </div>

        <div className="flex flex-wrap gap-2.5 items-center justify-center pt-1">
          {previewUnit.skills &&
            previewUnit.skills.map((skill) => {
              if (skill.formattedName === 'Clear Action') return null;
              return (
                <div
                  key={skill.name}
                  onClick={() => handleSkillPreview(skill)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm bg-black/60 hover:bg-black/90 border border-zinc-700 hover:border-pink-400 transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_12px_rgba(244,114,182,0.5)]"
                >
                  <SkillIcon
                    skill={skill}
                    className="w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform"
                  />
                  <div className="text-left">
                    <p className="text-[10.5px] font-bold text-zinc-200 group-hover:text-pink-200 leading-tight">
                      {skill.formattedName}
                    </p>
                    <p className="text-[8.5px] font-mono text-zinc-400">
                      {skill.type}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Nested Skill Preview Modal */}
      {typeof previewSkill !== 'string' && (
        <DarkBackgroundWrapper onClose={handleExitSkillPreview}>
          <SkillPreview
            handleExitSkillPreview={handleExitSkillPreview}
            previewSkill={previewSkill}
          />
        </DarkBackgroundWrapper>
      )}

      {/* Codex Dismiss Button */}
      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={handleExitUnitPreview}
          className={`w-full sm:w-auto px-8 py-2 rounded-sm font-cinzel font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-lg ${
            isEnemy
              ? 'bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 border border-rose-500 text-rose-200 hover:text-white hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.8)]'
              : 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-emerald-500 text-emerald-200 hover:text-white hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.8)]'
          }`}
        >
          ✕ CLOSE CODEX
        </button>
      </div>
    </div>
  );
};

export default UnitPreview;
