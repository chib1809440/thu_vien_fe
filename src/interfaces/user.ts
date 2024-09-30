import { AbstractEntity } from "./entityResponse";
import { Role } from "./role";

export interface User extends AbstractEntity {
    email: string;
    username: string;
    fullname: string;
    phoneNumber: string;
    address: string;
    birthday: string;
    avatar: string;
    gender: string;
    roleId: Role;
}
export interface CreateUserModel {
    email: string;
    fullname: string;
    phoneNumber: string;
    address: string;
    birthday: string;
    avatar?: File;
    gender: string;
    roleId: string;
}