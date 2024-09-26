import { TEntityAbstract } from "./entity-common.type";


export type TShelves = TEntityAbstract & {
    createBy: string | null;
    libraryId: string | null;
    name: string;
    description: string;
};

export type TShelvesCreate = Partial<Pick<TShelves,  "name" | "description" >>;
export type TShelvesEdit = Partial<Pick<TShelves,  "name" | "description" >> & {_id:string};
