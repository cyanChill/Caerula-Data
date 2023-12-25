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

/** @description Generate constants from `skill_table.json`. */
function generateSkillConstants() {
  const SkillIds: string[] = [];
  const SkillIconIds = new Set<string>();

  Object.values(SkillTable).forEach(({ skillId, iconId }) => {
    SkillIds.push(skillId);
    if (iconId) SkillIconIds.add(iconId);
  });

  return { SkillIds, SkillIconIds: [...SkillIconIds] };
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
    BrandIds: Object.keys(SkinTable.brandList),
    RangeIds: Object.keys(RangeTable),
    TokenIds: Object.keys(TokenTable),
    ItemIds: Object.keys(ItemTable.items),
  };
}

/**
 * @description Contains the term w/ its definition that is used for
 *  template injections.
 */
type TermDescription = {
  termId: string;
  termName: string;
  description: string;
  slug: string;
};

/** @description Extract the values used for template injections. */
export function generateGameDataConstants() {
  const mutatedTextStyles: Record<string, string | null> = {};
  Object.entries(gameData_const.richTextStyles).forEach(([key, value]) => {
    if (!value.startsWith("<color")) mutatedTextStyles[key] = null;
    else mutatedTextStyles[key] = value.slice(7, 14); // Extract hex value
  });

  const mutatedTermDescription: Record<string, TermDescription> = {};
  Object.entries(gameData_const.termDescriptionDict).forEach(([key, value]) => {
    mutatedTermDescription[key] = {
      ...value,
      // Ignore nested tooltips
      description: value.description
        .replace(/<@([^>/]*)>(.+?)<\/>/g, (_, _p1, p2: string) => p2)
        .replace(/<\$([^>/]*)>(.+?)<\/>/g, (_, _p1, p2: string) => p2),
      slug: generateSlug(null, value.termName),
    };
  });

  fs.writeFileSync(
    path.resolve("./data/gamedataConst.json"),
    niceJSON({
      richTextStyles: mutatedTextStyles,
      termDescriptionDict: mutatedTermDescription,
    })
  );
}

export function createConstantTypesFile() {
  const exportedFile = Object.entries({
    ...generateOperatorConstants(),
    ...generateSkillConstants(),
    ...generateEnemyConstants(),
    ...generateMiscConstants(),
  })
    .map(
      ([key, value]) => `export const ${key} = ${niceJSON(value)} as const;\n`
    )
    .join("\n");

  fs.writeFileSync(path.resolve("./data/types/typesFrom.ts"), exportedFile);
}
