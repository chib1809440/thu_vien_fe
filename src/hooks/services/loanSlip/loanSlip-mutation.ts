import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import loanSlipsService from "../../../_apis/services/loanSlip.service";
import { TLoanSlip, TLoanSlipCreate, TLoanSlipEdit } from "../../../types/models/loanSlip.type";

export const useAddLoanSlips = () => {
    return useMutation({
        mutationFn: async (data: TLoanSlipCreate) => {
            return await loanSlipsService.create<TLoanSlipCreate, TLoanSlip>(data);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useEditLoanSlips = () => {
    return useMutation({
        mutationFn: async (data: TLoanSlipEdit) => {
            return await loanSlipsService.update<TLoanSlipEdit, TLoanSlip>(data, data._id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteLoanSlips = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await loanSlipsService.delete<TLoanSlip>(id);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

export const useDeleteManyLoanSlips = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await loanSlipsService.deleteMultiple<TLoanSlip>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// xóa mềm
export const useDeleteSoftLoanSlips = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await loanSlipsService.softDelete<TLoanSlip>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

export const useDeleteSoftManyLoanSlips = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await loanSlipsService.softDeleteMultiple<TLoanSlip>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

// restore
export const useRestoreManyLoanSlips = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await loanSlipsService.restoreMany<TLoanSlip>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};