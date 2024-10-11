import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import liquidationService from "../../../_apis/services/liquidation.service";
import { TFilter } from "../../../types/models/entity-common.type";
import { TLiquidation } from "../../../types/models/liquidation.type";
import { getQueryKeys } from "../../../utils/object";
import { GET_LIQUIDATION, GET_LIQUIDATION_DELETED, GET_LIQUIDATION_DELETED_ID, GET_LIQUIDATION_ID } from "./liquidation-key";

export const useFetchLiquidation = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_LIQUIDATION, ...params }),
        queryFn: async()=>{
            return await liquidationService.getAll<TLiquidation>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchLiquidation = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_LIQUIDATION, ...params }),
        })
    }

    return revalidate;
}

export const useFetchLiquidationById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_LIQUIDATION_ID, _id }),
        queryFn: async()=>{
            return await liquidationService.getById<TLiquidation>(_id);
        },
        placeholderData: keepPreviousData,
    })
}
// get danh sách xóa mềm
export const useFetchLiquidationDeleteList = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_LIQUIDATION_DELETED, ...params }),
        queryFn: async()=>{
            return await liquidationService.getAllDeleted<TLiquidation>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchLiquidationDeleteList = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_LIQUIDATION_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchLiquidationDeleteListById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_LIQUIDATION_DELETED_ID, _id }),
        queryFn: async()=>{
            return await liquidationService.getByIdDeleted<TLiquidation>(_id);
        },
        placeholderData: keepPreviousData,
    })
}