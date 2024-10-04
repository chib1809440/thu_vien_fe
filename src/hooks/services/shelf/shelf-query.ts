import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import shelfService from "../../../_apis/services/shelf.service";
import { TFilter } from "../../../types/models/entity-common.type";
import { TShelves } from "../../../types/models/shelves";
import { getQueryKeys } from "../../../utils/object";
import { GET_SHELF_DELETED, GET_SHELF_DELETED_ID, GET_SHELF_ID, GET_SHELVES } from "./shelf-key";

export const useFetchShelf = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_SHELVES, ...params }),
        queryFn: async()=>{
            return await shelfService.getAll<TShelves>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchShelf = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_SHELVES, ...params }),
        })
    }

    return revalidate;
}

export const useFetchShelfById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_SHELF_ID, _id }),
        queryFn: async()=>{
            return await shelfService.getById<TShelves>(_id);
        },
        placeholderData: keepPreviousData,
    })
}
// get danh sách xóa mềm
export const useFetchShelfDeleteList = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_SHELF_DELETED, ...params }),
        queryFn: async()=>{
            return await shelfService.getAllDeleted<TShelves>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchShelfDeleteList = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_SHELF_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchShelfDeleteListById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_SHELF_DELETED_ID, _id }),
        queryFn: async()=>{
            return await shelfService.getByIdDeleted<TShelves>(_id);
        },
        placeholderData: keepPreviousData,
    })
}