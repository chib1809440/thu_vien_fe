import { TEntityAbstract } from "./entity-common.type";


export type TMaterial = TEntityAbstract & {
    createBy: string | null;
    groupId: string | null;
    isPublic: boolean;
    libraryId: string | null;
    name: string;
    description: string;
};

export type TMaterialCreate = Partial<Pick<TMaterial, "isPublic" | "name" | "description" >>;
export type TMaterialEdit = Partial<Pick<TMaterial, "isPublic" | "name" | "description" >> & {_id:string};
