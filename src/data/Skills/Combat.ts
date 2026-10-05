import cbattack from '../../assets/images/skills/cbattack.png';
import cbclear from '../../assets/images/skills/clear.png';
import { Skill } from '../../types';

export const clear: Skill = {
  name: 'Combat: Clear Action',
  formattedName: 'Reconnaissance / Disarm',
  description:
    'Disarms the armed action and surveys the field. Allows inspecting enemy division attributes and stats.',
  mechanics:
    'Disarms any currently selected spell or martial strike. Allows inspecting unit codexes, casualties forecast, and resistances without consuming the turn.',
  quote: '“A general who strikes blindly has already surrendered the field.”',
  schoolTier: 'Tactical Command • Stance',
  targetType: 'Self / Field',
  manaCost: 0,
  image: cbclear,
  type: 'Combat',
};

export const attack: Skill = {
  name: 'Combat: Attack',
  formattedName: 'Physical Strike',
  description:
    'Standard martial assault. Deals physical damage mitigated by target armor (each 1 Armor = 10% reduction).',
  mechanics:
    'Executes a direct physical strike against the enemy division. Damage is reduced by target armor (10% mitigation per point of armor, up to 100%). If the attacker possesses Vampiric Lust, restores 60% of dealt damage as health.',
  formula: 'Actual DMG = (Stack × Unit DMG) × (1 - Armor / 10)',
  quote: '“Iron breaks flesh; flesh yields to the cold earth.”',
  schoolTier: 'Martial Prowess • Basic Attack',
  targetType: 'Single Enemy',
  manaCost: 0,
  image: cbattack,
  type: 'Combat',
};

export const defend: Skill = {
  name: 'Combat: Defend',
  formattedName: 'Defensive Stance',
  description:
    'Assumes a fortified defensive posture. Temporarily boosts Armor by +3 (+30% physical damage mitigation) until the unit’s next turn.',
  mechanics:
    'Unit braces for incoming assault, locking shields and parrying blows. Grants +3 temporary Armor (+30% damage mitigation) until its next active turn.',
  formula: 'Temporary Armor +3 (+30% Physical Damage Mitigation)',
  quote: '“Stand firm as the fortress walls; let their blades shatter upon our shields.”',
  schoolTier: 'Tactical Command • Fortification',
  targetType: 'Self',
  manaCost: 0,
  image: cbclear,
  type: 'Combat',
};

export const waitSkill: Skill = {
  name: 'Combat: Wait',
  formattedName: 'Wait / Delay Turn',
  description:
    'Delays the unit’s turn to the end of the current initiative round. Can only be used once per round.',
  mechanics:
    'The division holds its position and watches enemy movements, deferring its action until all other divisions in the initiative queue have acted.',
  quote: '“Patience in warfare is the edge that cuts the deepest.”',
  schoolTier: 'Tactical Command • Maneuver',
  targetType: 'Self',
  manaCost: 0,
  image: cbclear,
  type: 'Combat',
};
