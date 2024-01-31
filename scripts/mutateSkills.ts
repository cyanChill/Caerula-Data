import fs from "fs";
import path from "path";

import type { Skill } from "@/data/types/AKSkill";
import SkillTable from "@/json/en_US/gamedata/excel/skill_table.json";

import { niceJSON } from "@/lib/format";
import { addTooltipAndColor, populateTemplate } from "@/utils/textFormat";

/** @description Create a table for all skills in Arknights. */
export function createSkillsJSON() {
  const skills: Record<string, Skill> = {};
  const errors: string[] = [];

  Object.entries(SkillTable).forEach(([id, { iconId, levels }]) => {
    try {
      const baseSkillVal = levels[0]; // Getting constant information about skill.
      // Don't index a skill with no description.
      if (!baseSkillVal.description)
        throw new Error("Skill doesn't meet indexing requirement.");

      const newSkill = {
        id,
        iconId: iconId ?? id,
        name: baseSkillVal.name,
        description: levels.map(({ description, blackboard, duration }) => {
          // Some skill uses the skill duration as a variable (and does not
          // include it in the `blackboard` property).
          const injctVals = blackboard;
          if (!blackboard.find(({ key }) => key === "duration")) {
            injctVals.push({
              key: "duration",
              value: duration,
              valueStr: null,
            });
          }
          // Description should be populated due to earlier check.
          let strWVal = populateTemplate(description!, injctVals);

          // Fix broken ability descriptions.
          if (id === "skchr_tiger_2") {
            strWVal = strWVal.replace("Arts damage;", "Arts damage</>;");
          }

          const skillDescription = addTooltipAndColor(strWVal);
          if (!skillDescription)
            throw new Error(`Failed to populate skill description of: ${id}.`);
          return skillDescription;
        }),
        rangeId: baseSkillVal.rangeId,
        activationType: getSkillActiveType(baseSkillVal.skillType),
        spRecovery: getSkillSpRecovery(baseSkillVal.spData.spType),
        spCost: levels.map(({ spData }) => spData.spCost),
        initSp: levels.map(({ spData }) => spData.initSp),
        duration: levels.map(({ duration }) => duration),
      } as Skill;

      skills[id] = newSkill;
    } catch {
      errors.push(id);
    }
  });

  fs.writeFileSync(
    path.resolve("./data/character/skillTable.json"),
    niceJSON(skills)
  );
  fs.writeFileSync(path.resolve("./errors/skillTable.json"), niceJSON(errors));

  console.log("[📜 Skill Table 📜]");
  console.log(`  - Created ${Object.keys(skills).length} entries.`);
  console.log(`  - Encountered ${errors.length} errors.`);
}

/** @description Gets how the skill is activated. */
function getSkillActiveType(str: string) {
  if (str === "PASSIVE") return "Passive";
  else if (str === "MANUAL") return "Manual";
  else if (str === "AUTO") return "Auto";
  throw new Error(`Invalid skill activation type value: ${str}.`);
}

/** @description Gets how the skill sp is generated. */
function getSkillSpRecovery(str: string | number) {
  if (str === "INCREASE_WITH_TIME") return "Auto";
  else if (str === "INCREASE_WHEN_ATTACK") return "Offensive";
  else if (str === "INCREASE_WHEN_TAKEN_DAMAGE") return "Defensive";
  else if (str === 8) return "Passive";
  throw new Error(`Invalid SP recovery type value: ${str}.`);
}
