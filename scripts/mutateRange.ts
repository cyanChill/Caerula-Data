import fs from "fs";
import path from "path";

import type { RangeArea } from "@/data/types/AKRange";
import RangeTable from "@/json/en_US/gamedata/excel/range_table.json";

import { niceJSON } from "@/lib/utils";

/** @description Create a table containing a visual representation of range. */
export function createRangeTableJSON() {
  const ranges: Record<string, RangeArea> = {};

  Object.values(RangeTable).forEach(({ id, grids }) => {
    // Calculate the dimension of the matrix we need to represent the range area.
    const dimensions = { row: { min: 0, max: 0 }, col: { min: 0, max: 0 } };
    grids.forEach(({ row, col }) => {
      if (row > dimensions.row.max) dimensions.row.max = row;
      if (row < dimensions.row.min) dimensions.row.min = row;
      if (col > dimensions.col.max) dimensions.col.max = col;
      if (col < dimensions.col.min) dimensions.col.min = col;
    });
    const numRows = dimensions.row.max - dimensions.row.min + 1;
    const numCols = dimensions.col.max - dimensions.col.min + 1;

    // Where the operator placement is relative to the grid dimensions.
    const rowOffset = Math.abs(dimensions.row.min);
    const colOffset = Math.abs(dimensions.col.min);

    // Create the matrix representing the range area.
    const newRangeArea: RangeArea = Array.from(
      Array(numRows),
      () => Array(numCols).fill(0) as 0[]
    );
    // Set placement spot if not provided (ie: rangeId "4-3").
    newRangeArea[rowOffset][colOffset] = 2;

    // Indicate what spots in the matrix is part of our range.
    grids.forEach(({ row, col }) => {
      // { row: 0, col: 0 } indicates the operator placement spot
      if (row === 0 && col === 0) newRangeArea[rowOffset][colOffset] = 2;
      else newRangeArea[row + rowOffset][col + colOffset] = 1;
    });

    ranges[id] = newRangeArea;
  });

  fs.writeFileSync(
    path.resolve("./data/gameplay/rangeTable.json"),
    niceJSON(ranges)
  );

  console.log("[🎯 Range Table 🎯]");
  console.log(`  - Created ${Object.keys(ranges).length} entries.`);
}
