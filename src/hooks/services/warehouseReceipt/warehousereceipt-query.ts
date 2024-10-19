import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import wareHouseReceiptService from "../../../_apis/services/wareHouseReceipt.service";
import { TWareHouseReceipt } from "../../../types/models/warehouse-receipt";
import { TFilter } from "../../../types/models/entity-common.type";
import { getQueryKeys } from "../../../utils/object";
import { GET_WAREHOUSERECEIPT, GET_WAREHOUSERECEIPT_DELETED, GET_WAREHOUSERECEIPT_DELETED_ID, GET_WAREHOUSERECEIPT_ID } from "./warehousereceipt-key";

export const useFetchWareHouseReceipt = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_WAREHOUSERECEIPT, ...params }),
        queryFn: async () => {
            return await wareHouseReceiptService.getAll<TWareHouseReceipt>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchWareHouseReceipt = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_WAREHOUSERECEIPT, ...params }),
        })
    }

    return revalidate;
}

export const useFetchWareHouseReceiptById = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_WAREHOUSERECEIPT_ID, _id }),
        queryFn: async () => {
            return await wareHouseReceiptService.getById<TWareHouseReceipt>(_id);
        },
        placeholderData: keepPreviousData,
    })
}
// get danh sách xóa mềm
export const useFetchWareHouseReceiptDeleteList = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_WAREHOUSERECEIPT_DELETED, ...params }),
        queryFn: async () => {
            return await wareHouseReceiptService.getAllDeleted<TWareHouseReceipt>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchWareHouseReceiptDeleteList = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_WAREHOUSERECEIPT_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchWareHouseReceiptDeleteListById = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_WAREHOUSERECEIPT_DELETED_ID, _id }),
        queryFn: async () => {
            return await wareHouseReceiptService.getByIdDeleted<TWareHouseReceipt>(_id);
        },
        placeholderData: keepPreviousData,
    })
}