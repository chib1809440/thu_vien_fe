import { TEntityAbstract } from "./entity-common.type";


export type TTypeAsset = TEntityAbstract & {
    createBy: string | null;
    groupId: string | null;
    isPublic: boolean;
    isLink: boolean;
    note: string;
    name: string;
};
