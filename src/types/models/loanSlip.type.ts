import { TEntityAbstract } from "./entity-common.type";
import { TPublications } from "./publications.type";

export type TStatusLoanSlip = 'không duyệt' | 'duyệt';

export type TLoanSlip = TEntityAbstract & {
    note: string | null;
    userId: string;
    borrowedDay: string;
    returnDay: string;
    barcode: string;
    isPrint: boolean;
    receiptDate: string;
    status: TStatusLoanSlip;
    publications: CreatePublication[]
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
export type TLoanSlipCreate = Partial<Pick<TLoanSlip, "note" | "borrowedDay" | "returnDay" | "isPrint" | "receiptDate" | "status" | "publications">> & { userId: string };
export type TLoanSlipEdit = Partial<Pick<TLoanSlip, "note" | "borrowedDay" | "returnDay" | "barcode" | "isPrint" | "receiptDate" | "status" | "publications">> & { _id: string, userId: string };
