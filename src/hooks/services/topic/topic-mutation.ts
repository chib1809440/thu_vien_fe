import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import topicService from "../../../_apis/services/topic.service";
import { TTopic, TTopicCreate, TTopicEdit } from "../../../types/models/topic";

export const useAddTopic = () => {
    return useMutation({
        mutationFn: async (data: TTopicCreate) => {
            return await topicService.create<TTopicCreate, TTopic>(data)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useEditTopic = () => {
    return useMutation({
        mutationFn: async (data: TTopicEdit) => {
            return await topicService.update<TTopicEdit, TTopic>(data, data._id);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteTopic = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await topicService.delete<TTopic>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteManyTopic = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await topicService.deleteMultiple<TTopic>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};
