import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import shelfService from "../../../_apis/services/shelf.service";
import { TShelves, TShelvesCreate, TShelvesEdit } from "../../../types/models/shelves";

export const useAddShelf = () => {
    return useMutation({
        mutationFn: async (data: TShelvesCreate) => {
            return await shelfService.create<TShelvesCreate, TShelves>(data)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useEditShelf = () => {
    return useMutation({
        mutationFn: async (data: TShelvesEdit) => {
            return await shelfService.update<TShelvesEdit, TShelves>(data, data._id);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteShelf = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await shelfService.delete<TShelves>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteManyShelf = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await shelfService.deleteMultiple<TShelves>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// xóa mềm
export const useDeleteSoftShelf = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await shelfService.softDelete<TShelves>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

export const useDeleteSoftManyShelf = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await shelfService.softDeleteMultiple<TShelves>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

// restore
export const useRestoreManyShelf = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await shelfService.restoreMany<TShelves>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};