import type { RawCharacter } from "@/types/rawCharacter";

// https://github.com/microsoft/TypeScript/issues/49703#issuecomment-1470794639
// https://www.typescriptlang.org/tsconfig#allowArbitraryExtensions

declare const operator_table: Record<string, RawCharacter>;

export default operator_table;
