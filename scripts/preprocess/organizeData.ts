import fs from "fs";
import path from "path";

import amiyaForm from "@/json/en_US/gamedata/excel/char_patch_table.json";
import _CharTable from "@/json/en_US/gamedata/excel/character_table.json";
import type { RawCharacter } from "@/types/rawCharacterType";

import { niceJSON } from "@/lib/utils";

// FIXME: Temporary workaround due data not being updated
const AmiyaGuard = amiyaForm.patchChars as unknown as Record<
  string,
  RawCharacter
>;
const CharTable = { ..._CharTable, ...AmiyaGuard };

/**
 * @description Goes over `character_table.json` and splits up the
 *  characters into 3 categories: operators, tokens, and devices.
 */
export function organizeCharacterTable() {
  const operators: Record<string, RawCharacter> = {};
  const tokens: Record<string, RawCharacter> = {};
  const devices: Record<string, RawCharacter> = {};

  Object.entries(CharTable).forEach(([key, value]) => {
    /* Don't add the duplicate Shalem entry from IS2 */
    if (key === "char_512_aprot") return;

    /* Character is a token */
    if (value.profession === "TOKEN") {
      tokens[key] = value;

      // Special Case w/ Ling's 3rd Summon as it has an "Advanced Form"
      if (key === "token_10020_ling_soul3") {
        tokens.token_10020_ling_soul3a = {
          ...value,
          appellation: "Advanced",
          phases: value.phases.map((phase) => ({
            ...phase,
            // Update stats for "advanced" form
            attributesKeyFrames: phase.attributesKeyFrames.map(
              ({ level, data }) => ({
                level,
                data: {
                  ...data,
                  maxHp: data.maxHp * 2,
                  atk: Math.round(data.atk * 1.8),
                  def: Math.round(data.def * 1.8),
                  magicResistance: data.magicResistance * 2,
                  blockCnt: 4,
                  baseAttackTime: data.baseAttackTime + 0.8,
                },
              })
            ),
          })),
        };
      }

      return;
    }

    /* Character is a device */
    if (value.profession === "TRAP") {
      devices[key] = value;
      return;
    }

    /* Character is an operator */
    operators[key] = value;
  });

  fs.writeFileSync(
    path.resolve("./json/preprocessed/operator_list.json"),
    niceJSON(operators)
  );
  fs.writeFileSync(
    path.resolve("./json/preprocessed/tokens_list.json"),
    niceJSON(tokens)
  );
  fs.writeFileSync(
    path.resolve("./json/preprocessed/game_devices_list.json"),
    niceJSON(devices)
  );
}
