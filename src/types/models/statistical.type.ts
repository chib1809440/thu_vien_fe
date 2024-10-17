import { TEntityAbstract } from "./entity-common.type";


export type TStatistical = TEntityAbstract & {
    totalPublication: TotalPublication[];
    totalBorrowable: number;
    TopBorrowedBooksInMonth: TopBorrowedBooksInMonth[];
    totalBorrowedBooks: number;
    totalReturnedBooks: number;
    totalOverdueLoans: number;
};

export type TotalPublication = {
    totalQuantity: string;
    count: number;
    type: string;
};
export type TopBorrowedBooksInMonth = {
    totalBorrowed: number;
    name: string;
};
