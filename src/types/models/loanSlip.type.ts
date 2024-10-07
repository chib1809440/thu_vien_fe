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
    status: string;
    publications: TPublications[]
};

export type TLoanSlipCreate = Partial<Pick<TLoanSlip, "note" | "borrowedDay" | "returnDay" | "barcode" | "isPrint" | "receiptDate" | "status" | "publications">> & { userId: string };
export type TLoanSlipEdit = Partial<Pick<TLoanSlip, "note" | "borrowedDay" | "returnDay" | "barcode" | "isPrint" | "receiptDate" | "status" | "publications">> & { _id: string, userId: string };
