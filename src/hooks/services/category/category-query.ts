import { useQuery, useQueryClient } from "@tanstack/react-query";
import categoryService from "../../../_apis/services/category.service";
import { TCategory } from "../../../types/models/category";
import { TFilter } from "../../../types/models/entity-common.type";
import { GET_CATEGORIES, GET_CATEGORY_ID } from "./category-key";

export const useFetchCategory = (params?:TFilter)=>{
    return useQuery({
        queryKey:[GET_CATEGORIES, params],
        queryFn: async()=>{
            return await categoryService.getAll<TCategory>(params);
        },
        staleTime: 1000 * 60 * 10,
    })
}

export const useReFetchCategory = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey:[GET_CATEGORIES, params]
        })
    }

    return revalidate;
}

export const useFetchCategoryById = (_id: string)=>{
    return useQuery({
        queryKey:[GET_CATEGORY_ID, _id],
        queryFn: async()=>{
            return await categoryService.getById<TCategory>(_id);
        },
        staleTime: 1000 * 60 * 10,
    })
}
