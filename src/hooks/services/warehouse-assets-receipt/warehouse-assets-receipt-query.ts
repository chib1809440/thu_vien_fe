import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import warehouseAssetsReceiptService from "../../../_apis/services/wareHouseAssetsReceipt.service";
import { TFilter } from "../../../types/models/entity-common.type";
import { TWareHouseAssetsReceipt } from "../../../types/models/warehouse-assets-receipt";
import { getQueryKeys } from "../../../utils/object";
import { GET_WAREHOUSEASSETSRECEIPT, GET_WAREHOUSEASSETSRECEIPT_DELETED, GET_WAREHOUSEASSETSRECEIPT_DELETED_ID, GET_WAREHOUSEASSETSRECEIPT_ID } from "./warehouse-assets-receipt-key";

export const useFetchWareHouseAssetsReceipt = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_WAREHOUSEASSETSRECEIPT, ...params }),
        queryFn: async () => {
            return await warehouseAssetsReceiptService.getAll<TWareHouseAssetsReceipt>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchWareHouseAssetsReceipt = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_WAREHOUSEASSETSRECEIPT, ...params }),
        })
    }

    return revalidate;
}

export const useFetchWareHouseAssetsReceiptById = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_WAREHOUSEASSETSRECEIPT_ID, _id }),
        queryFn: async () => {
            return await warehouseAssetsReceiptService.getById<TWareHouseAssetsReceipt>(_id);
        },
        placeholderData: keepPreviousData,
    })
}
// get danh sách xóa mềm
export const useFetchWareHouseAssetsReceiptDeleteList = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_WAREHOUSEASSETSRECEIPT_DELETED, ...params }),
        queryFn: async () => {
            return await warehouseAssetsReceiptService.getAllDeleted<TWareHouseAssetsReceipt>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchWareHouseAssetsReceiptDeleteList = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_WAREHOUSEASSETSRECEIPT_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchWareHouseReceiptAssetsDeleteListById = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_WAREHOUSEASSETSRECEIPT_DELETED_ID, _id }),
        queryFn: async () => {
            return await warehouseAssetsReceiptService.getByIdDeleted<TWareHouseAssetsReceipt>(_id);
        },
        placeholderData: keepPreviousData,
    })
}