import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import groupService from "../../../_apis/services/group.service";
import { GET_GROUP_DELETED, GET_GROUP_DELETED_ID, GET_GROUP_ID, GET_GROUPS, GET_LIBRARIES_FROM_GROUPS } from "./group-key";
import { TFilter } from "../../../types/models/entity-common.type";
import { TGroup } from "../../../types/models/group.type";
import { getQueryKeys } from "../../../utils/object";

export const useFetchGroup = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_GROUPS, ...params }),
        queryFn: async () => {
            return await groupService.getAll<TGroup>(params);
        },
         placeholderData: keepPreviousData,
    });
};

export const useReFetchGroup = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_GROUPS, ...params }),
        });
    };

    return revalidate;
};

export const useFetchGroupById = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_GROUP_ID, _id }),
        queryFn: async () => {
            return await groupService.getById<TGroup>(_id);
        },
         placeholderData: keepPreviousData,
    });
};

// get danh sách xóa mềm
export const useFetchGroupDeleteList = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_GROUP_DELETED, ...params }),
        queryFn: async()=>{
            return await groupService.getAllDeleted<TGroup>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchGroupDeleteList = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_GROUP_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchGroupDeleteListById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_GROUP_DELETED_ID, _id }),
        queryFn: async()=>{
            return await groupService.getByIdDeleted<TGroup>(_id);
        },
        placeholderData: keepPreviousData,
    })
}

// get link
export const useFetchLibrariesFromGroup = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_LIBRARIES_FROM_GROUPS, ...params }),
        queryFn: async()=>{
            return await groupService.getAllLibrariesFromGroup<TGroup>(params);
        },
         placeholderData: keepPreviousData,
    })
}

export const useReFetchLibrariesFromGroup = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_LIBRARIES_FROM_GROUPS, ...params }),
        })
    }

    return revalidate;
}