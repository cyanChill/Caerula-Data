import type { OperatorId } from "@/data/types/AKCharacter";
import type { OpPersonalFile } from "@/data/types/AKOPFiles";

declare const personalFiles: Record<OperatorId, OpPersonalFile[]>;

export default personalFiles;
