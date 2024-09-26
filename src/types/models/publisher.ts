import { TEntityAbstract } from "./entity-common.type";


export type TPublisher = TEntityAbstract & {
    createBy: string | null;
    groupId: string | null;
    isPublic: boolean;
    libraryId: string | null;
    name: string;
    description: string;
};

export type TPublisherCreate = Partial<Pick<TPublisher,  "name" | "description" >>;
export type TPublisherEdit = Partial<Pick<TPublisher,  "name" | "description" >> & {_id:string};
