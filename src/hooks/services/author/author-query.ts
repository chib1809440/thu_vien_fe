import { useQuery, useQueryClient } from "@tanstack/react-query";
import authorService from "../../../_apis/services/author.service";
import { TAuthor } from "../../../types/models/author";
import { TFilter } from "../../../types/models/entity-common.type";
import { getQueryKeys } from "../../../utils/object";
import { GET_AUTHOR, GET_AUTHOR_DELETED, GET_AUTHOR_DELETED_ID, GET_AUTHOR_ID } from "./author-key";

export const useFetchAuthor = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_AUTHOR, ...params }),
        queryFn: async()=>{
            return await authorService.getAll<TAuthor>(params);
        },
        staleTime: 1000 * 60 * 10,
    })
}

export const useReFetchAuthor = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_AUTHOR, ...params }),
        })
    }

    return revalidate;
}

export const useFetchAuthorById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_AUTHOR_ID, _id }),
        queryFn: async()=>{
            return await authorService.getById<TAuthor>(_id);
        },
        staleTime: 1000 * 60 * 10,
    })
}
// get danh sách xóa mềm
export const useFetchAuthorDeleteList = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_AUTHOR_DELETED, ...params }),
        queryFn: async()=>{
            return await authorService.getAllDeleted<TAuthor>(params);
        },
        staleTime: 1000 * 60 * 10,
    })
}

export const useReFetchAuthorDeleteList = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_AUTHOR_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchAuthorDeleteListById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_AUTHOR_DELETED_ID, _id }),
        queryFn: async()=>{
            return await authorService.getByIdDeleted<TAuthor>(_id);
        },
        staleTime: 1000 * 60 * 10,
    })
}