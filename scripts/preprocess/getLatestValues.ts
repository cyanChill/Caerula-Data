import fs from "fs";
import path from "path";

import latestStore from "@/data/latestStore.json";
import { OperatorIds as ExistingOperatorIds } from "@/data/types/typesFrom";
import ExistingSkins from "@/data/operator/skinTable.json";

import { generateOperatorConstants } from "./generateConstants";
import { generateSkinTableConstants } from "./generateSkinTable";

import { niceJSON } from "@/lib/utils";

/** @description Tracks any new values to be added to `latestStore.json` */
export function getNewValues() {
  const { OperatorIds: latestOpIdList } = generateOperatorConstants();

  /* Get existing skin ids. */
  const newSkinIds = new Set<string>();
  Object.values(generateSkinTableConstants().skinTable).forEach((skinArr) => {
    skinArr.forEach((skin) => {
      if (skin.brandId !== null) newSkinIds.add(skin.id);
    });
  });
  const existingSkinIds = new Set<string>();
  Object.values(ExistingSkins.skinTable).forEach((skinArr) => {
    skinArr.forEach((skin) => {
      if (skin.brandId !== null) existingSkinIds.add(skin.id);
    });
  });

  const differences = {
    "latest-operator-ids": getDifference(ExistingOperatorIds, latestOpIdList),
    "latest-skin-ids": getDifference([...existingSkinIds], [...newSkinIds]),
  };
  const newValues = { ...latestStore };

  Object.keys(differences).forEach((_key) => {
    const key = _key as keyof typeof differences;
    // @ts-expect-error: Will get the expected outcome
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
