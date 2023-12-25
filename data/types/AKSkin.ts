import type { BrandIds } from "./typesFrom";

export type BrandId = (typeof BrandIds)[number];

export interface Brand {
  id: BrandId;
  name: string;
  capitalName: string;
  description: string;
}

export interface Skin {
  id: string;
  brandId: BrandId | null;
  subBrand: { id: string; name: string };
  name: string;
  alt: string;
  artists: string[] | null;
  description: string | null;
}
