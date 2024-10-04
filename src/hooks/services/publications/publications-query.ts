import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import publicationsService from "../../../_apis/services/publications.service";
import { TFilter } from "../../../types/models/entity-common.type";
import { TPublications } from "../../../types/models/publications.type";
import { getQueryKeys } from "../../../utils/object";
import { GET_PUBLICATIONS, GET_PUBLICATIONS_DELETED, GET_PUBLICATIONS_DELETED_ID, GET_PUBLICATIONS_ID } from "./publications-key";

export const useFetchPublications = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_PUBLICATIONS, ...params }),
        queryFn: async () => {
            return await publicationsService.getAll<TPublications>(params);
        },
         placeholderData: keepPreviousData,
    });
};

export const useReFetchPublications = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_PUBLICATIONS, ...params }),
        });
    };

    return revalidate;
};

export const useFetchPublicationsById = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_PUBLICATIONS_ID, _id }),
        queryFn: async () => {
            return await publicationsService.getById<TPublications>(_id);
        },
         placeholderData: keepPreviousData,
    });
};

// get danh sách xóa mềm
export const useFetchPublicationsDeleteList = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_PUBLICATIONS_DELETED, ...params }),
        queryFn: async()=>{
            return await publicationsService.getAllDeleted<TPublications>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchPublicationsDeleteList = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_PUBLICATIONS_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchPublicationsDeleteListById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_PUBLICATIONS_DELETED_ID, _id }),
        queryFn: async()=>{
            return await publicationsService.getByIdDeleted<TPublications>(_id);
        },
        placeholderData: keepPreviousData,
    })
}