import React, { useState } from 'react';
import { useActionSound } from '../../hooks';

export const AudioControl: React.FC = () => {
  const { isMuted, volume, toggleMute, setVolume, playPreviewSound } = useActionSound();
  const [showSlider, setShowSlider] = useState(false);

  return (
    <div
      className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-stone-950/80 backdrop-blur-md border border-amber-500/30 rounded-full px-3 py-1.5 shadow-2xl transition-all duration-300 hover:border-amber-400/60"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <button
        type="button"
        onClick={() => {
          playPreviewSound();
          toggleMute();
        }}
        className="text-amber-400 hover:text-amber-300 transition-colors p-1 flex items-center justify-center focus:outline-none"
        title={isMuted ? "Unmute Audio" : "Mute Audio"}
        aria-label="Toggle Sound Mute"
      >
        {isMuted || volume === 0 ? (
          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      {showSlider && (
        <div className="flex items-center gap-2 pr-1 animate-fadeIn">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const newVol = parseFloat(e.target.value);
              setVolume(newVol);
            }}
            className="w-20 h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
          <span className="text-[10px] font-mono text-amber-200/70 w-7 text-right">
            {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
          </span>
        </div>
      )}
    </div>
  );
};
