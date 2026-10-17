import { Army } from '../../types';
import { useChangeVisibility, useActionSound } from '../../hooks';
import { useUnitPreview } from '../../features/UnitPreview';
import { useContext } from 'react';
import { BattleContext } from '../../context/BattleContext';
import { useCampaignStore } from '../../store/useCampaignStore';
import { DarkBackgroundWrapper } from '../DarkBackgroundWrapper';
import { UnitPreview } from './UnitPreview';
import { DialogueBox } from './DialogueBox';
import ydris from '../../assets/images/portraits/dryexa/ydris.webp';
import dryexarangerFace from '../../assets/images/portraits/dryexa/dryexarangerface.jpg';
import skeletonFace from '../../assets/images/portraits/undead/skeletonface.jpg';

interface Props {
  playerArmy: Army;
  race: string;
}

const PlayerUI = ({ playerArmy, race }: Props) => {
  const { isVisible, handleVisibility } = useChangeVisibility();
  const { handleUnitPreview, handleExitUnitPreview, previewUnit } =
    useUnitPreview();
  const { playPreviewSound } = useActionSound();
  const openInventory = useCampaignStore((state) => state.openInventory);

  const {
    addedDryexaRanger,
    setAddedDryexaRanger,
    addedSkeletons,
    setAddedSkeletons,
  } = useContext(BattleContext);

  const handleOpenArmory = () => {
    playPreviewSound();
    openInventory();
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-0 sm:flex-row items-center justify-between px-3 sm:px-6 py-4 bg-gradient-to-r from-black via-zinc-950/90 to-black border-b border-emerald-900/60 shadow-xl select-none">
      {/* Unit Description Modal */}
      {previewUnit !== undefined && (
        <DarkBackgroundWrapper onClose={handleExitUnitPreview}>
          <UnitPreview
            handleExitUnitPreview={handleExitUnitPreview}
            previewUnit={previewUnit}
          />
        </DarkBackgroundWrapper>
      )}

      {/* Left Dock: Ydris Chronicler & Armory Button */}
      <div className="flex items-center gap-4">
        {/* Ydris Chronicler Avatar */}
        <div
          className="relative group cursor-pointer flex items-center gap-3"
          onClick={handleVisibility}
        >
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-emerald-500 p-0.5 bg-black shadow-[0_0_20px_rgba(16,185,129,0.6)] group-hover:border-emerald-400 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.9)] transition-all">
            <img
              className="w-full h-full object-cover object-top rounded-full filter brightness-105"
              src={ydris}
              alt="Ydris Chronicler"
            />
          </div>
          <div className="hidden md:block">
            <h4 className="font-cinzel text-xs font-black text-emerald-300 tracking-wider">
              YDRIS
            </h4>
            <p className="text-[10px] font-mono text-zinc-400">War Chronicler</p>
          </div>
        </div>

        {/* Armory & Relics Button */}
        <button
          type="button"
          onClick={handleOpenArmory}
          className="px-3 py-1.5 rounded-xs font-cinzel text-xs font-black tracking-wider uppercase text-amber-200 bg-stone-950/90 hover:bg-amber-950/80 border border-amber-600/70 hover:border-amber-400 transition-all cursor-pointer shadow-[0_0_15px_rgba(217,119,6,0.3)] flex items-center gap-1.5 active:scale-95"
          title="Open Hero Armory and Equipment"
        >
          <span className="text-amber-400 text-xs">❖</span>
          <span>ARMORY</span>
        </button>
      </div>

      {/* Player Army Battalion Units Dock with Green Framing */}
      <div className="flex flex-wrap gap-3 justify-center items-center relative h-auto px-2">
        {playerArmy.map((unit) => (
          <div
            key={unit.id}
            onClick={() => handleUnitPreview(unit)}
            className="group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
          >
            {/* Green Circular Frame */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-emerald-500/90 p-0.5 bg-black shadow-[0_0_12px_rgba(16,185,129,0.4)] group-hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.7)] transition-all">
              <img
                className="w-full h-full object-cover object-top rounded-full filter brightness-100 contrast-105"
                src={unit.face}
                alt={unit.name || unit.id}
              />

              {/* Stack Multiplier Badge */}
              {unit.type !== 'Hero' && (
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-200 border border-emerald-400 text-[9px] font-mono font-bold shadow-md">
                  {Math.ceil(unit.stack)}x
                </span>
              )}
            </div>

            <span className="mt-1 text-[9.5px] font-cinzel font-bold text-zinc-300 group-hover:text-emerald-300 max-w-[70px] truncate text-center">
              {unit.name}
            </span>
          </div>
        ))}
      </div>

      {/* Dialogue Box Modal */}
      {isVisible && (
        <DarkBackgroundWrapper onClose={handleVisibility}>
          <DialogueBox
            race={race}
            image={ydris}
            handleVisibility={handleVisibility}
          />
        </DarkBackgroundWrapper>
      )}

      {/* Dryexa Rangers Reinforcement Modal */}
      {addedDryexaRanger && (
        <DarkBackgroundWrapper onClose={() => setAddedDryexaRanger(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col p-6 w-[95%] max-w-sm gap-3 items-center justify-center bg-gradient-to-b from-[#042214]/95 via-[#02130b]/95 to-[#010805]/95 border-2 border-emerald-500 shadow-[0_0_55px_rgba(16,185,129,0.55)] rounded-sm text-zinc-100 select-none animate-in fade-in zoom-in-95 duration-200 z-50"
          >
            <span className="absolute -top-1 -left-1 text-xs font-serif text-emerald-400">✦</span>
            <span className="absolute -top-1 -right-1 text-xs font-serif text-emerald-400">✦</span>
            <span className="absolute -bottom-1 -left-1 text-xs font-serif text-emerald-400">✦</span>
            <span className="absolute -bottom-1 -right-1 text-xs font-serif text-emerald-400">✦</span>

            <span className="px-3 py-0.5 rounded-sm bg-emerald-950 border border-emerald-500 text-emerald-200 text-[9px] font-cinzel font-black tracking-widest uppercase">
              REINFORCEMENTS GAINED
            </span>

            <div className="w-24 h-24 rounded-full border-2 border-emerald-400 p-1 bg-black shadow-[0_0_20px_rgba(16,185,129,0.7)] my-1">
              <img
                className="w-full h-full object-cover object-top rounded-full"
                src={dryexarangerFace}
                alt="Dryexa Rangers"
              />
            </div>

            <h3 className="font-cinzel text-base font-black text-white text-center">
              +14 Dryexa Rangers have joined the ranks as a token of gratitude!
            </h3>
            <p className="text-xs text-emerald-200/80 font-serif italic text-center">
              Elven marksmen have joined your campaign expedition.
            </p>

            <button
              type="button"
              onClick={() => setAddedDryexaRanger(false)}
              className="mt-2 w-full px-6 py-2 rounded-sm bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-emerald-500 text-emerald-200 hover:text-white font-cinzel font-black text-xs tracking-widest uppercase shadow"
            >
              Accept Reinforcements
            </button>
          </div>
        </DarkBackgroundWrapper>
      )}

      {/* Skeletons Reinforcement Modal */}
      {addedSkeletons && (
        <DarkBackgroundWrapper onClose={() => setAddedSkeletons(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col p-6 w-[95%] max-w-sm gap-3 items-center justify-center bg-gradient-to-b from-[#042214]/95 via-[#02130b]/95 to-[#010805]/95 border-2 border-emerald-500 shadow-[0_0_55px_rgba(16,185,129,0.55)] rounded-sm text-zinc-100 select-none animate-in fade-in zoom-in-95 duration-200 z-50"
          >
            <span className="absolute -top-1 -left-1 text-xs font-serif text-emerald-400">✦</span>
            <span className="absolute -top-1 -right-1 text-xs font-serif text-emerald-400">✦</span>
            <span className="absolute -bottom-1 -left-1 text-xs font-serif text-emerald-400">✦</span>
            <span className="absolute -bottom-1 -right-1 text-xs font-serif text-emerald-400">✦</span>

            <span className="px-3 py-0.5 rounded-sm bg-emerald-950 border border-emerald-500 text-emerald-200 text-[9px] font-cinzel font-black tracking-widest uppercase">
              REANIMATION COMPLETE
            </span>

            <div className="w-24 h-24 rounded-full border-2 border-emerald-400 p-1 bg-black shadow-[0_0_20px_rgba(16,185,129,0.7)] my-1">
              <img
                className="w-full h-full object-cover object-top rounded-full"
                src={skeletonFace}
                alt="Skeletons"
              />
            </div>

            <h3 className="font-cinzel text-base font-black text-white text-center">
              +40 Skeletons Reanimated!
            </h3>
            <p className="text-xs text-emerald-200/80 font-serif italic text-center">
              Fresh bones have arisen to bolster your deathless battalion.
            </p>

            <button
              type="button"
              onClick={() => setAddedSkeletons(false)}
              className="mt-2 w-full px-6 py-2 rounded-sm bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border border-emerald-500 text-emerald-200 hover:text-white font-cinzel font-black text-xs tracking-widest uppercase shadow"
            >
              Command Horde
            </button>
          </div>
        </DarkBackgroundWrapper>
      )}
    </div>
  );
};

export default PlayerUI;
