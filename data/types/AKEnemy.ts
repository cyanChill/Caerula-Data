import type { AttackPatterns, EnemyIds, EnemyRaceTable } from "./typesFrom";

export type EnemyId = (typeof EnemyIds)[number];
export type EnemyRace = (typeof EnemyRaceTable)[keyof typeof EnemyRaceTable];

/** @description The tiers of enemies in Arknights. */
export const EnemyTiers = ["NORMAL", "ELITE", "BOSS"] as const;
export type EnemyType = (typeof EnemyTiers)[number];

/** @description The classifications on how enemies attacks. */
export type EnemyAttackPattern = (typeof AttackPatterns)[number];

/** @description The effects enemies can be immune to. */
export const StatusEffect = [
  "Stun",
  "Silence",
  "Sleep",
  "Freeze",
  "Levitate",
] as const;
export type StatusEffectType = (typeof StatusEffect)[number];

/** @description The data we want from each "level" of an enemy. */
export type EnemyStat = {
  hp: number; // maxHp
  atk: number;
  def: number;
  res: number; // magicResistance
  mvSpd: number; // moveSpeed
  atkInterval: number; // baseAttackTime
  atkRange: number; // rangeRadius
};

/** @description Structure of how we display an enemy ability. */
export type EnemyAbility = {
  text: string;
  textFormat: "SILENCE" | "NORMAL" | "TITLE";
};

/** @description Object representing an Arknights enemy. */
export interface Enemy {
  sort: number;
  id: EnemyId;
  slug: string;
  code: string;
  name: string;
  description: string;
  race: EnemyRace | null;
  type: EnemyType;
  attackType: EnemyAttackPattern;
  abilityList: EnemyAbility[];
  isInvalidKilled: boolean; // Doesn't count to number of enemies defeated.
  immunities: StatusEffectType[];
  lifePointReduction: number; // lifePointReduce
  weight: number; // massLevel
}
