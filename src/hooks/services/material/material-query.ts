import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TFilter } from "../../../types/models/entity-common.type";
import { TMaterial } from "../../../types/models/material";
import { GET_MATERIAL_ID, GET_MATERIALS } from "./material-key";
import materialService from "../../../_apis/services/material.service";
import { getQueryKeys } from "../../../utils/object";

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
