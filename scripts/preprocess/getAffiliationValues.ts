import fs from "node:fs";
import path from "node:path";

import character_table from "@/json/en_US/gamedata/excel/character_table.json";
import handbook_team_table from "@/json/en_US/gamedata/excel/handbook_team_table.json";

import { niceJSON } from "@/lib/format";

/**
 * @description Automatically generates the `NationInfo`, `FactionInfo`,
 *  and `TeamInfo` tables in `AKAffiliation.ts`
 */
export function generateAffiliationTables() {
  const nationIds = new Set<string>();
  const factionRelation: Record<string, string | null> = {};
  const teamRelation: Record<string, string | null> = {};

  Object.values(character_table).forEach(({ nationId, groupId, teamId }) => {
    if (nationId) nationIds.add(nationId);
    if (groupId) factionRelation[groupId] = nationId;
    if (teamId) teamRelation[teamId] = nationId;
  });

  const nationTableStr = niceJSON(
    Object.fromEntries(
      [...nationIds].toSorted().map((id) => [id, getAffiliationName(id)])
    )
  ).replace(/"(\w*)": /g, "$1: ");
  const factionTableStr = niceJSON(
    Object.fromEntries(
      Object.keys(factionRelation)
        .toSorted()
        .map((id) => [
          id,
          { name: getAffiliationName(id), nationId: factionRelation[id] },
        ])
    )
  ).replace(/"(\w*)": /g, "$1: ");
  const teamTableStr = niceJSON(
    Object.fromEntries(
      Object.keys(teamRelation)
        .toSorted()
        .map((id) => [
          id,
          { name: getAffiliationName(id), nationId: teamRelation[id] },
        ])
    )
  ).replace(/"(\w*)": /g, "$1: ");

  fs.writeFileSync(
    path.resolve("./data/types/AKAffiliation.ts"),
    fs.readFileSync("./file_base/AKAffiliation_base.txt", "utf8") +
      `export const NationInfo: Record<NationId, string> = ${nationTableStr};\n\n` +
      `export const FactionInfo: Record<FactionId, AffiliationRelation> = ${factionTableStr};\n\n` +
      `export const TeamInfo: Record<TeamId, AffiliationRelation> = ${teamTableStr};\n`
  );
}

/** @description Get the display name of the affiliation. */
function getAffiliationName(id: string) {
  return handbook_team_table[id as keyof typeof handbook_team_table].powerName;
}
