import fs from "fs";
import path from "path";
import DOMPurify from "isomorphic-dompurify";

import type { OperatorId } from "@/data/types/AKOperator";
import type { VoiceActor, VoiceLine } from "@/data/types/AKVoice";
import enCharWords from "@/json/en_US/gamedata/excel/charword_table.json";
const enVoiceLines = enCharWords.charWords;
const voiceActors = enCharWords.voiceLangDict;

import { niceJSON, replaceUnicode } from "@/lib/utils";

/** @description Create a table of operator voice lines. */
// FIXME: Some operators (24-OP Skins) have unique voice lines that need to be
// distinguished
function createVoiceLineJSON() {
  const opVoiceLines = {} as Record<OperatorId, VoiceLine[]>;

  // Group the voice lines by operator
  Object.values(enVoiceLines).map((vLine) => {
    const newVLine = {
      sortId: vLine.voiceIndex,
      title: replaceUnicode(vLine.voiceTitle),
      text: DOMPurify.sanitize(replaceUnicode(vLine.voiceText)),
      unlockCond: null,
    } as VoiceLine;
    if (["AWAKE", "FAVOR"].includes(vLine.unlockType)) {
      newVLine.unlockCond = {
        type: vLine.unlockType === "AWAKE" ? "promotion" : "trust",
        val: vLine.unlockParam[0].valueInt,
      };
    }

    const opId =
      vLine.wordKey === "char_1001_amiya2" ? "char_1001_amiya2" : vLine.charId;

    // Assign voice line to operator
    if (Object.hasOwn(opVoiceLines, opId)) opVoiceLines[opId].push(newVLine);
    else opVoiceLines[opId] = [newVLine];
  });

  // Make sure voice lines are in order for each operator
  for (const [_key, value] of Object.entries(opVoiceLines)) {
    const key = _key as OperatorId;
    const sortedVLs = value.sort((a, b) => a.sortId - b.sortId);
    // Remove duplicate entries (sometimes from having a special language such as Italian)
    const seenSortIds = new Set();
    opVoiceLines[key] = sortedVLs.filter((vl) => {
      const isDup = seenSortIds.has(vl.sortId);
      seenSortIds.add(vl.sortId);
      return !isDup;
    });
  }

  fs.writeFileSync(
    path.resolve("./data/operator/profile/voiceLines.json"),
    niceJSON(opVoiceLines)
  );

  console.log(
    `  - 📢 Found ${
      Object.keys(opVoiceLines).length
    } Operator Voice Line entries.`
  );
}

/** @description Creates a table of the voice actors for an operator's base skin. */
function createVoiceActorsJSON() {
  const opVoiceActors = {} as Record<OperatorId, VoiceActor[]>;
  // Group the voice lines by operator
  for (const [key, value] of Object.entries(voiceActors)) {
    // Only return the voice actors for the base skin
    if (key === value.charId || key === "char_1001_amiya2") {
      opVoiceActors[key] = Object.values(value.dict)
        .map((val) => ({
          langId: val.voiceLangType,
          actor: val.cvName.map((name) => replaceUnicode(name)),
        }))
        .sort((a, b) => a.langId.localeCompare(b.langId));
    }
  }

  fs.writeFileSync(
    path.resolve("./data/operator/profile/voiceActors.json"),
    niceJSON(opVoiceActors)
  );

  console.log(
    `  - 🧑 Found ${
      Object.keys(opVoiceActors).length
    } Operator Voice Actors entries.`
  );
}

export function generateVoiceData() {
  console.log("[🎙️ Voices 🎙️]");
  createVoiceLineJSON();
  createVoiceActorsJSON();
}
