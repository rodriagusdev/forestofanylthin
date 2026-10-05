import dmcurse from '../../assets/images/skills/dmcurse.png';
import dmweakness from '../../assets/images/skills/dmweakness.png';
import dmshatterarmor from '../../assets/images/skills/dmshatterarmor.png';
import dmbreachresistances from '../../assets/images/skills/dmbreachresistances.png';
import { Skill } from '../../types';

export const curse: Skill = {
  name: 'Dark Magic: Curse',
  formattedName: 'Curse of Impotence',
  description:
    'Enshrouds target in debilitating malice. The target’s next physical attack deals 0 damage.',
  mechanics:
    'Places a dark hex upon the target division. Their next physical strike is entirely absorbed (0 DMG dealt), upon which the curse is consumed.',
  formula: 'Next Strike DMG = 0 (Curse Consumed)',
  quote: '“May their blades rust in their hands and their arrows splinter in mid-flight.”',
  schoolTier: 'Dark Magic • Circle II Hex',
  targetType: 'Single Enemy',
  manaCost: 4,
  image: dmcurse,
  type: 'Dark Magic',
};

export const weakness: Skill = {
  name: 'Dark Magic: Weakness',
  formattedName: 'Ray of Weakness',
  description:
    'Saps target division’s physical vigor, permanently crippling their attack damage for the rest of battle.',
  mechanics:
    'Applies a permanent attack penalty multiplier to the targeted enemy stack. Multiplier scales with caster spellpower (Heroes) or stack & tier (Creatures).',
  formula:
    'Hero: 30% + (7% × Spellpower) DMG Reduction\nCreature: 20% + (3% × Stack) + (5% × Level) DMG Reduction',
  quote: '“Muscle withers, resolve turns to water, and armor weighs like lead.”',
  schoolTier: 'Dark Magic • Circle I Curse',
  targetType: 'Single Enemy',
  manaCost: 2,
  image: dmweakness,
  type: 'Dark Magic',
};

export const shatterArmor: Skill = {
  name: 'Dark Magic: Shatter Armor',
  formattedName: 'Shatter Armor',
  description:
    'Fractures and disintegrates target’s armor plating permanently. Each point lost exposes them to +10% physical casualties.',
  mechanics:
    'Destroys target division’s armor rating permanently. Armor can be reduced below 0, exposing them to catastrophic bonus physical casualties.',
  formula:
    'Hero: - (1 + 1 × Spellpower) Armor\nCreature: - (1 + 0.7 × Stack + Level / 2) Armor',
  quote: '“Even forged mithril turns brittle when struck by the whispers of the Void.”',
  schoolTier: 'Dark Magic • Circle II Hex',
  targetType: 'Single Enemy',
  manaCost: 3,
  image: dmshatterarmor,
  type: 'Dark Magic',
};

export const breachResistances: Skill = {
  name: 'Dark Magic: Breach Resistances',
  formattedName: 'Breach Resistances',
  description:
    'Sunders enemy arcane wards, reducing Magic Resistance by 4 and increasing magic damage taken by 40%.',
  mechanics:
    'Rips open target division’s spiritual defenses, reducing Magic Resistance by a flat 4. Causes all incoming Destruction spells (e.g. Ice Spear) to inflict +40% bonus devastation.',
  formula: 'Target Magic Resistance -4 (+40% Magic Damage Sustained)',
  quote: '“No ward withstands the hunger of the Abyss when the veil is torn.”',
  schoolTier: 'Dark Magic • Circle II Hex',
  targetType: 'Single Enemy',
  manaCost: 3,
  image: dmbreachresistances,
  type: 'Dark Magic',
};
