import fs from "fs";
import path from "path";

import type { RawCharacter } from "@/types/rawCharacter";
import type { Brand, Skin } from "@/data/types/AKSkin";

import SkinTable from "@/json/en_US/gamedata/excel/skin_table.json";
import { IGNORE_SKINID_LIST } from "../constants";

import { niceJSON } from "@/lib/format";
import { cleanString } from "@/utils/textFormat";

type RawCharSkin =
  (typeof SkinTable.charSkins)[keyof typeof SkinTable.charSkins];

/**
 * @description Generate objects representing a brand along with noting
 *  the relation between a release of skin drop to a brand.
 */
function generateBrandConstants() {
  const Brands: Record<string, Brand> = {};
  const DropMap: Record<string, string> = {};

  Object.entries(SkinTable.brandList).forEach(
    ([id, { groupList, brandName, brandCapitalName: alt, description }]) => {
      Brands[id] = { id, name: brandName, altName: alt, description } as Brand;
      groupList.forEach(({ skinGroupId }) => (DropMap[skinGroupId] = id));
    }
  );

  return { Brands, DropMap };
}

/**
 * @description Creates a table containing a table of brands along with
 *  a table mapping a character to the skins they own.
 */
export function generateSkinTableConstants() {
  const OperatorTable = JSON.parse(
    fs.readFileSync(
      path.resolve("./json/preprocessed/operator_table.json"),
      "utf8"
    )
  ) as Record<string, RawCharacter>;
  const TokenTable = JSON.parse(
    fs.readFileSync(
      path.resolve("./json/preprocessed/tokens_table.json"),
      "utf8"
    )
  ) as Record<string, RawCharacter>;

  const { Brands: brandMap } = generateBrandConstants();

  // Mapping of character ids to their name
  const charNameTable: Record<string, string> = {};
  const charSkinMap: Record<string, string[]> = {};
  Object.entries({ ...OperatorTable, ...TokenTable }).forEach(
    ([id, { name }]) => {
      charNameTable[id] = id === "char_1001_amiya2" ? "Amiya (Guard)" : name;
      charSkinMap[id] = []; // Instantiate `charSkinMap`
    }
  );

  /* Create the skin table */
  const skins: Record<string, Skin> = {};
  Object.values(SkinTable.charSkins).forEach((skin) => {
    const usedBy = skin.tmplId ?? skin.charId; // `tmplId` is only populated for Amiya skins
    const isToken = !!TokenTable[usedBy];

    // Check to see if skin is for a character (operator or token)
    if (!isToken && (!skin.portraitId || !OperatorTable[usedBy])) return;
    if (isToken && (!skin.avatarId || !TokenTable[usedBy])) return;

    const charName = charNameTable[usedBy];
    const newEntry = getSkinEntry(skin, charName, usedBy, isToken);

    /* Special cases that we should ignore */
    if (isToken && newEntry.id.endsWith("_2")) return;
    if (IGNORE_SKINID_LIST.includes(newEntry.id)) return;

    skins[newEntry.id] = newEntry as Skin;
    charSkinMap[usedBy].push(newEntry.id); // Add to list of skins character has
  });

  /* 
    Non-default token outfits will have missing fields which will be
    populated from the outfit of the operator that uses the token.
  */
  Object.values(SkinTable.charSkins).forEach(({ portraitId, tokenSkinMap }) => {
    if (!tokenSkinMap) return;
    const { brandId, subBrand, name, releasedAt } = skins[portraitId];
    // Go through list of tokens associated with operator non-default outfit.
    tokenSkinMap.map(({ tokenId, tokenSkinId }) => {
      if (IGNORE_SKINID_LIST.includes(tokenSkinId)) return;
      const tkSkinEntry = skins[tokenSkinId];
      skins[tokenSkinId] = {
        ...tkSkinEntry,
        ...{ brandId, subBrand, name, releasedAt },
        imgAlt: `${charNameTable[tokenId]}'s "${name}" skin`,
      };
    });
  });

  /* Sort character skins by release date */
  Object.entries(charSkinMap).forEach(([charId, skinIds]) => {
    charSkinMap[charId] = skinIds.sort(
      (a, b) => skins[a].releasedAt - skins[b].releasedAt
    );
  });

  /* Special case for `'Thunderer' (Advanced)`. */
  charSkinMap.token_10020_ling_soul3a = charSkinMap.token_10020_ling_soul3;

  return { brandTable: brandMap, skinTable: skins, charSkinMap };
}

/** @description Generates a skin-like object that may not be complete. */
function getSkinEntry(
  rawSkin: RawCharSkin,
  charName: string,
  usedBy: string, // Id of character that uses this skin.
  isToken: boolean
) {
  const { DropMap: subBrandMap } = generateBrandConstants();
  const { skinGroupId, skinGroupName, ...displaySkin } = rawSkin.displaySkin;

  let skinName: string | null = null;
  if (displaySkin.skinName) skinName = displaySkin.skinName;
  else if (skinGroupId) {
    if (!isToken) {
      // skinGroupId is `ILLUST_${0 | 1 | 2}`
      skinName = `Elite ${skinGroupId.at(-1)}`;
    } else skinName = "Default";
  }

  return {
    // For tokens, have the `skinId` to be the `avatarId` instead of `portraitId`
    id: isToken ? rawSkin.avatarId : rawSkin.portraitId!,
    usedBy,
    brandId: skinGroupId ? subBrandMap[skinGroupId] : null,
    subBrand: skinGroupId ? { id: skinGroupId, name: skinGroupName } : null,
    name: skinName,
    imgAlt: skinName ? `${charName}'s "${skinName}" skin` : null,
    description: displaySkin.content
      ? cleanString(displaySkin.content)
          .replace(/<color name=#[a-fA-F0-9]+>/, "")
          .replace("</color>", "")
      : null,
    artists: displaySkin.drawerList,
    releasedAt: displaySkin.getTime,
  };
}

export function createSkinTable() {
  fs.writeFileSync(
    path.resolve("./data/character/skinTable.json"),
    niceJSON(generateSkinTableConstants())
  );
}
