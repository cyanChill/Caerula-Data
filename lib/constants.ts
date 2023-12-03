import type { Profession, SubClass } from "@/types/AKClass";
import type { OperatorId } from "@/types/AKOperator";
import type { TokenId } from "@/types/AKToken";

/** @description Operators considered to be limited. */
export const LimitedOperators = new Set([
  "char_2014_nian",
  "char_113_cqbw",
  "char_391_rosmon",
  "char_2015_dusk",
  "char_456_ash",
  "char_457_blitz",
  "char_458_rfrost",
  "char_1012_skadi2",
  "char_1013_chen2",
  "char_1014_nearl2",
  "char_2023_ling",
  "char_1023_ghost2",
  "char_1026_gvial2",
  "char_1028_texas2",
  "char_2024_chyue",
  "char_1029_yato2",
  "char_1030_noirc2",
  "char_249_mlyss",
]);

/** @description Operators exclusive to Integrated Strategies. */
export const ISOperators = new Set([
  "char_504_rguard",
  "char_514_rdfend",
  "char_507_rsnipe",
  "char_506_rmedic",
  "char_505_rcast",
  "char_513_apionr",
  "char_508_aguard",
  "char_511_asnipe",
  "char_509_acast",
  "char_510_amedic",
]);

/** @description Enemies immune to sleep which aren't noted. */
export const SleepImmune = new Set([
  "enemy_1115_embald",
  "enemy_3002_ftrtal",
  "enemy_1506_patrt",
  "enemy_1505_frstar",
  "enemy_1508_faust",
  "enemy_1509_mousek",
  "enemy_1510_frstar2",
  "enemy_1511_mdrock",
  "enemy_2006_flsnip",
  "enemy_2007_flwitch",
  "enemy_7012_wilder",
]);

/** @description Enemies immune to all effects which aren't noted. */
export const ImmuneToAll = new Set(["enemy_1523_mandra"]);

/**
 * @description Object containing relations between tokens & operators that can
 *  be read when we're processing our token data.
 */
export const TokenMappings = {
  token_10020_ling_soul3a: { id: "char_2023_ling", branch: "summoner" },
} as Record<TokenId, { id: OperatorId; branch: SubClass<Profession> } | null>;

/** @description Special cases where operator has traps. */
export const TrapperSpec = new Set<OperatorId>([
  "char_113_cqbw",
  "char_4046_ebnhlz",
]);
