import fs from "node:fs";
import path from "node:path";

import CharwordTable from "@/json/en_US/gamedata/excel/charword_table.json";

import { niceJSON } from "@/lib/format";

/** @description Automatically generates the `VoiceLangTable` in `AKVoice.ts` */
export function generateLanguageTable() {
  const langTable = Object.fromEntries(
    Object.entries(CharwordTable.voiceLangTypeDict).map(([key, { name }]) => [
      key,
      name,
    ])
  );

  // Removes the quotes around the property key
  const langTableStr = niceJSON(langTable).replace(/"(\w*)": /g, "$1: ");

  fs.writeFileSync(
    path.resolve("./data/types/AKVoice.ts"),
    `export const VoiceLangTable = ${langTableStr} as const;\n\n` +
      fs.readFileSync("./file_base/AKVoice_base.txt", "utf8")
  );
}
