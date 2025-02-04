import { Asset } from "../../interfaces/asset";
import { User } from "../../interfaces/user";
import { TEntityAbstract } from "./entity-common.type";
import { TSupplier } from "./supplier.type";

export type TWareHouseAssetsReceipt = TEntityAbstract & {
    note: string | null;
    supplierId: string | TSupplier;
    createBy?: string | User;
    isAccept: boolean;
    assets: (Asset & { quantity: number, price?: number; })[];
    barcode?: string;
};

export type CreateAssetsWareHouseReceipt = {
    assetId: string;
    name: string;
    quantity: number;
    price: number;
    barcode?: string;
};
export type TWareHouseAssetsReceiptCreate = {
    note: string | null;
    supplierId: string;
    assets?: CreateAssetsWareHouseReceipt[];
};
export type TWareHouseAssetsReceiptEdit = Partial<Pick<TWareHouseAssetsReceipt, "note">> & {
    _id: string;
    supplierId: string;
};