import fs from "fs";
import path from "path";

import type { RangeArea, RangeId } from "@/types/AKRange";
import rangeTable from "@/json/en_US/gamedata/excel/range_table.json";

import { niceJSON } from "@/lib/utils";

/** @description Create a table containing a visual representation of range. */
export function createRangeTableJSON() {
  const rTb = {} as Record<RangeId, RangeArea>;
  const errors: string[] = [];

  Object.keys(rangeTable).forEach((id) => {
    const rangeId = id as RangeId;

    try {
      const value = rangeTable[rangeId];

      const dimensions = { row: { min: 0, max: 0 }, col: { min: 0, max: 0 } };
      value.grids.forEach((pos) => {
        if (pos.row > dimensions.row.max) dimensions.row.max = pos.row;
        if (pos.row < dimensions.row.min) dimensions.row.min = pos.row;
        if (pos.col > dimensions.col.max) dimensions.col.max = pos.col;
        if (pos.col < dimensions.col.min) dimensions.col.min = pos.col;
      });
      const numRows = dimensions.row.max - dimensions.row.min + 1;
      const numCols = dimensions.col.max - dimensions.col.min + 1;
      // Where the operator placement is relative to the grid dimensions
      const rowOffset = Math.abs(dimensions.row.min);
      const colOffset = Math.abs(dimensions.col.min);

      const newRangeArea: RangeArea = Array.from(
        Array(numRows),
        () => Array(numCols).fill(0) as 0[]
      );
      // Set placement spot if not provided (ie: rangeId "4-3")
      newRangeArea[rowOffset][colOffset] = 2;

      value.grids.forEach((pos) => {
        // { row: 0, col: 0 } indicates the operator placement spot
        if (pos.row === 0 && pos.col === 0)
          newRangeArea[rowOffset][colOffset] = 2;
        else newRangeArea[pos.row + rowOffset][pos.col + colOffset] = 1;
      });

      rTb[rangeId] = newRangeArea;
    } catch {
      errors.push(rangeId);
    }
  });

  fs.writeFileSync(
    path.resolve("./data/gameplay/rangeTable.json"),
    niceJSON(rTb)
  );
  fs.writeFileSync(path.resolve("./errors/rangeTable.json"), niceJSON(errors));

  console.log("[🎯 Range Table 🎯]");
  console.log(`  - Created ${Object.keys(rTb).length} entries.`);
  console.log(`  - Encountered ${errors.length} errors.`);
}
