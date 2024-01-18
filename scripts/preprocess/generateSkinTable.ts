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
    ([id, { groupList, brandName, brandCapitalName: alt, description }]) => {
      Brands[id] = { id, name: brandName, altName: alt, description } as Brand;
      groupList.forEach(({ skinGroupId }) => (DropMap[skinGroupId] = id));
    }
  );

  return { Brands, DropMap };
}

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
  const opNameTable: Record<string, string> = {};
  const opSkinMap: Record<string, string[]> = {};
  Object.entries(OperatorTable).forEach(([id, { name }]) => {
    opNameTable[id] = id === "char_1001_amiya2" ? "Amiya (Guard)" : name;
    opSkinMap[id] = []; // Instantiate `opSkinMap`
  });

  /* Get the brand table and the relation to its subbrands. */
  const { Brands: brandMap, DropMap: subBrandMap } = generateBrandConstants();

  /* Create the skin table */
  const skins: Record<string, Skin> = {};
  Object.values(SkinTable.charSkins).forEach(
    ({ portraitId: id, tmplId, charId, displaySkin }) => {
      const usedBy = tmplId ?? charId; // `tmplId` is only populated for Amiya skins
      if (!id || !OperatorTable[usedBy]) return; // Not an operator skin

      const { skinGroupId, skinGroupName, skinName } = displaySkin;
      const name = skinName ?? `Elite ${skinGroupId.at(-1)}`; // skinGroupId is `ILLUST_${0 | 1 | 2}`

      skins[id] = {
        id,
        usedBy,
        brandId: subBrandMap[skinGroupId] ?? null,
        subBrand: { id: skinGroupId, name: skinGroupName },
        name,
        imgAlt: `${opNameTable[usedBy]}'s "${name}" skin`,
        description: displaySkin.content
          ? cleanString(displaySkin.content)
              .replace(/<color name=#[a-fA-F0-9]+>/, "")
              .replace("</color>", "")
          : null,
        artists: displaySkin.drawerList,
        releasedAt: displaySkin.getTime,
      } as Skin;

      opSkinMap[usedBy].push(id); // Add to list of skin operator has
    }
  );

  /* Sort operator skins by release date */
  Object.entries(opSkinMap).forEach(([opId, skinIds]) => {
    opSkinMap[opId] = skinIds.sort(
      (a, b) => skins[a].releasedAt - skins[b].releasedAt
    );
  });

  return { brandTable: brandMap, skinTable: skins, opSkinMap };
}

export function createSkinTable() {
  fs.writeFileSync(
    path.resolve("./data/operator/skinTable.json"),
    niceJSON(generateSkinTableConstants())
  );
}
