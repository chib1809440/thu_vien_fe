import { AbstractEntity } from "./entityResponse";

export interface Example extends AbstractEntity {
    name: string;
}
export interface CreateExampleModel {
    name: string;
    schoolId: number;
}