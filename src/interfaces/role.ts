import { AbstractEntity } from "./entityResponse";

export interface Role extends AbstractEntity {
    name: string;
}
export interface CreateRoleModel {
    name: string;
}