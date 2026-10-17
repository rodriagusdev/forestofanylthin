import React, { useState, useRef, useEffect } from 'react';
import { useActionSound } from '../../hooks';

export const AudioControl: React.FC = () => {
  const {
    isMuted,
    masterVolume,
    musicVolume,
    sfxVolume,
    toggleMute,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    playPreviewSound,
    getActiveMusicKey,
  } = useActionSound();

  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const activeKey = getActiveMusicKey();

  return (
    <div ref={panelRef} className="fixed top-24 right-4 z-50 select-none font-outfit">
      {/* Floating Audio Icon Pill */}
      <button
        type="button"
        onClick={() => {
          playPreviewSound();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 bg-stone-950/85 backdrop-blur-md border border-amber-500/30 rounded-full px-3 py-1.5 shadow-2xl transition-all duration-300 hover:border-amber-400/70 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] group"
        title="Audio & Volume Settings"
        aria-label="Open Audio Settings"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            playPreviewSound();
            toggleMute();
          }}
          className="text-amber-400 hover:text-amber-300 transition-colors p-0.5 flex items-center justify-center cursor-pointer"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted || masterVolume === 0 ? (
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-amber-400 group-hover:scale-105 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </div>
        <span className="text-[11px] font-cinzel text-amber-200/80 uppercase tracking-widest hidden sm:inline">
          {isMuted ? 'Muted' : `${Math.round(masterVolume * 100)}%`}
        </span>
      </button>

      {/* Multi-Channel Audio Settings Popover */}
      {isOpen && (
        <div className="absolute top-12 right-0 w-72 bg-stone-950/95 backdrop-blur-xl border border-amber-500/30 rounded-xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.9)] animate-fadeIn text-zinc-200">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 mb-3.5">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              <h3 className="font-cinzel text-xs font-semibold text-amber-200 uppercase tracking-wider">
                Sound Sanctuary
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                playPreviewSound();
                toggleMute();
              }}
              className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all ${
                isMuted
                  ? 'bg-red-950/60 border-red-500/50 text-red-300 hover:bg-red-900/60'
                  : 'bg-amber-950/40 border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
              }`}
            >
              {isMuted ? 'UNMUTE ALL' : 'MUTE ALL'}
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Master Channel */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-300 font-medium">Master Volume</span>
                <span className="font-mono text-amber-400/90 text-[10px]">
                  {isMuted ? '0%' : `${Math.round(masterVolume * 100)}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : masterVolume}
                onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Music Channel */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-300 font-medium">Music Channel</span>
                <span className="font-mono text-amber-400/90 text-[10px]">
                  {Math.round(musicVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* SFX Channel */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-300 font-medium">SFX & Spells</span>
                <span className="font-mono text-amber-400/90 text-[10px]">
                  {Math.round(sfxVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVolume}
                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          {activeKey && (
            <div className="mt-3.5 pt-2.5 border-t border-amber-500/15 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
              <span>ACTIVE THEME</span>
              <span className="text-amber-400/70 truncate max-w-[140px] uppercase">
                {activeKey.replace(/_/g, ' ')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
