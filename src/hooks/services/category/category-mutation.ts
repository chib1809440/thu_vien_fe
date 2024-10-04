import { useMutation } from "@tanstack/react-query";
import { TCategory, TCategoryCreate, TCategoryEdit } from "../../../types/models/category";
import categoryService from "../../../_apis/services/category.service";
import { toast } from "react-toastify";

export const useAddCategory = () => {
    return useMutation({
        mutationFn: async (data: TCategoryCreate) => {
            return await categoryService.create<TCategoryCreate, TCategory>(data)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useEditCategory = () => {
    return useMutation({
        mutationFn: async (data: TCategoryEdit) => {
            return await categoryService.update<TCategoryEdit, TCategory>(data, data._id);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteCategory = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await categoryService.delete<TCategory>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteManyCategory = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await categoryService.deleteMultiple<TCategory>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// xóa mềm
export const useDeleteSoftCategory = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await categoryService.softDelete<TCategory>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

export const useDeleteSoftManyCategory = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await categoryService.softDeleteMultiple<TCategory>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

// restore
export const useRestoreManyCategory = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await categoryService.restoreMany<TCategory>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};