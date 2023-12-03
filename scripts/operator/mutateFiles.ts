import fs from "fs";
import path from "path";
import DOMPurify from "isomorphic-dompurify";

import type { OperatorId } from "@/types/AKOperator";
import type { OpParadox, OpPersonalFile, OpRecord } from "@/types/AKOPFiles";
import enOpFiles from "@/json/en_US/gamedata/excel/handbook_info_table.json";
const opFiles = enOpFiles.handbookDict;
const opParadox = enOpFiles.handbookStageData;

import { niceJSON, replaceUnicode, removeIrregularTags } from "@/lib/utils";

/** @description Creates a table of operator records and their files. */
function createOperatorFilesJSON() {
  const opPersonalFiles = {} as Record<OperatorId, OpPersonalFile[]>;
  const opRecords = {} as Record<OperatorId, OpRecord[]>;

  Object.values(opFiles).map(({ charID, storyTextAudio, handbookAvgList }) => {
    const opId = charID as OperatorId;

    // Get Operator personal files for each operator
    opPersonalFiles[opId] = storyTextAudio.map((section) => {
      const { unLockType, storyText } = section.stories[0];
      const unlockVal = section.stories[0].unLockParam;

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
      if (opId === "char_134_ifrit" && section.storyTitle === "Basic Info") {
        saferText = saferText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }

      return {
        title: section.storyTitle,
        text: DOMPurify.sanitize(saferText),
        unlockCond,
      };
    });

    // Create handbook entry if it exists
    if (handbookAvgList.length > 0) {
      opRecords[opId] = handbookAvgList.map((record) => ({
        name: record.storySetName,
        // We'll apply the italics styles in our rendered JSX code.
        description: record.avgList.map((val) =>
          removeIrregularTags(val.storyIntro)
        ),
        unlockCond: {
          elite: +record.unlockParam[0].unlockParam1,
          lvl: +`${record.unlockParam[0].unlockParam2}`,
        },
        trustUnlock: +record.unlockParam[1].unlockParam1,
      }));
    }
  });
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
  const opParadoxSims = {} as Record<OperatorId, OpParadox>;

  Object.values(opParadox).map(({ name, charId, description, unlockParam }) => {
    const opId = charId as OperatorId;
    const unlockVal = unlockParam[0];

    opParadoxSims[opId] = {
      name,
      text: DOMPurify.sanitize(description),
      unlockCond: {
        elite: +unlockVal.unlockParam1,
        lvl: +unlockVal.unlockParam2,
      },
    };
  });

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
