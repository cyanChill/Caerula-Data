import deburr from "lodash.deburr";

import type { OperatorId } from "@/types/AKOperator";
import type { EnemyId, StatusEffectType } from "@/types/AKEnemy";
import { EnemyAttackTable } from "@/types/AKEnemy";
import type { ItemCount } from "@/types/AKItem";
import type { DefineValObj, Immunities } from "@/scripts/types";

import { ISOperators, LimitedOperators, SleepImmune } from "@/lib/constants";

/** @description Gets rarity from string. */
export function getRarity(str: `TIER_${1 | 2 | 3 | 4 | 5 | 6}`) {
  if (str === "TIER_1") return 1;
  else if (str === "TIER_2") return 2;
  else if (str === "TIER_3") return 3;
  else if (str === "TIER_4") return 4;
  else if (str === "TIER_5") return 5;
  else if (str === "TIER_6") return 6;
  throw new Error("Invalid rarity value.");
}

/** @description Gets phase number from string. */
export function getPhase(str: `PHASE_${0 | 1 | 2}`) {
  if (str === "PHASE_0") return 0;
  else if (str === "PHASE_1") return 1;
  else if (str === "PHASE_2") return 2;
  throw new Error("Invalid phase value.");
}

/** @description Gets how the skill is activated. */
export function getSkillActiveType(str: "AUTO" | "MANUAL" | "PASSIVE") {
  if (str === "PASSIVE") return "Passive";
  else if (str === "MANUAL") return "Manual";
  else if (str === "AUTO") return "Auto";
  throw new Error("Invalid skill type value.");
}

/** @description Gets how the skill sp is generated. */
export function getSkillSpRecovery(str: SkillSpRecoveryType) {
  if (str === "INCREASE_WITH_TIME") return "Auto";
  else if (str === "INCREASE_WHEN_ATTACK") return "Offensive";
  else if (str === "INCREASE_WHEN_TAKEN_DAMAGE") return "Defensive";
  else if (str === 8) return "Passive";
  throw new Error("Invalid SP type value.");
}
type SkillSpRecoveryType =
  | `INCREASE_${"WITH_TIME" | `WHEN_${"ATTACK" | "TAKEN_DAMAGE"}`}`
  | 8;

/** @description Returns whether an operator is limited or is from Integrated Strategies. */
export function getOpSpecial(id: OperatorId) {
  if (LimitedOperators.has(id)) return "limited";
  else if (ISOperators.has(id)) return "is";
  return null;
}

/**
 * @description Returns the list of statuses enemy is immune to, taking
 *  into account of special cases.
 */
export function getImmunities(
  key: EnemyId,
  effects: Immunities
): StatusEffectType[] {
  const { stunImmune, silenceImmune, sleepImmune } = effects;
  const { frozenImmune, levitateImmune } = effects;
  const immunities = new Set<StatusEffectType>();

  const cbIfImmune = (
    stat: DefineValObj<boolean>,
    effect: StatusEffectType
  ) => {
    if (stat.m_defined && stat.m_value) immunities.add(effect);
  };

  cbIfImmune(stunImmune, "Stun");
  cbIfImmune(silenceImmune, "Silence");
  cbIfImmune(sleepImmune, "Sleep");
  cbIfImmune(frozenImmune, "Freeze");
  cbIfImmune(levitateImmune, "Levitate");

  // Special Cases
  if (SleepImmune.has(key)) immunities.add("Sleep");
  if (key === "enemy_1523_mandra") {
    return ["Stun", "Silence", "Sleep", "Freeze", "Levitate"];
  }

  return [...immunities];
}

/** @description Returns the attack pattern from string (will coerce the correct type). */
export function getAttackPattern(str: string) {
  const key = str as keyof typeof EnemyAttackTable;
  if (!EnemyAttackTable[key])
    throw new Error(`Pattern for key "${key}" doesn't exist.`);
  return EnemyAttackTable[key];
}

/** @description Remove the "type" property in the raw object. */
export function getMaterialCost(arr: ItemCount[]) {
  return arr.map((obj) => ({ id: obj.id, count: obj.count }));
}

/** @description Helps generates slugs, catching the special cases. */
export function generateSlug(id: string | null, str: string) {
  // Special Cases
  switch (id) {
    // Enemy Slugs
    case "enemy_1539_reid":
      return "hateful_avenger/boss";
    case "enemy_1541_wdslms":
      return "damazti_cluster/clone";
    // Operator Slugs
    case "char_1001_amiya2":
      return "amiya/guard";
    // Token Slugs
    case "token_10027_ironmn_pile2":
      return "stainless™_multifunctional_platform-s2";
    case "token_10020_ling_soul3a":
      return "thunderer_advanced";
  }

  return deburr(str) // Replace accented characters with their unaccented equivalent
    .trim()
    .replaceAll(/\s/g, "_")
    .replace(/^'(.*)'$/, "$1") // Replace bounding quotes
    .toLowerCase();
}
