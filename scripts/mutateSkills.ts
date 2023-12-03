import fs from "fs";
import path from "path";

import { Skill, SkillId } from "@/types/AKSkill";
import enOperatorSkills from "@/json/en_US/gamedata/excel/skill_table.json";

import { getSkillActiveType, getSkillSpRecovery } from "@/lib/conversion";
import {
  injectTemplateVals,
  injectTooltipsColors,
  niceJSON,
} from "@/lib/utils";

/** @description Create a table for all skills in Arknights. */
export function createSkillsJSON() {
  const skills = {} as Record<SkillId, Skill>;
  const errors: string[] = [];

  Object.keys(enOperatorSkills).forEach((id) => {
    const skillId = id as SkillId;

    try {
      const value = enOperatorSkills[skillId];
      const lvl1Skill = value.levels[0];

      // Skip indexing if skill has no description.
      if (!lvl1Skill.description) throw new Error("Not an operator skill.");

      const newSkill = {
        id: skillId,
        iconId: value.iconId ? value.iconId : skillId,
        name: lvl1Skill.name,
        description: [],
        rangeId: lvl1Skill.rangeId,
        activationType: getSkillActiveType(lvl1Skill.skillType),
        spRecovery: getSkillSpRecovery(lvl1Skill.spData.spType),
        spCost: [],
        initSp: [],
        duration: [],
      } as Skill;

      // Populate the variable values
      value.levels.forEach((lvlData) => {
        newSkill.spCost.push(lvlData.spData.spCost);
        newSkill.initSp.push(lvlData.spData.initSp);
        newSkill.duration.push(lvlData.duration);

        // Some skill uses the skill duration as a variable (and not include
        // it in the `blackboard` property)
        const injctVals = lvlData.blackboard;
        if (!lvlData.blackboard.find((obj) => obj.key === "duration")) {
          injctVals.push({
            key: "duration",
            value: lvlData.duration,
            valueStr: null,
          });
        }
        let strWVal = injectTemplateVals(lvlData.description, injctVals);

        /* Fix broken ability descriptions */
        if (skillId === "skchr_tiger_2") {
          strWVal = strWVal.replace("Arts damage;", "Arts damage</>;");
        }

        const completedStr = injectTooltipsColors(strWVal);
        if (!completedStr) {
          throw new Error(`Failed to inject value into ${skillId}.`);
        }
        newSkill.description.push(completedStr);
      });

      skills[skillId] = newSkill;
    } catch {
      errors.push(skillId);
    }
  });

  fs.writeFileSync(
    path.resolve("./data/gameplay/skills.json"),
    niceJSON(skills)
  );
  fs.writeFileSync(
    path.resolve("./errors/operator_skills.json"),
    niceJSON(errors)
  );

  console.log("[📜 Skills 📜]");
  console.log(`  - Created ${Object.keys(skills).length} entries.`);
  console.log(`  - Encountered ${errors.length} errors.`);
}
