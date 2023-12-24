import fs from "fs";
import path from "path";

import type { Skill } from "@/data/types/AKSkill";
import SkillTable from "@/json/en_US/gamedata/excel/skill_table.json";

import { getSkillActiveType, getSkillSpRecovery } from "@/lib/conversion";
import {
  injectTemplateVals,
  injectTooltipsColors,
  niceJSON,
} from "@/lib/utils";

/** @description Create a table for all skills in Arknights. */
export function createSkillsJSON() {
  const skills: Record<string, Skill> = {};
  const errors: string[] = [];

  Object.values(SkillTable).forEach(({ skillId: id, iconId, levels }) => {
    try {
      // Getting constant information about skill.
      const baseSkillVal = levels[0];
      // Don't index a skill with no description.
      if (!baseSkillVal.description)
        throw new Error("Skill doesn't meet indexing requirement.");

      const newSkill = {
        id,
        iconId: iconId ?? id,
        name: baseSkillVal.name,
        description: [],
        rangeId: baseSkillVal.rangeId,
        activationType: getSkillActiveType(baseSkillVal.skillType),
        spRecovery: getSkillSpRecovery(baseSkillVal.spData.spType),
        spCost: [],
        initSp: [],
        duration: [],
      } as Skill;

      // Populate the values that change when we level up a skill.
      levels.forEach(({ spData, duration, blackboard, description }) => {
        newSkill.spCost.push(spData.spCost);
        newSkill.initSp.push(spData.initSp);
        newSkill.duration.push(duration);

        // Some skill uses the skill duration as a variable (and does not
        // include it in the `blackboard` property).
        const injctVals = blackboard;
        if (!blackboard.find(({ key }) => key === "duration")) {
          injctVals.push({ key: "duration", value: duration, valueStr: null });
        }
        // Description should be populated due to earlier check.
        let strWVal = injectTemplateVals(description!, injctVals);

        // Fix broken ability descriptions.
        if (id === "skchr_tiger_2") {
          strWVal = strWVal.replace("Arts damage;", "Arts damage</>;");
        }

        const skillDescription = injectTooltipsColors(strWVal);
        if (!skillDescription)
          throw new Error(`Failed to populate skill description of: ${id}.`);
        newSkill.description.push(skillDescription);
      });

      skills[id] = newSkill;
    } catch {
      errors.push(id);
    }
  });

  fs.writeFileSync(
    path.resolve("./data/gameplay/skillTable.json"),
    niceJSON(skills)
  );
  fs.writeFileSync(path.resolve("./errors/skillTable.json"), niceJSON(errors));

  console.log("[📜 Skill Table 📜]");
  console.log(`  - Created ${Object.keys(skills).length} entries.`);
  console.log(`  - Encountered ${errors.length} errors.`);
}
