import type { OperatorId } from "@/data/types/AKOperator";
import type { BrandId, Brand, Skin } from "@/data/types/AKSkin";

declare const skinTable: {
  brandTable: Record<BrandId, Brand>;
  skinTable: Record<OperatorId, Skin[]>;
};

export default skinTable;
