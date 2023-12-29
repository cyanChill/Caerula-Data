import type {
  AttackPosition,
  BlackboardArr,
  OptionalField,
  SPData,
} from "./JSONField";

type ClassTier = "NORMAL" | "ELITE" | "BOSS";
type Motion = "WALK" | "FLY";

export interface RawEnemyStat {
  level: number; // Variant of difficulty of enemy stat
  enemyData: {
    name: OptionalField<string>;
    description: OptionalField<string>;
    prefabKey: OptionalField<string>;
    attributes: RawEnemyAttributes;
    applyWay: OptionalField<AttackPosition>;
    motion: OptionalField<Motion>;
    enemyTags: OptionalField<string[]>;
    lifePointReduce: OptionalField<number>;
    levelType: OptionalField<ClassTier>;
    rangeRadius: OptionalField<number>;
    numOfExtraDrops: OptionalField<number>;
    viewRadius: OptionalField<number>;
    notCountInTotal: OptionalField<boolean>;
    talentBlackboard: BlackboardArr | null;
    skills: Skill[] | null;
    spData: (SPData & { maxSp: number }) | null;
  };
}

export interface RawEnemyAttributes {
  maxHp: OptionalField<number>;
  atk: OptionalField<number>;
  def: OptionalField<number>;
  magicResistance: OptionalField<number>;
  cost: OptionalField<number>;
  blockCnt: OptionalField<number>;
  moveSpeed: OptionalField<number>;
  attackSpeed: OptionalField<number>;
  baseAttackTime: OptionalField<number>;
  respawnTime: OptionalField<number>;
  hpRecoveryPerSec: OptionalField<number>;
  spRecoveryPerSec: OptionalField<number>;
  maxDeployCount: OptionalField<number>;
  massLevel: OptionalField<number>;
  baseForceLevel: OptionalField<number>;
  tauntLevel: OptionalField<number>;
  epDamageResistance: OptionalField<number>;
  epResistance: OptionalField<number>;
  stunImmune: OptionalField<boolean>;
  silenceImmune: OptionalField<boolean>;
  sleepImmune: OptionalField<boolean>;
  frozenImmune: OptionalField<boolean>;
  levitateImmune: OptionalField<boolean>;
}

interface Skill {
  prefabKey: string;
  priority: number;
  cooldown: number;
  initCooldown: number;
  spCost: number;
  blackboard: BlackboardArr;
}
