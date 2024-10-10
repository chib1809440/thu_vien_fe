import { User } from "../../interfaces/user";
import { TEntityAbstract } from "./entity-common.type";
import { TPublications } from "./publications.type";

export type TStatusLoanSlip = 'không duyệt' | 'đang xử lý' | 'duyệt';

export type TLoanSlip = TEntityAbstract & {
    note: string | null;
    userId: User;
    borrowedDay: string;
    returnDay: string;
    barcode: string;
    isPrint: boolean;
    isAgree: boolean;
    receiptDate: string;
    status: TStatusLoanSlip;
    publications: (TPublications & { quantityLoan: number, position: string })[];
};

export type CreatePublication = {
    publicationId: string;
    name: string;
    quantityLoan: number;
    quantity: number,
    shelvesQuantity: number,
    position: string;
    barcode: string;
};
export type TLoanSlipCreate = {
    note: string | null;
    userId: string;
    borrowedDay: string;
    barcodeUserId?: string;
    returnDay: string;
    barcode?: string;
    isPrint: boolean;
    receiptDate: string;
    status: TStatusLoanSlip;
    publications?: CreatePublication[],

};
//export type TLoanSlipCreate = Partial<Pick<TLoanSlip, "note" | "borrowedDay" | "returnDay" | "isPrint" | "receiptDate" | "status" | "publications">> & { userId: string, barcodeUserId?: string };
export type TLoanSlipEdit = Partial<Pick<TLoanSlip, "note" | "borrowedDay" | "returnDay" | "barcode" | "isPrint" | "receiptDate" | "status" | "publications">> & { _id: string, userId: string };
