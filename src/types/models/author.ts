import { TEntityAbstract } from "./entity-common.type";


export type TAuthor = TEntityAbstract & {
    createBy: string | null;
    groupId: string | null;
    isPublic: boolean;
    libraryId: string | null;
    name: string;
    description: string;
};

export type TAuthorCreate = Partial<Pick<TAuthor, "isPublic" | "name" | "description" >>;
export type TAuthorEdit = Partial<Pick<TAuthor,  "isPublic" | "name" | "description" >> & {_id:string};
