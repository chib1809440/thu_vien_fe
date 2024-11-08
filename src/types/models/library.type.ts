import { TEntityAbstract } from "./entity-common.type";


export type TLibrary = TEntityAbstract & {
    createBy: string | null;
    groupId: string | null;
    isPublic: boolean;
    isLink: boolean;
    isActive: boolean;
    name: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    facebook?: string;
    managementAgency: string;
    maxStorageLimit?: number;
    totalStorageUsed?: number;
};

export type TLibraryCreate = Partial<Pick<TLibrary,  "name" | "phoneNumber" | "address"| "managementAgency" | "email" | "facebook" | "maxStorageLimit" >>;
export type TLibraryEdit = Partial<Pick<TLibrary,  "name" | "phoneNumber" | "address"| "managementAgency" | "email" | "facebook" | "maxStorageLimit" >> & {_id:string};
