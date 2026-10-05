import skeletonPortrait from "../../../assets/images/portraits/undead/skeleton.jpg";
import skeletonFace from "../../../assets/images/portraits/undead/skeletonface.jpg";
import warlockPortrait from "../../../assets/images/portraits/undead/warlock.jpg";
import warlockFace from "../../../assets/images/portraits/undead/warlockface.jpg";
import lichPortrait from "../../../assets/images/portraits/undead/lich.webp";
import lichFace from "../../../assets/images/portraits/undead/lichface.webp";
import nicolaiPortrait from "../../../assets/images/portraits/undead/nicolai.jpg";
import nicolaiFace from "../../../assets/images/portraits/undead/nicolaiface.jpg";
import lorgrenPortrait from "../../../assets/images/portraits/undead/lorgren.jpg";
import lorgrenFace from "../../../assets/images/portraits/undead/lorgrenface.jpg";
import velishPortrait from "../../../assets/images/portraits/undead/velishacarys.webp";
import velishFace from "../../../assets/images/portraits/undead/velishacarysface.jpg";
import { curse, weakness } from "../../Skills/DarkMagic";
import { attack, clear } from "../../Skills/Combat";
import { reanimate, vampiricLust } from "../../Skills/Necromancy";
import { soundEngine } from "../../../services/audio/soundEngine";

const attackSword = () => soundEngine.play('attack_roynis');
const attackLich = () => soundEngine.play('attack_lich');
const attackVelish = () => soundEngine.play('attack_velish');
const attackNicolai = () => soundEngine.play('attack_nicolai');
const attackUndeadWarlock = () => soundEngine.play('attack_undeadwarlock');

const hittedLich = () => soundEngine.play('hit_lich');
const hittedSkeleton = () => soundEngine.play('hit_skeleton');
const hittedWarlock = () => soundEngine.play('hit_undeadwarlock');
const hittedNicolai = () => soundEngine.play('hit_nicolai');
const hittedVelish = () => soundEngine.play('hit_velish');

const deathVelish = () => soundEngine.play('death_velish');
const deathNicolai = () => soundEngine.play('death_nicolai');
const deathLich = () => soundEngine.play('death_lich');
const deathSkeleton = () => soundEngine.play('death_skeleton');
const deathUndeadWarlock = () => soundEngine.play('death_undeadwarlock');

export const nicolaiSilorn = {
  name: "Nicolai of Silorn",
  id: "Nicolai",
  type: "Hero",
  damage: 71,
  initialArmor: 6,
  armor: 6,
  magicResistance: 0,
  health: 210,
  maxHealth: 210,
  magic: 12,
  maxMagic: 12,
  initiative: "8",
  spellpower: 4,
  portrait: nicolaiPortrait,
  face: nicolaiFace,
  stack: 1,
  maxStack: 1,
  belongsTo: "",
  skills: [clear, attack, vampiricLust, reanimate],
  weaknessDamage: 1,
  cursed: false,
  vampiricHeal: false,
  soundAttack: attackNicolai,
  soundHitted: hittedNicolai,
  soundDeath: deathNicolai,
};

export const lorgrenMalkur = {
  name: "Lorgren Malkur",
  id: "Lorgren",
  type: "Hero",
  damage: 25,
  initialArmor: 4,
  armor: 4,
  magicResistance: 0,
  health: 120,
  maxHealth: 120,
  magic: 60,
  maxMagic: 60,
  initiative: "8",
  spellpower: 6,
  portrait: lorgrenPortrait,
  face: lorgrenFace,
  stack: 1,
  maxStack: 1,
  belongsTo: "",
  skills: [clear, attack, curse],
  weaknessDamage: 1,
  cursed: false,
  vampiricHeal: false,
};

export const velishAcarys = {
  name: "Velish Acarys",
  id: "Velish Acarys",
  type: "Hero",
  damage: 62,
  initialArmor: 2,
  armor: 2,
  magicResistance: 0,
  health: 175,
  maxHealth: 175,
  magic: 12,
  maxMagic: 12,
  initiative: "5",
  spellpower: 7,
  portrait: velishPortrait,
  face: velishFace,
  stack: 1,
  maxStack: 1,
  belongsTo: "",
  skills: [clear, attack, curse],
  weaknessDamage: 1,
  cursed: false,
  vampiricHeal: false,
  soundAttack: attackVelish,
  soundHitted: hittedVelish,
  soundDeath: deathVelish,
};

export const skeleton = {
  name: "Skeleton",
  id: "Skeleton",
  type: "Undead",
  level: 1,
  damage: 3,
  initialArmor: 0,
  armor: 0,
  magicResistance: 0,
  health: 6,
  maxHealth: 6,
  magic: 0,
  maxMagic: 0,
  initiative: "2",
  portrait: skeletonPortrait,
  face: skeletonFace,
  stack: 1,
  maxStack: 1,
  belongsTo: "",
  skills: [clear, attack],
  weaknessDamage: 1,
  cursed: false,
  vampiricHeal: false,
  soundAttack: attackSword,
  soundHitted: hittedSkeleton,
  soundDeath: deathSkeleton,
};

export const undeadWarlock = {
  name: "Undead Warlock",
  id: "Undead Warlock",
  type: "Undead",
  level: 3,
  damage: 12,
  initialArmor: 1,
  armor: 1,
  magicResistance: 0,
  health: 16,
  maxHealth: 16,
  magic: 4,
  maxMagic: 4,
  initiative: "1",
  portrait: warlockPortrait,
  face: warlockFace,
  stack: 1,
  maxStack: 1,
  belongsTo: "",
  skills: [clear, attack, curse],
  weaknessDamage: 1,
  cursed: false,
  vampiricHeal: false,
  isRanged: true,
  soundAttack: attackUndeadWarlock,
  soundHitted: hittedWarlock,
  soundDeath: deathUndeadWarlock,
};

export const lich = {
  name: "Lich",
  id: "Lich",
  type: "Undead",
  level: 5,
  damage: 27,
  initialArmor: 4,
  armor: 4,
  magicResistance: 0,
  health: 33,
  maxHealth: 33,
  magic: 8,
  maxMagic: 8,
  initiative: "6",
  portrait: lichPortrait,
  face: lichFace,
  stack: 1,
  maxStack: 1,
  belongsTo: "",
  skills: [clear, attack, curse, weakness],
  weaknessDamage: 1,
  cursed: false,
  vampiricHeal: false,
  isRanged: true,
  soundAttack: attackLich,
  soundHitted: hittedLich,
  soundDeath: deathLich,
};
