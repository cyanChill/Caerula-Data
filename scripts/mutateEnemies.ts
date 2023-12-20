import fs from "fs";
import path from "path";

import type { Enemy, EnemyId, EnemyStat } from "@/data/types/AKEnemy";
import type { DefineValObj } from "./types";
import EnemyList from "@/json/en_US/gamedata/excel/enemy_handbook_table.json";
import EnemyStats from "@/json/en_US/gamedata/levels/enemydata/enemy_database.json";
const enemies = EnemyStats.enemies;

import {
  generateSlug,
  getImmunities,
  getAttackPattern,
} from "@/lib/conversion";
import { injectTooltipsColors, niceJSON, replaceUnicode } from "@/lib/utils";

/** @description Return a stat value with a new key name. */
function getNewStat(attrObj: DefineValObj<number>, key: string) {
  if (attrObj.m_defined) return { [key]: attrObj.m_value };
  return {};
}

/** @description Creates a JSON file with an array of Enemy-type objects. */
export function createEnemiesJSON() {
  const results: Enemy[] = [];
  const stats = {} as Record<EnemyId, EnemyStat[]>;
  const errors: string[] = [];

  enemies.forEach((enemy) => {
    const id = enemy.Key as EnemyId;
    const enemyEntry = EnemyList[id];

    try {
      if (!enemyEntry) throw new Error("Enemy doesn't exist.");
      if (enemyEntry.hideInHandbook) throw new Error("Enemy is hidden.");

      // Create the base "EnemyStat" object.
      const baseStats = enemy.Value[0].enemyData;
      const statVariants = [
        {
          hp: baseStats.attributes.maxHp.m_value,
          atk: baseStats.attributes.atk.m_value,
          def: baseStats.attributes.def.m_value,
          res: baseStats.attributes.magicResistance.m_value,
          mvSpd: baseStats.attributes.moveSpeed.m_value,
          atkInterval: baseStats.attributes.baseAttackTime.m_value,
          atkRange: baseStats.rangeRadius.m_value, // Constant
        } as EnemyStat,
      ];

      // For the other "level" stats (for special stages such as EX mode),
      // the only fields that change have their `m_defined` set to true.
      enemy.Value.slice(1).forEach(({ enemyData: { attributes } }) => {
        statVariants.push({
          ...statVariants[0],
          ...getNewStat(attributes.maxHp, "hp"),
          ...getNewStat(attributes.atk, "atk"),
          ...getNewStat(attributes.def, "def"),
          ...getNewStat(attributes.magicResistance, "res"),
          ...getNewStat(attributes.moveSpeed, "mvSpd"),
          ...getNewStat(attributes.baseAttackTime, "atkInterval"),
        } as EnemyStat);
      });

      results.push({
        sort: enemyEntry.sortId,
        id,
        slug: generateSlug(id, enemyEntry.name),
        code: enemyEntry.enemyIndex,
        name: replaceUnicode(enemyEntry.name),
        description: replaceUnicode(enemyEntry.description),
        race: enemyEntry.enemyRace,
        type: enemyEntry.enemyLevel,
        attackType: getAttackPattern(enemyEntry.attackType),
        ability: injectTooltipsColors(enemyEntry.ability),
        isInvalidKilled: enemyEntry.isInvalidKilled,
        immunities: getImmunities(id, baseStats.attributes),
        lifePointReduction: baseStats.lifePointReduce.m_value,
        weight: baseStats.attributes.massLevel.m_value,
      } as Enemy);
      stats[id] = statVariants;
    } catch {
      errors.push(id);
    }
  });

  fs.writeFileSync(
    path.resolve("./data/enemy/enemies.json"),
    niceJSON(results.sort((a, b) => a.sort - b.sort))
  );
  fs.writeFileSync(
    path.resolve("./data/enemy/enemyStats.json"),
    niceJSON(stats)
  );
  fs.writeFileSync(path.resolve("./errors/enemies.json"), niceJSON(errors));

  console.log("[💀 Enemies 💀]");
  console.log(`  - Created ${results.length} entries.`);
  console.log(`  - Encountered ${errors.length} errors.`);
}
