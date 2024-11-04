import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import authorService from "../../../_apis/services/author.service";
import { TAuthor, TAuthorCreate, TAuthorEdit } from "../../../types/models/author";

export const useAddAuthor = () => {
    return useMutation({
        mutationFn: async (data: TAuthorCreate) => {
            return await authorService.create<TAuthorCreate, TAuthor>(data)
        },
        onError: (error: any) => {
            if (error.message === "name already exists") {
                toast.error("Tên đã tồn tại");
            } else {
                toast.error(error.message);
            }
        },
    })
}

export const useEditAuthor = () => {
    return useMutation({
        mutationFn: async (data: TAuthorEdit) => {
            return await authorService.update<TAuthorEdit, TAuthor>(data, data._id);
        },
        onError: (error: any) => {
            if (error.message === "name already exists") {
                toast.error("Tên đã tồn tại");
            } else {
                toast.error(error.message);
            }
        },
    })
}

export const useDeleteAuthor = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await authorService.delete<TAuthor>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}

export const useDeleteManyAuthor = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await authorService.deleteMultiple<TAuthor>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// xóa mềm
export const useDeleteSoftAuthor = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await authorService.softDelete<TAuthor>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

export const useDeleteSoftManyAuthor = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await authorService.softDeleteMultiple<TAuthor>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

// restore
export const useRestoreManyAuthor = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await authorService.restoreMany<TAuthor>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};


// pull-link
export const useAddAuthorPullLink = () => {
    return useMutation({
        mutationFn: async (data: { ids: string[], note: string, isPublic: boolean }) => {
            return await authorService.createPullLink<{ results: TAuthor[]; errors?: any }>(data)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
}