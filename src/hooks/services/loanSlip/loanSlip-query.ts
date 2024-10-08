import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import loanSlipsService from "../../../_apis/services/loanSlip.service";
import { TFilter } from "../../../types/models/entity-common.type";
import { TLoanSlip } from "../../../types/models/loanSlip.type";
import { getQueryKeys } from "../../../utils/object";
import { GET_LOANSLIP, GET_LOANSLIP_DELETED, GET_LOANSLIP_DELETED_ID, GET_LOANSLIP_ID } from "./loanSlip-key";

export const useFetchLoanSlip = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_LOANSLIP, ...params }),
        queryFn: async () => {
            return await loanSlipsService.getAll<TLoanSlip>(params);
        },
        placeholderData: keepPreviousData,
    });
};

export const useReFetchLoanSlip = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_LOANSLIP_ID, ...params }),
        });
    };

    return revalidate;
};

export const useFetchLoanSlipById = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_LOANSLIP_ID, _id }),
        queryFn: async () => {
            return await loanSlipsService.getById<TLoanSlip>(_id);
        },
        placeholderData: keepPreviousData,
    });
};

// get danh sách xóa mềm
export const useFetchLoanSlipDeleteList = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_LOANSLIP_DELETED, ...params }),
        queryFn: async () => {
            return await loanSlipsService.getAllDeleted<TLoanSlip>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchLoanSlipDeleteList = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_LOANSLIP_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchLoanSlipsDeleteListById = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_LOANSLIP_DELETED_ID, _id }),
        queryFn: async () => {
            return await loanSlipsService.getByIdDeleted<TLoanSlip>(_id);
        },
        placeholderData: keepPreviousData,
    })
}