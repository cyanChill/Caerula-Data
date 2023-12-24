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
import { generateSlug } from "@/lib/conversion";
import { niceJSON } from "@/lib/utils";

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
      key,
      { nationId, groupId, teamId, tagList, profession, subProfessionId },
    ]) => {
      OperatorIds.push(key);
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
  const EnemyRaceTable: Record<string, string> = {};
  const AttackPatterns = new Set<string>();
  const AttackPositions = new Set<string>();
  const DamageTypes = new Set<string>();
  const Movements = new Set<string>();
  const ClassTiers = new Set<string>();

  Object.values(EnemyTable.enemyData).forEach(
    ({ enemyId, hideInHandbook, damageType, enemyLevel }) => {
      if (hideInHandbook) return; // Only index the enemies that are shown
      EnemyIds.push(enemyId);

      damageType.forEach((dmg) => DamageTypes.add(dmg));
      ClassTiers.add(enemyLevel);

      const enemyStats = EnemyDatabase.enemies.find(
        (enemy) => enemy.Key === enemyId
      );
      if (!enemyStats) return;

      const { applyWay, motion } = enemyStats.Value[0].enemyData;
      if (motion.m_defined) Movements.add(motion.m_value);
      if (applyWay.m_defined) {
        AttackPositions.add(applyWay.m_value);

        // Generate attack types from attack position & damage types
        AttackPatterns.add(getAttackPattern(applyWay.m_value, damageType));
      }
    }
  );

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

/** @description Extract the values used for template injections. */
export function generateGameDataConstants() {
  const { richTextStyles, termDescriptionDict } = gameData_const;

  const mutatedTextStyles: Record<string, string | null> = {};

  Object.entries(richTextStyles).forEach(([key, value]) => {
    if (!value.startsWith("<color")) mutatedTextStyles[key] = null;
    else mutatedTextStyles[key] = value.slice(7, 14); // Extract hex value
  });

  const mutatedTermDescription: Record<
    string,
    { termId: string; termName: string; description: string; slug: string }
  > = {};
  Object.entries(termDescriptionDict).forEach(([key, value]) => {
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
