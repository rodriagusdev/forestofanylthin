import dryexaranger from "../../../assets/images/portraits/dryexa/dryexaranger.webp";
import dryexarangerFace from "../../../assets/images/portraits/dryexa/dryexarangerface.jpg";
import { soundEngine } from "../../../services/audio/soundEngine";
import { attack, clear } from "../../Skills/Combat";
import { UnitStats } from "../../../types";

const attackRanger = () => {
  soundEngine.play("attack_ranger");
};

const hittedRanger = () => {
  soundEngine.play("hit_ranger");
};

const deathRanger = () => {
  soundEngine.play("death_ranger");
};

export const dryexaRanger: UnitStats = {
  name: "Dryexa Ranger",
  id: "Dryexa Ranger",
  type: "Dryexa",
  level: 4,
  damage: 12,
  initialArmor: 0,
  armor: 0,
  magicResistance: 0,
  health: 13,
  maxHealth: 13,
  magic: 0,
  maxMagic: 0,
  initiative: "7",
  portrait: dryexaranger,
  face: dryexarangerFace,
  stack: 1,
  maxStack: 1,
  belongsTo: "",
  skills: [clear, attack],
  weaknessDamage: 1,
  cursed: false,
  isRanged: true,
  soundAttack: attackRanger,
  soundHitted: hittedRanger,
  soundDeath: deathRanger,
  updatedDamage: 12,
  updatedHealth: 13,
};
