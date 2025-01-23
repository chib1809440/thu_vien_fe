import { TLibrary } from "../types/models/library.type";
import { AbstractEntity } from "./entityResponse";
import { Role } from "./role";

export interface User extends AbstractEntity {
    email: string;
    username: string;
    first: string;
    fullname: string;
    phoneNumber: string;
    address: string;
    birthday: string;
    avatar: string | File;
    gender: string;
    barcode: string;
    roleId: Role | string;
    passwordFirst: string;
    class?: string;
    school?: string;
    libraryId: string | TLibrary;
    isActive?: number;
    managementAgency?: string;
}
export interface CreateUserModel {
    _id?: string;
    email: string;
    fullname: string;
    username?: string;
    phoneNumber: string;
    address: string;
    birthday: string;
    avatar?: File | string;
    gender: string;
    class?: string;
    school?: string;
    roleId: string | Role;
    libraryId: string | TLibrary;
}
export interface CreateAdminModel {
    _id?: string;
    email: string;
    fullname: string;
    phoneNumber: string;
    address: string;
    birthday: string;
    avatar?: File;
    gender: string;
    roleId: string | Role;
    libraryId: string | TLibrary;
    class?: string;
    school?: string;
}
export interface ChangePasswordUserModel {
    userId?: string;
    password?: string;
    newPassword?: string;
    confirmPassword: string;
}