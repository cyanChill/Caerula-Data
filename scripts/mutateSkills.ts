import fs from "fs";
import path from "path";

import type { Skill } from "@/data/types/AKSkill";
import OperatorTable from "@/json/preprocessed/operator_table.json";
import TokenTable from "@/json/preprocessed/tokens_table.json";
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
        rangeId: getSkillRange(id, baseSkillVal.rangeId),
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

/**
 * @description Returns the correct skill range which may be attached
 *  to a token skill.
 */
function getSkillRange(skillId: string, range: string | null) {
  /* Override for special cases */
  if (skillId === "skchr_swire2_1") return "x-4";
  if (skillId === "skchr_swire2_2") return "x-6";
  if (skillId === "skchr_swire2_3") return "2-4";

  // Only run the logic below if the range is `null`
  if (range) return range;

  // Find character that uses this skill
  const operator = Object.values(OperatorTable).find(({ skills }) =>
    skills.some((s) => s.skillId === skillId)
  );
  if (!operator) return range;
  const { skills, displayTokenDict } = operator;
  // Get the skill number for character
  const skillIdx = skills.findIndex((s) => s.skillId === skillId);
  // Get the token associated with current skill
  let tokenId = skills[skillIdx].overrideTokenKey;
  if (!tokenId) {
    if (!displayTokenDict) return range;
    tokenId = Object.keys(displayTokenDict)[0];
  }
  const token = TokenTable[tokenId as keyof typeof TokenTable];
  // Get skills associated with the token
  const tokenSkillId = token.skills[skillIdx].skillId;
  if (!tokenSkillId) return range;
  const tokenSkill = SkillTable[tokenSkillId];
  if (!tokenSkill) return range;
  const tokenSkillRange = tokenSkill.levels[0].rangeId;

  // Change the skill range to be the token skill's range if the token
  // skill range is defined & not equal to the range of the token
  if (tokenSkillRange && token.phases[0].rangeId !== tokenSkillRange) {
    return tokenSkillRange;
  } else return range;
}
