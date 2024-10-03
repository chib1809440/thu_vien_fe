import { TEntityAbstract } from "./entity-common.type";


export type TMaterial = TEntityAbstract & {
    createBy: string | null;
    groupId: string | null;
    isPublic: boolean;
    isLink: boolean;
    libraryId: string | null;
    name: string;
    description: string;
};

export type TMaterialCreate = Partial<Pick<TMaterial, "isLink" | "name" | "description" >>;
export type TMaterialEdit = Partial<Pick<TMaterial, "isLink" | "name" | "description" >> & {_id:string};
