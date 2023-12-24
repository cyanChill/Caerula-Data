import type { ProfessionTable } from "./typesFrom";
import type { AttackPosition } from "./shared";

import type { RangeId } from "./AKRange";

/** @description The profession an operator belongs to. */
export type Profession = keyof typeof ProfessionTable;
/** @description The subclasses/branches associated with a specific profession. */
export type SubClass<T extends Profession> =
  (typeof ProfessionTable)[T][number];

/** @description Object going in-depth about a specific subclass. */
export type Branch = {
  id: SubClass<Profession>;
  name: string;
  position: AttackPosition;
  range: RangeId[];
  trait: string;
  costIncrease: [number, number, number];
};
