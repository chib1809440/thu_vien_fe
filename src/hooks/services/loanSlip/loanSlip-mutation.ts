import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import loanSlipsService from "../../../_apis/services/loanSlip.service";
import { CreatePublication, TLoanSlip, TLoanSlipCreate, TLoanSlipEdit } from "../../../types/models/loanSlip.type";
import { translationMap } from "../../../helpers/translate";

export const useAddLoanSlip = () => {
    return useMutation({
        mutationFn: async (data: TLoanSlipCreate) => {
            return await loanSlipsService.create<TLoanSlipCreate, TLoanSlip>(data);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}
export const useApprovalLoanSlip = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await loanSlipsService.approvalLoanSlip<TLoanSlip>(id);
        },
        onError: (error: any) => {
            console.log(error);
            if (Array.isArray(error.message)) {
                const errorMessages = error.message
                    .map((err: any) => {
                        // Tách thông báo theo dấu ':'
                        const [mainMessage, additionalInfo] = err.message.split(": ");
                        // Dịch phần trước dấu ':', giữ nguyên phần sau
                        const translatedMessage = translationMap[mainMessage] || mainMessage;
                        return `${translatedMessage}: ${additionalInfo}`;
                    })
                    .join(", ");
                toast.error(errorMessages);
            } else {
                const [mainMessage, additionalInfo] = error.message.split(": ");
                const translatedMessage = translationMap[mainMessage] || mainMessage;
                toast.error(`${translatedMessage}: ${additionalInfo}`);
            }
        },
    })
}
export const useReturnLoanSlip = () => {
    return useMutation({
        mutationFn: async ({ id, publications }: { id: string; publications: CreatePublication[] }) => {
            return await loanSlipsService.returnLoanSlip<TLoanSlip>(id, publications);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};
export const useEditLoanSlip = () => {
    return useMutation({
        mutationFn: async (data: TLoanSlipEdit) => {
            return await loanSlipsService.update<TLoanSlipEdit, TLoanSlip>(data, data._id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteLoanSlip = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await loanSlipsService.delete<TLoanSlip>(id);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

export const useDeleteManyLoanSlip = () => {
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
export const useDeleteSoftLoanSlip = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await loanSlipsService.softDelete<TLoanSlip>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

export const useDeleteSoftManyLoanSlip = () => {
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
export const useRestoreManyLoanSlip = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await loanSlipsService.restoreMany<TLoanSlip>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};