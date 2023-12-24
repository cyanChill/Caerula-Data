import type { OperatorIds } from "./typesFrom";
import type { AttackPosition, Rarity, StatTable } from "./shared";

import type { NationId, FactionId, TeamId } from "./AKAffiliation";
import type { Profession, SubClass } from "./AKClass";
import type { ItemCount } from "./AKItem";
import type { RangeId } from "./AKRange";
import type { SkillId } from "./AKSkill";
import type { TokenId } from "./AKToken";

export type OperatorId = (typeof OperatorIds)[number];

/** @description Conversions of the raw data. */
export type EliteLvl = 0 | 1 | 2;

/** @description An operator's stats at a specific level. */
type OperatorStat = StatTable & {
  cost: number;
  blockCnt: number;
  respawnTime: number;
};

/** @description Specification of operation at promotion rank. */
export type Elite = {
  maxLevel: number;
  stats: OperatorStat[]; // Note: Really just "[StatAtLevel, StatAtLevel]"
  evolveCost: ItemCount[] | null;
};

/** @description Specification of skill mastery cost. */
export type OpSkill = {
  skillId: SkillId;
  tokenUsed: TokenId | null;
  unlockedAt: EliteLvl;
  masteryCost: MasteryCost[];
};
export type MasteryCost = {
  upgradeTime: number;
  ingredients: ItemCount[];
};

/** @description Specification of operator talent. */
export type OpTalent = {
  name: string;
  variants: OpTalentVariant[];
};
export type OpTalentVariant = {
  nameOverride?: string;
  elite: EliteLvl;
  level: number;
  potential: Rarity;
  description: string;
};

/** @description Specification of cost to level up skill from 1 to 7. */
export type SkillCost = {
  level: 2 | 3 | 4 | 5 | 6 | 7;
  cost: ItemCount[];
};

/** @description The final object representing an operator. */
export interface Operator {
  id: OperatorId;
  name: string;
  displayName: string;
  rarity: Rarity;
  potentials: string[];
  profession: Profession;
  branch: SubClass<Profession>;
  range: RangeId[];
  tokensUsed: TokenId[] | null;
  elite: Elite[];
  skills: OpSkill[];
  talents: OpTalent[];
  trustBonus: OperatorStat; // Max trust is achieved at 100% (Trust is from 0-200%)
  skillLevel: SkillCost[];
  nationId: NationId | null;
  factionId: FactionId | null;
  teamId: TeamId | null;
  position: AttackPosition;
  tags: string[];
  type: "limited" | "is" | null;
  slug: string;
}
