import fs from "fs";
import path from "path";

import type {
  OpTalent,
  Operator,
  OperatorId,
  RawStatAtLevel,
  StatAtLevel,
} from "@/data/types/AKOperator";
import type { SkillId } from "@/data/types/AKSkill";
import type { Token, TokenId } from "@/data/types/AKToken";
import enOperatorList from "@/json/preprocessed/operator_table.json";
import enTokenList from "@/json/preprocessed/tokens_table.json";
import AmiyaGuardData from "@/json/preprocessed/amiya_guard_polyfill.json";

import { TokenMappings, TrapperSpec } from "@/lib/constants";
import {
  generateSlug,
  getMaterialCost,
  getOpSpecial,
  getPhase,
  getRarity,
} from "@/lib/conversion";
import { injectTooltipsColors, niceJSON, replaceUnicode } from "@/lib/utils";

/** @description Generate a different name for special cases. */
function getDisplayName(
  id: OperatorId | TokenId,
  name: string,
  appellation: string
) {
  if (id === "char_1001_amiya2") return "Amiya (Guard)";
  else if (appellation !== " ") return `${name} (${appellation})`;
  return name;
}

/** @description Keep only the stat properties that I want from the raw data. */
function keepNecessaryStats(rawStat: RawStatAtLevel): StatAtLevel {
  return {
    level: rawStat.level,
    data: {
      hp: rawStat.data.maxHp,
      atk: rawStat.data.atk,
      def: rawStat.data.def,
      res: rawStat.data.magicResistance,
      cost: rawStat.data.cost,
      blockCnt: rawStat.data.blockCnt,
      atkInterval: rawStat.data.baseAttackTime,
      respawnTime: rawStat.data.respawnTime,
    },
  };
}

/** @description Create a table of objects representing operators. */
function createOperatorsJSON() {
  const operators = {} as Record<OperatorId, Operator>;
  const errors: string[] = [];

  Object.values(enOperatorList).forEach((currOp) => {
    const opId = currOp.phases[0].characterPrefabKey;

    /* Use polyfill for `Amiya (Guard)` since data hasn't updated. */
    if (opId === "char_1001_amiya2") {
      operators[opId] = AmiyaGuardData;
      return;
    }

    try {
      const newOperator = {
        id: opId,
        name: currOp.name,
        displayName: getDisplayName(opId, currOp.name, currOp.appellation),
        rarity: getRarity(currOp.rarity),
        potentials: currOp.potentialRanks.map((pot) => pot.description),
        profession: currOp.profession,
        branch: currOp.subProfessionId,
        range: currOp.phases.map((phase) => phase.rangeId),
        tokensUsed: null,
        elite: [],
        skills: [],
        talents: [],
        trustBonus: keepNecessaryStats(currOp.favorKeyFrames[1]),
        skillLevel: [],
        nationId: currOp.nationId,
        factionId: currOp.groupId,
        teamId: currOp.teamId,
        position: currOp.position,
        tags: currOp.tagList,
        type: getOpSpecial(opId),
        slug: generateSlug(opId, currOp.name),
      } as Operator;

      // Add Elite Costs
      newOperator.elite = currOp.phases.map(
        ({ maxLevel, evolveCost, attributesKeyFrames }) => ({
          maxLevel: maxLevel,
          stats: attributesKeyFrames.map((attr) => keepNecessaryStats(attr)),
          evolveCost: evolveCost ? getMaterialCost(evolveCost) : null,
        })
      );

      // Add Skills & Tokens used
      const usedTokens = currOp.tokenKey ? [currOp.tokenKey] : []; // Start w/ default token
      const tmEntry = { id: opId, branch: newOperator.branch }; // Token Map Entry
      if (currOp.tokenKey) TokenMappings[currOp.tokenKey] = tmEntry;

      newOperator.skills = currOp.skills.map((skill) => {
        if (skill.overrideTokenKey) {
          usedTokens.push(skill.overrideTokenKey);
          TokenMappings[skill.overrideTokenKey] = tmEntry;
        }

        return {
          skillId: skill.skillId,
          tokenUsed: skill.overrideTokenKey,
          unlockedAt: getPhase(skill.unlockCond.phase),
          masteryCost: skill.levelUpCostCond.map(
            ({ lvlUpTime, levelUpCost }) => ({
              upgradeTime: lvlUpTime,
              ingredients: levelUpCost ? getMaterialCost(levelUpCost) : [], // Potentially `null` w/ IS Reserve Ops
            })
          ),
        };
      });

      // Special case w/ Ling ("Advanced" version of 3rd token)
      if (opId === "char_2023_ling") usedTokens.push("token_10020_ling_soul3a");
      if (usedTokens.length > 0) newOperator.tokensUsed = usedTokens;

      // Add Talents ("talents" potentially `null` w/ IS Reserve Ops)
      newOperator.talents = currOp.talents
        ? currOp.talents.map(
            ({ candidates }) =>
              ({
                name: candidates[0].name,
                variants: candidates.map((tal) => {
                  let talentDesc = replaceUnicode(tal.description);

                  /* Fix broken talent descriptions */
                  if (["char_290_vigna"].includes(opId)) {
                    talentDesc = talentDesc.replace(")", ")</>");
                  }

                  return {
                    // Incase the talent name changes (ie: Amiya's 1st talent changes name)
                    ...(candidates[0].name !== tal.name
                      ? { nameOverride: tal.name }
                      : {}),
                    elite: getPhase(tal.unlockCondition.phase),
                    level: tal.unlockCondition.level,
                    potential: tal.requiredPotentialRank + 1,
                    description: injectTooltipsColors(talentDesc),
                  };
                }),
              }) as OpTalent
          )
        : [];

      // Add Skill Levels Upgrade Cost
      newOperator.skillLevel = currOp.allSkillLvlup.map((cost, idx) => ({
        level: (idx + 2) as 2 | 3 | 4 | 5 | 6 | 7,
        // "levelUpCost" potentially `null` w/ IS Reserve Ops
        cost: cost.lvlUpCost ? getMaterialCost(cost.lvlUpCost) : [],
      }));

      operators[opId] = newOperator;
    } catch {
      errors.push(opId);
    }
  });

  fs.writeFileSync(
    path.resolve("./data/operator/operators.json"),
    niceJSON(operators)
  );
  fs.writeFileSync(path.resolve("./errors/operators.json"), niceJSON(errors));

  console.log("[🧑 Opeartors 🧑]");
  console.log(`  - Created ${Object.keys(operators).length} entries.`);
  console.log(`  - Encountered ${errors.length} errors.`);
}

/** @description Creates a table for all the tokens used by operators. */
function createTokenJSON() {
  const tokens = {} as Record<TokenId, Token>;
  const errors: string[] = [];

  Object.keys(enTokenList).forEach((id) => {
    const tokenId = id as TokenId;
    const currTok = enTokenList[tokenId];

    try {
      const tokenOwner = TokenMappings[tokenId];

      const newToken = {
        id: tokenId,
        iconId:
          tokenId === "token_10020_ling_soul3a"
            ? "token_10020_ling_soul3"
            : tokenId,
        name: currTok.name,
        displayName: getDisplayName(tokenId, currTok.name, currTok.appellation),
        description: injectTooltipsColors(currTok.description),
        position: currTok.position, // Includes "ALL"
        range: currTok.phases[0].rangeId,
        stats: [],
        skillIds: currTok.skills.map((obj) => obj.skillId),
        type: "summon",
        usedBy: tokenOwner?.id,
        slug: generateSlug(tokenId, currTok.name),
      } as Token;

      // Add Elite Costs
      newToken.stats = currTok.phases.map(
        ({ maxLevel, attributesKeyFrames }) => ({
          maxLevel: maxLevel,
          stats: attributesKeyFrames.map((attr) => keepNecessaryStats(attr)),
        })
      );

      // Cleaning up "skillIds"
      const tokSkillIds = newToken.skillIds;
      if (tokSkillIds[0] !== null && tokSkillIds.length > 1) {
        const skillId1 = tokSkillIds[0];
        // If all spots in the skillId array is the same.
        if (tokSkillIds.join("") === skillId1.repeat(tokSkillIds.length)) {
          // Triple Repeats Case
          if (tokSkillIds.length === 3) {
            const newSkillIdArr = new Array<SkillId | null>(3).fill(null);
            // Last character should be a number from 1 to 3
            newSkillIdArr[+skillId1.slice(-1) - 1] = skillId1;
            newToken.skillIds = newSkillIdArr;
          } else {
            // Double Repeat Cases
            newToken.skillIds =
              tokenId === "token_10000_silent_healrb"
                ? [null, skillId1]
                : [skillId1, null];
          }
        }
      }

      if (tokenOwner?.branch === "tactician") {
        newToken.type = "reinforcement";
      } else if (tokenOwner?.branch === "craftsman") {
        newToken.type = "support";
      } else if (
        tokenOwner?.branch === "traper" ||
        (tokenOwner && TrapperSpec.has(tokenOwner?.id))
      ) {
        newToken.type = "trap";
      } else if (!tokenOwner) {
        newToken.type = "other"; // If token isn't owned by anyone
      }

      tokens[tokenId] = newToken;
    } catch {
      errors.push(tokenId);
    }
  });

  fs.writeFileSync(path.resolve("./data/token/tokens.json"), niceJSON(tokens));
  fs.writeFileSync(path.resolve("./errors/tokens.json"), niceJSON(errors));

  console.log("[🪼 Tokens 🪼]");
  console.log(`  - Created ${Object.keys(tokens).length} entries.`);
  console.log(`  - Encountered ${errors.length} errors.`);
}

/**
 * @description Generate file containing mappings of slugs from operators
 * and tokens to their ids.
 */
function generateSlugTable() {
  const opSlugs = {} as Record<string, OperatorId>;
  const tokSlugs = {} as Record<string, TokenId>;

  Object.values(enOperatorList).forEach((currOp) => {
    const opId = currOp.phases[0].characterPrefabKey;
    opSlugs[generateSlug(opId, currOp.name)] = opId;
  });

  Object.keys(enTokenList).forEach((id) => {
    const tokenId = id as TokenId;
    const value = enTokenList[tokenId];
    tokSlugs[generateSlug(tokenId, value.name)] = tokenId;
  });

  fs.writeFileSync(
    path.resolve("./data/operator/slugTable.ts"),
    `import type { OperatorId } from "@/data/types/AKOperator";\n\nexport const OpSlugTable = ${niceJSON(
      opSlugs
    )} as Record<string, OperatorId>;\n`
  );
  fs.writeFileSync(
    path.resolve("./data/token/slugTable.ts"),
    `import type { TokenId } from "@/data/types/AKToken";\n\nexport const TokSlugTable = ${niceJSON(
      tokSlugs
    )} as Record<string, TokenId>;\n`
  );
}

export function generateOperatorStatsAndSlugs() {
  createOperatorsJSON();
  createTokenJSON();
  generateSlugTable();
}
