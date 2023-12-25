import fs from "fs";
import path from "path";

import type { RawCharacter } from "@/types/rawCharacter";
import type { Brand, Skin } from "@/data/types/AKSkin";

import SkinTable from "@/json/en_US/gamedata/excel/skin_table.json";

import { niceJSON } from "@/lib/format";
import { cleanString } from "@/utils/textFormat";

/**
 * @description Generate objects representing a brand along with noting
 *  the relation between a release of skin drop to a brand.
 */
function generateBrandConstants() {
  const Brands: Record<string, Brand> = {};
  const DropMap: Record<string, string> = {};

  Object.entries(SkinTable.brandList).forEach(
    ([id, { groupList, brandName, brandCapitalName, description }]) => {
      Brands[id] = {
        id,
        name: brandName,
        capitalName: brandCapitalName,
        description,
      } as Brand;
      groupList.forEach(({ skinGroupId }) => (DropMap[skinGroupId] = id));
    }
  );

  return { Brands, DropMap };
}

/** @description Extended version of `Skin` type, with release time. */
type SkinEntry = Skin & { releaseAt: number };

/**
 * @description Creates a table containing a table of brands along with
 *  a table mapping an operator to the skins they own.
 */
export function generateSkinTableConstants() {
  const OperatorTable = JSON.parse(
    fs.readFileSync(
      path.resolve("./json/preprocessed/operator_table.json"),
      "utf8"
    )
  ) as Record<string, RawCharacter>;

  // Mapping of operator ids to their name
  const operatorMap: Record<string, string> = {};
  Object.entries(OperatorTable).map(([id, { name }]) => {
    operatorMap[id] = id === "char_1001_amiya2" ? "Amiya (Guard)" : name;
  });

  /* Create the brand table */
  const { Brands: brandMap, DropMap: subBrandMap } = generateBrandConstants();

  /* Create the skin table */
  const skinMap: Record<string, SkinEntry[]> = {};
  Object.values(SkinTable.charSkins).map(
    ({ tmplId, charId, displaySkin, portraitId }) => {
      const { skinGroupId, skinGroupName } = displaySkin;
      const uId = tmplId ?? charId; // `tmplId` is only populated for Amiya skins
      const skinName =
        displaySkin.skinName ??
        (skinGroupId ? `Elite ${skinGroupId.at(-1)}` : ""); // `ILLUST_${0 | 1 | 2}`
      const skinAltText =
        skinName !== "" ? `${operatorMap[uId]}'s "${skinName}" skin` : "";

      const newSkin = {
        id: `${portraitId}b`,
        brandId: subBrandMap[skinGroupId ?? ""] ?? null,
        subBrand: { id: skinGroupId, name: skinGroupName },
        releaseAt: displaySkin.getTime,
        name: skinName,
        alt: skinAltText,
        artists: displaySkin.drawerList,
        description: displaySkin.content
          ? cleanString(displaySkin.content)
              .replace("<color name=#ffffff>", "")
              .replace("</color>", "")
          : null,
      } as SkinEntry;

      if (Object.hasOwn(skinMap, uId)) skinMap[uId].push(newSkin);
      else skinMap[uId] = [newSkin];
    }
  );

  // Filter out the values from tokens, traps, etc.
  const operatorSkinMap: Record<string, Omit<SkinEntry, "releaseAt">[]> = {};
  Object.keys(operatorMap).forEach((opId) => {
    // Sort the values from skinMap for the operator (by releaseAt then skinId).
    operatorSkinMap[opId] = skinMap[opId]
      .sort((a, b) => {
        let nameCompare = a.id.localeCompare(b.id);
        // Amiya edge-case since 3 base skins
        if (a.subBrand.id === "ILLUST_1" && b.subBrand.id === "ILLUST_0") {
          nameCompare = 1;
        }
        if (a.subBrand.id === "ILLUST_0" && b.subBrand.id === "ILLUST_1") {
          nameCompare = -1;
        }
        return a.releaseAt - b.releaseAt || nameCompare;
      })
      .map(({ releaseAt: _, ...rest }) => rest); // Save everything except for "releaseAt"
  });

  return { brandTable: brandMap, skinTable: operatorSkinMap };
}

export function createSkinTable() {
  fs.writeFileSync(
    path.resolve("./data/operator/skinTable.json"),
    niceJSON(generateSkinTableConstants())
  );
}
