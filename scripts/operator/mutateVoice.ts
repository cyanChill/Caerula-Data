import fs from "fs";
import path from "path";
import DOMPurify from "isomorphic-dompurify";

import type { CharacterVoice, DialogueLine } from "@/data/types/AKVoice";
import CharwordTable from "@/json/en_US/gamedata/excel/charword_table.json";
import OperatorTable from "@/json/preprocessed/operator_table.json";

import { niceJSON } from "@/lib/format";
import { replaceUnicode } from "@/utils/textFormat";

type UnsortedDialogueLine = DialogueLine & { sortId: number };

function getVoiceLines() {
  const dialogues: Record<string, DialogueLine[]> = {};
  const opVoiceMap: Record<string, Set<string>> = {};

  const operatorIds = Object.keys(OperatorTable);
  operatorIds.forEach((id) => (opVoiceMap[id] = new Set<string>()));

  const unsortedDialogues: Record<string, UnsortedDialogueLine[]> = {};
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
    } as UnsortedDialogueLine;

    const vLineKey = vLine.wordKey;
    const opId =
      vLine.wordKey === "char_1001_amiya2" ? "char_1001_amiya2" : vLine.charId;

    // Group voice lines together.
    if (Object.hasOwn(unsortedDialogues, vLineKey))
      unsortedDialogues[vLineKey].push(newVLine);
    else unsortedDialogues[vLineKey] = [newVLine];

    // Map voice line set to operator.
    opVoiceMap[opId].add(vLineKey);
  });

  // Make sure voice lines are in order for each voice line set.
  Object.entries(unsortedDialogues).forEach(([id, value]) => {
    dialogues[id] = value
      .sort((a, b) => a.sortId - b.sortId)
      .map(({ sortId: _, ...dialogueLine }) => dialogueLine);
  });

  console.log(
    `  - 📢 Found ${Object.keys(dialogues).length} Voice Lines entries.`
  );

  return {
    dialogueTable: dialogues,
    opVoiceMap: Object.fromEntries(
      Object.entries(opVoiceMap).map(([id, val]) => [id, [...val]])
    ),
  };
}

function getVoiceActors() {
  const cvs: Record<string, CharacterVoice[]> = {};
  /* Group voice actors by a "voice id". */
  Object.entries(CharwordTable.voiceLangDict).forEach(([id, { dict }]) => {
    /* Don't add entry for duplicate Shalem entry from IS2. */
    if (id === "char_512_aprot") return;

    cvs[id] = Object.values(dict)
      .map(({ cvName, voiceLangType }) => ({
        langId: voiceLangType,
        actors: cvName.map((name) => replaceUnicode(name)),
      }))
      .sort((a, b) => a.langId.localeCompare(b.langId));
  });

  console.log(
    `  - 🧑 Found ${Object.keys(cvs).length} Operator Voice Actors entries.`
  );

  return { cvTable: cvs };
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
