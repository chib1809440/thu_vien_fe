// import { useQuery, useMutation, useQueryClient } from 'react-query';
// import { createExample, deleteExample, getAllExamples, getExampleById, updateExample } from '../../_apis/example.api';
// import { CreateExampleModel, Example } from '../../interfaces/example';
// import { EntityResponse } from '../../interfaces/entityResponse';
// import { ErrorResponse } from 'react-router-dom';

import { keepPreviousData, useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { createExample, deleteExample, getAllExamples, getExampleById, updateExample } from "../../_apis/example.api";
import { RQ_EXAMPLE, RQ_EXAMPLELIST } from "./constants_react_query";
import { CreateExampleModel, Example } from "../../interfaces/example";

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
export function useExampleList(page: number) {
    return useQuery({
        queryKey: [RQ_EXAMPLELIST, { page }],
        queryFn: () => getAllExamples(page),
        placeholderData: keepPreviousData,
    });
}
export function useCreateExample() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateExampleModel) => createExample(data),
        onMutate: () => {
            console.log("mutate");
        },

        onError: () => {
            console.log("error");
        },

        onSuccess: () => {
            console.log("success");
        },
        onSettled: async (_, error) => {
            console.log("settled");
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_EXAMPLELIST] });
            }
        },
    });
}
export function useDeleteExample() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteExample(id),

        onSuccess: () => {
            console.log("deleted successfully");
        },

        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_EXAMPLELIST] });
            }
        },
    });
}
export function useUpdateExample() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Example) => updateExample(data._id, data),

        onSettled: async (_, error, variables) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_EXAMPLELIST] });
                await queryClient.invalidateQueries({
                    queryKey: [RQ_EXAMPLE, { id: variables._id }],
                });
            }
        },
    });
}

export function useExample(ids: (number | undefined)[] | undefined) {
    return useQueries({
        queries: (ids ?? []).map((id) => {
            return {
                queryKey: [RQ_EXAMPLE, { id }],
                queryFn: () => getExampleById(id),
            };
        }),
    });
}