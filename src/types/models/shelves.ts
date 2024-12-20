import { Asset } from "../../interfaces/asset";
import { TEntityAbstract } from "./entity-common.type";


export type TShelves = TEntityAbstract & {
    createBy: string | null;
    libraryId: string | null;
    assetId: string | Asset;
    name: string;
    description: string;
    note: string;
};

export type TShelvesCreate = Partial<Pick<TShelves, "name" | "description" | "note">> & {
    assetId?: string | null;
};
export type TShelvesEdit = Partial<Pick<TShelves, "name" | "description" | "note">> & {
    _id: string,
    assetId?: string | Asset;
};
