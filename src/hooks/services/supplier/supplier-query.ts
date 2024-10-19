import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import supplierService from "../../../_apis/services/supplier.service";
import { TSupplier } from "../../../types/models/supplier.type";
import { TFilter } from "../../../types/models/entity-common.type";
import { getQueryKeys } from "../../../utils/object";
import { GET_SUPPLIER, GET_SUPPLIER_DELETED, GET_SUPPLIER_DELETED_ID, GET_SUPPLIER_ID } from "./supplier-key";

export const useFetchSupplier = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_SUPPLIER, ...params }),
        queryFn: async () => {
            return await supplierService.getAll<TSupplier>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchSupplier = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_SUPPLIER, ...params }),
        })
    }

    return revalidate;
}

export const useFetchSupplierById = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_SUPPLIER_ID, _id }),
        queryFn: async () => {
            return await supplierService.getById<TSupplier>(_id);
        },
        placeholderData: keepPreviousData,
    })
}
// get danh sách xóa mềm
export const useFetchSupplierDeleteList = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_SUPPLIER_DELETED, ...params }),
        queryFn: async () => {
            return await supplierService.getAllDeleted<TSupplier>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchSupplierDeleteList = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_SUPPLIER_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchSupplierDeleteListById = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_SUPPLIER_DELETED_ID, _id }),
        queryFn: async () => {
            return await supplierService.getByIdDeleted<TSupplier>(_id);
        },
        placeholderData: keepPreviousData,
    })
}