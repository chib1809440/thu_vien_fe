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
}
export interface CreateAssetModel {
    note: string;
    description: string;
    name: string;
    quantityTotal: number;
    quantityUsed: number;
    quantityWarehouse: number;
    quantityDamage: number;
    quantityLiquidation: number;

}