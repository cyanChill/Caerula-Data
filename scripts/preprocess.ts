// @ts-nocheck
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { generateSlug } from "@/lib/conversion";
import { niceJSON, replaceUnicode } from "@/lib/utils";

import amiyaForm from "@/json/en_US/gamedata/excel/char_patch_table.json";
import _CharTable from "@/json/en_US/gamedata/excel/character_table.json";
import SkillList from "@/json/en_US/gamedata/excel/skill_table.json";
import EnemyList from "@/json/en_US/gamedata/excel/enemy_handbook_table.json";
import gameData_const from "@/json/en_US/gamedata/excel/gamedata_const.json";
import SkinTable from "@/json/en_US/gamedata/excel/skin_table.json";
import RangeTable from "@/json/en_US/gamedata/excel/range_table.json";
import ItemTable from "@/json/en_US/gamedata/excel/item_table.json";

const CharTable = { ..._CharTable, ...amiyaForm.patchChars };

/**
 * @description This function will go over the "character_table.json" file
 *  and create 3 files for: operators, summons/traps, game devices.
 */
function organizeCharacterTable() {
  const enOperators = {};
  const enTokens = {};
  const enDevices = {};

  for (const [key, value] of Object.entries(CharTable)) {
    // Exclude "fake" Shalem in IS
    if (key === "char_512_aprot") {
      continue;
    } else if (value.profession === "TOKEN") {
      enTokens[key] = value;
      // Special Case w/ Ling 3rd Summon (Advanced Form) - we want to add a value
      // for the advanced form
      if (key === "token_10020_ling_soul3") {
        enTokens["token_10020_ling_soul3a"] = {
          ...value,
          appellation: "Advanced",
          phases: value.phases.map((phase) => ({
            ...phase,
            // Update stats for "advanced" form
            attributesKeyFrames: phase.attributesKeyFrames.map(
              ({ level, data }) => ({
                level,
                data: {
                  ...data,
                  maxHp: data.maxHp * 2,
                  atk: Math.round(data.atk * 1.8),
                  def: Math.round(data.def * 1.8),
                  magicResistance: data.magicResistance * 2,
                  blockCnt: 4,
                  baseAttackTime: data.baseAttackTime + 0.8,
                },
              })
            ),
          })),
        };
      }
    } else if (value.profession === "TRAP") {
      enDevices[key] = value;
    } else {
      enOperators[key] = value;
    }
  }

  fs.writeFileSync(
    path.resolve("./json/preprocessed/operator_list.json"),
    niceJSON(enOperators)
  );
  fs.writeFileSync(
    path.resolve("./json/preprocessed/tokens_list.json"),
    niceJSON(enTokens)
  );
  fs.writeFileSync(
    path.resolve("./json/preprocessed/game_devices_list.json"),
    niceJSON(enDevices)
  );
}

/**
 * @description This function will go over some JSON files and extract
 *  the constants that'll be used to generate types.
 */
function generateJSONForTypes() {
  /* Generate types from JSON data in "operator_list.json" */
  const enOperators = JSON.parse(
    fs.readFileSync(
      path.resolve("./json/preprocessed/operator_list.json"),
      "utf8"
    )
  );

  const OperatorIds = []; // Operator ids
  const NationIds = new Set(); // List of Arknight nations
  const FactionIds = new Set(); // Factions
  const TeamIds = new Set(); // Related characters
  const AltLangName = new Set(); // Alternate names (ie: Russian)
  const SpecializedRoles = new Set(); // What an operator is good at
  const Professions = {}; // Operator branch & subbranch

  for (const [key, value] of Object.entries(enOperators)) {
    OperatorIds.push(key);
    NationIds.add(value.nationId);
    FactionIds.add(value.groupId);
    TeamIds.add(value.teamId);
    AltLangName.add(value.appellation);
    value.tagList.forEach((tag) => SpecializedRoles.add(tag));
    if (Object.hasOwn(Professions, value.profession)) {
      Professions[value.profession].add(value.subProfessionId);
    } else {
      Professions[value.profession] = new Set([value.subProfessionId]);
    }
  }
  for (const key in Professions) Professions[key] = [...Professions[key]];

  /* Generate types from JSON data in "skill_list.json" */
  const SkillIds = []; // Skill ids
  const SkillIconIds = new Set(); // If skillId isn't used for the icon file, use this instead
  for (const [key, value] of Object.entries(SkillList)) {
    SkillIds.push(key);
    SkillIconIds.add(value.iconId);
  }

  /* Generate types from JSON data in "enemy_list.json" */
  const EnemyIds = []; // Enemy ids
  const EnemyRaceTable = {}; // Defines what an enmy is classified as
  const EnemyAttackType = new Set(); // How enemy can attack

  for (const [key, value] of Object.entries(EnemyList)) {
    EnemyIds.push(key);
    // Only index the enemies that are shown
    if (value.hideInHandbook) continue;

    // Not all enemies have a defined race
    if (!!value.enemyRace) EnemyRaceTable[value.enemyTags[0]] = value.enemyRace;
    EnemyAttackType.add(value.attackType);
  }

  /* Generate types from JSON data in "skin_table.json" */
  const skinBrandIds = Object.keys(SkinTable.brandList);

  /* Generate types from JSON data in "range_table.json" */
  const rangeIds = Object.keys(RangeTable);

  /* Generate types from JSON data in "tokens_list.json" */
  const enTokens = JSON.parse(
    fs.readFileSync(
      path.resolve("./json/preprocessed/tokens_list.json"),
      "utf8"
    )
  );
  const tokenIds = Object.keys(enTokens);

  /* Generate types for JSON data in "item_table.json" */
  const itemIds = Object.keys(ItemTable.items);

  /* Export values as a "const" type. */
  const exportedData = {
    OperatorIds: OperatorIds,
    AlternateLangNames: [...AltLangName],
    OperatorTags: [...SpecializedRoles],
    Professions: Professions,
    UnitPosition: ["MELEE", "RANGED", "ALL"],
    SkillIds: SkillIds,
    SkillIconIds: [...SkillIconIds],
    NationIds: [...NationIds],
    FactionIds: [...FactionIds],
    TeamIds: [...TeamIds],
    EnemyIds: EnemyIds,
    EnemyRaceTable: EnemyRaceTable,
    EnemyAttackType: [...EnemyAttackType],
    BrandIds: skinBrandIds,
    RangeIds: rangeIds,
    TokenIds: tokenIds,
    ItemIds: itemIds,
  };
  const exportedFile = Object.keys(exportedData)
    .map(
      (key) =>
        `export const ${key} = ${niceJSON(exportedData[key])} as const;\n`
    )
    .join("\n");

  fs.writeFileSync(path.resolve("./data/types/typesFrom.ts"), exportedFile);
}

/**
 * @description This function will go over the "gamedata_const.json" file
 *  and returns the values used for template injections.
 */
function generateGamedataConst() {
  const { richTextStyles, termDescriptionDict } = gameData_const;

  const mutatedTextStyles = {};
  for (const [key, value] of Object.entries(richTextStyles)) {
    if (!value.startsWith("<color")) mutatedTextStyles[key] = null;
    else mutatedTextStyles[key] = value.slice(7, 14); // Extract hex value
  }

  const mutatedTermDescription = {};
  for (const [key, value] of Object.entries(termDescriptionDict)) {
    mutatedTermDescription[key] = {
      ...value,
      // Ignore nested tooltips
      description: value.description
        .replace(/<\@([^>/]*)>(.+?)<\/>/g, (_, _p1, p2) => p2)
        .replace(/<\$([^>/]*)>(.+?)<\/>/g, (_, _p1, p2) => p2),
      slug: generateSlug(null, value.termName),
    };
  }

  fs.writeFileSync(
    path.resolve("./data/gamedataConst.json"),
    niceJSON({
      richTextStyles: mutatedTextStyles,
      termDescriptionDict: mutatedTermDescription,
    })
  );
}

/**
 * @description This function will go over the "skin_table.json" file
 *  and returns the list of "skins" available to an operator along with
 *  the available skin brands.
 */
function createSkinTable() {
  const { brandList, charSkins } = SkinTable;
  const rawOpList = JSON.parse(
    fs.readFileSync(
      path.resolve("./json/preprocessed/operator_list.json"),
      "utf8"
    )
  );
  // Mapping of operator ids w/ their name
  const operatorMap = {};
  Object.values(rawOpList).map((op) => {
    const opId = op.phases[0].characterPrefabKey;
    operatorMap[opId] = opId === "char_1001_amiya2" ? "Amiya (Guard)" : op.name;
  });

  /* Create the brand table */
  const brandMap = {};
  const subBrandMap = {};
  Object.values(brandList).map((brand) => {
    brandMap[brand.brandId] = {
      id: brand.brandId,
      name: brand.brandName,
      capitalName: brand.brandCapitalName,
      description: brand.description,
    };
    brand.groupList.map((id) => {
      subBrandMap[id] = brand.brandId;
    });
  });

  /* Create the skin table */
  const skinMap = {}; // Contains values for operators, tokens, traps, etc.
  Object.values(charSkins).map((skin) => {
    const uId = skin.tmplId ?? skin.charId;
    const skinName =
      skin.displaySkin.skinName ??
      (skin.displaySkin.skinGroupId
        ? `Elite ${skin.displaySkin.skinGroupId.at(-1)}`
        : "");
    const skinAltText =
      skinName !== "" ? `${operatorMap[uId]}'s "${skinName}" skin` : "";

    const newSkin = {
      skinId: `${skin.portraitId}b`,
      brandId: subBrandMap[skin.displaySkin.skinGroupId] || null,
      subBrand: {
        id: skin.displaySkin.skinGroupId,
        name: skin.displaySkin.skinGroupName,
      },
      releaseAt: skin.displaySkin.getTime,
      name: skinName,
      alt: skinAltText,
      artists: skin.displaySkin.drawerList,
      description: skin.displaySkin.content
        ? replaceUnicode(skin.displaySkin.content)
            ?.replace("<color name=#ffffff>", "")
            .replace("</color>", "")
        : null,
    };

    if (Object.hasOwn(skinMap, uId)) skinMap[uId].push(newSkin);
    else skinMap[uId] = [newSkin];
  });

  // Filter out the values from tokens, traps, etc.
  const operatorSkinMap = {};
  Object.keys(operatorMap).forEach((id) => {
    // Sort the values from skinMap for the operator (by releaseAt then skinId).
    operatorSkinMap[id] = skinMap[id]
      .sort((a, b) => {
        let nameCompare = a.skinId.localeCompare(b.skinId);
        // Amiya edge-case since 3 base skins
        if (a.subBrand.id === "ILLUST_1" && b.subBrand.id === "ILLUST_0") {
          nameCompare = 1;
        }
        if (a.subBrand.id === "ILLUST_0" && b.subBrand.id === "ILLUST_1") {
          nameCompare = -1;
        }
        return a.releaseAt - b.releaseAt || nameCompare;
      })
      .map(({ skinId, brandId, subBrand, releaseAt, ...rest }) => {
        // Save everything except for "releaseAt"
        return { id: skinId, brandId: brandId, subBrand: subBrand, ...rest };
      });
  });

  fs.writeFileSync(
    path.resolve("./data/operator/skins.json"),
    niceJSON({ brandTable: brandMap, skinTable: operatorSkinMap })
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  organizeCharacterTable();
  generateJSONForTypes();
  generateGamedataConst();
  createSkinTable();
}
