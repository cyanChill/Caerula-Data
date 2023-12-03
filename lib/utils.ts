import { neatJSON } from "neatjson";
import DOMPurify from "isomorphic-dompurify";

import GamedataConst from "@/data/gamedataConst.json";
const { richTextStyles, termDescriptionDict } = GamedataConst;

type TextStyle = keyof typeof richTextStyles;
type ToolTipKey = keyof typeof termDescriptionDict;

/**
 * @description Neater JSON formating compared to JSON.stringify(obj, null, 2)
 *  as it'll compress the arrays whenever possible.
 */
export const niceJSON = (obj: unknown) => {
  return neatJSON(obj, {
    objectPadding: 1,
    afterComma: 1,
    afterColon1: 1,
    afterColonN: 1,
  });
};

/** @description Removes properties from an object and scope it to the correct type. */
export function removeProperties<T, K extends keyof T>(obj: T, ...keys: K[]) {
  const cpyObj = { ...obj };
  for (const key of keys) {
    delete cpyObj[key];
  }
  return cpyObj;
}

/** @description Convert decimal notation into a percentage. */
export const decimalAsPercent = (num: number) => {
  return new Intl.NumberFormat("default", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

/** @description Identify what can be injected into the template values. */
export const getTemplateKeys = (str: string) => {
  const re = /{([^}]*)}/g;

  return [...str.matchAll(re)].map((tmp) => {
    const res = { segment: tmp[0], key: tmp[1], isPercent: false };
    if (res.key.endsWith("%")) res.isPercent = true;
    if (res.key.split(":").length === 2) res.key = res.key.split(":")[0];
    return res;
  });
};

/** @description Inject values into a string with template placeholders. */
export const injectTemplateVals = (
  str: string,
  values: { key: string; value: number }[]
) => {
  // Identify what needs to be injected into the description
  const areaToReplace = getTemplateKeys(str);
  let injectedStr = str;

  areaToReplace.forEach((tmp) => {
    const injectValSpec = values.find((obj) => {
      const normKey = tmp.key.toLowerCase();
      // Sometimes casing isn't the same
      if (normKey === obj.key.toLowerCase()) return true;
      // Sometimes keys contains unneeded modifier (ie: negative stat has
      // an unneeded "-" in front of `tmp.key`)
      if (normKey.slice(1) === obj.key.toLowerCase()) return true;
      return false;
    });
    if (!injectValSpec) {
      throw new Error(`Value for key "${tmp.key}" was not provided.`);
    }

    injectedStr = injectedStr.replace(
      tmp.segment,
      tmp.isPercent
        ? decimalAsPercent(injectValSpec.value)
        : `${injectValSpec.value}`
    );
  });

  // Replace any "--" with "-"
  return injectedStr.replaceAll("--", "-");
};

/** @description Replace tags (ie: <$></> and <@></>) with tooltip & color styling. */
export function injectTooltipsColors(str: string | null) {
  if (!str) return str; // Return if null
  let returnStr = str;

  // Inject ability first as this is sometimes wrapped with a color
  const tooltipReplacer = (
    _matchedTerm: string,
    p1: ToolTipKey, // First capture group (inside the 1st angle brackets)
    p2: string //Second capture group (between the angle brackets)
  ) => {
    const replaceVal = termDescriptionDict[p1];
    return `<a href="/terminology#${replaceVal.slug}" title="${replaceVal.description}" style="border-bottom:1px dotted currentcolor;cursor:help;">${p2}</a>`;
  };
  // ".*?" makes sure we get the shortest possible match.
  const toolTipRe = /<\$([^>/]*)>(.*?)<\/>/g;
  returnStr = returnStr.replace(toolTipRe, tooltipReplacer);

  // Replace the colors (to fix issue w/ incorrect parsing, we replace all
  // `</>` with `</span` and `<@ >` with the respective color span)
  const clrStartTagReplacer = (_matchedTerm: string, p1: TextStyle) => {
    const colorVal = richTextStyles[p1];
    if (!colorVal) return `<span>`;
    return `<span style="color:${colorVal};">`;
  };
  returnStr = returnStr.replace(/<@([^>/]*)>/g, clrStartTagReplacer);

  // Replace the ending tag
  returnStr = returnStr.replace(/<\/>/g, "</span>");

  // Escape any "<" or ">" not part of a span (dangerouslySetInnerHTML)
  // may incorrectly parse any `<>` that is clearly not a HTML tag.
  returnStr = returnStr.replace(/<([^>]*)>/g, (matched) => {
    if (
      matched.startsWith("<a") ||
      matched.startsWith("<span") ||
      matched.startsWith("<@") ||
      matched.startsWith("<$") ||
      matched.startsWith("</")
    ) {
      return matched;
    } else {
      return matched.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    }
  });

  // Return sanitized string (will automatically add a closing tag
  // at the end of the string if one isn't provided)
  return DOMPurify.sanitize(returnStr);
}

/** @description Helper function to convert unicode characters. */
export function replaceUnicode(str: string) {
  return str
    .replace(/[\u00a0]/g, " ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013]/gu, "—");
}

/** @description Removes irregular HTML tags inside a string (ie: <i></i>). */
export function removeIrregularTags(str: string) {
  return str.replaceAll("<i>", "").replaceAll("</i>", "");
}

/**  @description Capitalize first letter of word. */
export function capitalizeWord(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
