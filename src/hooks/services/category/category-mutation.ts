import { useMutation } from "@tanstack/react-query";
import { TCategory, TCategoryCreate, TCategoryEdit } from "../../../types/models/category";
import categoryService from "../../../_apis/services/category.service";

export const useAddCategory = () => {
    return useMutation({
        mutationFn: async (data: TCategoryCreate) => {
            return await categoryService.create<TCategoryCreate, TCategory>(data)
        },
        onError: (error: any) => {
            alert("Loi kia " + error?.response?.data?.message || error.message);
        },
    })
}

export const useEditCategory = () => {
    return useMutation({
        mutationFn: async (data: TCategoryEdit) => {
            return await categoryService.update<TCategoryEdit, TCategory>(data, data._id);
        },
        onError: (error: any) => {
            alert("Loi kia " + error?.response?.data?.message || error.message);
        },
    })
}

export const useDeleteCategory = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await categoryService.delete<TCategory>(_id)
        },
        onError: (error: any) => {
            alert("Loi kia " + error?.response?.data?.message || error.message);
        },
    })
}