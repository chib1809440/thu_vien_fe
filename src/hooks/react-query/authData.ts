// import { useQuery, useMutation, useQueryClient } from 'react-query';
// import { createExample, deleteExample, getAllExamples, getExampleById, updateExample } from '../../_apis/example.api';
// import { CreateExampleModel, Example } from '../../interfaces/example';
// import { EntityResponse } from '../../interfaces/entityResponse';
// import { ErrorResponse } from 'react-router-dom';

import { keepPreviousData, useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { createExample, deleteExample, deleteExampleSelected, getAllExamples, getExampleById, updateExample } from "../../_apis/example.api";
import { RQ_EXAMPLE, RQ_EXAMPLELIST, RQ_PERMISSIONLIST, RQ_RESOURCELIST } from "./constants_react_query";
import { CreateExampleModel, Example } from "../../interfaces/example";
import { getAllPermissions, getAllResources } from "../../_apis/auth.api";

// // useExamplesData Hook
// export const useExamplesData = (
//     page?: number,
//     take?: number,
//     search?: string,
//     order: string = "ASC",
//     onSuccess?: (data: EntityResponse<Example[]>) => void,
//     onError?: (error: any) => void
// ) => {
//     return useQuery<EntityResponse<Example[]>, ErrorResponse>(
//         ['Examples', page, take, search, order],
//         ({ queryKey }) => {
//             const [_key, page, take, search, order] = queryKey;
//             const parsedPage = page !== undefined ? Number(page) : undefined;
//             const parsedTake = take !== undefined ? Number(take) : undefined;
//             return getAllExamples(parsedPage, parsedTake, search?.toString(), order as string);
//         },
//         {
//             onSuccess,
//             onError,
//         }
//     );
// };

// // useAddExampleData Hook
// export const useAddExampleData = (
//     onSuccess: (data: EntityResponse<Example>) => void
// ) => {
//     const queryClient = useQueryClient();

//     // Modify mutation to expect CreateExampleModel instead of Example
//     return useMutation<EntityResponse<Example>, ErrorResponse, CreateExampleModel>(createExample, {
//         onSuccess: (data) => {
//             queryClient.invalidateQueries('Examples');
//             onSuccess(data);
//         },
//     });
// };

// // useDeleteExampleData Hook
// export const useDeleteExampleData = (
//     onSuccess: (data: EntityResponse<null>) => void
// ) => {
//     const queryClient = useQueryClient();

//     return useMutation<EntityResponse<null>, ErrorResponse, number>(deleteExample, {
//         onSuccess: (data) => {
//             queryClient.invalidateQueries('Examples');
//             onSuccess(data);
//         },
//     });
// };;

// // useUpdateExampleData Hook
// export const useUpdateExampleData = (
//     onSuccess?: (data: EntityResponse<Example>) => void
// ) => {
//     const queryClient = useQueryClient();

//     return useMutation<EntityResponse<Example>, ErrorResponse, { id: number; example: Example }>(
//         ({ id, example }) => updateExample(id, example),
//         {
//             onSuccess: (data) => {
//                 queryClient.invalidateQueries('Examples');
//                 if (onSuccess) {
//                     onSuccess(data);
//                 }
//             },
//         }
//     );
// };

// // useGetExampleData Hook
// export const useGetExampleData = (
//     ExampleId: number | undefined
// ) => {
//     return useQuery<EntityResponse<Example>, ErrorResponse>(
//         ['Example', ExampleId],
//         () => getExampleById(ExampleId as number),
//         {
//             enabled: ExampleId !== undefined,
//         }
//     );
// };
export function useResourceList() {

    return useQuery({
        queryKey: [RQ_RESOURCELIST],
        queryFn: () => getAllResources(),
        placeholderData: keepPreviousData,  // Sử dụng dữ liệu trước đó để tránh loading
    });
}
export function usePermissionList() {

    return useQuery({
        queryKey: [RQ_PERMISSIONLIST],
        queryFn: () => getAllPermissions(),
        placeholderData: keepPreviousData,  // Sử dụng dữ liệu trước đó để tránh loading
    });
}

