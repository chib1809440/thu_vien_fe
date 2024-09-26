import { AbstractEntity } from "./entityResponse";

export interface Example extends AbstractEntity {
    name: string;
    description: string;
}
export interface CreateExampleModel {
    description: string;
}