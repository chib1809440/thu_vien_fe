export type TApiResponseAbstract<DynamicType> = {
    statusCode: number;
    message: string;
    data: DynamicType;
};

export type TMeta = {
    page: number;
    limit: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
};

export type TApiMultipleRecords<Data> = TApiResponseAbstract<{ result: Data[]; meta: TMeta }>;

export type TApiOneRecord<Data> = TApiResponseAbstract<{ result: Data }>;

export type TApiModifyRecord<Data> = TApiResponseAbstract<Data>;