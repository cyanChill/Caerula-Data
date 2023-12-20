import type { NationId, FactionId, TeamId } from "@/data/types/AKAffiliation";
import type { Profession, SubClass } from "@/data/types/AKClass";
import type { ItemCount } from "@/data/types/AKItem";
import type {
  OperatorId,
  Position,
  RawStatAtLevel,
} from "@/data/types/AKOperator";
import type { RangeId } from "@/data/types/AKRange";
import type { SkillId } from "@/data/types/AKSkill";
import type { TokenId } from "@/data/types/AKToken";

// https://github.com/microsoft/TypeScript/issues/49703#issuecomment-1470794639
// https://www.typescriptlang.org/tsconfig#allowArbitraryExtensions

declare const operator_list: Record<OperatorId, RawOperator>;

type RawOperator = {
  name: string;
  appellation: string;
  nationId: NationId;
  groupId: FactionId;
  teamId: TeamId;
  tokenKey: TokenId | null;
  position: Position;
  tagList: string[];
  maxPotentialLevel: 0 | 1 | 2 | 3 | 4 | 5;
  rarity: "TIER_1" | "TIER_2" | "TIER_3" | "TIER_4" | "TIER_5" | "TIER_6";
  profession: Profession;
  subProfessionId: SubClass<Profession>;
  phases: Promotion[];
  skills: Skill[];
  talents: { candidates: TalentVariant[] }[] | null;
  potentialRanks: Potential[];
  favorKeyFrames: [RawStatAtLevel, RawStatAtLevel];
  allSkillLvlup: AllSkillLvlup[];
};

type Promotion = {
  characterPrefabKey: OperatorId;
  rangeId: RangeId;
  maxLevel: number;
  attributesKeyFrames: RawStatAtLevel[];
  evolveCost: ItemCount[] | null;
};

type Skill = {
  skillId: SkillId;
  overrideTokenKey: TokenId | null;
  levelUpCostCond: MasteryCost[];
  unlockCond: {
    phase: "PHASE_0" | "PHASE_1" | "PHASE_2";
    level: 1;
  };
};

type MasteryCost = {
  lvlUpTime: number;
  levelUpCost: ItemCount[];
};

type TalentVariant = {
  unlockCondition: {
    phase: "PHASE_0" | "PHASE_1" | "PHASE_2";
    level: number;
  };
  requiredPotentialRank: 0 | 1 | 2 | 3 | 4 | 5;
  prefabKey: "1" | "2" | null;
  name: string;
  description: string;
  rangeId: RangeId;
};

type Potential = {
  type: "BUFF" | "CUSTOM";
  description: string;
};

type AllSkillLvlup = {
  unlockCond: {
    phase: "PHASE_0" | "PHASE_1";
    level: 1;
  };
  lvlUpCost: ItemCount[];
};

export default operator_list;
