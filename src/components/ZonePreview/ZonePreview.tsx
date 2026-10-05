import { Army } from '../../types';
import { useUnitPreview } from '../../features/UnitPreview/useUnitPreview';
import { DarkBackgroundWrapper } from '../DarkBackgroundWrapper';
import UnitPreview from '../PlayerUI/UnitPreview/UnitPreview';

interface Props {
  previewLevel: Army;
  handleVisibility: () => void;
}

const ZonePreview = ({ previewLevel, handleVisibility }: Props) => {
  const { handleUnitPreview, handleExitUnitPreview, previewUnit } =
    useUnitPreview();

  return (
    <>
      <DarkBackgroundWrapper onClose={handleVisibility}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative flex flex-col items-center w-[95%] max-w-lg p-5 sm:p-7 rounded-sm border-2 border-rose-600 bg-gradient-to-b from-[#25060e]/95 via-[#130307]/95 to-[#080103]/95 shadow-[0_0_55px_rgba(225,29,72,0.6),inset_0_0_35px_rgba(159,18,57,0.45)] ring-1 ring-rose-500/50 backdrop-blur-2xl text-zinc-100 select-none animate-in fade-in zoom-in-95 duration-200 z-40"
        >
          {/* Crystal Thorn Corner Accents */}
          <span className="absolute -top-1 -left-1 text-sm font-serif text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]">
            ✦
          </span>
          <span className="absolute -top-1 -right-1 text-sm font-serif text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]">
            ✦
          </span>
          <span className="absolute -bottom-1 -left-1 text-sm font-serif text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]">
            ✦
          </span>
          <span className="absolute -bottom-1 -right-1 text-sm font-serif text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]">
            ✦
          </span>

          {/* Header Banner */}
          <div className="flex items-center justify-center mb-3">
            <span className="px-3.5 py-0.5 rounded-sm bg-rose-950/90 border border-rose-500 text-rose-200 text-[10px] font-cinzel font-black tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(244,63,94,0.7)]">
              ⚔ HOSTILE TERRITORY RECONNAISSANCE ⚔
            </span>
          </div>

          <h2 className="font-cinzel text-base sm:text-lg font-black text-white uppercase tracking-wider mb-4 text-center">
            Enemy Divisions In Domain
          </h2>

          {/* Enemy Divisions Grid */}
          <div className="flex flex-wrap gap-4 justify-center items-center py-3 w-full border-t border-b border-rose-950/80 my-2">
            {previewLevel?.map((unit) => (
              <div
                key={unit.id}
                onClick={() => handleUnitPreview(unit)}
                className="group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
              >
                {/* Red Circular Frame */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-rose-500/80 p-0.5 bg-black shadow-[0_0_15px_rgba(244,63,94,0.5)] group-hover:border-rose-400 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.8)] transition-all">
                  <img
                    className="w-full h-full object-cover object-top rounded-full filter brightness-95 contrast-105"
                    src={unit.face}
                    alt={unit.name}
                  />

                  {/* Red Multiplier Ribbon */}
                  {unit.type !== 'Hero' && (
                    <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-rose-950 text-rose-200 border border-rose-500 text-[9.5px] font-mono font-bold shadow-md">
                      {unit.stack}x
                    </span>
                  )}
                </div>

                <h3 className="mt-1.5 text-center text-[11px] font-cinzel font-bold text-zinc-200 group-hover:text-rose-200 max-w-[90px] truncate">
                  {unit.name}
                </h3>
              </div>
            ))}
          </div>

          {/* Close Button */}
          <div className="mt-4 w-full flex justify-center">
            <button
              type="button"
              onClick={handleVisibility}
              className="w-full sm:w-auto px-8 py-2 rounded-sm bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 border border-rose-500 text-rose-200 hover:text-white hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.8)] font-cinzel font-black text-xs tracking-widest uppercase transition-all shadow-lg"
            >
              ✕ Close Recon
            </button>
          </div>
        </div>
      </DarkBackgroundWrapper>

      {previewUnit !== undefined && (
        <DarkBackgroundWrapper onClose={handleExitUnitPreview}>
          <UnitPreview
            handleExitUnitPreview={handleExitUnitPreview}
            previewUnit={previewUnit}
          />
        </DarkBackgroundWrapper>
      )}
    </>
  );
};

export default ZonePreview;
