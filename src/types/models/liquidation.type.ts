import { TAsset } from "../../interfaces/asset";
import { TEntityAbstract } from "./entity-common.type";
import { TPublications } from "./publications.type";

export type TPositionLiquidation = "trên kệ" | "trong kho"
export type TPosition = "trong kho" | "trưng bày"

export type TLiquidation = TEntityAbstract & {
    note?: string;
    liquidations: Array<{
        type: "Asset" | "Publication";
        itemId: string;
        quantityLiquidation: number;
        priceLiquidation: number;
        position: TPosition;
    } & (TAsset | TPublications)>;
    reason?: string;
    status: string;
    isAccept?: string;
    isActive?: string;
    isCancel?: string;
    signatures?: string[];
};

export type TLiquidationCreate = Partial<Pick<TLiquidation, "note" | "reason" | "status">> & {
    liquidations?: Array<{
        type: "Asset" | "Publication";
        itemId: string;
        quantityLiquidation: number;
        priceLiquidation: number;
        position: TPosition;
    }>;
};

export type CreateLiquidation = {
    liquidations: Object[];
    note?: string;
    reason?: string;
    status?: string;
};


export type TLiquidationEdit = Partial<Pick<TLiquidation, "note" | "reason" | "status">> & {
    _id: string;
    liquidations?: Array<{
        type: "Asset" | "Publication";
        itemId: string;
        quantityLiquidation: number;
        priceLiquidation: number;
        position: TPosition;
    }>;
};