import { neatJSON } from "neatjson";

/**
 * @description Neater JSON formating compared to JSON.stringify(obj, null, 2)
 *  as it'll compress the arrays whenever possible.
 */
export const niceJSON = (obj: unknown) => {
  return neatJSON(obj, {
    objectPadding: 1,
    afterComma: 1,
    afterColon1: 1,
    afterColonN: 1,
  });
};
