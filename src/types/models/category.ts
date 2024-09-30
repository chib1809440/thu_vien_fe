import { TEntityAbstract } from "./entity-common.type";


export type TCategory = TEntityAbstract & {
    createBy: string | null;
    groupId: string | null;
    isPublic: boolean;
    libraryId: string | null;
    name: string;
    description: string;
};

export type TCategoryCreate = Partial<Pick<TCategory, "isPublic" | "name" | "description" >>;
export type TCategoryEdit = Partial<Pick<TCategory,  "isPublic" |"name" | "description" >> & {_id:string};
