import { User } from "../../interfaces/user";
import { TEntityAbstract } from "./entity-common.type";
import { TPublications } from "./publications.type";

export type TStatusLoanSlip = 'đang mượn' | 'quá hạn' | 'đã trả' | 'đang xử lý'|'chờ nhận sách';

export type TLoanSlip = TEntityAbstract & {
    note: string | null;
    userId: User;
    borrowedDay: string;
    returnDay: string;
    barcode: string;
    isPrint: boolean;
    libraryId?: string;
    isAgree: boolean;
    isReturn: boolean,
    receiptDate: string;
    status: TStatusLoanSlip;
    historys: {
        barcode: string;
        historyDate: string;
        name: string;
        position: string;
        publicationId: string;
        quantityLoan: number;
        quantityReturn: number;
    }[];
    publications: (TPublications & { quantityLoan: number, position: string, publicationId: string, quantityReturn?: number, quantityModify?: number })[];
};

export type CreatePublication = {
    publicationId: string;
    name: string;
    quantityLoan: number;
    quantity: number,
    shelvesQuantity: number,
    position: string;
    quantityReturn?: number;
    quantityModify?: number;
    barcode: string;
    libraryId?: string;
    libraryName?: string;
};
export type TLoanSlipCreate = {
    note: string | null;
    userId: string;
    libraryId?: string;
    borrowedDay: string;
    barcodeUserId?: string;
    returnDay: string;
    barcode?: string;
    isLink?: boolean,
    isPrint: boolean;
    receiptDate: string;
    status?: TStatusLoanSlip;
    publications?: CreatePublication[],

};
//export type TLoanSlipCreate = Partial<Pick<TLoanSlip, "note" | "borrowedDay" | "returnDay" | "isPrint" | "receiptDate" | "status" | "publications">> & { userId: string, barcodeUserId?: string };
export type TLoanSlipEdit = Partial<Pick<TLoanSlip, "note" | "borrowedDay" | "returnDay" | "barcode" | "isPrint" | "receiptDate" | "status" | "publications">> & { _id: string, userId: string };
