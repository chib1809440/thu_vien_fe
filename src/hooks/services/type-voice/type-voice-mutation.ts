import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import typeVoiceService from "../../../_apis/services/type-voice.service";
import { TTypeVoice, TTypeVoiceCreate, TTypeVoiceEdit } from "../../../types/models/type-voice";

export const useAddTypeVoice = () => {
    return useMutation({
        mutationFn: async (data: TTypeVoiceCreate) => {
            return await typeVoiceService.create<TTypeVoiceCreate, TTypeVoice>(data)
        },
        onError: (error: any) => {
             if (error.message === "name already exists") {
                toast.error("Tên đã tồn tại");
            } else {
                toast.error(error.message);
            }
        },
    })
}

export const useEditTypeVoice = () => {
    return useMutation({
        mutationFn: async (data: TTypeVoiceEdit) => {
            return await typeVoiceService.update<TTypeVoiceEdit, TTypeVoice>(data, data._id);
        },
        onError: (error: any) => {
             if (error.message === "name already exists") {
                toast.error("Tên đã tồn tại");
            } else {
                toast.error(error.message);
            }
        },
    })
}

export const useDeleteTypeVoice = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await typeVoiceService.delete<TTypeVoice>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteManyTypeVoice = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await typeVoiceService.deleteMultiple<TTypeVoice>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// xóa mềm
export const useDeleteSoftTypeVoice = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await typeVoiceService.softDelete<TTypeVoice>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

export const useDeleteSoftManyTypeVoice = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await typeVoiceService.softDeleteMultiple<TTypeVoice>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

// restore
export const useRestoreManyTypeVoice = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await typeVoiceService.restoreMany<TTypeVoice>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};