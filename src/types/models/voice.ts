import { TEntityAbstract } from "./entity-common.type";
import { TPublications } from "./publications.type";
import { TTypeVoice } from "./type-voice";

export type TVoice = TEntityAbstract & {
    createBy: string | null;
    groupId: string | null;
    isPublic: boolean;
    isLink: boolean;
    libraryId: string | null;
    note?: string;
    file?: any;
    path?: string;
    publicationId?: TPublications | string;
    typeVoiceId?: TTypeVoice | string;
    isPrivate?: boolean;
    order?: number;
    name?:string
};

export type TVoiceCreate = Partial<Pick<TVoice, "isPublic" | "isLink" | "note" | "file" | "isPrivate" | "order" | "name">> & {
    publicationId?: string | null;
    typeVoiceId?: string | null;
};

export type TVoiceEdit = Partial<Pick<TVoice, "isPublic" | "isLink" | "note" | "file" | "isPrivate" | "order" | "name">> & {
    _id: string;
    publicationId?: string | null;
    typeVoiceId?: string | null;
};
