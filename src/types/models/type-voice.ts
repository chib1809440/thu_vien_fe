import { TEntityAbstract } from "./entity-common.type";


export type TTypeVoice = TEntityAbstract & {
    createBy: string | null;
    groupId: string | null;
    isPublic: boolean;
    isLink: boolean;
    libraryId: string | null;
    name: string;
};

export type TTypeVoiceCreate = Partial<Pick<TTypeVoice, "isLink" | "name">>;
export type TTypeVoiceEdit = Partial<Pick<TTypeVoice, "isLink" | "name">> & { _id: string };
