import { TMeta } from "../api/api.type";
import { TFilter } from "./entity-common.type";


export type TLoading = "ready" | "pending" | "success" | "failed";

export type TSliceInitialState<DynamicData> = {
    isLoading: TLoading; // for get
    isFetching: TLoading; // for create, update, delete
    data: DynamicData;
    error: string | null;
    meta?: TMeta;
    filter?: TFilter;
};
