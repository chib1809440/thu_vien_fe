import { useQuery, useQueryClient } from "@tanstack/react-query";
import libraryService from "../../../_apis/services/library.service";
import { TFilter } from "../../../types/models/entity-common.type";
import { TLibrary } from "../../../types/models/library.type";
import { getQueryKeys } from "../../../utils/object";
import { GET_LIBRARY, GET_LIBRARY_DELETED, GET_LIBRARY_DELETED_ID, GET_LIBRARY_ID } from "./library-key";

export const useFetchLibrary = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_LIBRARY, ...params }),
        queryFn: async () => {
            return await libraryService.getAll<TLibrary>(params);
        },
        staleTime: 1000 * 60 * 10,
    });
};

export const useReFetchLibrary = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_LIBRARY, ...params }),
        });
    };

    return revalidate;
};

export const useFetchLibraryById = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_LIBRARY_ID, _id }),
        queryFn: async () => {
            return await libraryService.getById<TLibrary>(_id);
        },
        staleTime: 1000 * 60 * 10,
    });
};

// get danh sách xóa mềm
export const useFetchLibraryDeleteList = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_LIBRARY_DELETED, ...params }),
        queryFn: async()=>{
            return await libraryService.getAllDeleted<TLibrary>(params);
        },
        staleTime: 1000 * 60 * 10,
    })
}

export const useReFetchLibraryDeleteList = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_LIBRARY_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchLibraryDeleteListById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_LIBRARY_DELETED_ID, _id }),
        queryFn: async()=>{
            return await libraryService.getByIdDeleted<TLibrary>(_id);
        },
        staleTime: 1000 * 60 * 10,
    })
}