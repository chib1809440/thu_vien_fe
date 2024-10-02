import { AbstractEntity } from "./entityResponse";

export interface Role extends AbstractEntity {
    name: string;
    permissions: Permission[];
}
export interface CreateRoleModel {
    name: string;
}
export interface AddPermissionToRoleModel {
    roleId: string;
    permissions: Permission[];
}
export interface Permission {
    action: string;
    resource: string;
}