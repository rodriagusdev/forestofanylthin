import React, { useContext, useEffect, useRef, useState } from 'react';
import { BattleContext } from '../../../context/BattleContext';
import { CombatLogEntry, Unit } from '../../../types';
import { useBattle } from '../../../features/components/BattleUI/-BattleUI/useBattle';

export const CombatLog = () => {
  const {
    combatLogs,
    clearCombatLogs,
    fallenAllies,
    action,
    unitsInBoard,
    unitPosition,
    setMagicUsedInTurn,
    handleUnitPreview,
  } = useContext(BattleContext);

  const { selectUnit } = useBattle();
  const [activeTab, setActiveTab] = useState<'annals' | 'crypt'>('annals');
  const logContainerRef = useRef<HTMLDivElement>(null);

  const activeUnit = unitsInBoard[unitPosition] || unitsInBoard[0];
  const isPlayerTurn = activeUnit?.belongsTo === 'player';
  const isReanimateActive = action === 'Necromancy: Reanimate';
  const canReanimate =
    isPlayerTurn && isReanimateActive && (activeUnit?.magic ?? 0) >= 6;

  // Auto-focus Crypt when player selects Reanimate and there are fallen allies
  useEffect(() => {
    if (isReanimateActive && fallenAllies.length > 0) {
      setActiveTab('crypt');
    }
  }, [isReanimateActive, fallenAllies.length]);

  useEffect(() => {
    if (activeTab === 'annals' && logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [combatLogs, activeTab]);

  const handleCryptClick = (unit: Unit) => {
    if (canReanimate) {
      setMagicUsedInTurn(6);
      selectUnit(unit);
    } else {
      handleUnitPreview(unit);
    }
  };

  const getActionBadgeColor = (type: CombatLogEntry['actionType']) => {
    switch (type) {
      case 'attack':
        return 'border-amber-400/80 bg-gradient-to-r from-amber-950 to-yellow-950 text-amber-200 shadow-jewel-gold';
      case 'spell':
        return 'border-cyan-400/80 bg-gradient-to-r from-sky-950 to-blue-950 text-cyan-200 shadow-jewel-sapphire';
      case 'heal':
        return 'border-emerald-400/80 bg-gradient-to-r from-emerald-950 to-teal-950 text-emerald-200 shadow-jewel-emerald';
      case 'status':
        return 'border-purple-400/80 bg-gradient-to-r from-purple-950 to-indigo-950 text-purple-200 shadow-jewel-amethyst';
      case 'death':
        return 'border-rose-500/90 bg-gradient-to-r from-rose-950 to-red-950 text-rose-100 shadow-jewel-ruby';
      default:
        return 'border-zinc-700 bg-zinc-900 text-zinc-300';
    }
  };

  return (
    <aside className="relative flex flex-col h-full w-full smoked-velvet-scroll border-2 border-fuchsia-800/70 rounded-md p-2.5 sm:p-3 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.95)] overflow-hidden select-none">
      {/* Crystal Thorn Corner Seals */}
      <span className="absolute -top-1 -left-1 text-xs text-pink-400 font-serif">✦</span>
      <span className="absolute -top-1 -right-1 text-xs text-pink-400 font-serif">✦</span>
      <span className="absolute -bottom-1 -left-1 text-xs text-pink-400 font-serif">✦</span>
      <span className="absolute -bottom-1 -right-1 text-xs text-pink-400 font-serif">✦</span>

      {/* Navigation Tab Header */}
      <div className="relative pb-2 mb-2 border-b border-fuchsia-500/30 flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('annals')}
            className={`px-2.5 py-1 rounded text-[10px] sm:text-xs font-cinzel font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'annals'
                ? 'crystal-thorn-badge text-pink-100 border-pink-400/90 shadow-[0_0_12px_rgba(244,114,182,0.6)]'
                : 'text-zinc-400 hover:text-pink-200 bg-zinc-950/60 border border-zinc-800'
            }`}
          >
            <span>📜</span>
            <span>Annals</span>
            <span className="text-[9px] font-mono px-1 rounded bg-black/60 text-zinc-300">
              {combatLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('crypt')}
            className={`px-2.5 py-1 rounded text-[10px] sm:text-xs font-cinzel font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeTab === 'crypt'
                ? 'bg-gradient-to-r from-purple-950 via-fuchsia-950 to-purple-900 text-fuchsia-100 border border-fuchsia-400/90 shadow-[0_0_15px_rgba(217,70,239,0.7)] scale-102'
                : fallenAllies.length > 0
                ? 'text-fuchsia-300 bg-purple-950/50 border border-fuchsia-800/80 animate-pulse'
                : 'text-zinc-400 hover:text-fuchsia-200 bg-zinc-950/60 border border-zinc-800'
            }`}
          >
            <span>☠</span>
            <span>Crypt</span>
            <span
              className={`text-[9px] font-mono px-1 rounded ${
                fallenAllies.length > 0
                  ? 'bg-rose-950 text-rose-200 font-bold border border-rose-600/60'
                  : 'bg-black/60 text-zinc-400'
              }`}
            >
              {fallenAllies.length}
            </span>
          </button>
        </div>

        {activeTab === 'annals' && combatLogs.length > 0 && (
          <button
            onClick={clearCombatLogs}
            className="px-2 py-0.5 text-[8px] sm:text-[9px] font-cinzel uppercase tracking-wider text-pink-100 crystal-thorn-badge rounded transition-all hover:scale-105"
            title="Clear Combat Annals"
          >
            Clear
          </button>
        )}
      </div>

      {/* Annals View: Chronicles of War Log Entries */}
      {activeTab === 'annals' && (
        <div
          ref={logContainerRef}
          className="flex-1 overflow-y-auto space-y-2 pr-1.5 scrollbar-thin scrollbar-thumb-purple-500/40 scrollbar-track-zinc-950/80"
        >
          {combatLogs.length === 0 ? (
            <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center px-4 py-8 opacity-60">
              <div className="w-12 h-12 rounded-full border border-purple-500/30 flex items-center justify-center bg-purple-500/10 mb-3">
                <span className="text-xl text-purple-300">⚔</span>
              </div>
              <p className="text-xs text-zinc-400 font-cinzel uppercase tracking-wider">
                Annals of War Awaiting First Blood
              </p>
            </div>
          ) : (
            combatLogs.map((entry) => {
              const isActorPlayer = entry.actor.belongsTo === 'player';
              const isTargetPlayer = entry.target?.belongsTo === 'player';

              return (
                <div
                  key={entry.id}
                  className={`relative p-2 rounded border transition-all duration-300 ${
                    entry.isFatal
                      ? 'bg-gradient-to-r from-rose-950/60 via-zinc-900/80 to-black border-rose-600/60 shadow-[0_0_12px_rgba(225,29,72,0.3)]'
                      : 'bg-zinc-950/85 hover:bg-zinc-900/90 border-purple-900/40 hover:border-purple-500/40 shadow-sm'
                  }`}
                >
                  {/* Meta Bar: Timestamp & Action Badge */}
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 rounded-sm text-[8px] font-mono font-bold bg-black border border-zinc-800 text-zinc-400">
                        {entry.timestamp}
                      </span>
                      <span
                        className={`px-1.5 py-0.2 rounded-sm text-[8px] font-cinzel font-black uppercase tracking-wider border ${getActionBadgeColor(
                          entry.actionType
                        )}`}
                      >
                        {entry.actionName}
                      </span>
                    </div>

                    {entry.isFatal && (
                      <span className="px-1.5 py-0.2 rounded-sm text-[8px] font-cinzel font-black uppercase tracking-widest bg-rose-950 text-rose-200 border border-rose-500/80 animate-pulse">
                        ☠ SLAIN
                      </span>
                    )}
                  </div>

                  {/* Combatant Avatars Bar */}
                  <div className="flex items-center gap-2 mb-1.5">
                    {/* Actor Avatar */}
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-full overflow-hidden border flex-shrink-0 ${
                          isActorPlayer
                            ? 'border-emerald-400/80 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                            : 'border-rose-500/80 shadow-[0_0_6px_rgba(244,63,94,0.5)]'
                        }`}
                      >
                        <img
                          src={entry.actor.face}
                          alt={entry.actor.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <span
                        className={`text-[10px] font-bold truncate ${
                          isActorPlayer ? 'text-emerald-300' : 'text-rose-300'
                        }`}
                      >
                        {entry.actor.name}
                      </span>
                    </div>

                    {/* Versus / Target Arrow */}
                    {entry.target && (
                      <>
                        <span className="text-[10px] text-purple-400/80 flex-shrink-0">➔</span>
                        {/* Target Avatar */}
                        <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
                          <span
                            className={`text-[10px] font-bold truncate text-right ${
                              isTargetPlayer ? 'text-emerald-300' : 'text-rose-300'
                            }`}
                          >
                            {entry.target.name}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-full overflow-hidden border flex-shrink-0 ${
                              isTargetPlayer
                                ? 'border-emerald-400/80 shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                                : 'border-rose-500/80 shadow-[0_0_6px_rgba(244,63,94,0.5)]'
                            }`}
                          >
                            <img
                              src={entry.target.face}
                              alt={entry.target.name}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Narrative Text */}
                  <p className="text-[10px] text-zinc-300 leading-relaxed pl-1 font-serif">
                    {entry.description}
                  </p>

                  {/* Quantitative Impact Counters */}
                  {(entry.damageDealt !== undefined || entry.stacksLost !== undefined) && (
                    <div className="mt-1.5 pt-1 border-t border-zinc-800/80 flex items-center gap-2">
                      {entry.damageDealt !== undefined && (
                        <span className="text-[9px] font-mono font-bold text-rose-400 bg-rose-950/40 px-1 py-0.2 rounded border border-rose-800/40">
                          -{entry.damageDealt} DMG
                        </span>
                      )}
                      {entry.stacksLost !== undefined && (
                        <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-950/40 px-1 py-0.2 rounded border border-amber-800/40">
                          -{entry.stacksLost} Troops
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Crypt View: Fallen Allied Divisions */}
      {activeTab === 'crypt' && (
        <div className="flex-1 overflow-y-auto space-y-2 pr-1.5 scrollbar-thin scrollbar-thumb-purple-500/40 scrollbar-track-zinc-950/80">
          {/* Crypt Banner */}
          <div className="p-2 rounded bg-gradient-to-r from-purple-950/80 via-black to-zinc-950 border border-purple-600/50 mb-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-cinzel font-black uppercase text-fuchsia-200 tracking-wider">
                Crypt of the Fallen
              </span>
              <span className="text-[9px] text-purple-300/80 font-serif italic">
                Rest in Necrotic Shadows
              </span>
            </div>
            {isReanimateActive ? (
              <p className="text-[9px] text-pink-300 mt-1 animate-pulse">
                ✦ Click any fallen division below to cast Reanimate Undead (6 MP)!
              </p>
            ) : (
              <p className="text-[9px] text-zinc-400 mt-1">
                Select Reanimate from command dock to resurrect fallen legions.
              </p>
            )}
          </div>

          {fallenAllies.length === 0 ? (
            <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center px-4 py-6 opacity-70">
              <div className="w-12 h-12 rounded-full border border-fuchsia-600/40 flex items-center justify-center bg-purple-900/20 mb-2">
                <span className="text-xl text-fuchsia-300">🕯</span>
              </div>
              <p className="text-[11px] font-cinzel text-zinc-300 uppercase tracking-widest font-bold">
                No Slain Allies
              </p>
              <p className="text-[9px] text-zinc-500 font-serif italic mt-1">
                All battalions stand fighting on the battlefield.
              </p>
            </div>
          ) : (
            fallenAllies.map((unit) => (
              <div
                key={unit.id}
                onClick={() => handleCryptClick(unit)}
                className={`relative p-2.5 rounded-md border transition-all duration-300 cursor-pointer ${
                  canReanimate
                    ? 'bg-gradient-to-r from-purple-950 via-zinc-900 to-black border-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.5)] hover:scale-102 ring-1 ring-pink-400'
                    : 'bg-zinc-950/90 border-zinc-800 hover:border-purple-700/60 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {/* Unit Face with Gravestone Border */}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-purple-600/80 bg-black flex-shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.5)]">
                    <img
                      src={unit.face}
                      alt={unit.name}
                      className="w-full h-full object-cover object-top filter grayscale contrast-125"
                    />
                    <div className="absolute inset-0 bg-purple-950/40 mix-blend-color" />
                  </div>

                  {/* Division Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-bold text-zinc-200 truncate font-cinzel">
                        {unit.name}
                      </h4>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60 font-bold">
                        0 HP (Slain)
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[9px] text-zinc-400">
                      <span>
                        Capacity: {unit.maxStack}x ({unit.maxHealth} HP)
                      </span>
                      <span>{unit.damage * unit.maxStack} DMG</span>
                    </div>

                    {/* Reanimate Callout Button if Reanimate is Active */}
                    {canReanimate ? (
                      <div className="mt-2 py-0.5 px-2 rounded bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-700 text-white font-cinzel font-black text-[9px] tracking-wider uppercase text-center shadow-[0_0_10px_rgba(244,114,182,0.9)] animate-pulse">
                        🔮 Reanimate Division (6 MP)
                      </div>
                    ) : (
                      <div className="mt-1 text-[8px] text-fuchsia-400/80 font-serif italic text-right">
                        Click to preview codex
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Footer Filigree Line */}
      <div className="pt-2 mt-1 border-t border-purple-500/20 flex items-center justify-between text-[8px] text-purple-400/60 font-cinzel">
        <span>⚔ FOREST OF AN-YLTHIN</span>
        <span>
          {activeTab === 'annals'
            ? `${combatLogs.length} EVENTS RECORDED`
            : `${fallenAllies.length} FALLEN ALLIES`}
        </span>
      </div>
    </aside>
  );
};

export default CombatLog;

