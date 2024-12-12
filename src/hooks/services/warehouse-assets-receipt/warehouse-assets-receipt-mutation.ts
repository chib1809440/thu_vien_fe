import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import warehouseAssetsReceiptService from "../../../_apis/services/wareHouseAssetsReceipt.service";
import { TWareHouseAssetsReceipt } from "../../../types/models/warehouse-assets-receipt";
import { TWareHouseReceiptCreate, TWareHouseReceiptEdit } from "../../../types/models/warehouse-receipt";
export const useAcceptWareHouseAssetsReceipt = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await warehouseAssetsReceiptService.acceptWareHouseReceipt<TWareHouseAssetsReceipt>(id);
        },
        onError: (error: any) => {
            toast.error(error.message)
        },
    })
}
export const useAddWareHouseAssetsReceipt = () => {
    return useMutation({
        mutationFn: async (data: TWareHouseReceiptCreate) => {
            return await warehouseAssetsReceiptService.create<TWareHouseReceiptCreate, TWareHouseAssetsReceipt>(data)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useEditWareHouseAssetsReceipt = () => {
    return useMutation({
        mutationFn: async (data: TWareHouseReceiptEdit) => {
            return await warehouseAssetsReceiptService.update<TWareHouseReceiptEdit, TWareHouseAssetsReceipt>(data, data._id);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteWareHouseAssetsReceipt = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await warehouseAssetsReceiptService.delete<TWareHouseAssetsReceipt>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteManyWareHouseAssetsReceipt = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await warehouseAssetsReceiptService.deleteMultiple<TWareHouseAssetsReceipt>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// xóa mềm
export const useDeleteSoftWareHouseAssetsReceipt = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await warehouseAssetsReceiptService.softDelete<TWareHouseAssetsReceipt>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

export const useDeleteSoftManyWareHouseAssetsReceipt = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await warehouseAssetsReceiptService.softDeleteMultiple<TWareHouseAssetsReceipt>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

// restore
export const useRestoreManyWareHouseAssetsReceipt = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await warehouseAssetsReceiptService.restoreMany<TWareHouseAssetsReceipt>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};