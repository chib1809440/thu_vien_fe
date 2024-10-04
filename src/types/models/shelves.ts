import { TEntityAbstract } from "./entity-common.type";


export type TShelves = TEntityAbstract & {
    createBy: string | null;
    libraryId: string | null;
    name: string;
    description: string;
    note: string;
};

export type TShelvesCreate = Partial<Pick<TShelves,  "name" | "description" | "note" >>;
export type TShelvesEdit = Partial<Pick<TShelves,  "name" | "description" | "note" >> & {_id:string};
