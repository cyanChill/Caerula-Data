import fs from "node:fs";
import path from "node:path";

import type { AKItem } from "@/data/types/AKItem";
import ItemTable from "@/json/en_US/gamedata/excel/item_table.json";

import { niceJSON } from "@/lib/format";
import { getRarity } from "@/utils/conversion";
import { cleanString } from "@/utils/textFormat";

/** @description Create a table of the items in Arknights. */
export function createItemsJSON() {
  const items: Record<string, AKItem> = {};

  Object.entries(ItemTable.items).forEach(
    ([id, { iconId, name, description, usage, rarity }]) => {
      items[id] = {
        id,
        iconId,
        name: cleanString(name),
        description: description ? cleanString(description) : null,
        usage: usage ? cleanString(usage) : null,
        rarity: getRarity(rarity),
      } as AKItem;
    }
  );

  fs.writeFileSync(
    path.resolve("./data/gameplay/itemTable.json"),
    niceJSON(items)
  );

  console.log("[🧳 Item Table 🧳]");
  console.log(`  - Created ${Object.keys(items).length} entries.`);
}
