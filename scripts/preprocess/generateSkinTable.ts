import fs from "fs";
import path from "path";

import type OperatorTableSchema from "@/json/preprocessed/operator_table.json";

import SkinTable from "@/json/en_US/gamedata/excel/skin_table.json";

import { niceJSON, replaceUnicode } from "@/lib/utils";

/**
 * @description Generate objects representing a brand along with noting
 *  the relation between a release of skin drop to a brand.
 */
function generateBrandConstants() {
  const Brands: Record<
    string,
    { id: string; name: string; capitalName: string; description: string }
  > = {};
  const DropMap: Record<string, string> = {};

  Object.values(SkinTable.brandList).forEach(
    ({ brandId, groupList, brandName, brandCapitalName, description }) => {
      Brands[brandId] = {
        id: brandId,
        name: brandName,
        capitalName: brandCapitalName,
        description,
      };
      groupList.forEach((id) => {
        DropMap[id] = brandId;
      });
    }
  );

  return { Brands, DropMap };
}

type SkinEntry = {
  id: string;
  brandId: string | null;
  subBrand: { id: string | null; name: string | null };
  releaseAt: number;
  name: string;
  alt: string;
  artists: string[] | null;
  description: string | null;
};

/**
 * @description Creates a table containing a table of brands along with
 *  a table mapping an operator to the skins they own.
 */
export function generateSkinTableConstants() {
  const rawOpList = JSON.parse(
    fs.readFileSync(
      path.resolve("./json/preprocessed/operator_table.json"),
      "utf8"
    )
  ) as typeof OperatorTableSchema;

  // Mapping of operator ids w/ their name
  const operatorMap: Record<string, string> = {};
  Object.values(rawOpList).map((op) => {
    const opId = op.phases[0].characterPrefabKey;
    operatorMap[opId] = opId === "char_1001_amiya2" ? "Amiya (Guard)" : op.name;
  });

  /* Create the brand table */
  const { Brands: brandMap, DropMap: subBrandMap } = generateBrandConstants();

  /* Create the skin table */
  const skinMap: Record<string, SkinEntry[]> = {}; // Contains values for operators, tokens, traps, etc.
  Object.values(SkinTable.charSkins).map(
    ({ tmplId, charId, displaySkin, portraitId }) => {
      const uId = tmplId ?? charId; // `tmplId` is only populated for Amiya skins
      const skinName =
        displaySkin.skinName ??
        (displaySkin.skinGroupId
          ? `Elite ${displaySkin.skinGroupId.at(-1)}` // `ILLUST_${0 | 1 | 2}`
          : "");
      const skinAltText =
        skinName !== "" ? `${operatorMap[uId]}'s "${skinName}" skin` : "";

      const skinBrandId = displaySkin.skinGroupId
        ? subBrandMap[displaySkin.skinGroupId] ?? null
        : null;

      const newSkin = {
        id: `${portraitId}b`,
        brandId: skinBrandId,
        subBrand: {
          id: displaySkin.skinGroupId,
          name: displaySkin.skinGroupName,
        },
        releaseAt: displaySkin.getTime,
        name: skinName,
        alt: skinAltText,
        artists: displaySkin.drawerList,
        description: displaySkin.content
          ? replaceUnicode(displaySkin.content)
              ?.replace("<color name=#ffffff>", "")
              .replace("</color>", "")
          : null,
      };

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
      .map(({ id, brandId, subBrand, releaseAt: _, ...rest }) => {
        // Save everything except for "releaseAt"
        return { id, brandId, subBrand, ...rest };
      });
  });

  return { brandTable: brandMap, skinTable: operatorSkinMap };
}

export function createSkinTable() {
  fs.writeFileSync(
    path.resolve("./data/operator/skins.json"),
    niceJSON(generateSkinTableConstants())
  );
}
