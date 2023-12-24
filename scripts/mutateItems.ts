import fs from "fs";
import path from "path";

import type { AKItem } from "@/data/types/AKItem";
import ItemTable from "@/json/en_US/gamedata/excel/item_table.json";

import { getRarity } from "@/lib/conversion";
import { niceJSON, replaceUnicode, removeIrregularTags } from "@/lib/utils";

/** @description Create a table of the items in Arknights. */
export function createItemsJSON() {
  const items: Record<string, AKItem> = {};

  Object.values(ItemTable.items).forEach(
    ({ itemId, iconId, name, description, usage, rarity }) => {
      items[itemId] = {
        id: itemId,
        iconId: iconId,
        name: replaceUnicode(name),
        description: description
          ? removeIrregularTags(replaceUnicode(description))
          : null,
        usage: usage ? replaceUnicode(usage) : null,
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
