import { useMutation } from "@tanstack/react-query"
import groupService from "../../../_apis/services/group.service"
import { TGroup, TGroupCreate, TGroupEdit } from "../../../types/models/group.type";

export const useAddGroup = () => {
    return useMutation({
        mutationFn: async (data: TGroupCreate) => {
            return await groupService.create<TGroupCreate, TGroup>(data);
        },
        onError: (error: any) => {
            alert("Loi kia " + error?.response?.data?.message || error.message);
        },
    })
}

export const useEditGroup = () => {
    return useMutation({
        mutationFn: async(data:TGroupEdit)=>{
            return await groupService.update<TGroupEdit, TGroup>(data, data._id)
        },
        onError: (error: any) => {
            alert("Loi kia " + error?.response?.data?.message || error.message);
        },
    })
}

export const useDeleteGroup = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await groupService.delete<TGroup>(id);
        },
    });
};