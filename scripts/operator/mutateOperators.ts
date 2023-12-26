import fs from "fs";
import path from "path";

import type { MaterialCount } from "@/types/JSONField";
import type { RawCharacterStat } from "@/types/rawCharacter";

import type { Operator } from "@/data/types/AKOperator";
import type { SkillId } from "@/data/types/AKSkill";
import type { Token, TokenId } from "@/data/types/AKToken";
import OperatorTable from "@/json/preprocessed/operator_table.json";
import TokenTable from "@/json/preprocessed/tokens_table.json";

import { niceJSON } from "@/lib/format";
import { getPhase, getRarity, generateSlug } from "@/utils/conversion";
import { addTooltipAndColor, cleanString } from "@/utils/textFormat";

/**
 * @description Object containing relations between tokens & operators that can
 *  be read when we're processing our token data.
 */
export const TokenMappings: Record<
  string,
  { id: string; branch: string } | null
> = {};

/** @description Create a table of objects representing operators. */
function createOperatorsJSON() {
  const operators: Record<string, Operator> = {};
  const errors: string[] = [];

  Object.entries(OperatorTable).forEach(([id, currOp]) => {
    try {
      const newOperator = {
        id,
        name: currOp.name,
        displayName: getDisplayName(id, currOp.name, currOp.appellation),
        rarity: getRarity(currOp.rarity),
        potentials: currOp.potentialRanks.map((pot) => pot.description),
        profession: currOp.profession,
        branch: currOp.subProfessionId,
        range: currOp.phases.map((phase) => phase.rangeId),
        tokensUsed: null,
        elite: currOp.phases.map(
          ({ maxLevel, evolveCost, attributesKeyFrames }) => ({
            maxLevel,
            stats: attributesKeyFrames.map((attr) => keepNecessaryStats(attr)),
            evolveCost: evolveCost ? getMaterialCost(evolveCost) : null,
          })
        ),
        skills: currOp.skills.map(
          ({ skillId, overrideTokenKey, unlockCond, levelUpCostCond }) => ({
            skillId,
            tokenUsed: overrideTokenKey,
            unlockedAt: getPhase(unlockCond.phase),
            masteryCost: levelUpCostCond.map(({ lvlUpTime, levelUpCost }) => ({
              upgradeTime: lvlUpTime,
              ingredients: getMaterialCost(levelUpCost ?? []),
            })),
          })
        ),
        talents: (currOp.talents ?? []).map(({ candidates }) => ({
          name: candidates[0].name,
          variants: candidates.map((tal) => {
            let talentDesc = cleanString(tal.description!);

            /* Fix broken talent descriptions */
            if (["char_290_vigna"].includes(id)) {
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
              description: addTooltipAndColor(talentDesc),
            };
          }),
        })),
        trustBonus: keepNecessaryStats(currOp.favorKeyFrames![1]),
        skillLevel: currOp.allSkillLvlup.map((cost, idx) => ({
          level: (idx + 2) as 2 | 3 | 4 | 5 | 6 | 7,
          cost: getMaterialCost(cost.lvlUpCost ?? []),
        })),
        nationId: currOp.nationId,
        factionId: currOp.groupId,
        teamId: currOp.teamId,
        position: currOp.position,
        tags: currOp.tagList,
        type: classifyOperator(id),
        slug: generateSlug(id, currOp.name),
      } as Operator;

      /* Get the tokens associated with an operator. */
      const usedTokens = new Set(Object.keys(currOp.displayTokenDict ?? {}));
      // Get tokens that are automatically deployed.
      currOp.skills.forEach(({ overrideTokenKey }) => {
        if (overrideTokenKey) usedTokens.add(overrideTokenKey);
      });
      // Special case w/ Ling ("Advanced" version of 3rd token)
      if (id === "char_2023_ling") usedTokens.add("token_10020_ling_soul3a");

      if (usedTokens.size > 0) {
        newOperator.tokensUsed = [...usedTokens] as TokenId[];
        // Create mappings from tokens to their operators
        usedTokens.forEach(
          (tokKey) =>
            (TokenMappings[tokKey] = { id, branch: newOperator.branch })
        );
      }

      operators[id] = newOperator;
    } catch {
      errors.push(id);
    }
  });

  fs.writeFileSync(
    path.resolve("./data/operator/operatorTable.json"),
    niceJSON(operators)
  );
  fs.writeFileSync(
    path.resolve("./errors/operatorTable.json"),
    niceJSON(errors)
  );

  console.log("[🧑 Opeartors 🧑]");
  console.log(`  - Created ${Object.keys(operators).length} entries.`);
  console.log(`  - Encountered ${errors.length} errors.`);
}

/** @description Creates a table for all the tokens used by operators. */
function createTokenJSON() {
  const tokens: Record<string, Token> = {};
  const errors: string[] = [];

  Object.entries(TokenTable).forEach(([id, currTok]) => {
    try {
      const tokenOwner = TokenMappings[id];

      const newToken = {
        id,
        iconId:
          id === "token_10020_ling_soul3a" ? "token_10020_ling_soul3" : id,
        name: currTok.name,
        displayName: getDisplayName(id, currTok.name, currTok.appellation),
        description: addTooltipAndColor(currTok.description),
        position: currTok.position, // Includes "ALL"
        range: currTok.phases[0].rangeId,
        stats: currTok.phases.map(({ maxLevel, attributesKeyFrames }) => ({
          maxLevel,
          stats: attributesKeyFrames.map((attr) => keepNecessaryStats(attr)),
        })),
        skillIds: currTok.skills.map((obj) => obj.skillId),
        type: "summon",
        usedBy: tokenOwner?.id,
        slug: generateSlug(id, currTok.name),
      } as Token;

      /* Clean up `skillIds` to remove duplicates. */
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
              id === "token_10000_silent_healrb"
                ? [null, skillId1]
                : [skillId1, null];
          }
        }
      }

      /** @description Special cases where operator has traps. */
      const TrapperSpec = new Set<string>([
        "char_113_cqbw",
        "char_4046_ebnhlz",
      ]);

      /* Specify what type of token this is. */
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

      tokens[id] = newToken;
    } catch {
      errors.push(id);
    }
  });

  fs.writeFileSync(
    path.resolve("./data/token/tokenTable.json"),
    niceJSON(tokens)
  );
  fs.writeFileSync(path.resolve("./errors/tokenTable.json"), niceJSON(errors));

  console.log("[🪼 Tokens 🪼]");
  console.log(`  - Created ${Object.keys(tokens).length} entries.`);
  console.log(`  - Encountered ${errors.length} errors.`);
}

/**
 * @description Generate file containing mappings of slugs from operators
 * and tokens to their ids.
 */
function generateSlugTable() {
  const opSlugs: Record<string, string> = {};
  const tokSlugs: Record<string, string> = {};

  Object.entries(OperatorTable).forEach(([id, { name }]) => {
    opSlugs[generateSlug(id, name)] = id;
  });

  Object.entries(TokenTable).forEach(([id, { name }]) => {
    tokSlugs[generateSlug(id, name)] = id;
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

/** @description Generate a different name for special cases. */
function getDisplayName(id: string, name: string, appellation: string) {
  if (id === "char_1001_amiya2") return "Amiya (Guard)";
  else if (appellation !== " ") return `${name} (${appellation})`;
  return name;
}

/** @description Keep only the stat properties that I want from the raw data. */
function keepNecessaryStats(stat: RawCharacterStat) {
  return {
    hp: stat.data.maxHp,
    atk: stat.data.atk,
    def: stat.data.def,
    res: stat.data.magicResistance,
    cost: stat.data.cost,
    blockCnt: stat.data.blockCnt,
    atkInterval: stat.data.baseAttackTime,
    respawnTime: stat.data.respawnTime,
  };
}

/** @description Operators considered to be limited. */
const LimitedOperators = new Set([
  "char_2014_nian",
  "char_113_cqbw",
  "char_391_rosmon",
  "char_2015_dusk",
  "char_456_ash",
  "char_457_blitz",
  "char_458_rfrost",
  "char_1012_skadi2",
  "char_1013_chen2",
  "char_1014_nearl2",
  "char_2023_ling",
  "char_1023_ghost2",
  "char_1026_gvial2",
  "char_1028_texas2",
  "char_2024_chyue",
  "char_1029_yato2",
  "char_1030_noirc2",
  "char_249_mlyss",
  "char_1016_agoat2",
  "char_245_cello",
]);

/** @description Operators exclusive to Integrated Strategies. */
const ISOperators = new Set([
  "char_504_rguard",
  "char_514_rdfend",
  "char_507_rsnipe",
  "char_506_rmedic",
  "char_505_rcast",
  "char_513_apionr",
  "char_508_aguard",
  "char_511_asnipe",
  "char_509_acast",
  "char_510_amedic",
]);

/** @description Returns whether an operator is limited or is from Integrated Strategies. */
export function classifyOperator(id: string) {
  if (LimitedOperators.has(id)) return "limited";
  else if (ISOperators.has(id)) return "is";
  return null;
}

/** @description Remove the "type" property in the raw object. */
function getMaterialCost(arr: MaterialCount[]) {
  return arr.map((obj) => ({ id: obj.id, count: obj.count }));
}
