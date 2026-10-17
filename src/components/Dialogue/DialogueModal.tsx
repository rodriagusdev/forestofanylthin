import React, { useEffect } from 'react';
import { useCampaignStore, DialogueChoice } from '../../store/useCampaignStore';
import { useActionSound } from '../../hooks';
import { soundEngine } from '../../services/audio/soundEngine';

export const DialogueModal: React.FC = () => {
  const activeDialogue = useCampaignStore((state) => state.activeDialogue);
  const currentDialogueNodeId = useCampaignStore(
    (state) => state.currentDialogueNodeId
  );
  const selectDialogueChoice = useCampaignStore(
    (state) => state.selectDialogueChoice
  );
  const advanceDialogueNode = useCampaignStore(
    (state) => state.advanceDialogueNode
  );
  const closeDialogue = useCampaignStore((state) => state.closeDialogue);
  const { playPreviewSound } = useActionSound();

  const currentNode =
    activeDialogue && currentDialogueNodeId
      ? activeDialogue.nodes[currentDialogueNodeId]
      : null;

  // Auto-play voiceover or narration audio for the active dialogue node
  useEffect(() => {
    if (currentNode?.audio) {
      soundEngine.playVoiceover(currentNode.audio);
    }
    return () => {
      soundEngine.stopVoiceover();
    };
  }, [currentNode?.id, currentNode?.audio]);

  if (!activeDialogue || !currentDialogueNodeId || !currentNode) return null;

  const speaker = currentNode.speaker;
  const hasChoices = currentNode.choices && currentNode.choices.length > 0;

  const handleChoiceClick = (choice: DialogueChoice) => {
    playPreviewSound();
    selectDialogueChoice(choice);
  };

  const handleAdvance = () => {
    playPreviewSound();
    advanceDialogueNode();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-6 select-none font-outfit">
      <div
        className="relative w-full max-w-2xl bg-[#0c0a0e] border border-stone-700 rounded-xs shadow-[0_0_60px_rgba(0,0,0,0.95)] p-6 sm:p-8 text-stone-200 animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Story Title Header */}
        {activeDialogue.title && (
          <div className="flex items-center justify-center mb-4">
            <span className="text-[10px] font-cinzel tracking-[0.25em] text-stone-400 uppercase">
              ◈ {activeDialogue.title} ◈
            </span>
          </div>
        )}

        {/* Speaker Info & Avatar */}
        <div className="flex items-center gap-4 pb-4 border-b border-stone-800">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-stone-700 bg-black flex-shrink-0">
            {speaker.avatar ? (
              <img
                src={speaker.avatar}
                alt={speaker.name}
                className="w-full h-full object-cover object-top rounded-full filter brightness-90"
              />
            ) : (
              <div className="w-full h-full bg-stone-900 flex items-center justify-center text-stone-400 text-lg">
                ◈
              </div>
            )}
          </div>

          <div>
            <h3 className="font-cinzel text-base sm:text-lg font-bold text-stone-100 tracking-wide">
              {speaker.name}
            </h3>
            {speaker.title && (
              <p className="text-[11px] font-cinzel text-stone-400">
                {speaker.title}
              </p>
            )}
          </div>

          <button
            onClick={closeDialogue}
            className="ml-auto w-7 h-7 rounded-full border border-stone-800 bg-black/50 hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-all flex items-center justify-center text-xs"
            title="Dismiss"
          >
            ✕
          </button>
        </div>

        {/* Dialogue Text Content */}
        <div className="py-5 min-h-[90px] flex items-center">
          <p className="text-sm sm:text-base font-serif italic text-stone-200 leading-relaxed">
            “{currentNode.text}”
          </p>
        </div>

        {/* Choices or Continue Prompt */}
        <div className="pt-4 border-t border-stone-800 flex flex-col gap-2">
          {hasChoices ? (
            <div className="flex flex-col gap-2">
              {currentNode.choices?.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoiceClick(choice)}
                  className="w-full py-2.5 px-4 rounded-xs bg-stone-900/60 hover:bg-stone-900 border border-stone-800 hover:border-amber-700/80 text-left text-xs sm:text-sm font-medium text-stone-300 hover:text-amber-100 transition-all flex items-center justify-between group shadow-sm"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-amber-500/70 group-hover:translate-x-1 transition-transform text-xs">
                      ❖
                    </span>
                    <span>{choice.text}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={handleAdvance}
                className="px-6 py-2 rounded-xs bg-stone-900 hover:bg-amber-950/80 border border-stone-700 hover:border-amber-600 text-stone-200 hover:text-amber-100 font-cinzel text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center gap-2"
              >
                <span>{currentNode.nextNodeId ? 'CONTINUE' : 'DEPART'}</span>
                <span>▸</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
