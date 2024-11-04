import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import groupService from "../../../_apis/services/group.service";
import { TGroup, TGroupCreate, TGroupEdit } from "../../../types/models/group.type";

export const useAddGroup = () => {
    return useMutation({
        mutationFn: async (data: TGroupCreate) => {
            return await groupService.create<TGroupCreate, TGroup>(data);
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

export const useEditGroup = () => {
    return useMutation({
        mutationFn: async (data: TGroupEdit) => {
            return await groupService.update<TGroupEdit, TGroup>(data, data._id)
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

export const useDeleteGroup = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            return await groupService.delete<TGroup>(id);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

export const useDeleteManyGroup = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await groupService.deleteMultiple<TGroup>(ids);
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });
};

// xóa mềm
export const useDeleteSoftGroup = () => {
    return useMutation({
        mutationFn: async (_id: string) => {
            return await groupService.softDelete<TGroup>(_id)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

export const useDeleteSoftManyGroup = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await groupService.softDeleteMultiple<TGroup>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};

// restore
export const useRestoreManyGroup = () => {
    return useMutation({
        mutationFn: async (ids: string[]) => {
            return await groupService.restoreMany<TGroup>(ids)
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    })
};