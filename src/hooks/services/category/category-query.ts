import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import categoryService from "../../../_apis/services/category.service";
import { TCategory } from "../../../types/models/category";
import { TFilter } from "../../../types/models/entity-common.type";
import { getQueryKeys } from "../../../utils/object";
import { GET_CATEGORIES, GET_CATEGORIES_LINK, GET_CATEGORY_DELETED, GET_CATEGORY_DELETED_ID, GET_CATEGORY_ID } from "./category-key";

export const useFetchCategory = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_CATEGORIES, ...params }),
        queryFn: async()=>{
            return await categoryService.getAll<TCategory>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchCategory = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_CATEGORIES, ...params }),
        })
    }

    return revalidate;
}

export const useFetchCategoryById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_CATEGORY_ID, _id }),
        queryFn: async()=>{
            return await categoryService.getById<TCategory>(_id);
        },
        placeholderData: keepPreviousData,
    })
}

// get danh sách xóa mềm
export const useFetchCategoryDeleteList = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_CATEGORY_DELETED, ...params }),
        queryFn: async()=>{
            return await categoryService.getAllDeleted<TCategory>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchCategoryDeleteList = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_CATEGORY_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchCategoryDeleteListById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_CATEGORY_DELETED_ID, _id }),
        queryFn: async()=>{
            return await categoryService.getByIdDeleted<TCategory>(_id);
        },
        placeholderData: keepPreviousData,
    })
}

// get link
export const useFetchCategoryLink = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_CATEGORIES_LINK, ...params }),
        queryFn: async()=>{
            return await categoryService.getAllLink<TCategory>(params);
        },
         placeholderData: keepPreviousData,
    })
}

export const useReFetchCategoryLink = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_CATEGORIES_LINK, ...params }),
        })
    }

    return revalidate;
}

