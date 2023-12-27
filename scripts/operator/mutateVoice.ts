import fs from "fs";
import path from "path";
import DOMPurify from "isomorphic-dompurify";

import type { VoiceActor, VoiceLine } from "@/data/types/AKVoice";
import CharwordTable from "@/json/en_US/gamedata/excel/charword_table.json";
import OperatorTable from "@/json/preprocessed/operator_table.json";

import { niceJSON } from "@/lib/format";
import { replaceUnicode } from "@/utils/textFormat";

function getVoiceLines() {
  const skinVoiceLines: Record<string, VoiceLine[]> = {};
  const opVoiceMap: Record<string, Set<string>> = {};

  const operatorIds = Object.keys(OperatorTable);
  operatorIds.forEach((id) => (opVoiceMap[id] = new Set<string>()));

  /* Group voice lines by a "voice id". */
  Object.values(CharwordTable.charWords).forEach((vLine) => {
    /* Don't add entry for duplicate Shalem entry from IS2. */
    if (vLine.charId === "char_512_aprot") return;

    const newVLine = {
      sortId: vLine.voiceIndex,
      title: replaceUnicode(vLine.voiceTitle),
      text: DOMPurify.sanitize(replaceUnicode(vLine.voiceText)),
      unlockCond: ["AWAKE", "FAVOR"].includes(vLine.unlockType)
        ? {
            type: vLine.unlockType === "AWAKE" ? "promotion" : "trust",
            val: vLine.unlockParam[0].valueInt,
          }
        : null,
    } as VoiceLine;

    const vLineKey = vLine.wordKey;
    const opId =
      vLine.wordKey === "char_1001_amiya2" ? "char_1001_amiya2" : vLine.charId;

    // Group voice lines together.
    if (Object.hasOwn(skinVoiceLines, vLineKey))
      skinVoiceLines[vLineKey].push(newVLine);
    else skinVoiceLines[vLineKey] = [newVLine];

    // Map voice line set to operator.
    opVoiceMap[opId].add(vLineKey);
  });

  // Make sure voice lines are in order for each voice line set.
  Object.entries(skinVoiceLines).forEach(([id, value]) => {
    skinVoiceLines[id] = value.sort((a, b) => a.sortId - b.sortId);
  });

  console.log(
    `  - 📢 Found ${Object.keys(skinVoiceLines).length} Voice Lines entries.`
  );

  return {
    voiceLineTable: skinVoiceLines,
    opVoiceMap: Object.fromEntries(
      Object.entries(opVoiceMap).map(([id, val]) => [id, [...val]])
    ),
  };
}

function getVoiceActors() {
  const opVoiceActors: Record<string, VoiceActor[]> = {};
  /* Group voice actors by a "voice id". */
  Object.entries(CharwordTable.voiceLangDict).forEach(([id, { dict }]) => {
    /* Don't add entry for duplicate Shalem entry from IS2. */
    if (id === "char_512_aprot") return;

    opVoiceActors[id] = Object.values(dict)
      .map(({ cvName, voiceLangType }) => ({
        langId: voiceLangType,
        actors: cvName.map((name) => replaceUnicode(name)),
      }))
      .sort((a, b) => a.langId.localeCompare(b.langId));
  });

  console.log(
    `  - 🧑 Found ${
      Object.keys(opVoiceActors).length
    } Operator Voice Actors entries.`
  );

  return { actorTable: opVoiceActors };
}

export function generateVoiceData() {
  console.log("[🎙️ Voices 🎙️]");
  fs.writeFileSync(
    path.resolve("./data/operator/profile/voiceTable.json"),
    niceJSON({
      ...getVoiceActors(),
      ...getVoiceLines(),
    })
  );
}
