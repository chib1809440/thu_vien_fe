import { TEntityAbstract } from "./entity-common.type";


export type TSupplier = TEntityAbstract & {
    note: string | null;
    phoneNumber: string;
    address: string;
    name: string;
    email: string;
};

export type TSupplierCreate = Partial<Pick<TSupplier, "note" | "name" | "phoneNumber" | "address" | "email">>;
export type TSupplierEdit = Partial<Pick<TSupplier, "note" | "name" | "phoneNumber" | "address" | "email">> & { _id: string };
