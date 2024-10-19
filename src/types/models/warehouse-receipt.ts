import { User } from "../../interfaces/user";
import { TEntityAbstract } from "./entity-common.type";
import { TPublications } from "./publications.type";
import { TSupplier } from "./supplier.type";


export type TWareHouseReceipt = TEntityAbstract & {
    note: string | null;
    supplierId: string | TSupplier;
    barcode?: string;
    createBy?: string | User;
    isAccept: boolean,
    publications: (TPublications & { quantityWareHouse: number })[];
};

export type CreatePublicationWareHouseReceipt = {
    publicationId: string;
    name: string;
    barcode: string;
    quantityWareHouse: number;
};
export type TWareHouseReceiptCreate = {
    note: string | null;
    supplierId: string;
    publications?: CreatePublicationWareHouseReceipt[],

};
//export type TWareHouseReceiptCreate = Partial<Pick<TWareHouseReceipt, "note" | "borrowedDay" | "returnDay" | "isPrint" | "receiptDate" | "status" | "publications">> & { userId: string, barcodeUserId?: string };
export type TWareHouseReceiptEdit = Partial<Pick<TWareHouseReceipt, "note">> & { _id: string, supplierId: string };
