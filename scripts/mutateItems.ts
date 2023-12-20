import fs from "fs";
import path from "path";

import type { AKItem, ItemId } from "@/data/types/AKItem";
import type { Rarity } from "@/data/types/AKOperator";
import itemsJSON from "@/json/en_US/gamedata/excel/item_table.json";
const itemsTable = itemsJSON.items;

import { niceJSON, replaceUnicode, removeIrregularTags } from "@/lib/utils";

/** @description Create a table of the items in Arknights. */
export function createItemsJSON() {
  const itemsObj = {} as Record<ItemId, AKItem>;

  Object.values(itemsTable).forEach((item) => {
    const itemId = item.itemId as ItemId;

    itemsObj[itemId] = {
      id: itemId,
      iconId: item.iconId,
      name: replaceUnicode(item.name),
      description: item.description
        ? removeIrregularTags(replaceUnicode(item.description))
        : null,
      usage: item.usage ? replaceUnicode(item.usage) : null,
      rarity: (item.rarity + 1) as Rarity,
    };
  });

  fs.writeFileSync(
    path.resolve("./data/gameplay/items.json"),
    niceJSON(itemsObj)
  );

  console.log("[🧳 Items 🧳]");
  console.log(`  - Created ${Object.keys(itemsObj).length} entries.`);
}
