import type { AttackPositions } from "./typesFrom";

/** @description Where a character can be placed, or how an enemies attacks. */
export type AttackPosition = (typeof AttackPositions)[number];

export type Rarity = 1 | 2 | 3 | 4 | 5 | 6;

/** @description Common portion of stats that are shared. */
export type StatTable = {
  hp: number; // maxHp
  atk: number;
  def: number;
  res: number; // magicResistance
  atkInterval: number; // baseAttackTime
};
