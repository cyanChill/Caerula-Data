import type { BlackboardArr, SPData } from "./JSONField";

type ActivationMethod = "AUTO" | "MANUAL" | "PASSIVE";
type DurationMethod = "NONE" | "AMMO";

export interface RawSkill {
  skillId: string;
  iconId: string | null;
  hidden: boolean;
  levels: SkillLevel[];
}

interface SkillLevel {
  name: string;
  rangeId: string | null;
  description: string | null;
  skillType: ActivationMethod;
  durationType: DurationMethod;
  spData: SPData & {
    levelUpCost: null;
    maxChargeTime: number;
    spCost: number;
  };
  prefabId: string | null;
  duration: number;
  blackboard: BlackboardArr;
}
