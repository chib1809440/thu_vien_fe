import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import authorService from "../../../_apis/services/author.service";
import { TAuthor, TAuthorCreate, TAuthorEdit } from "../../../types/models/author";

export const useAddAuthor = () => {
    return useMutation({
        mutationFn: async (data: TAuthorCreate) => {
            return await authorService.create<TAuthorCreate, TAuthor>(data)
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message);
        },
    })
}

export const useEditAuthor = () => {
    return useMutation({
        mutationFn: async (data: TAuthorEdit) => {
            return await authorService.update<TAuthorEdit, TAuthor>(data, data._id);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message);
        },
    })
}

export const useDeleteAuthor = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await authorService.delete<TAuthor>(_id)
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || error.message);
        },
    })
}