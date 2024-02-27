import fs from "fs";
import path from "path";

import latestStore from "@/data/latestStore.json";
import { OperatorIds as ExistingOperatorIds } from "@/data/types/typesFrom";

import { generateOperatorConstants } from "./generateConstants";
import { generateSkinTableConstants } from "./generateSkinTable";

import { niceJSON } from "@/lib/format";

/** @description Tracks any new values to be added to `latestStore.json` */
export function getNewValues() {
  const { OperatorIds: latestOpIdList } = generateOperatorConstants();

  /* Get a list of skins which released 9 days prior, 2 days in the future. */
  const newSkinIds: string[] = [];
  const now = new Date().getTime() / 1000; // From `ms` to `s`
  Object.values(generateSkinTableConstants().skinTable).forEach((skin) => {
    if (
      -777600 <= skin.releasedAt - now &&
      skin.releasedAt - now <= 172800 &&
      skin.id.startsWith("char_")
    )
      newSkinIds.push(skin.id);
  });

  const differences = {
    "latest-operator-ids": getDifference(ExistingOperatorIds, latestOpIdList),
    "latest-skin-ids": newSkinIds,
  };
  const newValues = { ...latestStore };

  Object.keys(differences).forEach((_key) => {
    const key = _key as keyof typeof differences;
    // @ts-expect-error: `differences[key]` will return values that match the type
    if (differences[key].length > 0) newValues[key] = differences[key];
  });

  fs.writeFileSync(
    path.resolve("./data/latestStore.json"),
    niceJSON(newValues)
  );
}

function getDifference(oldVals: readonly string[], newVals: readonly string[]) {
  const existingVals = new Set(oldVals);
  const incomingVals = new Set(newVals);
  return [
    ...new Set([...incomingVals].filter((val) => !existingVals.has(val))),
  ];
}
