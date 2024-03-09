import { fileURLToPath } from "url";

import { organizeCharacterTable } from "./organizeData";
import {
  createConstantTypesFile,
  generateGameDataConstants,
} from "./generateConstants";
import { createSkinTable } from "./generateSkinTable";
import { getNewValues } from "./getLatestValues";
import { generateBranchTable } from "./getClassValues";
import { generateAffiliationTables } from "./getAffiliationValues";

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  organizeCharacterTable();
  getNewValues();
  createConstantTypesFile();
  generateGameDataConstants();
  createSkinTable();
  generateBranchTable();
  generateAffiliationTables();
}
