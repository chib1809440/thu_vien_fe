import { TCategory } from "./category";
import { TEntityAbstract } from "./entity-common.type";


export type TTopic = TEntityAbstract & {
    createBy: string | null;
    groupId: string | null;
    isPublic: boolean;
    isLink: boolean;
    libraryId: string | null;
    name: string;
    categoryIds?: TCategory[] | null;
};

export type TTopicCreate = Partial<Pick<TTopic, "name">> & {
    categoryIds?: string[] | TCategory[] | null;
};
export type TTopicEdit = Partial<Pick<TTopic, "name">> & {
    _id: string,
    categoryIds?: string[] | TCategory[] | null;
};
