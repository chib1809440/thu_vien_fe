import { AbstractEntity } from "./entityResponse";

export interface School extends AbstractEntity {
    code: string;
    name: string;
    description: string;
    address: string;
    manageBy: string;
}
export interface CreateSchoolModel {
    code: string;
    name: string;
    description: string;
    address: string;
    manageBy: string;
}