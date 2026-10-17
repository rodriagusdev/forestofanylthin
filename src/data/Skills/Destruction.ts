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
    'Conjures an armor-piercing spear of glacial frost. Deals massive single-target magic damage scaling with Hero Spellpower and amplified by target magic vulnerability.',
  mechanics:
    'Impales a single enemy stack with hyper-compressed glacial frost. Scales with Spellpower, ignores physical armor, and amplifies if target magic resistance was breached.',
  formula:
    'Hero: (95 + 8 × Spellpower) × (1 - Magic Resistance / 10)\nCreature: (40 + 5 × Stack + 5 × Level) × (1 - Magic Resistance / 10)',
  quote: '“Colder than the grave, swifter than the final winter breath.”',
  schoolTier: 'Destruction Magic • Circle III Evocation',
  targetType: 'Single Enemy',
  manaCost: 7,
  image: destructionicespear,
  type: 'Destruction',
};
