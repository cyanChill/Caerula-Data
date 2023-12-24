import deburr from "lodash.deburr";

import type { MaterialCount, OptionalField } from "@/types/JSONField";

import type { StatusEffect } from "@/data/types/AKEnemy";

import { ISOperators, LimitedOperators, SleepImmune } from "@/lib/constants";

/** @description Gets rarity from string. */
export function getRarity(str: string) {
  if (str === "TIER_1") return 1;
  else if (str === "TIER_2") return 2;
  else if (str === "TIER_3") return 3;
  else if (str === "TIER_4") return 4;
  else if (str === "TIER_5") return 5;
  else if (str === "TIER_6") return 6;
  throw new Error(`Invalid rarity value: ${str}.`);
}

/** @description Gets phase number from string. */
export function getPhase(str: string) {
  if (str === "PHASE_0") return 0;
  else if (str === "PHASE_1") return 1;
  else if (str === "PHASE_2") return 2;
  throw new Error(`Invalid phase value: ${str}.`);
}

/** @description Gets how the skill is activated. */
export function getSkillActiveType(str: string) {
  if (str === "PASSIVE") return "Passive";
  else if (str === "MANUAL") return "Manual";
  else if (str === "AUTO") return "Auto";
  throw new Error(`Invalid skill activation type value: ${str}.`);
}

/** @description Gets how the skill sp is generated. */
export function getSkillSpRecovery(str: string | number) {
  if (str === "INCREASE_WITH_TIME") return "Auto";
  else if (str === "INCREASE_WHEN_ATTACK") return "Offensive";
  else if (str === "INCREASE_WHEN_TAKEN_DAMAGE") return "Defensive";
  else if (str === 8) return "Passive";
  throw new Error(`Invalid SP recovery type value: ${str}.`);
}

/** @description Returns whether an operator is limited or is from Integrated Strategies. */
export function getOpSpecial(id: string) {
  if (LimitedOperators.has(id)) return "limited";
  else if (ISOperators.has(id)) return "is";
  return null;
}

/**
 * @description Returns the list of statuses enemy is immune to, taking
 *  into account of special cases.
 */
export function getImmunities(
  key: string,
  effects: Immunities
): StatusEffect[] {
  const { stunImmune, silenceImmune, sleepImmune } = effects;
  const { frozenImmune, levitateImmune } = effects;
  const immunities = new Set<StatusEffect>();

  const cbIfImmune = (stat: OptionalField<boolean>, effect: StatusEffect) => {
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
type Immunities = {
  stunImmune: OptionalField<boolean>;
  silenceImmune: OptionalField<boolean>;
  sleepImmune: OptionalField<boolean>;
  frozenImmune: OptionalField<boolean>;
  levitateImmune: OptionalField<boolean>;
};

/** @description Remove the "type" property in the raw object. */
export function getMaterialCost(arr: MaterialCount[]) {
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
