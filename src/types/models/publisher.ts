import { TEntityAbstract } from "./entity-common.type";


export type TPublisher = TEntityAbstract & {
    createBy: string | null;
    groupId: string | null;
    isPublic: boolean;
    isLink: boolean;
    libraryId: string | null;
    name: string;
    description: string;
    note: string;
};

export type TPublisherCreate = Partial<Pick<TPublisher,  "isLink" | "name" | "description" | "note"  >>;
export type TPublisherEdit = Partial<Pick<TPublisher, "isLink" | "name" | "description" | "note"  >> & {_id:string};
