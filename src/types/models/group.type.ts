import { TEntityAbstract } from "./entity-common.type";
import { TLibrary } from "./library.type";

export type TGroup = TEntityAbstract & {
    createBy: string;
    groupId: number | string;
    isPublic: boolean;
    isLink: boolean;
    isActive: true;
    name: string;
    mainLibrary?: TLibrary | null;
    librarys?: TLibrary[] | null;
};

export type TGroupCreate = Partial<Pick<TGroup, "isPublic" | "name">>;
export type TGroupEdit = Partial<Pick<TGroup, "isPublic" | "name">> & {
    _id: string;
};