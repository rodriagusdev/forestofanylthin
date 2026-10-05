import { useContext, useState } from 'react';
import { UnitStats } from '../../types';
import { BattleContext } from '../../context/BattleContext';
import { useBattle } from '../../features/components/BattleUI';
import { calculateCombatForecast } from '../../helpers/combat/damageCalculations';

interface Props {
  unit: UnitStats;
}

export const Unit = ({ unit }: Props) => {
  const { selectUnit } = useBattle();
  const {
    action,
    turn,
    unitsInBoard,
    unitPosition,
    setMagicUsedInTurn,
    isDamaging,
    targetUnit,
    handleUnitPreview,
    hoveredUnitId,
    setHoveredUnitId,
    floatingTexts,
  } = useContext(BattleContext);

  const [hoverEffect, setHoverEffect] = useState(false);

  const activeUnit = unitsInBoard[unitPosition] || unitsInBoard[0];
  const isPlayerTurn =
    turn === 'player' ||
    (activeUnit?.belongsTo === 'player' && (!turn || !turn.startsWith('enemy')));
  const isAllied = unit.belongsTo === 'player';
  const isCurrentlyPlaying = activeUnit?.id === unit.id;
  const isQueueFocused = hoveredUnitId === unit.id;
  const turnIndex = unitsInBoard.findIndex((u) => u.id === unit.id);
  const unitFloatingTexts = floatingTexts.filter((f) => f.unitId === unit.id);

  const isTargetable =
    isPlayerTurn &&
    action !== 'Combat: Clear Action' &&
    ((unit.belongsTo === 'enemy' &&
      action !== 'Necromancy: Reanimate' &&
      action !== 'Necromancy: Vampiric Lust') ||
      (unit.belongsTo === 'player' &&
        (action === 'Necromancy: Reanimate' ||
          action === 'Necromancy: Vampiric Lust')));

  const handleActionRequirement = () => {
    const spellsCost: Record<string, number> = {
      'Combat: Attack': 0,
      'Combat: Clear Action': 0,
      'Dark Magic: Curse': 4,
      'Dark Magic: Weakness': 2,
      'Dark Magic: Shatter Armor': 3,
      'Dark Magic: Breach Resistances': 3,
      'Destruction: Rain of Fire': 10,
      'Destruction: Ice Spear': 7,
      'Necromancy: Reanimate': 6,
      'Necromancy: Vampiric Lust': 6,
    };

    const playingUnitMagic = activeUnit?.magic ?? 0;
    const cost = spellsCost[action] ?? 0;

    if (playingUnitMagic >= cost) {
      setMagicUsedInTurn(cost);
      selectUnit(unit);
    }
  };

  const handleSelectUnit = () => {
    if (isPlayerTurn && isAllied) {
      if (
        action === 'Necromancy: Reanimate' ||
        action === 'Necromancy: Vampiric Lust'
      ) {
        if (activeUnit?.magic >= 6) {
          setMagicUsedInTurn(6);
          selectUnit(unit);
          return;
        }
      }
    }

    if (
      action !== 'Combat: Clear Action' &&
      action !== 'Necromancy: Reanimate' &&
      action !== 'Necromancy: Vampiric Lust' &&
      isPlayerTurn &&
      unit.belongsTo === 'enemy'
    ) {
      handleActionRequirement();
      return;
    }

    // Default fallback: open unit preview if not performing targeted action
    handleUnitPreview(unit);
  };

  const handleCardClick = () => {
    if (isTargetable) {
      handleSelectUnit();
    } else {
      handleUnitPreview(unit);
    }
  };

  const maxHp = unit.health * unit.maxStack;
  const hpPct =
    maxHp > 0
      ? Math.max(0, Math.min(100, (unit.updatedHealth / maxHp) * 100))
      : 0;
  const manaPct =
    unit.maxMagic > 0
      ? Math.max(0, Math.min(100, (unit.magic / unit.maxMagic) * 100))
      : 0;

  // Calculate combat forecast on hover if player has an action armed
  const combatForecast =
    isTargetable && activeUnit && hoverEffect
      ? calculateCombatForecast(activeUnit, unit, action)
      : null;

  return (
    <article
      onClick={handleCardClick}
      onMouseEnter={() => {
        setHoverEffect(true);
        setHoveredUnitId(unit.id);
      }}
      onMouseLeave={() => {
        setHoverEffect(false);
        setHoveredUnitId(null);
      }}
      className={`relative w-[155px] sm:w-[175px] md:w-[190px] p-1.5 sm:p-2 rounded-sm border-2 transition-all duration-300 select-none flex flex-col justify-between flex-shrink-0 velvet-reliquary-card cursor-pointer ${
        isCurrentlyPlaying
          ? 'border-fuchsia-400 bg-gradient-to-b from-[#3b1359] via-[#1b082c] to-[#0a0312] shadow-[0_0_35px_rgba(236,72,153,0.7),inset_0_0_25px_rgba(168,85,247,0.7)] ring-2 ring-pink-400 -translate-y-1.5 z-20'
          : isQueueFocused
          ? 'border-pink-300 ring-2 ring-pink-400 shadow-[0_0_35px_rgba(244,114,182,0.95)] scale-[1.03] z-30 animate-ethereal-beacon'
          : isTargetable
          ? 'border-pink-400 shadow-jewel-amethyst cursor-crosshair ring-2 ring-fuchsia-500/80 animate-pulse'
          : isAllied
          ? 'border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.35)] hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.65)] ring-1 ring-emerald-500/30'
          : 'border-rose-600/80 shadow-[0_0_15px_rgba(244,63,94,0.35)] hover:border-rose-400 hover:shadow-[0_0_25px_rgba(244,63,94,0.65)] ring-1 ring-rose-500/30'
      }`}
    >
      {/* Crystal Thorn Gem Faceted Corners with Faction Tinting */}
      <span
        className={`absolute -top-1 -left-1 text-[9px] font-serif ${
          isCurrentlyPlaying || isQueueFocused
            ? 'text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.9)]'
            : isAllied
            ? 'text-emerald-400/90 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]'
            : 'text-rose-400/90 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]'
        }`}
      >
        ✦
      </span>
      <span
        className={`absolute -top-1 -right-1 text-[9px] font-serif ${
          isCurrentlyPlaying || isQueueFocused
            ? 'text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.9)]'
            : isAllied
            ? 'text-emerald-400/90 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]'
            : 'text-rose-400/90 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]'
        }`}
      >
        ✦
      </span>
      <span
        className={`absolute -bottom-1 -left-1 text-[9px] font-serif ${
          isCurrentlyPlaying || isQueueFocused
            ? 'text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.9)]'
            : isAllied
            ? 'text-emerald-400/90 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]'
            : 'text-rose-400/90 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]'
        }`}
      >
        ✦
      </span>
      <span
        className={`absolute -bottom-1 -right-1 text-[9px] font-serif ${
          isCurrentlyPlaying || isQueueFocused
            ? 'text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.9)]'
            : isAllied
            ? 'text-emerald-400/90 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]'
            : 'text-rose-400/90 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]'
        }`}
      >
        ✦
      </span>

      {/* Turn Table Link Forecast Banner */}
      {isQueueFocused && !isCurrentlyPlaying && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.2 rounded-sm bg-gradient-to-r from-purple-950 via-pink-900 to-purple-950 border border-pink-400 text-pink-100 text-[8px] font-cinzel font-black tracking-widest uppercase shadow-[0_0_15px_rgba(244,114,182,0.9)] z-30 whitespace-nowrap animate-pulse">
          ✦ TURN #{turnIndex !== -1 ? turnIndex + 1 : '?'} IN QUEUE ✦
        </div>
      )}

      {/* Target Crosshair Banner (Crystal Thorn Badge) */}
      {isTargetable && !isQueueFocused && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.2 crystal-thorn-badge text-pink-100 text-[8px] font-cinzel font-black tracking-widest uppercase rounded-sm shadow-[0_0_18px_rgba(244,114,182,0.9)] z-30 whitespace-nowrap animate-pulse">
          ⚔ ENGAGE TARGET ⚔
        </div>
      )}

      {/* Floating Combat Numbers & Dynamic Status Popups */}
      {unitFloatingTexts.map((f) => {
        const isDamage = f.type === 'damage' || f.type === 'crit';
        const isHeal = f.type === 'heal';
        const isCounter = f.type === 'counter';
        const isCurse = f.type === 'curse';

        const badgeBg = isHeal
          ? 'bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border-emerald-400 text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,1)]'
          : isCounter
          ? 'bg-gradient-to-r from-purple-950 via-pink-900 to-purple-950 border-pink-400 text-pink-100 shadow-[0_0_25px_rgba(236,72,153,1)]'
          : isCurse
          ? 'bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 border-purple-400 text-purple-200 shadow-[0_0_25px_rgba(168,85,247,1)]'
          : isDamage
          ? 'bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-rose-400 text-rose-100 shadow-[0_0_25px_rgba(244,63,94,1)]'
          : 'bg-gradient-to-r from-amber-950 via-yellow-900 to-amber-950 border-amber-400 text-amber-100 shadow-[0_0_25px_rgba(245,158,11,1)]';

        return (
          <div
            key={f.id}
            className="absolute top-1/3 left-1/2 pointer-events-none z-50 animate-combat-number flex flex-col items-center whitespace-nowrap"
          >
            <div
              className={`px-2.5 py-1 rounded-sm border-2 font-cinzel font-black text-xs sm:text-sm tracking-wider uppercase drop-shadow-lg ${badgeBg}`}
            >
              {f.text}
            </div>
            {f.subtext && (
              <span className="text-[8px] font-mono font-bold text-zinc-200 drop-shadow mt-0.5 px-1.5 py-0.2 bg-black/90 rounded border border-zinc-700">
                {f.subtext}
              </span>
            )}
          </div>
        );
      })}

      {/* Floating Combat Strike Number / Impact Particle */}
      {isDamaging && targetUnit?.id === unit.id && unitFloatingTexts.length === 0 && (
        <div className="absolute top-1/2 left-1/2 pointer-events-none z-40 animate-combat-number">
          <div className="px-2.5 py-0.5 rounded-sm bg-gradient-to-r from-rose-950 via-pink-900 to-rose-950 border-2 border-pink-400 text-pink-100 font-cinzel font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(244,63,94,1)] whitespace-nowrap">
            💥 STRIKE!
          </div>
        </div>
      )}

      {/* Large Grand Portrait Chamber (-10% height) */}
      <div
        className={`relative h-[135px] sm:h-[155px] md:h-[170px] w-full overflow-hidden border-2 ${isCurrentlyPlaying
          ? 'border-fuchsia-400 shadow-[0_0_20px_rgba(236,72,153,0.5)]'
          : isAllied
            ? 'border-emerald-600/80 group-hover:border-emerald-400'
            : 'border-rose-700/80 group-hover:border-rose-400'
          } bg-black cursor-pointer group rounded-xs shadow-inner`}
        onMouseEnter={() => setHoverEffect(true)}
        onMouseLeave={() => setHoverEffect(false)}
      >
        <img
          className="object-cover h-full w-full object-top filter brightness-95 contrast-105 group-hover:scale-110 transition-transform duration-500"
          src={unit.portrait}
          alt={unit.name}
        />

        {/* Heraldic Stack Multiplier Ribbon */}
        {unit.type !== 'Hero' && (
          <div
            className={`absolute top-1.5 left-1.5 px-1.5 py-0.2 text-[18px] font-mono font-black shadow-md rounded-sm flex items-center gap-1 border ${isAllied
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500'
              : 'bg-rose-950/90 text-rose-200 border-rose-500'
              }`}
          >
            <span>{Math.ceil(unit.stack)}</span>
          </div>
        )}

        {/* Active Turn Seal in Crystal Thorn Styling */}
        {isCurrentlyPlaying && (
          <span className="absolute top-1.5 right-1.5 px-1.5 py-0.2 crystal-thorn-badge text-pink-100 text-[8px] font-cinzel font-black tracking-widest uppercase rounded-sm shadow-[0_0_12px_rgba(244,114,182,0.8)]">
            ACTIVE
          </span>
        )}

        {/* Info / Inspect Button - Opens Unit Description Modal */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleUnitPreview(unit);
          }}
          className={`absolute bottom-1.5 right-1.5 w-4.5 h-4.5 rounded-full border text-[9px] font-bold flex items-center justify-center transition-all z-20 shadow-md ${isAllied
            ? 'bg-emerald-950/90 hover:bg-emerald-600 border-emerald-400/80 text-emerald-200 hover:text-white'
            : 'bg-rose-950/90 hover:bg-rose-600 border-rose-400/80 text-rose-200 hover:text-white'
            }`}
          title="Inspect unit codex"
        >
          i
        </button>

        {/* Status Overlay Badges with Jeweled Contrast Glows */}
        <div className="absolute bottom-1.5 left-1.5 flex flex-wrap gap-0.5 max-w-[85%] z-20">
          {unit.defending && (
            <span className="px-1 py-0.2 rounded-xs bg-indigo-950/95 border border-indigo-400 text-indigo-200 text-[7.5px] font-bold shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse">
              🛡️ Guard (+3)
            </span>
          )}
          {unit.hasWaited && (
            <span className="px-1 py-0.2 rounded-xs bg-amber-950/95 border border-amber-500/80 text-amber-200 text-[7.5px] font-bold shadow-jewel-gold">
              ⏳ Waited
            </span>
          )}
          {unit.cursed && (
            <span className="px-1 py-0.2 rounded-xs bg-purple-950/95 border border-purple-400 text-purple-200 text-[7.5px] font-bold shadow-jewel-amethyst">
              ☠ Cursed
            </span>
          )}
          {unit.vampiricHeal && (
            <span className="px-1 py-0.2 rounded-xs bg-emerald-950/95 border border-emerald-400 text-emerald-200 text-[7.5px] font-bold shadow-jewel-emerald">
              🩸 Drain
            </span>
          )}
          {unit.magicResistance < 0 && (
            <span className="px-1 py-0.2 rounded-xs bg-rose-950/95 border border-rose-400 text-rose-200 text-[7.5px] font-bold shadow-jewel-ruby">
              ⚡ Breached
            </span>
          )}
          {unit.weaknessDamage < 1 && (
            <span className="px-1 py-0.2 rounded-xs bg-amber-950/95 border border-amber-400 text-amber-200 text-[7.5px] font-bold shadow-jewel-gold">
              🌀 Weak
            </span>
          )}
          {unit.isRanged && (
            <span className="px-1 py-0.2 rounded-xs bg-amber-950/95 border border-amber-400 text-amber-200 text-[7.5px] font-bold shadow-jewel-gold">
              🏹 Ranged
            </span>
          )}
          {unit.hasRetaliated && (
            <span className="px-1 py-0.2 rounded-xs bg-zinc-950/95 border border-zinc-700 text-zinc-400 text-[7.5px] font-bold shadow-inner">
              ⚔ Spent Counter
            </span>
          )}
        </div>

        {/* Interactive Tactical Casualties / Combat Prediction Banner on Hover */}
        {combatForecast && (
          <div className="absolute inset-x-0 bottom-0 py-1 px-1.5 bg-gradient-to-t from-black via-rose-950/95 to-transparent border-t border-pink-500/80 text-center z-30 animate-in fade-in zoom-in-95 duration-100">
            {combatForecast.isFatal ? (
              <div className="text-[9px] font-cinzel font-black text-pink-200 uppercase tracking-wider drop-shadow animate-pulse">
                ☠ FATAL STRIKE! (~{Math.ceil(unit.stack)} KILLS)
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-0.5 text-[8.5px] font-mono font-bold text-pink-200">
                <div className="flex items-center gap-1">
                  {activeUnit?.cursed && action === 'Combat: Attack' ? (
                    <span className="text-purple-300 font-black">
                      ☠ Curse Absorbs (0 DMG)
                    </span>
                  ) : combatForecast.projectedKills > 0 ? (
                    <>
                      <span className="text-rose-400">☠ Kills:</span>
                      <span className="text-white font-black">
                        ~{combatForecast.projectedKills} Troops
                      </span>
                      <span className="text-pink-300 text-[7.5px]">
                        ({combatForecast.projectedDamage} DMG)
                      </span>
                    </>
                  ) : (
                    <span>{combatForecast.effectLabel}</span>
                  )}
                </div>
                {!unit.hasRetaliated && action === 'Combat: Attack' && (
                  activeUnit?.isRanged && !unit.isRanged ? (
                    <span className="text-[7.5px] text-emerald-300 font-cinzel font-black">
                      🛡️ SAFE: TARGET CANNOT COUNTER (RANGED)
                    </span>
                  ) : (
                    <span className="text-[7.5px] text-amber-300 font-cinzel font-black">
                      ⚡ TARGET WILL COUNTER-ATTACK
                    </span>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Unit Title */}
      <div className="mt-1 text-center">
        <h4 className="font-cinzel text-[11px] sm:text-xs font-black text-white tracking-wide truncate drop-shadow-[0_0_10px_rgba(244,114,182,0.6)]">
          {unit.name}
        </h4>
      </div>

      {/* Streamlined Jeweled Vitality & Mana Meters (Uniform Height) */}
      <div className="mt-0.5 space-y-0.5">
        {/* Health Bar with Blood Ruby & Rose Luminous Glow */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-[7.5px] sm:text-[8.5px] font-mono text-zinc-300">
            <span className="text-rose-300 font-bold flex items-center gap-0.5 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]">
              ❤ VITALITY
            </span>
            <span className="text-pink-300 font-black drop-shadow-[0_0_6px_rgba(244,114,182,0.6)]">
              {Math.max(0, Math.ceil(unit.updatedHealth))} / {maxHp}
            </span>
          </div>
          <div className="w-full h-1.5 bg-black rounded-full border border-fuchsia-900/80 p-[0.5px] shadow-[inset_0_0_8px_rgba(0,0,0,0.9)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-700 via-pink-500 to-fuchsia-400 transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.9)]"
              style={{ width: `${hpPct}%` }}
            />
          </div>
        </div>

        {/* Mana Bar with Arcane Amethyst Glow (Always rendered: 0 / 0 if no magic) */}
        <div className="space-y-0.5">
          <div className="flex justify-between text-[7.5px] sm:text-[8.5px] font-mono text-zinc-300">
            <span
              className={`${unit.maxMagic > 0 ? 'text-fuchsia-300' : 'text-zinc-500'
                } font-bold flex items-center gap-0.5 drop-shadow-[0_0_6px_rgba(217,70,239,0.7)]`}
            >
              <span>✦</span> MANA
            </span>
            <span
              className={`${unit.maxMagic > 0
                ? 'text-pink-200 font-black'
                : 'text-zinc-500 font-semibold'
                } drop-shadow-[0_0_6px_rgba(217,70,239,0.7)]`}
            >
              {Math.max(0, Math.ceil(unit.magic || 0))} / {unit.maxMagic || 0}
            </span>
          </div>
          <div
            className={`w-full h-1.5 bg-black rounded-full border ${unit.maxMagic > 0 ? 'border-fuchsia-800/80' : 'border-zinc-800'
              } p-[0.5px] shadow-[inset_0_0_8px_rgba(0,0,0,0.9)] overflow-hidden`}
          >
            <div
              className="h-full bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-300 transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(217,70,239,0.9)]"
              style={{ width: `${manaPct}%` }}
            />
          </div>
        </div>
      </div>
    </article>
  );
};
