import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import statisticalService from "../../../_apis/services/statistical.service";
import { TStatistical } from "../../../types/models/statistical.type";
import { TFilter } from "../../../types/models/entity-common.type";
import { getQueryKeys } from "../../../utils/object";
import { GET_STATISTICAL, GET_STATISTICAL_DELETED, GET_STATISTICAL_DELETED_ID, GET_STATISTICAL_ID } from "./statistical-key";

export const useFetchStatistical = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_STATISTICAL, ...params }),
        queryFn: async () => {
            return await statisticalService.getStatistical<TStatistical>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchStatistical = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_STATISTICAL, ...params }),
        })
    }

    return revalidate;
}

export const useFetchStatisticalById = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_STATISTICAL_ID, _id }),
        queryFn: async () => {
            return await statisticalService.getById<TStatistical>(_id);
        },
        placeholderData: keepPreviousData,
    })
}
// get danh sách xóa mềm
export const useFetchStatisticalDeleteList = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_STATISTICAL_DELETED, ...params }),
        queryFn: async () => {
            return await statisticalService.getAllDeleted<TStatistical>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchStatisticalDeleteList = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_STATISTICAL_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchStatisticalDeleteListById = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_STATISTICAL_DELETED_ID, _id }),
        queryFn: async () => {
            return await statisticalService.getByIdDeleted<TStatistical>(_id);
        },
        placeholderData: keepPreviousData,
    })
}