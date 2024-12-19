import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import typeAssetService from "../../../_apis/services/type-asset.service";
import { TFilter } from "../../../types/models/entity-common.type";
import { TTypeAsset } from "../../../types/models/type-asset";
import { getQueryKeys } from "../../../utils/object";
import { GET_TYPEASSET } from "./type-voice-key";

export const useFetchTypeAsset = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_TYPEASSET, ...params }),
        queryFn: async()=>{
            return await typeAssetService.getAll<TTypeAsset>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchTypeVoice = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_TYPEASSET, ...params }),
        })
    }

    return revalidate;
}