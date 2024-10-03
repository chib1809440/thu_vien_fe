// import { useQuery, useMutation, useQueryClient } from 'react-query';
// import { createAsset, deleteAsset, getAllAssets, getAssetById, updateAsset } from '../../_apis/asset.api';
// import { CreateAssetModel, Asset } from '../../interfaces/asset';
// import { EntityResponse } from '../../interfaces/entityResponse';
// import { ErrorResponse } from 'react-router-dom';

import { keepPreviousData, useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAsset, softDeleteAsset, softDeleteAssetSelected, getAllAssets, getAssetById, updateAsset, deleteAssetSelected, deleteAsset, restoreAssetSelected } from "../../_apis/asset.api";
import { RQ_ASSET, RQ_ASSETLIST, RQ_ASSETTRASHLIST } from "./constants_react_query";
import { CreateAssetModel, Asset } from "../../interfaces/asset";

// // useAssetsData Hook
// export const useAssetsData = (
//     page?: number,
//     take?: number,
//     search?: string,
//     order: string = "ASC",
//     onSuccess?: (data: EntityResponse<Asset[]>) => void,
//     onError?: (error: any) => void
// ) => {
//     return useQuery<EntityResponse<Asset[]>, ErrorResponse>(
//         ['Assets', page, take, search, order],
//         ({ queryKey }) => {
//             const [_key, page, take, search, order] = queryKey;
//             const parsedPage = page !== undefined ? Number(page) : undefined;
//             const parsedTake = take !== undefined ? Number(take) : undefined;
//             return getAllAssets(parsedPage, parsedTake, search?.toString(), order as string);
//         },
//         {
//             onSuccess,
//             onError,
//         }
//     );
// };

// // useAddAssetData Hook
// export const useAddAssetData = (
//     onSuccess: (data: EntityResponse<Asset>) => void
// ) => {
//     const queryClient = useQueryClient();

//     // Modify mutation to expect CreateAssetModel instead of Asset
//     return useMutation<EntityResponse<Asset>, ErrorResponse, CreateAssetModel>(createAsset, {
//         onSuccess: (data) => {
//             queryClient.invalidateQueries('Assets');
//             onSuccess(data);
//         },
//     });
// };

// // useDeleteAssetData Hook
// export const useDeleteAssetData = (
//     onSuccess: (data: EntityResponse<null>) => void
// ) => {
//     const queryClient = useQueryClient();

//     return useMutation<EntityResponse<null>, ErrorResponse, number>(deleteAsset, {
//         onSuccess: (data) => {
//             queryClient.invalidateQueries('Assets');
//             onSuccess(data);
//         },
//     });
// };;

// // useUpdateAssetData Hook
// export const useUpdateAssetData = (
//     onSuccess?: (data: EntityResponse<Asset>) => void
// ) => {
//     const queryClient = useQueryClient();

//     return useMutation<EntityResponse<Asset>, ErrorResponse, { id: number; asset: Asset }>(
//         ({ id, asset }) => updateAsset(id, asset),
//         {
//             onSuccess: (data) => {
//                 queryClient.invalidateQueries('Assets');
//                 if (onSuccess) {
//                     onSuccess(data);
//                 }
//             },
//         }
//     );
// };

// // useGetAssetData Hook
// export const useGetAssetData = (
//     AssetId: number | undefined
// ) => {
//     return useQuery<EntityResponse<Asset>, ErrorResponse>(
//         ['Asset', AssetId],
//         () => getAssetById(AssetId as number),
//         {
//             enabled: AssetId !== undefined,
//         }
//     );
// };
export function useAssetList(page?: number, limit?: number, search?: string) {

    return useQuery({
        queryKey: [RQ_ASSETLIST, { page, limit, search }],
        queryFn: () => getAllAssets(page, limit, search),
        placeholderData: keepPreviousData,  // Sử dụng dữ liệu trước đó để tránh loading
    });
}

export function useCreateAsset(onSuccess, onError) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAssetModel) => createAsset(data),
        onMutate: () => {
            console.log("mutate");
        },

        onError: (data) => {
            onError(data)
        },

        onSuccess: (data) => {
            onSuccess(data)

        },
        onSettled: async (_, error) => {
            console.log("settled");
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_ASSETLIST] });
            }
        },
    });
}

export function useUpdateAsset(onSuccess, onError) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Asset) => updateAsset(data._id, data),
        onSuccess: (data) => {
            onSuccess(data)

        },
        onError: (data) => {
            onError(data)
        },
        onSettled: async (_, error, variables) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_ASSETLIST] });
                await queryClient.invalidateQueries({
                    queryKey: [RQ_ASSET, { id: variables._id }],
                });
            }
        },
    });
}

export function useAsset(ids: (string | undefined)[] | undefined) {
    return useQueries({
        queries: (ids ?? []).map((id) => {
            return {
                queryKey: [RQ_ASSET, { id }],
                queryFn: () => getAssetById(id),
            };
        }),
    });
}
export function useSoftDeleteAssetSelected() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids: string[]) => softDeleteAssetSelected(ids),
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_ASSETLIST] });
            }
        },
    });
}
export function useSoftDeleteAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => softDeleteAsset(id),
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_ASSETLIST] });
            }
        },
    });
}
export function useAssetTrashList(page?: number, limit?: number, search?: string) {

    return useQuery({
        queryKey: [RQ_ASSETTRASHLIST, { page, limit, search }],
        queryFn: () => getAllAssets(page, limit, search),
        placeholderData: keepPreviousData,  // Sử dụng dữ liệu trước đó để tránh loading
    });
}
export function useDeleteAssetSelected() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids: string[]) => deleteAssetSelected(ids),
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_ASSETTRASHLIST] });
            }
        },
    });
}
export function useDeleteAsset() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteAsset(id),
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_ASSETTRASHLIST] });
            }
        },
    });
}
export function useRestoreAssetSelected() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids: string[]) => restoreAssetSelected(ids),
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_ASSETTRASHLIST] });
            }
        },
    });
}