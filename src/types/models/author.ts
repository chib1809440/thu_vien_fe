import { TEntityAbstract } from "./entity-common.type";


export type TAuthor = TEntityAbstract & {
    createBy: string | null;
    groupId: string | null;
    isPublic: boolean;
    isLink: boolean;
    libraryId: string | null;
    name: string;
    description: string;
};

export type TAuthorCreate = Partial<Pick<TAuthor, "isLink" | "name" | "description" >>;
export type TAuthorEdit = Partial<Pick<TAuthor,  "isLink" | "name" | "description" >> & {_id:string};
