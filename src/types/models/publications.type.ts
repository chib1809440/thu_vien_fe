import { TAuthor } from "./author";
import { TCategory } from "./category";
import { TEntityAbstract } from "./entity-common.type";
import { TMaterial } from "./material";
import { TPublisher } from "./publisher";
import { TShelves } from "./shelves";

export type TTypePublications = 'ấn phẩm cứng' | 'ấn phẩm mềm';
export type TStatusPublications = 'trên kệ' | 'thanh lý' | 'bị hư hại' | 'có sẵn' | 'không có sẵn';

export type TPublications = TEntityAbstract & {
    isPublic: boolean;
    isLink: boolean;
    note?: string;
    name: string;
    barcode: string;
    description?: string;
    quantity: number;
    shelvesQuantity: number;
    status: TStatusPublications;
    type: TTypePublications;
    shelvesId?: TShelves | string;
    categoryIds?: TCategory[] | null;
    authorIds?: TAuthor[] | null;
    publisherIds?: TPublisher[] | null;
    materialIds?: TMaterial[] | null;
    file?: any;
    path?: string;
    priviewImage?: string;
    images?: any[];
    quantityLoan?: number,
    quantityLiquidation?: number,
    quantityDamaged?: number,
};

export type TPublicationsCreate = Partial<Pick<TPublications, "isPublic" | "isLink" | "name" | "barcode" | "description" | "note" | "quantity" | "shelvesQuantity" | "status" | "type" | "file">> & {
    categoryIds?: string[] | TCategory[] | null;
    authorIds?: string[] | TAuthor[] | null;
    shelvesId?: string | null;
    publisherIds?: string[] | TPublisher[] | null;
    materialIds?: string[] | TMaterial[] | null;
};
export type TPublicationsEdit = Partial<Pick<TPublications, "isPublic" | "isLink" | "name" | "barcode" | "description" | "note" | "quantity" | "shelvesQuantity" | "status" | "type" | "file">> & {
    _id: string;
    categoryIds?: string[] | TCategory[] | null;
    authorIds?: string[] | TAuthor[] | null;
    shelvesId?: string | null;
    publisherIds?: string[] | TPublisher[] | null;
    materialIds?: string[] | TMaterial[] | null;
};
