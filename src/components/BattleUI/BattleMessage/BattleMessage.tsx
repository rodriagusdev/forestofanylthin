import { useDisplayBars } from '../../../features/components/BattleUI';
import { SkillIcon } from '../../SkillPreview/SkillIcon';

const BattleMessage = () => {
  const {
    playingUnit,
    targetUnit,
    battleMessageText,
    actionImage,
    isDamaging,
    isReanimate,
    isMagicUsed,
    updateMagic,
    attackerIsCursed,
    updateHealth,
    targetMaxHealth,
    updateAttackerHealth,
    attackerMaxHealth,
    attackerDamage,
    casualtiesLost,
    vampiricHealAmount,
    canRetaliate,
    retaliationDamage,
    retaliationCasualties,
  } = useDisplayBars();

  const isPlayerAttacking = playingUnit?.belongsTo === 'player';

  const healthPercentage =
    targetMaxHealth > 0
      ? Math.max(0, Math.min(100, (updateHealth / targetMaxHealth) * 100))
      : 0;

  const attackerHealthPercentage =
    attackerMaxHealth > 0
      ? Math.max(0, Math.min(100, (updateAttackerHealth / attackerMaxHealth) * 100))
      : 0;

  const maxMagic = playingUnit?.maxMagic ?? 0;
  const magicPercentage =
    maxMagic > 0
      ? Math.max(0, Math.min(100, (updateMagic / maxMagic) * 100))
      : 0;

  const isRangedAttacker = Boolean(playingUnit?.isRanged);
  const isMeleeDefender = !targetUnit?.isRanged;

  return (
    <div className="relative flex flex-col w-[95%] max-w-[880px] bg-gradient-to-b from-zinc-950 via-black to-zinc-950 backdrop-blur-2xl border-2 border-amber-400 p-5 sm:p-7 rounded-sm shadow-jewel-gold text-zinc-100 select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Maximalist Baroque Corner Fleur-de-lis */}
      <span className="absolute -top-1.5 -left-1.5 text-sm text-amber-300 font-serif">⚜</span>
      <span className="absolute -top-1.5 -right-1.5 text-sm text-amber-300 font-serif">⚜</span>
      <span className="absolute -bottom-1.5 -left-1.5 text-sm text-amber-300 font-serif">⚜</span>
      <span className="absolute -bottom-1.5 -right-1.5 text-sm text-amber-300 font-serif">⚜</span>

      {/* Majestic Header Ribbon */}
      <div className="flex items-center justify-center gap-3 text-amber-300 text-xs tracking-[0.3em] uppercase font-cinzel font-black mb-3 drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)]">
        <span className="h-[1.5px] w-12 sm:w-28 bg-gradient-to-r from-transparent via-amber-400 to-amber-200" />
        <span>⚜ TACTICAL ENGAGEMENT RESOLUTION ⚜</span>
        <span className="h-[1.5px] w-12 sm:w-28 bg-gradient-to-l from-transparent via-amber-400 to-amber-200" />
      </div>

      {/* Combat Clash Duel Arena */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center my-2">
        {/* Attacking Unit (Left) */}
        <div className={`md:col-span-4 flex flex-col items-center text-center p-3.5 rounded-sm bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black border-2 ${
          isPlayerAttacking ? 'border-emerald-500/60 shadow-jewel-emerald' : 'border-rose-500/60 shadow-jewel-ruby'
        } relative`}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-amber-300">
              {isPlayerAttacking ? '⚜ ALLIED INITIATOR ⚜' : '☠ HOSTILE AGGRESSOR ☠'}
            </span>
            {isRangedAttacker && (
              <span className="px-1.5 py-0.2 rounded-xs bg-amber-950/90 border border-amber-400 text-amber-300 text-[8px] font-bold">
                🏹 Ranged
              </span>
            )}
          </div>

          <div className="relative group mb-2">
            <div
              className={`absolute -inset-2 rounded-full blur-lg animate-pulse ${
                isPlayerAttacking ? 'bg-emerald-500/60' : 'bg-rose-500/60'
              }`}
            />
            <img
              className={`relative h-24 w-24 sm:h-28 sm:w-28 rounded-full p-1 border-2 border-amber-400 object-cover object-top shadow-2xl bg-black ${
                canRetaliate && retaliationDamage > 0
                  ? 'animate-pulse brightness-125 filter contrast-125'
                  : ''
              }`}
              src={playingUnit?.face}
              alt={playingUnit?.name}
            />
            {playingUnit?.type !== 'Hero' && (
              <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-sm bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-400 text-amber-200 text-[10px] font-mono font-black shadow-lg">
                {Math.ceil(playingUnit?.stack || 1)}x
              </span>
            )}
          </div>

          <h3 className="font-cinzel text-sm sm:text-base font-black text-amber-100 truncate w-full drop-shadow">
            {playingUnit?.name}
          </h3>

          {/* Attacker Vitality Meter (Animated on counterattack) */}
          <div className="w-full mt-2 space-y-1">
            <div className="flex justify-between text-[10px] font-mono font-bold text-rose-300">
              <span className="flex items-center gap-1"><span>💎</span> ❤ VITALITY</span>
              <span className={canRetaliate && retaliationDamage > 0 ? 'text-rose-300 font-black' : 'text-emerald-300'}>
                {Math.max(0, Math.round(updateAttackerHealth))} / {attackerMaxHealth} HP
              </span>
            </div>
            <div className="w-full h-2.5 bg-black rounded-full border border-amber-500/50 p-[1px] shadow-inner overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-700 via-rose-500 to-amber-400 transition-all duration-300 rounded-full shadow-jewel-ruby"
                style={{ width: `${attackerHealthPercentage}%` }}
              />
            </div>
          </div>

          {/* Retaliation Strike Feedback Badge on Attacker */}
          {canRetaliate && retaliationDamage > 0 && (
            <div className="mt-1.5 px-2 py-0.5 rounded-xs bg-rose-950/90 border border-rose-400 text-[9.5px] font-mono font-black text-rose-200 shadow-jewel-ruby animate-pulse">
              ⚔ COUNTERED: -{retaliationDamage} DMG {retaliationCasualties > 0 && `(-${retaliationCasualties} ☠)`}
            </div>
          )}

          {/* Attacker Mana Tube */}
          {isMagicUsed && (
            <div className="w-full mt-2 space-y-1">
              <div className="flex justify-between text-[10px] font-mono font-bold text-cyan-300">
                <span className="flex items-center gap-1"><span>✦</span> MANA DRAIN</span>
                <span>
                  {Math.round(updateMagic)} / {playingUnit?.maxMagic} MP
                </span>
              </div>
              <div className="w-full h-2 bg-black rounded-full border border-cyan-500 p-[1px] shadow-inner overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-700 via-cyan-500 to-sky-300 transition-all duration-300 rounded-full shadow-jewel-sapphire"
                  style={{ width: `${magicPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Center Clash Action / Elemental Impact Burst */}
        <div className="md:col-span-3 flex flex-col items-center justify-center text-center py-2">
          {/* Jeweled Action Emblem */}
          <div className="relative p-2.5 border-2 border-amber-300 rounded-full bg-gradient-to-b from-zinc-800 via-zinc-950 to-black shadow-jewel-gold mb-2 animate-bounce duration-1000">
            {actionImage ? (
              <SkillIcon skill={actionImage} className="w-11 h-11" />
            ) : (
              <span className="w-11 h-11 flex items-center justify-center text-xl text-amber-300">⚔</span>
            )}
          </div>

          <span className="font-cinzel text-xs font-black text-amber-200 tracking-widest uppercase drop-shadow">
            {actionImage?.formattedName || 'STRIKE'}
          </span>

          {/* Dynamic Damage Floating Numbers & Status Feedback */}
          {attackerIsCursed ? (
            <div className="mt-2 space-y-1.5">
              <div className="px-3 py-1 rounded-sm bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-950 border-2 border-purple-400 text-xs font-cinzel text-purple-200 font-black tracking-wider shadow-jewel-amethyst">
                ☠ CURSED: STRIKE NULLIFIED (0 DMG)
              </div>

              {canRetaliate && retaliationDamage > 0 ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-gradient-to-r from-orange-950 via-amber-950 to-orange-950 border border-amber-500/80 text-[10px] font-cinzel font-black text-amber-200 shadow-jewel-gold animate-pulse">
                  <span>⚔ COUNTER: -{retaliationDamage} DMG</span>
                  {retaliationCasualties > 0 && (
                    <span className="text-rose-300 font-mono font-bold">(-{retaliationCasualties} ☠)</span>
                  )}
                </div>
              ) : isRangedAttacker && isMeleeDefender && actionImage?.name === 'Combat: Attack' ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-indigo-950/90 border border-indigo-400/80 text-[9.5px] font-cinzel font-bold text-indigo-200 shadow-jewel-sapphire">
                  <span>🏹 RANGED ATTACK (NO RETALIATION)</span>
                </div>
              ) : null}
            </div>
          ) : isDamaging ? (
            <div className="mt-2 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-sm bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-2 border-rose-400 shadow-jewel-ruby animate-pulse">
                <span className="text-sm sm:text-base font-cinzel font-black text-rose-100 tracking-wider">
                  💥 -{attackerDamage.toFixed(0)} DAMAGE!
                </span>
              </div>

              {casualtiesLost > 0 && (
                <div className="text-[11px] font-mono text-rose-300 font-black tracking-wide drop-shadow">
                  ☠ -{casualtiesLost} CASUALTIES SUSTAINED
                </div>
              )}

              {vampiricHealAmount > 0 && (
                <div className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-300 bg-emerald-950/90 border border-emerald-400 px-2.5 py-0.5 rounded-sm shadow-jewel-emerald">
                  <span>🩸 +{vampiricHealAmount} HP SIPHONED</span>
                </div>
              )}

              {canRetaliate && retaliationDamage > 0 ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-gradient-to-r from-orange-950 via-amber-950 to-orange-950 border border-amber-500/80 text-[10px] font-cinzel font-black text-amber-200 shadow-jewel-gold animate-pulse">
                  <span>⚔ COUNTER: -{retaliationDamage} DMG</span>
                  {retaliationCasualties > 0 && (
                    <span className="text-rose-300 font-mono font-bold">(-{retaliationCasualties} ☠)</span>
                  )}
                </div>
              ) : isRangedAttacker && isMeleeDefender && actionImage?.name === 'Combat: Attack' ? (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-indigo-950/90 border border-indigo-400/80 text-[9.5px] font-cinzel font-bold text-indigo-200 shadow-jewel-sapphire">
                  <span>🏹 RANGED ATTACK (NO RETALIATION)</span>
                </div>
              ) : null}
            </div>
          ) : isReanimate ? (
            <div className="mt-2 px-3 py-1 rounded-sm bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 border-2 border-emerald-400 text-xs font-cinzel text-emerald-200 font-black tracking-wider shadow-jewel-emerald animate-pulse">
              ✨ REANIMATED: FULL HEALTH & DIVISION RESTORED!
            </div>
          ) : null}
        </div>

        {/* Defending Target Unit (Right) */}
        <div className={`md:col-span-4 flex flex-col items-center text-center p-3.5 rounded-sm bg-gradient-to-b from-zinc-900/90 via-zinc-950/90 to-black border-2 ${
          !isPlayerAttacking ? 'border-emerald-500/60 shadow-jewel-emerald' : 'border-rose-500/60 shadow-jewel-ruby'
        } relative`}>
          <span className="text-[10px] uppercase font-cinzel font-black tracking-widest text-amber-300 mb-1.5">
            {actionImage?.name === 'Destruction: Rain of Fire'
              ? '☠ ALL HOSTILE DIVISIONS ☠'
              : !isPlayerAttacking
              ? '⚜ ALLIED TARGET ⚜'
              : '☠ HOSTILE TARGET ☠'}
          </span>

          <div className="relative group mb-2">
            <div
              className={`absolute -inset-2 rounded-full blur-lg ${
                !isPlayerAttacking ? 'bg-emerald-500/60' : 'bg-rose-500/60'
              }`}
            />
            <img
              className={`relative h-24 w-24 sm:h-28 sm:w-28 rounded-full p-1 border-2 border-amber-400 object-cover object-top shadow-2xl bg-black ${
                (isDamaging && !attackerIsCursed) || isReanimate
                  ? 'animate-pulse brightness-125 filter contrast-125'
                  : ''
              }`}
              src={targetUnit?.face}
              alt={targetUnit?.name}
            />
            {targetUnit?.type !== 'Hero' && actionImage?.name !== 'Destruction: Rain of Fire' && (
              <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-sm bg-gradient-to-r from-purple-950 to-indigo-950 border border-purple-400 text-amber-200 text-[10px] font-mono font-black shadow-lg">
                {Math.ceil(targetUnit?.stack || 1)}x
              </span>
            )}
            {actionImage?.name === 'Destruction: Rain of Fire' && (
              <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-sm bg-gradient-to-r from-orange-950 to-red-950 border border-orange-400 text-amber-200 text-[9px] font-cinzel font-black shadow-lg">
                ALL ENEMIES
              </span>
            )}
          </div>

          <h3 className="font-cinzel text-sm sm:text-base font-black text-amber-100 truncate w-full drop-shadow">
            {actionImage?.name === 'Destruction: Rain of Fire' ? 'Hostile Army Battalions' : targetUnit?.name}
          </h3>

          {/* Defender Vitality Drain / Heal Meter */}
          <div className="w-full mt-2 space-y-1">
            <div className="flex justify-between text-[10px] font-mono font-bold text-rose-300">
              <span className="flex items-center gap-1"><span>💎</span> ❤ VITALITY</span>
              <span className={isReanimate ? 'text-emerald-300 font-black' : 'text-emerald-300'}>
                {Math.max(0, Math.round(updateHealth))} / {targetMaxHealth} HP
              </span>
            </div>
            <div className="w-full h-2.5 bg-black rounded-full border border-amber-500/50 p-[1px] shadow-inner overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isReanimate
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-400 to-green-300 shadow-jewel-emerald'
                    : 'bg-gradient-to-r from-rose-700 via-rose-500 to-amber-400 shadow-jewel-ruby'
                }`}
                style={{ width: `${healthPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Inscribed Combat Log Scroll */}
      <footer className="mt-4 pt-3 border-t border-amber-500/30 text-center bg-black/60 p-2.5 rounded-sm border border-zinc-900">
        <p className="text-xs sm:text-sm text-amber-100/90 font-serif italic tracking-wide">
          “{battleMessageText}”
        </p>
      </footer>
    </div>
  );
};

export default BattleMessage;
