import { useMutation } from "@tanstack/react-query";
import materialService from "../../../_apis/services/material.service";
import { TMaterial, TMaterialCreate, TMaterialEdit } from "../../../types/models/material";
import { toast } from "react-toastify";

export const useAddMaterial = () => {
    return useMutation({
        mutationFn: async (data: TMaterialCreate) => {
            return await materialService.create<TMaterialCreate, TMaterial>(data)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useEditMaterial = () => {
    return useMutation({
        mutationFn: async (data: TMaterialEdit) => {
            return await materialService.update<TMaterialEdit, TMaterial>(data, data._id);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteMaterial = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await materialService.delete<TMaterial>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteManyMaterial = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await materialService.deleteMultiple<TMaterial>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// xóa mềm
export const useDeleteSoftMaterial = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await materialService.softDelete<TMaterial>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

export const useDeleteSoftManyMaterial = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await materialService.softDeleteMultiple<TMaterial>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

// restore
export const useRestoreManyMaterial = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await materialService.restoreMany<TMaterial>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};