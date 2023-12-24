import fs from "fs";
import path from "path";

import type { OptionalField } from "@/types/JSONField";

import type { Enemy, EnemyStat } from "@/data/types/AKEnemy";
import EnemyDatabase from "@/json/en_US/gamedata/levels/enemydata/enemy_database.json";
import EnemyTable from "@/json/en_US/gamedata/excel/enemy_handbook_table.json";
import { EnemyRaceTable } from "@/data/types/typesFrom";

import getAttackPattern from "@/data/utils/getAttackPattern";
import { generateSlug, getImmunities } from "@/lib/conversion";
import { injectTooltipsColors, niceJSON, replaceUnicode } from "@/lib/utils";

/** @description Applies styles to abilities if available.  */
function FormatAbilities(abilites: { text: string; textFormat: string }[]) {
  return abilites.map(({ text, textFormat }) => ({
    text: injectTooltipsColors(text),
    textFormat,
  }));
}

/** @description Return a stat value with a new key name. */
function getNewStat(attrObj: OptionalField<number>, key: string) {
  if (attrObj.m_defined) return { [key]: attrObj.m_value };
  return {};
}

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
          erst: baseStatVal.attributes.epDamageResistance.m_value,
          irst: baseStatVal.attributes.epResistance.m_value,
          mvSpd: baseStatVal.attributes.moveSpeed.m_value,
          atkInterval: baseStatVal.attributes.baseAttackTime.m_value,
          atkRange: baseStatVal.rangeRadius.m_value, // Constant
        } as EnemyStat,
      ];

      // For the other "level" stats (for special stages such as EX mode),
      // the only fields that change have their `m_defined` set to true.
      Value.slice(1).forEach(({ enemyData: { attributes } }) => {
        statVariants.push({
          ...statVariants[0],
          ...getNewStat(attributes.maxHp, "hp"),
          ...getNewStat(attributes.atk, "atk"),
          ...getNewStat(attributes.def, "def"),
          ...getNewStat(attributes.magicResistance, "res"),
          ...getNewStat(attributes.epDamageResistance, "erst"),
          ...getNewStat(attributes.epResistance, "irst"),
          ...getNewStat(attributes.moveSpeed, "mvSpd"),
          ...getNewStat(attributes.baseAttackTime, "atkInterval"),
        } as EnemyStat);
      });

      // Assert certain fields in the base stat is defined.
      if (!baseStatVal.applyWay.m_defined)
        throw new Error("Enemy is missing fields.");

      const enemyRace = baseStatVal.enemyTags.m_defined
        ? EnemyRaceTable[
            baseStatVal.enemyTags.m_value[0] as keyof typeof EnemyRaceTable
          ]
        : null;
      const enemyAtkPat = getAttackPattern(
        baseStatVal.applyWay.m_value,
        currEnemy.damageType
      );

      enemies.push({
        sort: currEnemy.sortId,
        id,
        slug: generateSlug(id, currEnemy.name),
        code: currEnemy.enemyIndex,
        name: replaceUnicode(currEnemy.name),
        description: replaceUnicode(currEnemy.description),
        race: enemyRace,
        type: currEnemy.enemyLevel,
        attackPattern: enemyAtkPat,
        abilityList: FormatAbilities(currEnemy.abilityList),
        isInvalidKilled: currEnemy.isInvalidKilled,
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
