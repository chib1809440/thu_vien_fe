import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import voiceService from "../../../_apis/services/voice.service";
import { TVoice, TVoiceCreate, TVoiceEdit } from "../../../types/models/voice";

export const useAddVoice = () => {
    return useMutation({
        mutationFn: async (data: TVoiceCreate) => {
            return await voiceService.create<TVoiceCreate, TVoice>(data, true)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useEditVoice = () => {
    return useMutation({
        mutationFn: async (data: TVoiceEdit) => {
            return await voiceService.update<TVoiceEdit, TVoice>(data, data._id, true);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteVoice = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await voiceService.delete<TVoice>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteManyVoice = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await voiceService.deleteMultiple<TVoice>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// xóa mềm
export const useDeleteSoftVoice = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await voiceService.softDelete<TVoice>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

export const useDeleteSoftManyVoice = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await voiceService.softDeleteMultiple<TVoice>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

// restore
export const useRestoreManyVoice = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await voiceService.restoreMany<TVoice>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};