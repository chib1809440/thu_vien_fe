import { TEntityAbstract } from "./entity-common.type";

export type TRole = 'user' | 'teacher' | 'admin';

export type TUser = TEntityAbstract & {
    createBy: string | null;
    groupId: string | null;
    libraryId: string | null;
    isPublic: boolean;
    isLink: boolean;
    isActive: boolean;
    username: string;
    email: string;
    fullname: string;
    phoneNumber: string;
    address: string;
    avatar: string;
    birthday: Date;
    permissions: TPermissions;
    role: TRole;
    isAdmin: boolean;
}

export type TPermissions = {
    action: string;
    resource: string;
}