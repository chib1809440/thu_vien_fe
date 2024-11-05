import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import requestGroupService from "../../../_apis/services/request-group.service";
import { TGroup, TGroupEdit } from "../../../types/models/group.type";

export const useAddRequestGroup = () => {
    return useMutation({
        mutationFn: async (groupId: string) => {
            return await requestGroupService.requestGroup(groupId);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useEditRequestGroup = () => {
    return useMutation({
        mutationFn: async (data: TGroupEdit) => {
            return await requestGroupService.update<TGroupEdit, TGroup>(data, data._id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}