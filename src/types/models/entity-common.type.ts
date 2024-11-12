export type TTimestamp = {
    createdAt: string;
    updatedAt: string;
};

export type TEntityAbstract = TTimestamp & {
    _id: string;
};

export type TOrder = 'DESC' | 'ASC';

export type TFilter = {
    order?: TOrder;
    search?: string;
    page?: number;
    limit?: number;
} & Record<string, any>;