type ObtainMethod =
  | "Recruitment & Headhunting"
  | "Event Reward"
  | "Anniversary Reward"
  | "Voucher Exchange"
  | "Credit Store"
  | "Limited Gift Pack"
  | "Main Story"
  | "Obtained from Integrated Strategies";

type RarityTier = `TIER_${1 | 2 | 3 | 4 | 5 | 6}`;

type OperatorProfession =
  | "CASTER"
  | "MEDIC"
  | "PIONEER"
  | "SNIPER"
  | "SPECIAL"
  | "SUPPORT"
  | "TANK"
  | "WARRIOR";

type CandidateBase = {
  unlockCondition: UnlockCondition;
  requiredPotentialRank: number;
  prefabKey: string | null;
  rangeId: string | null;
  blackboard: { key: string; value: number; valueStr: string | null }[];
};

type UnlockCondition = { phase: `PHASE_${0 | 1 | 2}`; level: number };

type MaterialCount = { id: string; count: number; type: "MATERIAL" };

interface Stat {
  level: number;
  data: {
    maxHp: number;
    atk: number;
    def: number;
    magicResistance: number;
    cost: number;
    blockCnt: number;
    moveSpeed: number;
    attackSpeed: number;
    baseAttackTime: number;
    respawnTime: number;
    hpRecoveryPerSec: number;
    spRecoveryPerSec: number;
    maxDeployCount: number;
    maxDeckStackCnt: number;
    tauntLevel: number;
    massLevel: number;
    baseForceLevel: number;
    stunImmune: boolean;
    silenceImmune: boolean;
    sleepImmune: boolean;
    frozenImmune: boolean;
    levitateImmune: boolean;
  };
}

export interface RawCharacter {
  name: string;
  description: string | null;
  canUseGeneralPotentialItem: boolean;
  canUseActivityPotentialItem: boolean;
  potentialItemId: string | null;
  activityPotentialItemId: string | null;
  classicPotentialItemId: string | null;
  nationId: string | null;
  groupId: string | null;
  teamId: string | null;
  displayNumber: string | null;
  tokenKey: string | null;
  appellation: string;
  position: "MELEE" | "RANGED" | "ALL" | "NONE";
  tagList: string[] | null;
  itemUsage: string | null;
  itemDesc: string | null;
  itemObtainApproach: ObtainMethod | null;
  isNotObtainable: boolean;
  isSpChar: boolean;
  maxPotentialLevel: number;
  rarity: RarityTier;
  profession: "TRAP" | "TOKEN" | OperatorProfession;
  subProfessionId: string;
  trait: Trait | null;
  phases: Phase[];
  skills: Skill[];
  talents: Talent[] | null;
  potentialRanks: Potential[];
  favorKeyFrames: Stat[] | null;
  allSkillLvlup: {
    unlockCond: UnlockCondition;
    lvlUpCost: MaterialCount[] | null;
  }[];
}

interface Trait {
  candidates: (CandidateBase & { overrideDescripton: string | null })[];
}

interface Phase {
  characterPrefabKey: string;
  rangeId: string | null;
  maxLevel: number;
  attributesKeyFrames: Stat[];
  evolveCost: MaterialCount[] | null;
}

interface Skill {
  skillId: string;
  overridePrefabKey: string | null;
  overrideTokenKey: string | null;
  levelUpCostCond: {
    unlockCond: UnlockCondition;
    lvlUpTime: number;
    levelUpCost: MaterialCount[] | null;
  }[];
  unlockCond: UnlockCondition;
}

interface Talent {
  candidates: (CandidateBase & {
    name: string | null;
    description: string | null;
  })[];
}

interface Potential {
  type: "BUFF" | "CUSTOM";
  description: string;
  buff: {
    attributes: {
      abnormalFlags: null;
      abnormalImmunes: null;
      abnormalAntis: null;
      abnormalCombos: null;
      abnormalComboImmunes: null;
      attributeModifiers: {
        attributeType: string | number;
        formulaItem: string | number;
        value: number;
        loadFromBlackboard: boolean;
        fetchBaseValueFromSourceEntity: boolean;
      }[];
    };
  } | null;
  equivalentCost: null;
}
