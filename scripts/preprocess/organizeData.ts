import fs from "node:fs";
import path from "node:path";

import type { RawCharacter } from "@/types/rawCharacter";

import amiyaForm from "@/json/en_US/gamedata/excel/char_patch_table.json";
import _CharTable from "@/json/en_US/gamedata/excel/character_table.json";

import { niceJSON } from "@/lib/format";

const AmiyaGuard = amiyaForm.patchChars as Record<string, RawCharacter>;
const CharTable = { ..._CharTable, ...AmiyaGuard };

/**
 * @description Goes over `character_table.json` and splits up the
 *  characters into 3 categories: operators, tokens, and devices.
 */
export function organizeCharacterTable() {
  const operators: Record<string, RawCharacter> = {};
  const tokens: Record<string, RawCharacter> = {};
  const devices: Record<string, RawCharacter> = {};

  Object.entries(CharTable).forEach(([id, value]) => {
    /* Don't add the duplicate Shalem entry from IS2 */
    if (id === "char_512_aprot") return;
    /* Character is a device */
    if (value.profession === "TRAP") return (devices[id] = value);
    /* Character is an operator */
    if (value.profession !== "TOKEN") return (operators[id] = value);
    /* Character is a token */
    tokens[id] = value;

    // Special Case w/ Ling's 3rd Summon as it has an "Advanced Form"
    if (id === "token_10020_ling_soul3") {
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
  });

  fs.writeFileSync(
    path.resolve("./json/preprocessed/operator_table.json"),
    niceJSON(operators)
  );
  fs.writeFileSync(
    path.resolve("./json/preprocessed/tokens_table.json"),
    niceJSON(tokens)
  );
  fs.writeFileSync(
    path.resolve("./json/preprocessed/game_devices_table.json"),
    niceJSON(devices)
  );
}
