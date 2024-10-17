import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import typeVoiceService from "../../../_apis/services/type-voice.service";
import { TFilter } from "../../../types/models/entity-common.type";
import { TTypeVoice } from "../../../types/models/type-voice";
import { getQueryKeys } from "../../../utils/object";
import { GET_TYPEVOICE, GET_TYPEVOICE_DELETED, GET_TYPEVOICE_DELETED_ID, GET_TYPEVOICE_ID } from "./type-voice-key";

export const useFetchTypeVoice = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_TYPEVOICE, ...params }),
        queryFn: async()=>{
            return await typeVoiceService.getAll<TTypeVoice>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchTypeVoice = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_TYPEVOICE, ...params }),
        })
    }

    return revalidate;
}

export const useFetchTypeVoiceById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_TYPEVOICE_ID, _id }),
        queryFn: async()=>{
            return await typeVoiceService.getById<TTypeVoice>(_id);
        },
        placeholderData: keepPreviousData,
    })
}
// get danh sách xóa mềm
export const useFetchTypeVoiceDeleteList = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_TYPEVOICE_DELETED, ...params }),
        queryFn: async()=>{
            return await typeVoiceService.getAllDeleted<TTypeVoice>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchTypeVoiceDeleteList = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_TYPEVOICE_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchTypeVoiceDeleteListById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_TYPEVOICE_DELETED_ID, _id }),
        queryFn: async()=>{
            return await typeVoiceService.getByIdDeleted<TTypeVoice>(_id);
        },
        placeholderData: keepPreviousData,
    })
}