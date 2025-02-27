import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import topicService from "../../../_apis/services/topic.service";
import { TFilter } from "../../../types/models/entity-common.type";
import { TTopic } from "../../../types/models/topic";
import { getQueryKeys } from "../../../utils/object";
import { GET_TOPIC, GET_TOPIC_ID } from "./topic-key";

export const useFetchTopic = (params?:TFilter)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_TOPIC, ...params }),
        queryFn: async()=>{
            return await topicService.getAll<TTopic>(params);
        },
        placeholderData: keepPreviousData,
    })
}

export const useReFetchTopic = ()=>{
    const queryClient = useQueryClient();

    const revalidate = (params?:TFilter)=>{
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_TOPIC, ...params }),
        })
    }

    return revalidate;
}

export const useFetchTopicById = (_id: string)=>{
    return useQuery({
        queryKey: getQueryKeys({ key: GET_TOPIC_ID, _id }),
        queryFn: async()=>{
            return await topicService.getById<TTopic>(_id);
        },
        placeholderData: keepPreviousData,
    })
}
