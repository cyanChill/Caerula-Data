import DOMPurify from "isomorphic-dompurify";

import type { BlackboardArr } from "@/types/JSONField";
import Terminology from "@/data/gameplay/terminology.json";
import ColorStyles from "@/json/colorStyles.json";

import { decimalAsPercent } from "./conversion";

type CleanStringConfig = { unicode?: boolean; irregularTags?: boolean };
const CleanStringOpts: CleanStringConfig = {
  unicode: true,
  irregularTags: true,
};

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

export function replaceUnicode(str: string) {
  return cleanString(str, { unicode: true });
}

/** @description Insert values into template locations. */
export function populateTemplate(str: string, values: BlackboardArr) {
  /* Figure what we can populate by finding instances of `{.*}`. */
  const locations = [...str.matchAll(/{([^}]*)}/g)].map(
    ([matchedPhrase, key]) => ({
      segment: matchedPhrase,
      key: key.split(":")[0], // Key is left of `:` if it's present.
      isPercent: key.endsWith("%"),
    })
  );

  /* Populate the template locations we found. */
  let populatedStr = str;
  locations.forEach(({ key, segment, isPercent }) => {
    // Find object containing information to populate this template location.
    const tempVal = values.find((obj) => {
      const normKey = key.toLowerCase();
      // Sometimes casing isn't the same
      if (normKey === obj.key.toLowerCase()) return true;
      // Sometimes keys contains unneeded modifier (ie: negative stat has
      // an unneeded "-" in front of `key`)
      if (normKey.slice(1) === obj.key.toLowerCase()) return true;
      return false;
    });
    if (!tempVal) throw new Error(`Value for key "${key}" was not provided.`);

    populatedStr = populatedStr.replace(
      segment,
      isPercent ? decimalAsPercent(tempVal.value) : `${tempVal.value}`
    );
  });

  // Replace any "--" with "-" (due to how the data represents negative numbers).
  return populatedStr.replaceAll("--", "-");
}

type TextStyle = keyof typeof ColorStyles;
type TermDescription = { name: string; description: string; slug: string };

/** @description Replace tags (ie: <$></> and <@></>) with tooltip & color styling. */
export function addTooltipAndColor(str: string | null) {
  if (!str) return str; // Return if null
  let returnStr = str;

  /* Inject ability first as this is sometimes wrapped with a color. */
  returnStr = returnStr.replace(
    /<\$([^>/]*)>(.*?)<\/>/g, // ".*?" makes sure we get the shortest possible match.
    (_: string, key: string, content: string) => {
      const { slug, description } = Object.values(Terminology)
        // Find the term nested in one of the term categories
        .map(({ terms }: { terms: Record<string, TermDescription> }) => {
          if (!Object.keys(terms).includes(key)) return null;
          return terms[key];
        })
        // The resulting array should have 1 `TermDescription` object, with
        // the remaining values being `null`
        .filter((val) => val !== null)[0];

      return `<a href="/terminology#${slug}" title="${description}" style="border-bottom:1px dotted currentcolor;cursor:help;">${content}</a>`;
    }
  );

  /* Inject colors via spans. */
  returnStr = returnStr.replace(/<@([^>/]*)>/g, (_: string, key: TextStyle) => {
    const colorVal = ColorStyles[key];
    if (!colorVal) return `<span>`; // Return plain span if we have no style for color.
    return `<span style="color:${colorVal};">`;
  });
  returnStr = returnStr.replace(/<\/>/g, "</span>"); // Close off color spans

  // Escape any "<" or ">" not part of a HTML element as dangerouslySetInnerHTML
  // may incorrectly parse any `<>` that is clearly not a HTML tag.
  returnStr = returnStr.replace(/<([^>]*)>/g, (matched) => {
    if (
      matched.startsWith("<a") ||
      matched.startsWith("<span") ||
      matched.startsWith("</")
    ) {
      return matched;
    } else {
      return matched.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    }
  });

  // Return sanitized string (automatically adds a closing tag at the
  // end of the string if one isn't provided)
  return DOMPurify.sanitize(returnStr);
}
