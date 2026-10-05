import { useDialogHandler } from '../../../features/components/PlayerUI/DialogueBox';

interface Props {
  handleVisibility: () => void;
  image: string;
  race: string;
}

const DialogueBox = ({ handleVisibility, image, race }: Props) => {
  const { showDialogOptions, dialogText } = useDialogHandler({ race });

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative flex flex-col p-5 sm:p-7 w-[95%] max-w-xl gap-4 items-center justify-center bg-gradient-to-b from-[#042214]/95 via-[#02130b]/95 to-[#010805]/95 border-2 border-emerald-500 shadow-[0_0_55px_rgba(16,185,129,0.55),inset_0_0_35px_rgba(5,150,105,0.4)] ring-1 ring-emerald-400/50 rounded-sm backdrop-blur-2xl text-zinc-100 select-none animate-in fade-in zoom-in-95 duration-200 z-50"
    >
      {/* Crystal Thorn Corner Accents */}
      <span className="absolute -top-1 -left-1 text-sm font-serif text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]">✦</span>
      <span className="absolute -top-1 -right-1 text-sm font-serif text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]">✦</span>
      <span className="absolute -bottom-1 -left-1 text-sm font-serif text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]">✦</span>
      <span className="absolute -bottom-1 -right-1 text-sm font-serif text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]">✦</span>

      {/* Header Badge */}
      <div className="flex items-center justify-center">
        <span className="px-3.5 py-0.5 rounded-sm bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-[10px] font-cinzel font-black tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(16,185,129,0.7)]">
          ✦ EXPEDITION CHRONICLER ✦
        </span>
      </div>

      <h2 className="font-cinzel text-xl sm:text-2xl font-black text-white uppercase tracking-wider text-center">
        Ydris
      </h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
        {/* Ydris Avatar with Green Frame */}
        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-emerald-400 p-1 bg-black shadow-[0_0_20px_rgba(16,185,129,0.6)]">
            <img
              className="w-full h-full object-cover object-top rounded-full filter brightness-105"
              src={image}
              alt="Ydris"
            />
          </div>
        </div>

        {/* Dialog Choices */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start flex-1">
          {showDialogOptions}
        </div>
      </div>

      {/* Dialogue Text Scroll */}
      <div className="w-full p-3.5 h-[140px] overflow-y-auto rounded-sm bg-black/70 border border-emerald-900/80 text-xs sm:text-sm font-serif italic text-emerald-100/90 leading-relaxed shadow-inner">
        {dialogText}
      </div>

      {/* Dismiss Button */}
      <div className="w-full flex justify-center pt-1">
        <button
          type="button"
          onClick={handleVisibility}
          className="w-full sm:w-auto px-8 py-2 rounded-sm bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-emerald-500 text-emerald-200 hover:text-white hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.8)] font-cinzel font-black text-xs tracking-widest uppercase transition-all shadow-lg"
        >
          ✕ Conclude Council
        </button>
      </div>
    </div>
  );
};

export default DialogueBox;
