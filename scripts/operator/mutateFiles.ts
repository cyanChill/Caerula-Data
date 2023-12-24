import fs from "fs";
import path from "path";
import DOMPurify from "isomorphic-dompurify";

import type {
  OpParadox,
  OpPersonalFile,
  OpRecord,
} from "@/data/types/AKOPFiles";
import OpFiles from "@/json/en_US/gamedata/excel/handbook_info_table.json";

import { niceJSON, replaceUnicode, removeIrregularTags } from "@/lib/utils";

/** @description Creates a table of operator records and their files. */
function createOperatorFilesJSON() {
  const opPersonalFiles: Record<string, OpPersonalFile[]> = {};
  const opRecords: Record<string, OpRecord[]> = {};

  Object.values(OpFiles.handbookDict).map(
    ({ charID: id, storyTextAudio, handbookAvgList }) => {
      // Get Operator personal files for each operator
      opPersonalFiles[id] = storyTextAudio.map(({ stories, storyTitle }) => {
        const { unLockType, storyText, unLockParam: unlockVal } = stories[0];

        let unlockCond = null;
        if (unLockType === "AWAKE") {
          unlockCond = { type: "promotion", val: 2 } as const;
        } else if (unLockType === "FAVOR") {
          unlockCond = { type: "trust", val: +unlockVal } as const;
        } else if (unLockType !== "DIRECT") {
          // Note: Special case w/ Amiya as one file requires unlocking Amiya (Guard)
          unlockCond = { type: "special", val: unlockVal } as const;
        }

        let saferText = replaceUnicode(storyText);
        // Escape characters before santize for only Ifrit's "Basic Info" section
        if (id === "char_134_ifrit" && storyTitle === "Basic Info") {
          saferText = saferText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }

        return {
          title: storyTitle,
          text: DOMPurify.sanitize(saferText),
          unlockCond,
        };
      });

      // Create handbook entry if it exists
      if (handbookAvgList.length > 0) {
        opRecords[id] = handbookAvgList.map(
          ({ storySetName, avgList, unlockParam }) => ({
            name: storySetName,
            // We'll apply the italics styles in our rendered JSX code.
            description: avgList.map((val) =>
              removeIrregularTags(val.storyIntro)
            ),
            unlockCond: {
              elite: +unlockParam[0].unlockParam1,
              lvl: +`${unlockParam[0].unlockParam2}`,
            },
            trustUnlock: +unlockParam[1].unlockParam1,
          })
        );
      }
    }
  );
  // Have Amiya (Guard) have the same personal file as the regular form
  opPersonalFiles.char_1001_amiya2 = opPersonalFiles.char_002_amiya;

  fs.writeFileSync(
    path.resolve("./data/operator/profile/personalFiles.json"),
    niceJSON(opPersonalFiles)
  );
  fs.writeFileSync(
    path.resolve("./data/operator/profile/operatorRecords.json"),
    niceJSON(opRecords)
  );

  console.log(
    `  - 📑 Found ${Object.keys(opPersonalFiles).length} Operator Files.`
  );
  console.log(
    `  - 💽 Found ${Object.keys(opRecords).length} Operator Records.`
  );
}

/** @description Create a table of operator paradox simulator story. */
function createOperatorParadoxJSON() {
  const opParadoxSims: Record<string, OpParadox> = {};

  Object.values(OpFiles.handbookStageData).map(
    ({ name, charId: id, description, unlockParam }) => {
      opParadoxSims[id] = {
        name,
        text: DOMPurify.sanitize(description),
        unlockCond: {
          elite: +unlockParam[0].unlockParam1,
          lvl: +unlockParam[0].unlockParam2,
        },
      };
    }
  );

  fs.writeFileSync(
    path.resolve("./data/operator/profile/paradoxSimulation.json"),
    niceJSON(opParadoxSims)
  );

  console.log(
    `  - 📼 Found ${Object.keys(opParadoxSims).length} Paradox Simulations.`
  );
}

export function generateOperatorDetails() {
  console.log("[📚 Operator Details 📚]");
  createOperatorFilesJSON();
  createOperatorParadoxJSON();
}
