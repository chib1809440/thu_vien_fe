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
    libraries?: TLibrary[] | null;
};

export type TGroupCreate = Partial<Pick<TGroup, "name">> & {
    mainLibrary: string | null;
    libraries?: string[] | TLibrary[] | null;
};
export type TGroupEdit = Partial<Pick<TGroup, "name">> & {
    _id: string;
    mainLibrary?: string | null;
    libraries?: string[] | TLibrary[] | null;
};