import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import publisherService from "../../../_apis/services/publisher.service";
import { TPublisher, TPublisherCreate, TPublisherEdit } from "../../../types/models/publisher";

export const useAddPublisher = () => {
    return useMutation({
        mutationFn: async (data: TPublisherCreate) => {
            return await publisherService.create<TPublisherCreate, TPublisher>(data)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useEditPublisher = () => {
    return useMutation({
        mutationFn: async (data: TPublisherEdit) => {
            return await publisherService.update<TPublisherEdit, TPublisher>(data, data._id);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeletePublisher = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await publisherService.delete<TPublisher>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteManyPublisher = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await publisherService.deleteMultiple<TPublisher>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// xóa mềm
export const useDeleteSoftPublisher = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await publisherService.softDelete<TPublisher>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

export const useDeleteSoftManyPublisher = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await publisherService.softDeleteMultiple<TPublisher>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

// restore
export const useRestoreManyPublisher = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await publisherService.restoreMany<TPublisher>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};


// pull-link
export const useAddPublisherPullLink = () => {
    return useMutation({
        mutationFn: async (data: { ids: string[], note: string, isPublic: boolean }) => {
            return await publisherService.createPullLink<{ data: TPublisher; errors?: any }>(data)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}