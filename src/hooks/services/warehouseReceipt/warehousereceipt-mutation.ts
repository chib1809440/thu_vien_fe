import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import wareHouseReceiptService from "../../../_apis/services/wareHouseReceipt.service";
import { TWareHouseReceipt, TWareHouseReceiptCreate, TWareHouseReceiptEdit } from "../../../types/models/warehouse-receipt";
export const useAcceptWareHouseReceipt = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await wareHouseReceiptService.acceptWareHouseReceipt<TWareHouseReceipt>(id);
        },
        onError: (error: any) => {
            toast.error(error.message)
        },
    })
}
export const useAddWareHouseReceipt = () => {
    return useMutation({
        mutationFn: async (data: TWareHouseReceiptCreate) => {
            return await wareHouseReceiptService.create<TWareHouseReceiptCreate, TWareHouseReceipt>(data)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useEditWareHouseReceipt = () => {
    return useMutation({
        mutationFn: async (data: TWareHouseReceiptEdit) => {
            return await wareHouseReceiptService.update<TWareHouseReceiptEdit, TWareHouseReceipt>(data, data._id);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteWareHouseReceipt = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await wareHouseReceiptService.delete<TWareHouseReceipt>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteManyWareHouseReceipt = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await wareHouseReceiptService.deleteMultiple<TWareHouseReceipt>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// xóa mềm
export const useDeleteSoftWareHouseReceipt = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await wareHouseReceiptService.softDelete<TWareHouseReceipt>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

export const useDeleteSoftManyWareHouseReceipt = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await wareHouseReceiptService.softDeleteMultiple<TWareHouseReceipt>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

// restore
export const useRestoreManyWareHouseReceipt = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await wareHouseReceiptService.restoreMany<TWareHouseReceipt>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};