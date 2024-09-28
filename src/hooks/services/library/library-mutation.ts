import { useMutation } from "@tanstack/react-query";
import libraryService from "../../../_apis/services/library.service";
import { TLibrary, TLibraryCreate, TLibraryEdit } from "../../../types/models/library.type";
import { toast } from "react-toastify";

export const useAddLibrary = () => {
    return useMutation({
        mutationFn: async (data: TLibraryCreate) => {
            return await libraryService.create<TLibraryCreate, TLibrary>(data)
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message);
        },
    })
}

export const useEditLibrary = () => {
    return useMutation({
        mutationFn: async (data: TLibraryEdit) => {
            return await libraryService.update<TLibraryEdit, TLibrary>(data, data._id);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message);
        },
    })
}

export const useDeleteLibrary = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await libraryService.delete<TLibrary>(_id)
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message);
        },
    })
}