import type { OperatorId } from "@/data/types/AKCharacter";
import type { OpRecord } from "@/data/types/AKOPFiles";

declare const operatorRecords: Record<OperatorId, OpRecord[]>;

export default operatorRecords;
