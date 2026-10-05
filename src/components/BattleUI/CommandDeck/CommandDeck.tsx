import { useContext, useState } from 'react';
import { BattleContext } from '../../../context/BattleContext';
import { useActionSound } from '../../../hooks';
import { useBattle } from '../../../features/components/BattleUI';
import { ActionName, Skill } from '../../../types';
import { defend, waitSkill } from '../../../data/Skills/Combat';
import SkillIcon from '../../SkillPreview/SkillIcon/SkillIcon';

const spellManaCosts: Record<string, number> = {
  'Combat: Attack': 0,
  'Combat: Clear Action': 0,
  'Combat: Defend': 0,
  'Combat: Wait': 0,
  'Dark Magic: Weakness': 2,
  'Dark Magic: Shatter Armor': 3,
  'Dark Magic: Breach Resistances': 3,
  'Dark Magic: Curse': 4,
  'Necromancy: Reanimate': 6,
  'Necromancy: Vampiric Lust': 6,
  'Destruction: Ice Spear': 7,
  'Destruction: Rain of Fire': 10,
};

interface GrimoireTooltipProps {
  skill: Skill;
  cost?: number;
  isAvailable: boolean;
  statusText?: string;
  promptText?: string;
  theme: {
    tooltipContainer: string;
    tooltipHeader: string;
    tooltipDivider: string;
    badge: string;
    tag: string;
    tooltipCost?: string;
    tooltipPrompt?: string;
  };
}

const GrimoireTooltip = ({
  skill,
  cost = 0,
  isAvailable,
  statusText,
  promptText = '◈ Click to Arm ◈',
  theme,
}: GrimoireTooltipProps) => {
  return (
    <div
      className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 w-72 sm:w-80 p-3.5 rounded-sm ${theme.tooltipContainer} z-[99999] pointer-events-none text-left animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl`}
    >
      {/* Ornate Grimoire Header */}
      <div
        className={`flex items-start justify-between pb-2 border-b ${theme.tooltipDivider} mb-2`}
      >
        <div>
          <h5
            className={`font-cinzel text-xs sm:text-sm font-black tracking-wide uppercase ${theme.tooltipHeader}`}
          >
            {skill.formattedName || skill.name}
          </h5>
          <span className="text-[8.5px] font-cinzel font-semibold text-zinc-400 block tracking-wider mt-0.5">
            {skill.schoolTier || theme.tag}
          </span>
        </div>
        <span
          className={`text-[8px] font-cinzel font-black px-1.5 py-0.5 rounded-sm border ${theme.badge} tracking-widest uppercase flex-shrink-0`}
        >
          {theme.tag}
        </span>
      </div>

      {/* Tactical Parameters Badges */}
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {skill.targetType && (
          <span className="px-1.5 py-0.5 bg-black/80 border border-zinc-700/80 text-zinc-300 text-[8.5px] font-mono rounded-xs">
            🎯 {skill.targetType}
          </span>
        )}
        <span
          className={`px-1.5 py-0.5 bg-black/80 border border-zinc-700/80 text-[8.5px] font-mono font-bold rounded-xs ${
            cost > 0 ? theme.tooltipCost : 'text-emerald-400'
          }`}
        >
          💧 {cost > 0 ? `${cost} Mana` : '0 Mana (Free)'}
        </span>
      </div>

      {/* Mechanical Rules */}
      <div className="text-[10.5px] text-zinc-200 font-serif leading-relaxed mb-2.5">
        {skill.mechanics || skill.description}
      </div>

      {/* Formula Box if available */}
      {skill.formula && (
        <div className="p-1.5 rounded-xs bg-black/70 border border-zinc-800/80 mb-2.5">
          <span className="text-[8px] font-cinzel text-zinc-400 font-bold uppercase tracking-wider block mb-0.5">
            ◈ Scaling Formula:
          </span>
          <pre className="text-[9px] font-mono text-amber-200/90 whitespace-pre-wrap leading-tight">
            {skill.formula}
          </pre>
        </div>
      )}

      {/* Lore Quote */}
      {skill.quote && (
        <p className="text-[9.5px] text-zinc-400 font-serif italic border-l-2 border-zinc-700/60 pl-2 py-0.5 mb-2.5 leading-normal">
          {skill.quote}
        </p>
      )}

      {/* Grimoire Footer Status */}
      <div
        className={`flex items-center justify-between pt-2 border-t ${theme.tooltipDivider} text-[9px] font-mono font-bold`}
      >
        <span className={isAvailable ? 'text-emerald-400' : 'text-rose-400'}>
          {statusText || (isAvailable ? '✓ Available to Cast' : '✕ Insufficient Mana')}
        </span>
        <span
          className={`font-cinzel text-[8px] uppercase tracking-wider ${theme.tooltipPrompt}`}
        >
          {promptText}
        </span>
      </div>
    </div>
  );
};

export const CommandDeck = () => {
  const { action, setAction, unitsInBoard, unitPosition, turn } =
    useContext(BattleContext);
  const { executeDefend, executeWait, executeAoEAction } = useBattle();

  const { playPreviewSound } = useActionSound();
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

  const currentActiveUnit = unitsInBoard[unitPosition];
  const isPlayerTurn =
    turn === 'player' || currentActiveUnit?.belongsTo === 'player';

  if (!isPlayerTurn || !currentActiveUnit) {
    return (
      <div className="w-[220px] h-[220px] rounded-full border-2 border-fuchsia-900/80 bg-gradient-to-b from-zinc-950 via-[#1b082c] to-black flex flex-col items-center justify-center text-center p-4 shadow-[0_0_30px_rgba(0,0,0,0.95)] select-none">
        <span className="w-3.5 h-3.5 rounded-full bg-rose-500 animate-ping mb-2.5" />
        <span className="font-cinzel text-xs font-black text-rose-300 uppercase tracking-widest drop-shadow">
          ENEMY TURN
        </span>
      </div>
    );
  }

  const handleSelectAction = (playerAction: ActionName) => {
    playPreviewSound();
    if (action === playerAction) {
      setAction('Combat: Clear Action');
    } else {
      setAction(playerAction);
    }
  };

  const getOrbTheme = (type: string, skillName?: string) => {
    if (skillName === 'Combat: Defend') {
      return {
        glow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.8)] hover:border-indigo-400',
        selected:
          'border-indigo-400 bg-gradient-to-b from-indigo-700 via-purple-950 to-black shadow-[0_0_25px_rgba(99,102,241,0.8)] ring-2 ring-indigo-400 scale-110',
        badge:
          'text-indigo-200 border-indigo-500/80 bg-indigo-950/90 shadow-[0_0_8px_rgba(99,102,241,0.6)]',
        tag: 'FORTIFICATION',
        tooltipContainer:
          'bg-gradient-to-b from-[#1e1b4b] via-[#0f0c29] to-[#04030f] border-2 border-indigo-500 shadow-[0_0_35px_rgba(99,102,241,0.8),inset_0_0_15px_rgba(79,70,229,0.4)]',
        tooltipHeader: 'text-indigo-100 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]',
        tooltipDivider: 'border-indigo-500/30',
        tooltipDesc: 'text-indigo-100/90',
        tooltipCost: 'text-indigo-300',
        tooltipPrompt: 'text-indigo-300',
      };
    }
    if (skillName === 'Combat: Wait') {
      return {
        glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.8)] hover:border-amber-300',
        selected:
          'border-amber-300 bg-gradient-to-b from-amber-700 via-yellow-950 to-black shadow-jewel-gold ring-2 ring-amber-400 scale-110',
        badge:
          'text-amber-200 border-amber-500/80 bg-amber-950/90 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
        tag: 'MANEUVER',
        tooltipContainer:
          'bg-gradient-to-b from-[#451a03] via-[#240e02] to-[#0a0301] border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.8),inset_0_0_15px_rgba(217,119,6,0.4)]',
        tooltipHeader: 'text-amber-100 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]',
        tooltipDivider: 'border-amber-500/30',
        tooltipDesc: 'text-amber-100/90',
        tooltipCost: 'text-amber-300',
        tooltipPrompt: 'text-amber-300',
      };
    }

    switch (type) {
      case 'Destruction':
        return {
          glow: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.8)] hover:border-orange-400',
          selected:
            'border-orange-400 bg-gradient-to-b from-orange-700 via-red-950 to-black shadow-[0_0_25px_rgba(249,115,22,0.8)] ring-2 ring-orange-400 scale-110',
          badge:
            'text-orange-200 border-orange-500/80 bg-orange-950/90 shadow-[0_0_8px_rgba(249,115,22,0.6)]',
          tag: 'DESTRUCTION',
          tooltipContainer:
            'bg-gradient-to-b from-[#450a0a] via-[#230404] to-[#0a0101] border-2 border-orange-500 shadow-[0_0_35px_rgba(249,115,22,0.8),inset_0_0_15px_rgba(239,68,68,0.4)]',
          tooltipHeader: 'text-orange-100 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]',
          tooltipDivider: 'border-orange-500/30',
          tooltipDesc: 'text-orange-100/90',
          tooltipCost: 'text-amber-300',
          tooltipPrompt: 'text-orange-300',
        };
      case 'Dark Magic':
        return {
          glow: 'hover:shadow-[0_0_20px_rgba(217,70,239,0.8)] hover:border-pink-300',
          selected:
            'border-pink-300 bg-gradient-to-b from-fuchsia-800 via-purple-950 to-black shadow-jewel-amethyst ring-2 ring-pink-400 scale-110',
          badge:
            'text-pink-200 border-pink-500/80 bg-purple-950/90 shadow-[0_0_8px_rgba(217,70,239,0.6)]',
          tag: 'DARK MAGIC',
          tooltipContainer:
            'bg-gradient-to-b from-[#3b0764] via-[#1d0733] to-[#08020e] border-2 border-fuchsia-400 shadow-[0_0_35px_rgba(217,70,239,0.8),inset_0_0_15px_rgba(168,85,247,0.4)]',
          tooltipHeader: 'text-pink-100 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]',
          tooltipDivider: 'border-fuchsia-500/30',
          tooltipDesc: 'text-pink-100/90',
          tooltipCost: 'text-purple-300',
          tooltipPrompt: 'text-pink-300',
        };
      case 'Necromancy':
        return {
          glow: 'hover:shadow-[0_0_20px_rgba(52,211,153,0.8)] hover:border-emerald-300',
          selected:
            'border-emerald-300 bg-gradient-to-b from-emerald-800 via-teal-950 to-black shadow-jewel-emerald ring-2 ring-emerald-400 scale-110',
          badge:
            'text-emerald-200 border-emerald-500/80 bg-emerald-950/90 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
          tag: 'NECROMANCY',
          tooltipContainer:
            'bg-gradient-to-b from-[#064e3b] via-[#032b21] to-[#01140e] border-2 border-emerald-400 shadow-[0_0_35px_rgba(52,211,153,0.8),inset_0_0_15px_rgba(16,185,129,0.4)]',
          tooltipHeader: 'text-emerald-100 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]',
          tooltipDivider: 'border-emerald-500/30',
          tooltipDesc: 'text-emerald-100/90',
          tooltipCost: 'text-emerald-300',
          tooltipPrompt: 'text-emerald-300',
        };
      default:
        return {
          glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.8)] hover:border-amber-300',
          selected:
            'border-amber-300 bg-gradient-to-b from-amber-700 via-yellow-950 to-black shadow-jewel-gold ring-2 ring-amber-400 scale-110',
          badge:
            'text-amber-200 border-amber-500/80 bg-amber-950/90 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
          tag: 'COMBAT',
          tooltipContainer:
            'bg-gradient-to-b from-[#451a03] via-[#240e02] to-[#0a0301] border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.8),inset_0_0_15px_rgba(217,119,6,0.4)]',
          tooltipHeader: 'text-amber-100 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]',
          tooltipDivider: 'border-amber-500/30',
          tooltipDesc: 'text-amber-100/90',
          tooltipCost: 'text-amber-300',
          tooltipPrompt: 'text-amber-300',
        };
    }
  };

  const availableSkills = currentActiveUnit.skills.filter(
    (s) => s.formattedName !== 'Clear Action'
  );

  const N = availableSkills.length;
  const radius = 74; // Orbital radius in px (+30% expansion)
  const center = 110; // Center of the 220x220 circle

  return (
    <div className="relative flex flex-col items-center select-none z-50">
      {/* HOMM V True Circular Medallion Disc with Crystal Thorn Magenta Facets */}
      <div className="relative w-[220px] h-[220px] rounded-full bg-gradient-to-b from-[#3b1359] via-[#1b082c] to-[#090214] border-4 border-fuchsia-500 shadow-[0_0_40px_rgba(217,70,239,0.7),inset_0_0_30px_rgba(147,51,234,0.8)] flex items-center justify-center">
        {/* Runic Filigree Pattern Background */}
        <div className="absolute inset-2 rounded-full border border-pink-400/40 border-dashed pointer-events-none" />
        <div className="absolute inset-4 rounded-full border border-pink-400/25 pointer-events-none" />

        {/* Center Commander Hub / Talisman */}
        <button
          type="button"
          onClick={() => setAction('Combat: Clear Action')}
          className="relative z-20 w-18 h-18 rounded-full bg-gradient-to-b from-[#4c1d95] via-[#2e1065] to-[#0f051d] border-2 border-pink-400 p-0.5 shadow-[0_0_22px_rgba(244,114,182,0.8)] flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform group"
          title="Click to cancel armed action"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-pink-400/80 mb-0.5 bg-black shadow-inner">
            <img
              src={currentActiveUnit.face}
              alt={currentActiveUnit.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <span className="text-[8.5px] font-mono font-bold text-pink-200 drop-shadow">
            {currentActiveUnit.magic} MP
          </span>
        </button>

        {/* Orbiting Satellite Spell Orbs (Radial Rosette) */}
        {availableSkills.map((skill, index) => {
          const isSelected = action === skill.name;
          const cost = spellManaCosts[skill.name] ?? 0;
          const hasEnoughMana = currentActiveUnit.magic >= cost;
          const theme = getOrbTheme(skill.type, skill.name);

          // Calculate exact polar position around the 220px circle
          const angle = -Math.PI / 2 + index * ((2 * Math.PI) / N);
          const x = center + radius * Math.cos(angle) - 22; // 22 is half of 44px orb
          const y = center + radius * Math.sin(angle) - 22;

          return (
            <div
              key={skill.name}
              className={`absolute ${
                hoveredSkill?.name === skill.name ? 'z-50' : 'z-30'
              }`}
              style={{ left: `${x}px`, top: `${y}px` }}
              onMouseEnter={() => setHoveredSkill(skill)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <button
                type="button"
                data-unstyled="true"
                disabled={!hasEnoughMana}
                onClick={() => handleSelectAction(skill.name as ActionName)}
                className={`relative w-11 h-11 rounded-full p-1.5 border-2 transition-all duration-300 flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? theme.selected
                    : hasEnoughMana
                    ? `bg-gradient-to-b from-[#3b1359] via-[#160626] to-[#07020d] border-fuchsia-500 ${theme.glow} hover:scale-110`
                    : 'bg-zinc-950 border-zinc-800 opacity-35 cursor-not-allowed filter grayscale'
                }`}
                title={skill.formattedName}
              >
                <SkillIcon skill={skill} className="w-6 h-6" />

                {/* Mana Pip on Orb */}
                {cost > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-[#0f051d] border border-pink-400 text-pink-200 text-[8px] font-mono font-bold rounded-full shadow">
                    {cost}
                  </span>
                )}
              </button>

              {/* School-Specific Rich HoMM V Grimoire Tooltip */}
              {hoveredSkill?.name === skill.name && (
                <GrimoireTooltip
                  skill={skill}
                  cost={cost}
                  isAvailable={hasEnoughMana}
                  theme={theme}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Tactical Stance Buttons (Defend & Wait) */}
      <div className="flex items-center gap-1.5 mt-2.5 w-full max-w-[220px] justify-center relative">
        {/* DEFEND BUTTON */}
        <div
          className="relative flex-1"
          onMouseEnter={() => setHoveredSkill(defend)}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          <button
            type="button"
            onClick={() => {
              playPreviewSound();
              setHoveredSkill(null);
              executeDefend();
            }}
            className="w-full flex items-center justify-center gap-1 px-2 py-1 rounded-sm bg-gradient-to-b from-[#1e1b4b] to-[#0a0820] border border-indigo-500/80 hover:border-indigo-300 text-indigo-200 hover:text-white font-cinzel text-[9px] font-black tracking-wider uppercase shadow-[0_0_12px_rgba(99,102,241,0.5)] transition-all hover:scale-105 cursor-pointer active:scale-95"
          >
            <span>🛡️</span>
            <span>DEFEND</span>
          </button>

          {/* Rich Tooltip for Defend */}
          {hoveredSkill?.name === 'Combat: Defend' && (
            <GrimoireTooltip
              skill={defend}
              cost={0}
              isAvailable={true}
              statusText="✓ Ready to Fortify"
              promptText="◈ Click to Defend ◈"
              theme={getOrbTheme('Combat', 'Combat: Defend')}
            />
          )}
        </div>

        {/* WAIT BUTTON */}
        <div
          className="relative flex-1"
          onMouseEnter={() => setHoveredSkill(waitSkill)}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          <button
            type="button"
            disabled={Boolean(currentActiveUnit?.hasWaited)}
            onClick={() => {
              playPreviewSound();
              setHoveredSkill(null);
              executeWait();
            }}
            className={`w-full flex items-center justify-center gap-1 px-2 py-1 rounded-sm font-cinzel text-[9px] font-black tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(245,158,11,0.5)] ${
              currentActiveUnit?.hasWaited
                ? 'bg-zinc-950 border border-zinc-800 text-zinc-600 cursor-not-allowed opacity-40'
                : 'bg-gradient-to-b from-[#451a03] to-[#120701] border border-amber-500/80 hover:border-amber-300 text-amber-200 hover:text-white hover:scale-105 cursor-pointer active:scale-95'
            }`}
          >
            <span>⏳</span>
            <span>WAIT</span>
          </button>

          {/* Rich Tooltip for Wait */}
          {hoveredSkill?.name === 'Combat: Wait' && (
            <GrimoireTooltip
              skill={waitSkill}
              cost={0}
              isAvailable={!currentActiveUnit?.hasWaited}
              statusText={
                currentActiveUnit?.hasWaited
                  ? '✕ Already Waited This Round'
                  : '✓ Ready to Delay Turn'
              }
              promptText="◈ Click to Delay Turn ◈"
              theme={getOrbTheme('Combat', 'Combat: Wait')}
            />
          )}
        </div>
      </div>

      {/* Dedicated AoE Launch Button for Rain of Fire */}
      {action === 'Destruction: Rain of Fire' && (
        <button
          type="button"
          onClick={() => {
            playPreviewSound();
            executeAoEAction();
          }}
          className="mt-2 w-full max-w-[220px] py-1.5 px-2 rounded-sm bg-gradient-to-r from-orange-700 via-red-600 to-amber-600 border-2 border-amber-300 text-amber-100 font-cinzel text-[9.5px] font-black tracking-widest uppercase shadow-[0_0_20px_rgba(249,115,22,0.9)] hover:scale-105 active:scale-95 cursor-pointer animate-pulse"
        >
          🔥 UNLEASH RAIN OF FIRE 🔥
        </button>
      )}

      {/* Armed Action Subtext */}
      {action !== 'Combat: Clear Action' && action !== 'Destruction: Rain of Fire' && (
        <div className="mt-1.5 px-3 py-1 crystal-thorn-badge text-center max-w-[220px]">
          <span className="font-cinzel text-[8.5px] font-bold text-pink-100 tracking-wider animate-pulse truncate block">
            ⚔ [{action.replace(/.*:\s*/, '')}] ARMED
          </span>
        </div>
      )}
    </div>
  );
};
