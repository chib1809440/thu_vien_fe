export interface Meta {
    page: number;
    limit: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface EntityData<T> {
    result: T;
    meta?: Meta;
}

export interface EntityResponse<T> {
    statusCode: number;
    success: boolean;
    message?: string | string[];
    data: EntityData<T>;
}
export interface SingleRecordResponse<T> {
    statusCode: number;
    success: boolean;
    message?: string | string[];
    data: T;
}
export interface AbstractEntity {
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
    uuid?: string;
}