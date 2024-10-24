import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import voiceService from "../../../_apis/services/voice.service";
import { TFilter } from "../../../types/models/entity-common.type";
import { TVoice } from "../../../types/models/voice";
import { getQueryKeys } from "../../../utils/object";
import { GET_VOICE, GET_VOICE_DELETED, GET_VOICE_DELETED_ID, GET_VOICE_ID, GET_VOICE_LINK } from "./voice-key";

export const useFetchVoice = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_VOICE, ...params }),
        queryFn: async () => {
            return await voiceService.getAll<TVoice>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchVoice = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_VOICE, ...params }),
        })
    }

    return revalidate;
}

export const useFetchVoiceById = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_VOICE_ID, _id }),
        queryFn: async () => {
            return await voiceService.getById<TVoice>(_id);
        },
        placeholderData: keepPreviousData,
    })
}
// get danh sách xóa mềm
export const useFetchVoiceDeleteList = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_VOICE_DELETED, ...params }),
        queryFn: async () => {
            return await voiceService.getAllDeleted<TVoice>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchVoiceDeleteList = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_VOICE_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchVoiceDeleteListById = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_VOICE_DELETED_ID, _id }),
        queryFn: async () => {
            return await voiceService.getByIdDeleted<TVoice>(_id);
        },
        placeholderData: keepPreviousData,
    })
}

// get link
export const useFetchVoiceLink = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_VOICE_LINK, ...params }),
        queryFn: async () => {
            return await voiceService.getAllLink<TVoice>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchVoiceLink = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_VOICE_LINK, ...params }),
        })
    }

    return revalidate;
}