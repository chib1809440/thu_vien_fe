import { useQuery, useQueryClient } from "@tanstack/react-query";
import groupService from "../../../_apis/services/group.service";
import { GET_GROUP_DELETED, GET_GROUP_DELETED_ID, GET_GROUP_ID, GET_GROUPS } from "./group-key";
import { TFilter } from "../../../types/models/entity-common.type";
import { TGroup } from "../../../types/models/group.type";
import { getQueryKeys } from "../../../utils/object";

export const useFetchGroup = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_GROUPS, ...params }),
        queryFn: async () => {
            return await groupService.getAll<TGroup>(params);
        },
        staleTime: 1000 * 60 * 10, // 10 minutes
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
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
};

// get danh sách xóa mềm
export const useFetchGroupDeleteList = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_GROUP_DELETED, ...params }),
        queryFn: async()=>{
            return await groupService.getAllDeleted<TGroup>(params);
        },
        staleTime: 1000 * 60 * 10,
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
        staleTime: 1000 * 60 * 10,
    })
}