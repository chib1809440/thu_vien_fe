import { useQuery, useQueryClient } from "@tanstack/react-query";
import materialService from "../../../_apis/services/material.service";
import { TFilter } from "../../../types/models/entity-common.type";
import { TMaterial } from "../../../types/models/material";
import { getQueryKeys } from "../../../utils/object";
import { GET_MATERIAL_DELETED, GET_MATERIAL_DELETED_ID, GET_MATERIAL_ID, GET_MATERIALS } from "./material-key";

export const useFetchMaterial = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_MATERIALS, ...params }),
        queryFn: async()=>{
            return await materialService.getAll<TMaterial>(params);
        },
        staleTime: 1000 * 60 * 10,
    })
}

export const useReFetchMaterial = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_MATERIALS, ...params }),
        })
    }

    return revalidate;
}

export const useFetchMaterialById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_MATERIAL_ID, _id }),
        queryFn: async()=>{
            return await materialService.getById<TMaterial>(_id);
        },
        staleTime: 1000 * 60 * 10,
    })
}

// get danh sách xóa mềm
export const useFetchMaterialDeleteList = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_MATERIAL_DELETED, ...params }),
        queryFn: async()=>{
            return await materialService.getAllDeleted<TMaterial>(params);
        },
        staleTime: 1000 * 60 * 10,
    })
}

export const useReFetchMaterialDeleteList = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_MATERIAL_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchMaterialDeleteListById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_MATERIAL_DELETED_ID, _id }),
        queryFn: async()=>{
            return await materialService.getByIdDeleted<TMaterial>(_id);
        },
        staleTime: 1000 * 60 * 10,
    })
}
