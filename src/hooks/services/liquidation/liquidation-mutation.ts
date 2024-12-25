import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import liquidationService from "../../../_apis/services/liquidation.service";
import { TLiquidation, TLiquidationCreate, TLiquidationEdit } from "../../../types/models/liquidation.type";

export const useAddLiquidation = () => {
    return useMutation({
        mutationFn: async (data: TLiquidationCreate) => {
            return await liquidationService.create<TLiquidationCreate, TLiquidation>(data)
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

export const useEditLiquidation = () => {
    return useMutation({
        mutationFn: async (data: TLiquidationEdit) => {
            return await liquidationService.update<TLiquidationEdit, TLiquidation>(data, data._id);
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

export const useDeleteLiquidation = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await liquidationService.delete<TLiquidation>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteManyLiquidation = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await liquidationService.deleteMultiple<TLiquidation>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// xóa mềm
export const useDeleteSoftLiquidation = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await liquidationService.softDelete<TLiquidation>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

export const useDeleteSoftManyLiquidation = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await liquidationService.softDeleteMultiple<TLiquidation>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

// restore
export const useRestoreManyLiquidation = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await liquidationService.restoreMany<TLiquidation>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

//xác nhận ký
export const useSignature = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await liquidationService.confirmSignature<TLiquidation>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};