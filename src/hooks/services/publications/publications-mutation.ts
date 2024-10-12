import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import publicationsService from "../../../_apis/services/publications.service";
import {
    TPublications,
    TPublicationsCreate,
    TPublicationsEdit,
} from "../../../types/models/publications.type";

export const useAddPublications = () => {
    return useMutation({
        mutationFn: async (data: TPublicationsCreate) => {
            return await publicationsService.create<TPublicationsCreate, TPublications>(data, true);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

export const useEditPublications = () => {
    return useMutation({
        mutationFn: async (data: TPublicationsEdit) => {
            return await publicationsService.update<TPublicationsEdit, TPublications>(
                data,
                data._id,
                true
            );
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

export const useDeletePublications = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await publicationsService.delete<TPublications>(id);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

export const useDeleteManyPublications = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await publicationsService.deleteMultiple<TPublications>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// xóa mềm
export const useDeleteSoftPublications = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await publicationsService.softDelete<TPublications>(_id);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

export const useDeleteSoftManyPublications = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await publicationsService.softDeleteMultiple<TPublications>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// restore
export const useRestoreManyPublications = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await publicationsService.restoreMany<TPublications>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// updateShelvesQuantity
export const useUpdateShelvesQuantity = () => {
    return useMutation({
        mutationFn: async (data: { id: string; quantity: number; shelvesId: string }) => {
            return await publicationsService.updateShelvesQuantity(data);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// updateStockQuantity
export const useUpdateStockQuantity = () => {
    return useMutation({
        mutationFn: async (data: {id: string; quantity: number }) => {
            return await publicationsService.updateStockQuantity(data);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};
