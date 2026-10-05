import destructionrainoffire from '../../assets/images/skills/destructionfirerain.png';
import destructionicespear from '../../assets/images/skills/destructionicespear.png';
import { Skill } from '../../types';

export const rainOfFire: Skill = {
  name: 'Destruction: Rain of Fire',
  formattedName: 'Rain of Fire',
  description:
    'Calls down a cataclysmic meteor shower from the burning skies, dealing flat magic damage to every enemy division simultaneously.',
  mechanics:
    'Unleashes catastrophic AoE devastation across the entire battlefield. Deals flat unblockable magic damage to every enemy stack on the field.',
  formula:
    'Hero: 30 + (5 × Spellpower) Magic DMG per division\nCreature: 10 + (3 × Stack) + (3 × Level) Magic DMG',
  quote:
    '“Let the heavens bleed cinder and ash until only smoking craters remain.” — Elisith of the Covenant',
  schoolTier: 'Destruction Magic • Master Arcana',
  targetType: 'All Enemy Divisions',
  manaCost: 10,
  image: destructionrainoffire,
  type: 'Destruction',
};

export const iceSpear: Skill = {
  name: 'Destruction: Ice Spear',
  formattedName: 'Ice Spear',
  description:
    'Conjures an armor-piercing spear of glacial frost. Deals 95 base damage, scaling with target magic vulnerability (up to 133 DMG if Breached).',
  mechanics:
    'Impales a single enemy stack with hyper-compressed glacial frost. Ignores physical armor and amplifies if target magic resistance was breached.',
  formula: 'Damage = 95 × (1 - Magic Resistance / 10)',
  quote: '“Colder than the grave, swifter than the final winter breath.”',
  schoolTier: 'Destruction Magic • Circle III Evocation',
  targetType: 'Single Enemy',
  manaCost: 7,
  image: destructionicespear,
  type: 'Destruction',
};
