import { TAsset } from "../../interfaces/asset";
import { User } from "../../interfaces/user";
import { TEntityAbstract } from "./entity-common.type";
import { TPublications } from "./publications.type";

// Define type enum
export type TPositionLiquidation = "trên kệ" | "trong kho";
export type TPosition = "trong kho" | "trưng bày";
export type TLiquidationType = "Asset" | "Publication";

// Define type default for liquidation
type TLiquidationDefault = {
    createBy?: string | User;
    barcode?: string;
    quantityUsed?: number;
    quantityTotal?: number;
    shelvesQuantity?: number;
    quantity?: number;
    itemId: string;
    quantityLiquidation: number;
    priceLiquidation: number;
    position: TPosition;
};

// Define type liquidation with type
export type TLiquidationDefaultWithType = { type: TLiquidationType, label?: string } & TLiquidationDefault;

// Define type liquidation for asset
type TLiquidationAssetBase = { type: "Asset" } & TLiquidationDefault & TAsset;

// Define type liquidation for publication
type TLiquidationPublicationBase = { type: "Publication" } & TLiquidationDefault & Omit<TPublications, "type">;

// Define type liquidation base
type TLiquidationBase = TLiquidationPublicationBase | TLiquidationAssetBase;

export type TLiquidation = TEntityAbstract & {
    createBy?: string | User;
    note?: string;
    liquidations: TLiquidationBase[];
    reason?: string;
    status?: string;
    isAccept?: boolean;
    isActive?: string;
    isCancel?: string;
    signatures?: string[];
};

type TLiquidationPick = Pick<TLiquidation, "note" | "reason" | "status">;

export type TLiquidationCreate = Partial<TLiquidationPick> & {
    liquidations?: TLiquidationDefaultWithType[];
};

export type CreateLiquidation = {
    liquidations?: TLiquidationDefaultWithType[];
    note?: string;
    reason?: string;
    status?: string;
};

export type EditLiquidation = {
    _id?: string;
    liquidations?: TLiquidationDefaultWithType[];
    note?: string;
    reason?: string;
    status?: string;
};

export type TLiquidationEdit = Partial<TLiquidationPick> & {
    _id?: string;
    liquidations?: TLiquidationDefaultWithType[];
};