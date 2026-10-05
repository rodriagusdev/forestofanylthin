import ngvampiriclust from '../../assets/images/skills/ngvampirism.png';
import ngreanimate from '../../assets/images/skills/ngreanimate.png';
import { Skill } from '../../types';

export const vampiricLust: Skill = {
  name: 'Necromancy: Vampiric Lust',
  formattedName: 'Vampiric Lust',
  description:
    'Bestows the ancient hunger of vampires upon an allied division. 60% of all physical damage dealt is converted into life drain.',
  mechanics:
    'Permanently imbues an allied division with bloodthirst for the entire encounter. When executing physical strikes, 60% of actual damage inflicted restores the division’s lost vitality.',
  formula: 'Life Drain = 60% of Physical Damage Dealt (Caps at Max HP)',
  quote:
    '“Drink deep of their warm blood and mock the fragility of mortal flesh.”',
  schoolTier: 'Forbidden Necromancy • Blood Rite',
  targetType: 'Friendly Division',
  manaCost: 6,
  image: ngvampiriclust,
  type: 'Necromancy',
};

export const reanimate: Skill = {
  name: 'Necromancy: Reanimate',
  formattedName: 'Reanimate Undead',
  description:
    'Restores an active or fallen allied division to maximum health and restores 100% of their troop casualties. (If the division is already fallen, open the ☠ Crypt tab on the left to reanimate them onto the field).',
  mechanics:
    'Channels dark necromantic energy into an allied battalion. Instantly restores the stack count to its full starting size and replenishes total health to 100%. If the division has already fallen in battle, navigate to the ☠ Crypt tab in the left Chronicle panel to resurrect them back into active combat.',
  formula: 'Restoration = Max Stack & 100% Max Health (From Field or ☠ Crypt)',
  quote:
    '“In the Necropolis of Silorn, death is not an ending — it is merely a reassignment.” — Nicolai',
  schoolTier: 'Forbidden Necromancy • Sacred Rite',
  targetType: 'Friendly Division (Field / Crypt)',
  manaCost: 6,
  image: ngreanimate,
  type: 'Necromancy',
};
