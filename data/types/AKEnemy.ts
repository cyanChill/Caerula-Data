import type {
  AttackPatterns,
  ClassTiers,
  EnemyIds,
  EnemyRaceTable,
} from "./typesFrom";

export type EnemyId = (typeof EnemyIds)[number];
export type EnemyRace = (typeof EnemyRaceTable)[keyof typeof EnemyRaceTable];
export type EnemyTier = (typeof ClassTiers)[number];
export type AttackPattern = (typeof AttackPatterns)[number];

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
  // FIXME: Not completely sure if the mapping for the elemental resistances
  // are correct
  erst: number; // epDamageResistance (Reduce Elemental Damage Taken By Percent)
  irst: number; // epResistance (Reduce Elemental Impairement Build-up By Percent)
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
  type: EnemyTier;
  attackPattern: AttackPattern;
  abilityList: EnemyAbility[];
  isInvalidKilled: boolean; // Doesn't count to number of enemies defeated.
  immunities: StatusEffectType[];
  lifePointReduction: number; // lifePointReduce
  weight: number; // massLevel
  isFlying: boolean;
  relatedEnemies: EnemyId[];
}
