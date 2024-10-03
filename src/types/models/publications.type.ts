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
    categoryId?: TCategory | string;
    authorId?: TAuthor | string;
    shelvesId?: TShelves | string;
    publisherId?: TPublisher | string;
    materialId?: TMaterial | string;
    file?: any;
};

export type TPublicationsCreate = Partial<Pick<TPublications, "isPublic" | "isLink" | "name" | "barcode" | "description" | "note" | "quantity" | "shelvesQuantity" | "status" | "type">>;
export type TPublicationsEdit = Partial<Pick<TPublications, "isPublic" | "isLink" | "name" | "barcode" | "description" | "note" | "quantity" | "shelvesQuantity" | "status" | "type">> & { _id: string };
