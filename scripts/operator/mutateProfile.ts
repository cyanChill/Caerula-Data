import fs from "fs";
import path from "path";
import DOMPurify from "isomorphic-dompurify";

import type { OpFile, OpParadox, OpRecord } from "@/data/types/AKOPFiles";
import HandBookTable from "@/json/en_US/gamedata/excel/handbook_info_table.json";

import { niceJSON } from "@/lib/format";
import { cleanString } from "@/utils/textFormat";

/** @description Creates a table of operator records and their files. */
function getFilesAndRecords() {
  const files: Record<string, OpFile[]> = {};
  const records: Record<string, OpRecord[]> = {};

  Object.entries(HandBookTable.handbookDict).forEach(
    ([id, { storyTextAudio, handbookAvgList }]) => {
      // Get operator files for each operator.
      files[id] = storyTextAudio.map(({ stories, storyTitle: title }) => {
        const { unLockType, storyText, unLockParam: unlockVal } = stories[0];

        let unlockCond = null;
        if (unLockType === "AWAKE") {
          unlockCond = { type: "promotion", val: 2 } as const;
        } else if (unLockType === "FAVOR") {
          unlockCond = { type: "trust", val: +unlockVal } as const;
        } else if (unLockType !== "DIRECT") {
          // Note: Special case w/ Amiya as one file requires unlocking Amiya (Guard).
          unlockCond = { type: "special", val: unlockVal } as const;
        }

        let saferText = cleanString(storyText, { unicode: true });
        // Ifrit's "Basic Info" section has angle brackets that need to be escaped
        if (id === "char_134_ifrit" && title === "Basic Info") {
          saferText = saferText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        }

        return { title, text: DOMPurify.sanitize(saferText), unlockCond };
      });

      // Create operator record entry if it exists.
      if (handbookAvgList.length > 0) {
        records[id] = handbookAvgList.map(
          ({ storySetName, avgList, unlockParam }) =>
            ({
              title: storySetName,
              // We'll apply the italics styles in our rendered JSX code.
              text: avgList.map((val) => cleanString(val.storyIntro)),
              unlockCond: {
                elite: +unlockParam[0].unlockParam1,
                level: +`${unlockParam[0].unlockParam2}`,
              },
              trustUnlock: +unlockParam[1].unlockParam1,
            }) as OpRecord
        );
      }
    }
  );

  // `Amiya (Guard)` has the same operator file as the regular form.
  files.char_1001_amiya2 = files.char_002_amiya;

  console.log(`  - 📑 Found ${Object.keys(files).length} Operator Files.`);
  console.log(`  - 💽 Found ${Object.keys(records).length} Operator Records.`);

  return { fileTable: files, recordTable: records };
}

/** @description Create a table of operator paradox simulator story. */
function getParadoxSimulations() {
  const paradoxes: Record<string, OpParadox> = {};

  Object.entries(HandBookTable.handbookStageData).forEach(
    ([id, { name, description, unlockParam }]) => {
      paradoxes[id] = {
        title: name,
        text: DOMPurify.sanitize(description),
        unlockCond: {
          elite: +unlockParam[0].unlockParam1,
          level: +unlockParam[0].unlockParam2,
        },
      } as OpParadox;
    }
  );

  console.log(
    `  - 📼 Found ${Object.keys(paradoxes).length} Paradox Simulations.`
  );

  return { paradoxTable: paradoxes };
}

export function generateOperatorDetails() {
  console.log("[📚 Operator Details 📚]");
  fs.writeFileSync(
    path.resolve("./data/operator/profile/profileTable.json"),
    niceJSON({
      ...getFilesAndRecords(),
      ...getParadoxSimulations(),
    })
  );
}
