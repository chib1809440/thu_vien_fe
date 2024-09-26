import { TEntityAbstract } from "./entity-common.type";


export type TGroup = TEntityAbstract & {
    createBy: string;
    isPublic: boolean;
    isLink: boolean;
    isActive: true;
    name: string;
    mainLibrary: string | null;
};

export type TGroupCreate = Partial<Pick<TGroup,  "isPublic" | "name" | "mainLibrary">>;
export type TGroupEdit = Partial<Pick<TGroup,  "isPublic" | "name" | "mainLibrary">> & {
    _id: string;
};