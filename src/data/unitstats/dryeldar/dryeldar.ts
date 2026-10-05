import { attack, clear } from '../../Skills/Combat';
import {
  breachResistances,
  curse,
  shatterArmor,
  weakness,
} from '../../Skills/DarkMagic';
import { iceSpear, rainOfFire } from '../../Skills/Destruction';
import elisithPortrait from '../../../assets/images/portraits/dryeldar/elisith.jpg';
import elisithFace from '../../../assets/images/portraits/dryeldar/elisithface.jpg';
import darkMatronPortrait from '../../../assets/images/portraits/dryeldar/darkmatron2.jpg';
import darkMatronFace from '../../../assets/images/portraits/dryeldar/darkmatron2face.jpg';
import twistedJinPortrait from '../../../assets/images/portraits/dryeldar/twistedjin.jpg';
import twistedJinFace from '../../../assets/images/portraits/dryeldar/twistedjinface.jpg';
import enslavedroynisPortrait from '../../../assets/images/portraits/dryeldar/enslavedroynis.jpg';
import enslavedroynisFace from '../../../assets/images/portraits/dryeldar/enslavedroynisface.jpg';
import { UnitStats } from '../../../types';
import { soundEngine } from '../../../services/audio/soundEngine';

const attackSword = () => soundEngine.play('attack_roynis');
const attackTwistedJin = () => soundEngine.play('attack_twistedjin');
const attackDarkMatron = () => soundEngine.play('attack_darkmatron');
const attackElisith = () => soundEngine.play('attack_elisith');

const hittedRoynis = () => soundEngine.play('hit_roynis');
const hittedTwistedJin = () => soundEngine.play('hit_twistedjin');
const hittedDarkMatron = () => soundEngine.play('hit_darkmatron');
const hittedElisith = () => soundEngine.play('hit_elisith');

const deathTwistedJin = () => soundEngine.play('death_twistedjin');
const deathDarkMatron = () => soundEngine.play('death_darkmatron');
const deathRoynis = () => soundEngine.play('death_roynis');

export const elisith: UnitStats = {
  name: 'Elisith',
  id: 'Elisith',
  type: 'Hero',
  damage: 56,
  initialArmor: 5,
  armor: 5,
  magicResistance: 0,
  health: 145,
  maxHealth: 145,
  magic: 18,
  maxMagic: 18,
  initiative: '9',
  spellpower: 5,
  portrait: elisithPortrait,
  face: elisithFace,
  stack: 1,
  maxStack: 1,
  belongsTo: '',
  skills: [clear, attack, curse, rainOfFire, iceSpear],
  weaknessDamage: 1,
  cursed: false,
  isRanged: true,
  soundAttack: attackElisith,
  soundHitted: hittedElisith,
  soundDeath: deathRoynis,
  updatedDamage: 56,
  updatedHealth: 145,
};

export const enslavedRoynis: UnitStats = {
  name: 'Enslaved Roynis',
  id: 'Enslaved Roynis',
  type: 'Dryeldar',
  level: 1,
  damage: 7,
  initialArmor: 1,
  armor: 1,
  magicResistance: 0,
  health: 8,
  maxHealth: 8,
  magic: 0,
  maxMagic: 0,
  initiative: '4',
  portrait: enslavedroynisPortrait,
  face: enslavedroynisFace,
  stack: 1,
  maxStack: 1,
  belongsTo: '',
  skills: [clear, attack],
  weaknessDamage: 1,
  cursed: false,
  soundAttack: attackSword,
  soundHitted: hittedRoynis,
  soundDeath: deathRoynis,
  updatedDamage: 7,
  updatedHealth: 8,
};

export const twistedJin: UnitStats = {
  name: 'Twisted Jin',
  id: 'Twisted Jin',
  type: 'Dryeldar',
  level: 4,
  damage: 21,
  initialArmor: 2,
  armor: 2,
  magicResistance: 0,
  health: 25,
  maxHealth: 25,
  magic: 4,
  maxMagic: 4,
  initiative: '6',
  portrait: twistedJinPortrait,
  face: twistedJinFace,
  stack: 1,
  maxStack: 1,
  belongsTo: '',
  skills: [clear, attack, weakness, curse],
  weaknessDamage: 1,
  cursed: false,
  soundAttack: attackTwistedJin,
  soundHitted: hittedTwistedJin,
  soundDeath: deathTwistedJin,
  updatedDamage: 21,
  updatedHealth: 25,
};

export const darkMatron: UnitStats = {
  name: 'Dark Matron',
  id: 'Dark Matron',
  type: 'Dryeldar',
  level: 6,
  damage: 29,
  initialArmor: 5,
  armor: 5,
  magicResistance: 0,
  health: 50,
  maxHealth: 50,
  magic: 6,
  maxMagic: 6,
  initiative: '5',
  portrait: darkMatronPortrait,
  face: darkMatronFace,
  stack: 1,
  maxStack: 1,
  belongsTo: '',
  skills: [clear, attack, shatterArmor, breachResistances],
  weaknessDamage: 1,
  cursed: false,
  soundAttack: attackDarkMatron,
  soundHitted: hittedDarkMatron,
  soundDeath: deathDarkMatron,
  updatedDamage: 29,
  updatedHealth: 50,
};
