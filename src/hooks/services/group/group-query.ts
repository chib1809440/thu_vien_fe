import { useQuery, useQueryClient } from "@tanstack/react-query";
import groupService from "../../../_apis/services/group.service";
import { GET_GROUP_ID, GET_GROUPS } from "./group-key";
import { TFilter } from "../../../types/models/entity-common.type";
import { TGroup } from "../../../types/models/group.type";

export const useFetchGroup = (params?: TFilter)=>{
    return useQuery({
        queryKey: [GET_GROUPS, params],
        queryFn: async () => {
            return await groupService.getAll<TGroup>(params);
        },
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}

export const useReFetchGroup = () =>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: [GET_GROUPS, params]
        })
    }

    return revalidate;

}

export const useFetchGroupById = (_id: string) =>{
    return useQuery({
        queryKey: [GET_GROUP_ID, _id],
        queryFn: async()=>{
            return await groupService.getById<TGroup>(_id);
        },
        staleTime: 1000 * 60 * 10, // 10 minutes
    })
}