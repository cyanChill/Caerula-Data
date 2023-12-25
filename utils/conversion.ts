import deburr from "lodash.deburr";

import type { OptionalField } from "@/types/JSONField";

/** @description Convert decimal notation into a percentage. */
export const decimalAsPercent = (num: number) => {
  return new Intl.NumberFormat("default", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

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

/** @description Helps generates slugs & deals with special cases. */
export function generateSlug(id: string | null, str: string) {
  /* Special Cases */
  switch (id) {
    /* Enemy Slugs */
    case "enemy_1539_reid":
      return "hateful_avenger/boss";
    case "enemy_1541_wdslms":
      return "damazti_cluster/clone";
    /* Operator Slugs */
    case "char_1001_amiya2":
      return "amiya/guard";
    /* Token Slugs */
    case "token_10027_ironmn_pile2":
      return "stainless™_multifunctional_platform-s2";
    case "token_10020_ling_soul3a":
      return "thunderer_advanced";
  }

  return deburr(str) // Replace accented characters with their unaccented equivalent
    .trim()
    .replaceAll(/\s/g, "_")
    .replace(/^'(.*)'$/, "$1") // Remove bounding quotes
    .toLowerCase();
}

/**
 * @description Takes an `OptionalField` type and returns a key-value
 *  pair containing the specified key and the `OptionalField` value if
 *  defined.
 */
export function optFieldAsObj<T>(attrObj: OptionalField<T>, key: string) {
  if (attrObj.m_defined) return { [key]: attrObj.m_value };
  return {};
}
