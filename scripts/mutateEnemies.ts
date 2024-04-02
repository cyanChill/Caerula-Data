import fs from "fs";
import path from "path";

import type { RawEnemyAttributes } from "@/types/rawEnemy";
import type { Enemy, EnemyStat } from "@/data/types/AKEnemy";

import { Debuffs } from "@/data/types/AKEnemy";
import { EnemyRaceTable } from "@/data/types/typesFrom";
import EnemyDatabase from "@/json/en_US/gamedata/levels/enemydata/enemy_database.json";
import EnemyTable from "@/json/en_US/gamedata/excel/enemy_handbook_table.json";

import getAttackPattern from "@/data/utils/getAttackPattern";
import { niceJSON } from "@/lib/format";
import { generateSlug, optFieldAsObj } from "@/utils/conversion";
import { addTooltipAndColor, cleanString } from "@/utils/textFormat";
import { toLowercase } from "@/utils/typedStrings";

/** @description Creates a JSON file with an array of Enemy-type objects. */
export function createEnemiesJSON() {
  const enemies: Enemy[] = [];
  const stats: Record<string, EnemyStat[]> = {};
  const errors: string[] = [];

  EnemyDatabase.enemies.forEach(({ Key: id, Value }) => {
    const currEnemy =
      EnemyTable.enemyData[id as keyof typeof EnemyTable.enemyData];

    try {
      if (!currEnemy) throw new Error("Enemy doesn't exist.");
      if (currEnemy.hideInHandbook) throw new Error("Enemy is hidden.");

      // Get an object representing the base stat of an Enemy which can
      // be inherited as a fallback for stronger stat variants.
      const baseStatVal = Value[0].enemyData;
      const statVariants = [
        {
          hp: baseStatVal.attributes.maxHp.m_value,
          atk: baseStatVal.attributes.atk.m_value,
          def: baseStatVal.attributes.def.m_value,
          res: baseStatVal.attributes.magicResistance.m_value,
          mvSpd: baseStatVal.attributes.moveSpeed.m_value,
          atkInterval: baseStatVal.attributes.baseAttackTime.m_value,
          erst: baseStatVal.attributes.epDamageResistance.m_value,
          irst: baseStatVal.attributes.epResistance.m_value,
          atkRange: baseStatVal.rangeRadius.m_value, // Constant
        } as EnemyStat,
      ];

      // For the other "level" stats (for special stages such as EX mode),
      // the only fields that change have their `m_defined` set to true.
      Value.slice(1).forEach(({ enemyData: { attributes } }) => {
        statVariants.push({
          ...statVariants[0],
          ...optFieldAsObj(attributes.maxHp, "hp"),
          ...optFieldAsObj(attributes.atk, "atk"),
          ...optFieldAsObj(attributes.def, "def"),
          ...optFieldAsObj(attributes.magicResistance, "res"),
          ...optFieldAsObj(attributes.moveSpeed, "mvSpd"),
          ...optFieldAsObj(attributes.baseAttackTime, "atkInterval"),
          ...optFieldAsObj(attributes.epDamageResistance, "erst"),
          ...optFieldAsObj(attributes.epResistance, "irst"),
        } as EnemyStat);
      });

      const atkPos = baseStatVal.applyWay.m_defined
        ? baseStatVal.applyWay.m_value
        : "MELEE";

      enemies.push({
        sort: currEnemy.sortId,
        id,
        slug: generateSlug(id, currEnemy.name),
        code: currEnemy.enemyIndex,
        name: cleanString(currEnemy.name),
        description: cleanString(currEnemy.description),
        /*
          FIXME: Currently, some enemies in `enemey_database.json` note
          `enemyTags` to be defined, but have the `m_value` which potentially
          is an empty array be `null`
        */
        race:
          baseStatVal.enemyTags.m_defined && !!baseStatVal.enemyTags.m_value
            ? EnemyRaceTable[
                baseStatVal.enemyTags.m_value[0] as keyof typeof EnemyRaceTable
              ]
            : null,
        type: currEnemy.enemyLevel,
        attackPattern: getAttackPattern(atkPos, currEnemy.damageType),
        abilityList: currEnemy.abilityList.map(({ text, textFormat }) => ({
          text: addTooltipAndColor(text),
          textFormat,
        })),
        immunities: getImmunities(id, baseStatVal.attributes),
        lifePointReduction: baseStatVal.lifePointReduce.m_value,
        weight: baseStatVal.attributes.massLevel.m_value,
        isFlying: baseStatVal.motion.m_value === "FLY",
        relatedEnemies: currEnemy.linkEnemies,
      } as Enemy);

      stats[id] = statVariants;
    } catch {
      errors.push(id);
    }
  });

  fs.writeFileSync(
    path.resolve("./data/enemy/enemyList.json"),
    niceJSON(enemies.sort((a, b) => a.sort - b.sort))
  );
  fs.writeFileSync(
    path.resolve("./data/enemy/enemyStatTable.json"),
    niceJSON(stats)
  );
  fs.writeFileSync(path.resolve("./errors/enemyList.json"), niceJSON(errors));

  console.log("[💀 Enemy Table 💀]");
  console.log(`  - Created ${enemies.length} entries.`);
  console.log(`  - Encountered ${errors.length} errors.`);
}

/** @description Enemies immune to sleep which aren't noted. */
const SleepImmune = new Set([
  "enemy_1115_embald",
  "enemy_3002_ftrtal",
  "enemy_1506_patrt",
  "enemy_1505_frstar",
  "enemy_1508_faust",
  "enemy_1509_mousek",
  "enemy_1510_frstar2",
  "enemy_1511_mdrock",
  "enemy_2006_flsnip",
  "enemy_2007_flwitch",
  "enemy_7012_wilder",
]);

/**
 * @description Returns the list of debuffs enemy is immune to, taking
 *  into account of special cases.
 */
function getImmunities(key: string, effects: RawEnemyAttributes) {
  const immunities = new Set<string>();

  Debuffs.forEach((debuff) => {
    const debuffStatus = effects[`${toLowercase(debuff)}Immune`];
    if (debuffStatus.m_defined && debuffStatus.m_value) immunities.add(debuff);
  });

  // Special Cases
  if (SleepImmune.has(key)) immunities.add("Sleep");
  if (key === "enemy_1523_mandra") {
    return ["Stun", "Silence", "Sleep", "Frozen", "Levitate"];
  }

  return [...immunities];
}
