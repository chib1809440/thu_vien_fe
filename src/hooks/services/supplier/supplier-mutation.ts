import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import supplierService from "../../../_apis/services/supplier.service";
import { TSupplier, TSupplierCreate, TSupplierEdit } from "../../../types/models/supplier.type";

export const useAddSupplier = () => {
    return useMutation({
        mutationFn: async (data: TSupplierCreate) => {
            return await supplierService.create<TSupplierCreate, TSupplier>(data)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useEditSupplier = () => {
    return useMutation({
        mutationFn: async (data: TSupplierEdit) => {
            return await supplierService.update<TSupplierEdit, TSupplier>(data, data._id);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteSupplier = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await supplierService.delete<TSupplier>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteManySupplier = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await supplierService.deleteMultiple<TSupplier>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// xóa mềm
export const useDeleteSoftSupplier = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await supplierService.softDelete<TSupplier>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

export const useDeleteSoftManySupplier = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await supplierService.softDeleteMultiple<TSupplier>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

// restore
export const useRestoreManySupplier = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await supplierService.restoreMany<TSupplier>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};