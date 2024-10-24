import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { TFilter } from "../../../types/models/entity-common.type";
import { getQueryKeys } from "../../../utils/object";
import { GET_PUBLISHER, GET_PUBLISHER_DELETED, GET_PUBLISHER_DELETED_ID, GET_PUBLISHER_ID, GET_PUBLISHER_LINK } from "./publisher-key";
import { TPublisher } from "../../../types/models/publisher";
import publisherService from "../../../_apis/services/publisher.service";

export const useFetchPublisher = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_PUBLISHER, ...params }),
        queryFn: async()=>{
            return await publisherService.getAll<TPublisher>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchPublisher = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_PUBLISHER, ...params }),
        })
    }

    return revalidate;
}

export const useFetchPublisherById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_PUBLISHER_ID, _id }),
        queryFn: async()=>{
            return await publisherService.getById<TPublisher>(_id);
        },
        placeholderData: keepPreviousData,
    })
}
// get danh sách xóa mềm
export const useFetchPublisherDeleteList = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_PUBLISHER_DELETED, ...params }),
        queryFn: async()=>{
            return await publisherService.getAllDeleted<TPublisher>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchPublisherDeleteList = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_PUBLISHER_DELETED, ...params }),
        })
    }

    return revalidate;
}

export const useFetchPublisherDeleteListById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_PUBLISHER_DELETED_ID, _id }),
        queryFn: async()=>{
            return await publisherService.getByIdDeleted<TPublisher>(_id);
        },
        placeholderData: keepPreviousData,
    })
}

// get link
export const useFetchPublisherLink = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_PUBLISHER_LINK, ...params }),
        queryFn: async()=>{
            return await publisherService.getAllLink<TPublisher>(params);
        },
         placeholderData: keepPreviousData,
    })
}

export const useReFetchPublisherLink = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_PUBLISHER_LINK, ...params }),
        })
    }

    return revalidate;
}
