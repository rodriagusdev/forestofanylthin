import {
  lich,
  skeleton,
  undeadWarlock,
  velishAcarys,
} from "./unitstats/undead/undead";

export const lostGlade = [
  {
    ...skeleton,
    stack: 60,
    id: "Glade Skeleton",
    belongsTo: "enemy",
    updatedHealth: skeleton.health * 60,
    updatedDamage: skeleton.damage * 60,
    maxStack: 60,
    maxHealth: skeleton.health * 60,
  },
];

export const cemetery = [
  {
    ...skeleton,
    stack: 25,
    id: "Cemetery Skeleton",
    belongsTo: "enemy",
    updatedHealth: skeleton.health * 25,
    updatedDamage: skeleton.damage * 25,
    maxStack: 25,
    maxHealth: skeleton.health * 25,
  },
  {
    ...lich,
    stack: 1,
    id: "Cemetery Lich",
    belongsTo: "enemy",
    updatedHealth: lich.health,
    updatedDamage: lich.damage,
    maxStack: 1,
    maxHealth: lich.health,
  },
];

export const gloomyForest = [
  {
    ...skeleton,
    stack: 25,
    id: "Forest Skeleton",
    belongsTo: "enemy",
    updatedHealth: skeleton.health * 25,
    updatedDamage: skeleton.damage * 25,
    maxStack: 25,
    maxHealth: skeleton.health * 25,
  },
  {
    ...skeleton,
    stack: 14,
    id: "Forest Skeleton 2",
    belongsTo: "enemy",
    updatedHealth: skeleton.health * 14,
    updatedDamage: skeleton.damage * 14,
    maxStack: 14,
    maxHealth: skeleton.health * 14,
  },
  {
    ...undeadWarlock,
    stack: 4,
    id: "Forest Warlock",
    belongsTo: "enemy",
    updatedHealth: undeadWarlock.health * 4,
    updatedDamage: undeadWarlock.damage * 4,
    maxStack: 4,
    maxHealth: undeadWarlock.health * 4,
  },
];

export const forgottenCrypt = [
  {
    ...velishAcarys,
    belongsTo: "enemy",
    updatedHealth: velishAcarys.health,
    updatedDamage: velishAcarys.damage,
    maxStack: 1,
    maxHealth: velishAcarys.health,
  },
  {
    ...skeleton,
    stack: 51,
    id: "Crypt Skeleton",
    belongsTo: "enemy",
    updatedHealth: skeleton.health * 51,
    updatedDamage: skeleton.damage * 51,
    maxStack: 51,
    maxHealth: skeleton.health * 51,
  },
  {
    ...undeadWarlock,
    stack: 13,
    id: "Crypt Warlock",
    belongsTo: "enemy",
    updatedHealth: undeadWarlock.health * 13,
    updatedDamage: undeadWarlock.damage * 13,
    maxStack: 13,
    maxHealth: undeadWarlock.health * 13,
  },
  {
    ...lich,
    stack: 5,
    id: "Crypt Lich",
    belongsTo: "enemy",
    updatedHealth: lich.health * 5,
    updatedDamage: lich.damage * 5,
    maxStack: 5,
    maxHealth: lich.health * 5,
  },
  {
    ...skeleton,
    stack: 38,
    id: "Crypt Skeleton2",
    belongsTo: "enemy",
    updatedHealth: skeleton.health * 38,
    updatedDamage: skeleton.damage * 38,
    maxStack: 38,
    maxHealth: skeleton.health * 38,
  },
];
