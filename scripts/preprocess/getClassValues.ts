import fs from "fs";
import path from "path";

import gameData_const from "@/json/en_US/gamedata/excel/gamedata_const.json";
import character_table from "@/json/en_US/gamedata/excel/character_table.json";
import uniequip_table from "@/json/en_US/gamedata/excel/uniequip_table.json";

import { niceJSON } from "@/lib/format";
import { addTooltipAndColor } from "@/utils/textFormat";

/** @description Mapping from a `BranchId` to `"NONE" | "PHYSICAL" | "MAGICAL" | "HEAL"` */
const damageTable = Object.fromEntries(
  Object.entries(gameData_const.subProfessionDamageTypePairs).filter(([key]) =>
    isValidBranch(key)
  )
);

/** @description Mapping from `BranchId` to its branch name. */
const branchNameTable = Object.fromEntries(
  Object.values(uniequip_table.subProfDict)
    .filter(({ subProfessionId }) => isValidBranch(subProfessionId))
    .map(({ subProfessionId, subProfessionName }) => [
      subProfessionId,
      subProfessionName,
    ])
);

/** @description Sorted branch ids. */
const branchIds = Object.keys(branchNameTable).toSorted((a, b) =>
  a.localeCompare(b)
);

/** @description Helper function to filter out invalid branches. */
function isValidBranch(str: string) {
  return !str.startsWith("notchar") && !str.startsWith("none");
}

type BranchStructure = {
  id: string;
  name: string;
  profession: string;
  position: string;
  damageType: string;
  trait: string;
};

/** @description Convert the raw profession id value to its name. */
const ProfessionMap: Record<string, string> = {
  CASTER: "Caster",
  MEDIC: "Medic",
  PIONEER: "Vanguard",
  TANK: "Defender",
  SNIPER: "Sniper",
  SPECIAL: "Specialist",
  SUPPORT: "Supporter",
  WARRIOR: "Guard",
};

/** @description Automatically generates the `BranchTable` in `AKClass.ts` */
export function generateBranchTable() {
  const branchTable = new Map<string, BranchStructure>();

  branchIds.forEach((id) => {
    // Read over `character_table.json` as `operator_table.json` may
    // not be up-to-date as we're updating it in the sames script
    const { description, profession, position } = Object.values(
      character_table
    ).find((op) => op.subProfessionId === id && op.rarity !== "TIER_1")!;

    // Modify the trait description for some classes
    let unstylizedTrait = description!;
    if (unstylizedTrait.includes("all blocked enemies")) {
      unstylizedTrait = unstylizedTrait.replace(
        "all blocked enemies",
        "multiple targets equal to block count"
      );
    } else if (id === "chain") {
      unstylizedTrait = unstylizedTrait.replace("3", "3/4 (Elite 2)");
    } else if (id === "craftsman") {
      unstylizedTrait = unstylizedTrait.replace(
        "<Support Devices>",
        "<@ba.kw><Support Devices></>"
      );
    } else if (id === "dollkeeper") {
      unstylizedTrait = unstylizedTrait.replace(
        "<Substitute>",
        "<@ba.kw><Substitute></>"
      );
    } else if (id === "healer") {
      unstylizedTrait = unstylizedTrait.replace("{heal_scale:0%}", "80%");
    } else if (id === "librator") {
      unstylizedTrait = unstylizedTrait
        .replace("{atk:0%}", "200%")
        .replace("{max_stack_cnt}", "40");
    } else if (id === "musha") {
      unstylizedTrait = unstylizedTrait.replace(
        "{value}",
        "30/50/70 (Elite 0/1/2)"
      );
    }

    branchTable.set(id, {
      id,
      name: branchNameTable[id],
      profession: ProfessionMap[profession],
      position,
      damageType: damageTable[id],
      trait: addTooltipAndColor(unstylizedTrait)!,
    });
  });

  // Removes the quotes around the property key
  const branchTableStr = niceJSON(Object.fromEntries(branchTable)).replace(
    /"(\w*)": /g,
    "$1: "
  );

  fs.writeFileSync(
    path.resolve("./data/types/AKClass.ts"),
    fs.readFileSync("./file_base/AKClass_base.txt", "utf8") +
      `export const BranchTable = ${branchTableStr} as Record<BranchId, Branch>;\n`
  );
}
