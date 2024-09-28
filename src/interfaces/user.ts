import { AbstractEntity } from "./entityResponse";

export interface User extends AbstractEntity {
    email: string;
    username: string;
    fullname: string;
    phoneNumber: string;
    address: string;
    birthday: string;
    avatar: string;
    gender: string;
}
export interface CreateUserModel {
    email: string;
    password: string;
    username: string;
    fullname: string;
    phoneNumber: string;
    address: string;
    birthday: string;
    avatar: string;
    gender: string;
}