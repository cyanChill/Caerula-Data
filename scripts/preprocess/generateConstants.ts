import fs from "fs";
import path from "path";

import type { RawCharacter } from "@/types/rawCharacter";

import EnemyDatabase from "@/json/en_US/gamedata/levels/enemydata/enemy_database.json";
import EnemyTable from "@/json/en_US/gamedata/excel/enemy_handbook_table.json";
import ItemTable from "@/json/en_US/gamedata/excel/item_table.json";
import RangeTable from "@/json/en_US/gamedata/excel/range_table.json";
import SkillTable from "@/json/en_US/gamedata/excel/skill_table.json";
import SkinTable from "@/json/en_US/gamedata/excel/skin_table.json";
import gameData_const from "@/json/en_US/gamedata/excel/gamedata_const.json";
import { IGNORE_SKINID_LIST } from "../constants";

import getAttackPattern from "@/data/utils/getAttackPattern";
import { niceJSON } from "@/lib/format";
import { generateSlug } from "@/utils/conversion";

/** @description Generate constants from `operator_table.json`. */
export function generateOperatorConstants() {
  const OperatorTable = JSON.parse(
    fs.readFileSync(
      path.resolve("./json/preprocessed/operator_table.json"),
      "utf8"
    )
  ) as Record<string, RawCharacter>;

  const OperatorIds: string[] = [];
  const NationIds = new Set<string>();
  const FactionIds = new Set<string>();
  const TeamIds = new Set<string>();
  const RoleTags = new Set<string>();
  const _ProfessionTable: Record<string, Set<string>> = {};

  Object.entries(OperatorTable).forEach(
    ([
      id,
      { nationId, groupId, teamId, tagList, profession, subProfessionId },
    ]) => {
      OperatorIds.push(id);
      if (nationId) NationIds.add(nationId);
      if (groupId) FactionIds.add(groupId);
      if (teamId) TeamIds.add(teamId);
      if (tagList) tagList.forEach((tag) => RoleTags.add(tag));

      if (Object.hasOwn(_ProfessionTable, profession)) {
        _ProfessionTable[profession].add(subProfessionId);
      } else {
        _ProfessionTable[profession] = new Set([subProfessionId]);
      }
    }
  );

  // Convert Set back into an array
  const ProfessionTable: Record<string, string[]> = {};
  Object.entries(_ProfessionTable).forEach(([key, value]) => {
    ProfessionTable[key] = [...value];
  });

  return {
    OperatorIds,
    NationIds: [...NationIds],
    FactionIds: [...FactionIds],
    TeamIds: [...TeamIds],
    RoleTags: [...RoleTags],
    ProfessionTable,
  };
}

/** @description Generate constants from `enemy_handbook_table.json` */
function generateEnemyConstants() {
  const EnemyIds: string[] = [];
  const AttackPatterns = new Set<string>();
  const AttackPositions = new Set<string>();
  const ClassTiers = new Set<string>();
  const DamageTypes = new Set<string>();
  const Movements = new Set<string>();

  Object.entries(EnemyTable.enemyData).forEach(
    ([id, { hideInHandbook, damageType, enemyLevel }]) => {
      if (hideInHandbook) return; // Only index the enemies that are shown
      ClassTiers.add(enemyLevel);
      damageType.forEach((dmg) => DamageTypes.add(dmg));

      /* Retrieve values only in the stats table. */
      const enemyStats = EnemyDatabase.enemies.find(({ Key }) => Key === id);
      if (!enemyStats) return; // Don't save id of enemy without any stats
      EnemyIds.push(id); // Save id after knowing enemy has stats

      const { applyWay, motion } = enemyStats.Value[0].enemyData;
      if (motion.m_defined) Movements.add(motion.m_value);
      if (applyWay.m_defined) {
        AttackPositions.add(applyWay.m_value);
        /* Generate attack types from attack position & damage types */
        AttackPatterns.add(getAttackPattern(applyWay.m_value, damageType));
      }
    }
  );

  const EnemyRaceTable: Record<string, string> = {};
  Object.values(EnemyTable.raceData).forEach(({ id, raceName }) => {
    EnemyRaceTable[id] = raceName;
  });

  return {
    EnemyIds,
    EnemyRaceTable,
    AttackPatterns: [...AttackPatterns],
    AttackPositions: [...AttackPositions],
    DamageTypes: [...DamageTypes],
    Movements: [...Movements],
    ClassTiers: [...ClassTiers],
  };
}

/**
 * @description Generates constants from various files which we only need
 *  one value.
 */
function generateMiscConstants() {
  const TokenTable = JSON.parse(
    fs.readFileSync(
      path.resolve("./json/preprocessed/tokens_table.json"),
      "utf8"
    )
  ) as Record<string, RawCharacter>;

  return {
    TokenIds: Object.keys(TokenTable),
    RangeIds: Object.keys(RangeTable),
    SkillIds: Object.keys(SkillTable),
    BrandIds: Object.keys(SkinTable.brandList),
    SkinIds: Object.values(SkinTable.charSkins)
      .map(({ skinId, portraitId, avatarId }) => {
        if (skinId.startsWith("token")) {
          if (avatarId.endsWith("_2")) return null;
          return avatarId;
        } else if (skinId.startsWith("trap_079_allydonq")) {
          return "trap_079_allydonq";
        } else if (skinId.startsWith("trap")) return null;
        return portraitId;
      })
      .filter((id) => id !== null && !IGNORE_SKINID_LIST.includes(id)),
    ItemIds: Object.keys(ItemTable.items),
  };
}

/**
 * @description Contains the term w/ its definition that is used for
 *  template injections.
 */
type TermCategory = {
  name: string;
  description: string;
  terms: Record<string, TermDescription>;
};

type TermDescription = { name: string; description: string; slug: string };

/** @description How we'll categorize the terms. */
const termCategories = [
  {
    key: "gameplay_mechanics",
    regex: /ba\.(?!dt\.).*/,
    name: "Gameplay Mechanics",
    description:
      "Describes buffs & debuffs applicable to enemies or operators.",
  },
  {
    key: "elemental_damages",
    regex: /ba\.dt\..*/,
    name: "Elemental Damages",
    description:
      "The different types of elemental damages done by enemies or operators.",
  },
  {
    key: "base_skills",
    regex: /cc\..*/,
    name: "Base Skills",
    description: "Terms mentioned in base skills.",
  },
];

/** @description Extract the values used for template injections. */
export function generateGameDataConstants() {
  const textStyleDict: Record<string, string | null> = {};
  Object.entries(gameData_const.richTextStyles).forEach(([key, value]) => {
    if (!value.startsWith("<color")) textStyleDict[key] = null;
    else textStyleDict[key] = value.slice(7, 14); // Extract hex value
  });

  fs.writeFileSync(
    path.resolve("./json/colorStyles.json"),
    niceJSON(textStyleDict)
  );

  const tDDict = gameData_const.termDescriptionDict;

  const termCategoryDict: Record<string, TermCategory> = {};
  termCategories.map(({ key, regex, name, description }) => {
    const terms: Record<string, TermDescription> = {};
    // Get the term ids for this category
    const foundTermIds = Object.keys(tDDict).filter((key) =>
      regex.test(key)
    ) as (keyof typeof tDDict)[];

    foundTermIds.map((key) => {
      const { termName, description } = tDDict[key];
      // See if we need to change the resulting slug due to duplicate names
      const hasUsedSlug = Object.values(terms).filter(
        ({ name }) => name === termName
      );

      terms[key] = {
        name: termName,
        // Ignore nested tooltips
        description: description
          .replace(/<@([^>/]*)>(.+?)<\/>/g, (_, _p1, p2: string) => p2)
          .replace(/<\$([^>/]*)>(.+?)<\/>/g, (_, _p1, p2: string) => p2),
        slug:
          hasUsedSlug.length > 0
            ? generateSlug(null, termName) + (hasUsedSlug.length + 1)
            : generateSlug(null, termName),
      };
    });

    termCategoryDict[key] = { name, description, terms };
  });

  fs.writeFileSync(
    path.resolve("./data/gameplay/terminology.json"),
    niceJSON(termCategoryDict)
  );
}

export function createConstantTypesFile() {
  const exportedFile = Object.entries({
    ...generateOperatorConstants(),
    ...generateEnemyConstants(),
    ...generateMiscConstants(),
  })
    .map(
      ([key, value]) => `export const ${key} = ${niceJSON(value)} as const;\n`
    )
    .join("\n");

  fs.writeFileSync(path.resolve("./data/types/typesFrom.ts"), exportedFile);
}
