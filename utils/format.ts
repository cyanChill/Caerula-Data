import deburr from "lodash.deburr";

/** @description Clean up a string based on certain configs. */
export function cleanString(str: string, opts = CleanStringOpts) {
  let cleanedStr = str;

  // Converts some unicode characters into safer values.
  if (opts.unicode) {
    cleanedStr = cleanedStr
      .replace(/[\u00a0]/g, " ")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2013]/gu, "—");
  }

  // Removes irregular HTML tags inside a string (ie: <i></i>).
  if (opts.irregularTags) {
    cleanedStr = cleanedStr.replaceAll("<i>", "").replaceAll("</i>", "");
  }

  return cleanedStr;
}
const CleanStringOpts = { unicode: true, irregularTags: true };

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
