import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import requestGroupService from "../../../_apis/services/request-group.service";
import { TFilter } from "../../../types/models/entity-common.type";
import { TGroup } from "../../../types/models/group.type";
import { getQueryKeys } from "../../../utils/object";
import { GET_REQUEST_GROUPS, GET_REQUEST_GROUPS_ADMIN } from "./request-group-key";
import { TLibrary } from "../../../types/models/library.type";

export const useFetchRequestGroup = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_REQUEST_GROUPS, ...params }),
        queryFn: async () => {
            return await requestGroupService.getAll<TGroup>(params);
        },
        placeholderData: keepPreviousData,
    });
};

export const useReFetchRequestGroup = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_REQUEST_GROUPS, ...params }),
        });
    };

    return revalidate;
};

export const useFetchRequestGroupFromAdmin = (params?: TFilter) => {
    return useQuery({
        queryKey: getQueryKeys({ key: GET_REQUEST_GROUPS_ADMIN, ...params }),
        queryFn: async () => {
            return await requestGroupService.getAllRequestGroupFromAdmin<TGroup & { groupId?: TGroup, libraryId?: TLibrary }>(params);
        },
        placeholderData: keepPreviousData,
    });
};

export const useReFetchRequestGroupFromAdmin = () => {
    const queryClient = useQueryClient();

    const revalidate = (params?: TFilter) => {
        queryClient.invalidateQueries({
            queryKey: getQueryKeys({ key: GET_REQUEST_GROUPS_ADMIN, ...params }),
        });
    };

    return revalidate;
};
