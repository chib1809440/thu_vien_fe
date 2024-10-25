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
    avatar: string;
    gender: string;
    barcode: string;
    roleId: Role|string;
    passwordFirst: string;
    libraryId: string | TLibrary;
}
export interface CreateUserModel {
    _id?: string;
    email: string;
    fullname: string;
    phoneNumber: string;
    address: string;
    birthday: string;
    avatar?: File;
    gender: string;
    roleId: string;
    libraryId: string;
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
    roleId: string;
}