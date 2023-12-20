import type { RangeId } from "@/data/types/AKRange";
import type { SkillId, SkillIconId } from "@/data/types/AKSkill";

declare const skill_table: Record<SkillId, RawSkill>;

type RawSkill = {
  skillId: SkillId;
  iconId: SkillIconId; // Icon id is either skillId or iconId
  levels: SkillLevel[];
};

type SkillLevel = {
  name: string;
  rangeId: RangeId | null;
  description: string;
  skillType: "AUTO" | "MANUAL" | "PASSIVE";
  durationType: "PASSIVE" | "INSTANT" | "LIMITED";
  spData: {
    spType:
      | "INCREASE_WITH_TIME"
      | "INCREASE_WHEN_ATTACK"
      | "INCREASE_WHEN_TAKEN_DAMAGE"
      | 8;
    maxChargeTime: 0 | 1 | 2 | 3 | 4;
    spCost: number;
    initSp: number;
  };
  duration: number;
  blackboard: { key: string; value: number; valueStr: string | null }[];
};

export default skill_table;
