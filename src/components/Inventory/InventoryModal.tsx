import React, { useState } from 'react';
import { useCampaignStore } from '../../store/useCampaignStore';
import { DarkBackgroundWrapper } from '../DarkBackgroundWrapper';
import { useActionSound } from '../../hooks';
import { EquipmentSlot, InventoryItem } from '../../types';
import healthIcon from '../../assets/images/stats/health.png';
import damageIcon from '../../assets/images/stats/damage.png';
import armorIcon from '../../assets/images/stats/armor.png';
import hourglassIcon from '../../assets/images/stats/hourglass.png';
import { calculateEquipmentBonuses } from '../../helpers/inventory/inventoryCalculations';

export const InventoryModal: React.FC = () => {
  const isInventoryOpen = useCampaignStore((state) => state.isInventoryOpen);
  const closeInventory = useCampaignStore((state) => state.closeInventory);
  const equipment = useCampaignStore((state) => state.equipment);
  const inventory = useCampaignStore((state) => state.inventory);
  const heroStats = useCampaignStore((state) => state.heroStats);
  const equipItem = useCampaignStore((state) => state.equipItem);
  const unequipItem = useCampaignStore((state) => state.unequipItem);

  // Default selection to first non-null equipped slot if available
  const initialSlot: EquipmentSlot = equipment.helm
    ? 'helm'
    : equipment.armor
    ? 'armor'
    : equipment.ring1
    ? 'ring1'
    : equipment.ring2
    ? 'ring2'
    : 'helm';

  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(initialSlot);
  const [selectedStashItem, setSelectedStashItem] = useState<InventoryItem | null>(null);

  const { playPreviewSound } = useActionSound();

  if (!isInventoryOpen) return null;

  const bonuses = calculateEquipmentBonuses(equipment);

  // Current active inspected item (either from an equipped slot or from stash)
  const activeItem: InventoryItem | null = selectedStashItem
    ? selectedStashItem
    : selectedSlot
    ? equipment[selectedSlot]
    : null;

  const handleSelectSlot = (slot: EquipmentSlot) => {
    playPreviewSound();
    setSelectedSlot(slot);
    setSelectedStashItem(null);
  };

  const handleSelectStashItem = (item: InventoryItem) => {
    playPreviewSound();
    setSelectedStashItem(item);
    setSelectedSlot(null);
  };

  const handleEquip = (item: InventoryItem) => {
    playPreviewSound();
    equipItem(item);
    setSelectedStashItem(null);
    setSelectedSlot(
      item.slot === 'helm'
        ? 'helm'
        : item.slot === 'armor'
        ? 'armor'
        : !equipment.ring1
        ? 'ring1'
        : 'ring2'
    );
  };

  const handleUnequip = (slot: EquipmentSlot) => {
    playPreviewSound();
    unequipItem(slot);
    setSelectedSlot(slot);
    setSelectedStashItem(null);
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'Relic':
        return 'text-amber-400 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.4)] bg-amber-950/30';
      case 'Epic':
        return 'text-fuchsia-400 border-fuchsia-500/80 shadow-[0_0_15px_rgba(217,70,239,0.4)] bg-purple-950/30';
      case 'Rare':
        return 'text-cyan-400 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-cyan-950/30';
      default:
        return 'text-stone-300 border-stone-700 bg-stone-900/50';
    }
  };

  const getRarityGlow = (rarity?: string) => {
    switch (rarity) {
      case 'Relic':
        return 'shadow-[0_0_30px_rgba(245,158,11,0.5)] border-amber-500';
      case 'Epic':
        return 'shadow-[0_0_30px_rgba(217,70,239,0.5)] border-fuchsia-500';
      case 'Rare':
        return 'shadow-[0_0_30px_rgba(6,182,212,0.4)] border-cyan-500';
      default:
        return 'shadow-[0_0_20px_rgba(120,113,108,0.3)] border-stone-600';
    }
  };

  const renderSlotCard = (slot: EquipmentSlot, label: string, item: InventoryItem | null) => {
    const isSelected = selectedSlot === slot && !selectedStashItem;
    return (
      <div
        key={slot}
        onClick={() => handleSelectSlot(slot)}
        className={`relative p-2.5 rounded-sm border transition-all cursor-pointer flex items-center justify-between min-h-[70px] backdrop-blur-md ${
          item
            ? `${getRarityColor(item.rarity)} ${
                isSelected
                  ? 'ring-2 ring-amber-400 scale-[1.02] shadow-[0_0_20px_rgba(245,158,11,0.6)] bg-black/80'
                  : 'hover:scale-[1.01] bg-black/50'
              }`
            : isSelected
            ? 'border-amber-500/80 ring-1 ring-amber-400 bg-black/60 text-stone-400'
            : 'border-dashed border-stone-800 bg-black/40 text-stone-600 hover:border-stone-700'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {item?.icon ? (
            <img
              src={item.icon}
              alt={item.name}
              className="w-10 h-10 rounded-xs border border-stone-700/90 object-cover shrink-0 shadow"
            />
          ) : (
            <div className="w-10 h-10 rounded-xs border border-stone-800 bg-black/60 flex items-center justify-center text-xs text-stone-600 shrink-0 font-cinzel">
              ❖
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-cinzel tracking-widest uppercase font-bold text-stone-400">
                {label}
              </span>
              {item && (
                <span className="text-[8px] font-mono uppercase px-1.5 py-0.2 rounded bg-black/80 border border-stone-800">
                  {item.rarity}
                </span>
              )}
            </div>

            {item ? (
              <div>
                <h4 className="font-cinzel text-xs font-black tracking-wide text-white truncate mt-0.5">
                  {item.name}
                </h4>
                <div className="flex flex-wrap gap-1 mt-0.5 text-[9px] font-mono text-stone-300">
                  {item.stats.armor ? <span className="text-pink-300">+{item.stats.armor} ARM</span> : null}
                  {item.stats.health ? <span className="text-rose-300">+{item.stats.health} HP</span> : null}
                  {item.stats.damage ? <span className="text-amber-300">+{item.stats.damage} ATK</span> : null}
                  {item.stats.spellpower ? <span className="text-indigo-300">+{item.stats.spellpower} SP</span> : null}
                  {item.stats.magic ? <span className="text-fuchsia-300">+{item.stats.magic} MP</span> : null}
                  {item.stats.initiative ? <span className="text-cyan-300">+{item.stats.initiative} INIT</span> : null}
                  {item.stats.magicResistance ? <span className="text-purple-300">+{item.stats.magicResistance} RES</span> : null}
                </div>
              </div>
            ) : (
              <span className="font-cinzel text-[10px] text-stone-600 italic block mt-0.5">
                — Empty Slot —
              </span>
            )}
          </div>
        </div>

        {isSelected && (
          <span className="text-amber-400 text-xs pl-2 shrink-0">◀</span>
        )}
      </div>
    );
  };

  const heroImageSrc = heroStats?.portrait || heroStats?.face;

  return (
    <DarkBackgroundWrapper zIndex={100200} onClose={closeInventory}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col w-[95%] max-w-5xl bg-[#0b090e]/95 border-2 border-stone-700 p-5 sm:p-7 rounded-sm shadow-[0_0_70px_rgba(0,0,0,0.95)] backdrop-blur-2xl select-none animate-in fade-in zoom-in-95 duration-200 z-50 text-stone-200 max-h-[94vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-5">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 text-xs">❖</span>
            <h2 className="text-sm sm:text-base font-cinzel font-black tracking-[0.2em] text-white uppercase">
              COMMANDER ARMORY & RELICS
            </h2>
          </div>
          <button
            type="button"
            onClick={closeInventory}
            className="w-7 h-7 rounded-full border border-stone-800 bg-black/60 hover:bg-stone-800 text-stone-400 hover:text-white transition-all flex items-center justify-center text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* 2-Column Grid: Left (Hero Portrait + Stats) | Right (Slots, Stash, and Large Item Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Great Hero Portrait & Stats Below */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Full Hero Portrait Frame */}
            <div className="relative rounded-sm overflow-hidden border-2 border-stone-700/80 bg-black shadow-[0_0_30px_rgba(0,0,0,0.9)] group">
              {heroImageSrc ? (
                <div className="relative w-full h-[320px] sm:h-[350px] overflow-hidden bg-stone-950">
                  <img
                    src={heroImageSrc}
                    alt={heroStats?.name || 'Commander'}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Gradient Overlays for dark-fantasy atmosphere */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b090e] via-transparent to-black/30 pointer-events-none" />
                  <div className="absolute inset-0 border border-amber-500/20 pointer-events-none" />

                  {/* Hero Title Overlay */}
                  <div className="absolute bottom-3 left-4 right-4 flex flex-col">
                    <span className="text-[10px] font-cinzel tracking-widest uppercase text-amber-400 font-bold drop-shadow">
                      {heroStats?.type || 'Commander'}
                    </span>
                    <h3 className="font-cinzel text-lg sm:text-xl font-black text-white tracking-wide drop-shadow-md">
                      {heroStats?.name || 'Hero'}
                    </h3>
                  </div>
                </div>
              ) : (
                <div className="w-full h-[320px] flex items-center justify-center bg-stone-900 text-stone-600 font-cinzel text-sm">
                  Portrait Unavailable
                </div>
              )}
            </div>

            {/* Stats Grid Below Hero Portrait */}
            <div className="p-4 rounded-sm bg-black/60 border border-stone-800/90 shadow-inner">
              <div className="flex items-center justify-between border-b border-stone-800/80 pb-2 mb-3">
                <span className="font-cinzel text-xs font-black tracking-wider text-stone-300 uppercase">
                  ATTRIBUTES & STATS
                </span>
                <span className="text-[9px] font-mono text-stone-500 uppercase">
                  ACTIVE MODIFIERS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-black/70 border border-stone-800/80">
                  <span className="text-stone-300 flex items-center gap-1.5 text-[11px]">
                    <img src={healthIcon} alt="HP" className="w-3.5 h-3.5 object-contain" /> Vitality
                  </span>
                  <span className="font-bold text-rose-300">
                    {heroStats?.health}{' '}
                    {bonuses.health > 0 && <span className="text-emerald-400 text-[9.5px]">(+{bonuses.health})</span>}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-black/70 border border-stone-800/80">
                  <span className="text-stone-300 flex items-center gap-1.5 text-[11px]">
                    <img src={damageIcon} alt="ATK" className="w-3.5 h-3.5 object-contain" /> Attack
                  </span>
                  <span className="font-bold text-amber-300">
                    {heroStats?.damage}{' '}
                    {bonuses.damage > 0 && <span className="text-emerald-400 text-[9.5px]">(+{bonuses.damage})</span>}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-black/70 border border-stone-800/80">
                  <span className="text-stone-300 flex items-center gap-1.5 text-[11px]">
                    <img src={armorIcon} alt="ARM" className="w-3.5 h-3.5 object-contain" /> Armor
                  </span>
                  <span className="font-bold text-pink-300">
                    {heroStats?.armor}{' '}
                    {bonuses.armor > 0 && <span className="text-emerald-400 text-[9.5px]">(+{bonuses.armor})</span>}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-black/70 border border-stone-800/80">
                  <span className="text-stone-300 flex items-center gap-1.5 text-[11px]">
                    <img src={hourglassIcon} alt="SPD" className="w-3.5 h-3.5 object-contain" /> Speed
                  </span>
                  <span className="font-bold text-cyan-300">
                    {heroStats?.initiative}{' '}
                    {bonuses.initiative > 0 && <span className="text-emerald-400 text-[9.5px]">(+{bonuses.initiative})</span>}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-black/70 border border-stone-800/80">
                  <span className="text-stone-300 text-[11px]">✦ Spellpower</span>
                  <span className="font-bold text-indigo-300">
                    {heroStats?.spellpower || 0}{' '}
                    {bonuses.spellpower > 0 && <span className="text-emerald-400 text-[9.5px]">(+{bonuses.spellpower})</span>}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-black/70 border border-stone-800/80">
                  <span className="text-stone-300 text-[11px]">✦ Mana Pool</span>
                  <span className="font-bold text-fuchsia-300">
                    {heroStats?.magic || 0}{' '}
                    {bonuses.magic > 0 && <span className="text-emerald-400 text-[9.5px]">(+{bonuses.magic})</span>}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Equipped Slots + Stash + Large Relic Inspector */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Equipment Slots Grid (4 Slots) */}
            <div className="flex flex-col gap-2 p-3.5 rounded-sm bg-black/60 border border-stone-800/90">
              <div className="flex items-center justify-between border-b border-stone-800/80 pb-1.5 mb-1">
                <span className="font-cinzel text-xs font-black tracking-wider text-amber-200 uppercase">
                  EQUIPPED RELICS
                </span>
                <span className="text-[9px] font-mono text-stone-500">4 SLOTS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {renderSlotCard('helm', 'HELM', equipment.helm)}
                {renderSlotCard('armor', 'ARMOR', equipment.armor)}
                {renderSlotCard('ring1', 'RING I', equipment.ring1)}
                {renderSlotCard('ring2', 'RING II', equipment.ring2)}
              </div>
            </div>

            {/* Expedition Stash (Unequipped Items) */}
            <div className="flex flex-col p-3.5 rounded-sm bg-black/60 border border-stone-800/90">
              <div className="flex items-center justify-between border-b border-stone-800/80 pb-1.5 mb-2">
                <span className="font-cinzel text-xs font-black tracking-wider text-stone-300 uppercase">
                  EXPEDITION STASH
                </span>
                <span className="text-[9px] font-mono text-stone-500">
                  {inventory.length} UNEQUIPPED
                </span>
              </div>

              {inventory.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-stone-600 py-3">
                  <p className="font-cinzel text-xs text-stone-500">
                    Stash is currently empty.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                  {inventory.map((item) => {
                    const isSelected = selectedStashItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectStashItem(item)}
                        className={`p-2 rounded-sm border transition-all cursor-pointer flex items-center justify-between ${
                          getRarityColor(item.rarity)
                        } ${
                          isSelected
                            ? 'ring-2 ring-amber-400 scale-[1.01] shadow-[0_0_15px_rgba(245,158,11,0.5)] bg-black/80'
                            : 'hover:scale-[1.01] bg-black/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {item.icon ? (
                            <img
                              src={item.icon}
                              alt={item.name}
                              className="w-8 h-8 rounded-xs border border-stone-700/80 object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-xs border border-stone-800 bg-black/60 flex items-center justify-center text-xs text-stone-600 shrink-0 font-cinzel">
                              ❖
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-cinzel text-xs font-bold text-white truncate">
                              {item.name}
                            </h4>
                            <span className="text-[9px] font-mono uppercase text-stone-400">
                              {item.slot} • {item.rarity}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEquip(item);
                          }}
                          className="px-2 py-0.5 rounded-xs font-cinzel text-[9px] font-black uppercase text-amber-200 bg-amber-950/80 hover:bg-amber-900 border border-amber-600 transition-all cursor-pointer ml-1 shrink-0"
                        >
                          EQUIP
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Large Item Preview & Lore Inspector */}
            <div className="flex-1 p-4 sm:p-5 rounded-sm bg-black/70 border border-stone-800/90 flex flex-col justify-between min-h-[260px]">
              {activeItem ? (
                <div className="flex flex-col gap-3.5">
                  {/* Big Image + Title Header */}
                  <div className="flex items-start gap-4 pb-3.5 border-b border-stone-800/80">
                    {activeItem.icon ? (
                      <div className={`relative p-1 rounded-sm border-2 ${getRarityGlow(activeItem.rarity)} bg-black/90 shrink-0`}>
                        <img
                          src={activeItem.icon}
                          alt={activeItem.name}
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-xs object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-sm border-2 border-stone-800 bg-black/80 flex items-center justify-center text-3xl text-stone-600 shrink-0 font-cinzel">
                        ❖
                      </div>
                    )}

                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/50 border border-amber-800/60">
                            {activeItem.slot}
                          </span>
                          <span className="text-[10px] font-mono uppercase text-stone-400 px-2 py-0.5 rounded bg-black/60 border border-stone-800">
                            {activeItem.rarity}
                          </span>
                          {selectedStashItem && (
                            <span className="text-[9px] font-mono uppercase text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/50 border border-cyan-800">
                              In Stash
                            </span>
                          )}
                        </div>

                        <h3 className="font-cinzel text-base sm:text-lg font-black text-white tracking-wide leading-snug">
                          {activeItem.name}
                        </h3>
                      </div>

                      {/* Stat Badges */}
                      <div className="flex flex-wrap gap-1 mt-1.5 text-[10px] font-mono">
                        {activeItem.stats.armor ? (
                          <span className="px-2 py-0.5 rounded bg-pink-950/40 border border-pink-700/50 text-pink-300">
                            +{activeItem.stats.armor} Armor
                          </span>
                        ) : null}
                        {activeItem.stats.health ? (
                          <span className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-700/50 text-rose-300">
                            +{activeItem.stats.health} Vitality
                          </span>
                        ) : null}
                        {activeItem.stats.damage ? (
                          <span className="px-2 py-0.5 rounded bg-amber-950/40 border border-amber-700/50 text-amber-300">
                            +{activeItem.stats.damage} Attack
                          </span>
                        ) : null}
                        {activeItem.stats.spellpower ? (
                          <span className="px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-700/50 text-indigo-300">
                            +{activeItem.stats.spellpower} Spellpower
                          </span>
                        ) : null}
                        {activeItem.stats.magic ? (
                          <span className="px-2 py-0.5 rounded bg-fuchsia-950/40 border border-fuchsia-700/50 text-fuchsia-300">
                            +{activeItem.stats.magic} Mana
                          </span>
                        ) : null}
                        {activeItem.stats.initiative ? (
                          <span className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-700/50 text-cyan-300">
                            +{activeItem.stats.initiative} Speed
                          </span>
                        ) : null}
                        {activeItem.stats.magicResistance ? (
                          <span className="px-2 py-0.5 rounded bg-purple-950/40 border border-purple-700/50 text-purple-300">
                            +{activeItem.stats.magicResistance} Magic Resist
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Description & Lore */}
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs sm:text-sm text-stone-300 font-serif leading-relaxed">
                      {activeItem.description}
                    </p>

                    {activeItem.lore && (
                      <p className="text-xs text-stone-400 font-serif italic border-l-2 border-amber-600/60 pl-3 py-0.5 bg-black/40 rounded-r">
                        “{activeItem.lore}”
                      </p>
                    )}
                  </div>

                  {/* Contextual Action (Equip or Unequip) */}
                  <div className="pt-1">
                    {selectedStashItem ? (
                      <button
                        type="button"
                        onClick={() => handleEquip(selectedStashItem)}
                        className="w-full py-2.5 px-4 rounded-xs font-cinzel text-xs font-black tracking-wider uppercase text-stone-100 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 hover:from-amber-900 hover:to-amber-800 border border-amber-500 transition-all cursor-pointer shadow"
                      >
                        EQUIP {selectedStashItem.name.toUpperCase()}
                      </button>
                    ) : selectedSlot && equipment[selectedSlot] ? (
                      <button
                        type="button"
                        onClick={() => handleUnequip(selectedSlot)}
                        className="w-full py-2 px-4 rounded-xs font-cinzel text-xs font-bold tracking-wider uppercase text-rose-200 bg-rose-950/80 hover:bg-rose-900 border border-rose-600 transition-all cursor-pointer shadow"
                      >
                        UNEQUIP {selectedSlot.toUpperCase()}
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8 text-stone-600">
                  <span className="text-3xl mb-2 text-stone-700">❖</span>
                  <h4 className="font-cinzel text-sm font-bold text-stone-400 uppercase tracking-wider">
                    {selectedSlot ? `${selectedSlot.toUpperCase()} Slot is Empty` : 'No Relic Selected'}
                  </h4>
                  <p className="font-serif text-xs text-stone-500 max-w-sm mt-1">
                    Select an equipped relic or an item from your stash to inspect its artwork, power, and ancient inscriptions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-5 border-t border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={closeInventory}
            className="px-6 py-2 rounded-xs font-cinzel text-xs font-bold tracking-wider uppercase text-stone-300 bg-stone-900 hover:bg-stone-800 border border-stone-700 transition-all cursor-pointer"
          >
            DISMISS
          </button>
        </div>
      </div>
    </DarkBackgroundWrapper>
  );
};

export default InventoryModal;
