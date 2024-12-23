import { TEntityAbstract } from "../types/models/entity-common.type";
import { TTypeAsset } from "../types/models/type-asset";
import { AbstractEntity } from "./entityResponse";

export interface Asset extends AbstractEntity {
    note: string;
    description: string;
    name: string;
    quantityUsed: number;
    quantityTotal: number;
    quantityWarehouse: number;
    quantityDamage: number;
    quantityLiquidation: number;
    typeAssetId: TTypeAsset | string;
    status: string;
    priceInput?: number;
}

export type TAsset = TEntityAbstract & {
    note: string;
    description: string;
    name: string;
    quantityUsed: number;
    quantityTotal: number;
    quantityWarehouse: number;
    quantityDamage: number;
    quantityLiquidation: number;
    typeAssetId: TTypeAsset | string;
    status: string;
    priceInput?: number;
};

export interface CreateAssetModel {
    note: string;
    description: string;
    name: string;
    quantityTotal: number;
    quantityUsed: number;
    quantityWarehouse: number;
    quantityDamage: number;
    quantityLiquidation: number;
    typeAssetId: TTypeAsset | string;
    status: string;
}
export interface UpdateAssetModel {
    _id: string,
    note: string;
    description: string;
    name: string;
    quantityTotal: number;
    quantityUsed: number;
    quantityWarehouse: number;
    quantityDamage: number;
    quantityLiquidation: number;
    typeAssetId: TTypeAsset | string;
    status: string;
}