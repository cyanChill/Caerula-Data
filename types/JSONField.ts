export type AttackPosition = "MELEE" | "RANGED" | "ALL" | "NONE";

export type BlackboardArr = {
  key: string;
  value: number;
  valueStr: string | null;
}[];

export type MaterialCount = { id: string; count: number; type: "MATERIAL" };

export type OptionalField<T> =
  | { m_defined: true; m_value: T }
  | { m_defined: false; m_value: unknown };

export type SPData = {
  spType:
    | "INCREASE_WITH_TIME"
    | "INCREASE_WHEN_ATTACK"
    | "INCREASE_WHEN_TAKEN_DAMAGE"
    | 8;
  initSp: number;
  increment: number;
};
