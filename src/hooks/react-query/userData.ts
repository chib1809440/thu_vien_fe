// import { useQuery, useMutation, useQueryClient } from 'react-query';
// import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../../_apis/user.api';
// import { CreateUserModel, User } from '../../interfaces/user';
// import { EntityResponse } from '../../interfaces/entityResponse';
// import { ErrorResponse } from 'react-router-dom';

import { keepPreviousData, useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, deleteUserSelected, getAllUsers, getAllUsersDeleted, getUserById, restoreUserSelected, softDeleteUser, softDeleteUserSelected, updateUser } from "../../_apis/user.api";
import { RQ_USER, RQ_USERLIST, RQ_USERTRASHLIST } from "./constants_react_query";
import { CreateAdminModel, CreateUserModel, User } from "../../interfaces/user";
import { createAdminAcount, updateAdminAcount } from "../../_apis/auth.api";
import { getQueryKeys } from "../../utils/object";

// // useUsersData Hook
// export const useUsersData = (
//     page?: number,
//     take?: number,
//     search?: string,
//     order: string = "ASC",
//     onSuccess?: (data: EntityResponse<User[]>) => void,
//     onError?: (error: any) => void
// ) => {
//     return useQuery<EntityResponse<User[]>, ErrorResponse>(
//         ['Users', page, take, search, order],
//         ({ queryKey }) => {
//             const [_key, page, take, search, order] = queryKey;
//             const parsedPage = page !== undefined ? Number(page) : undefined;
//             const parsedTake = take !== undefined ? Number(take) : undefined;
//             return getAllUsers(parsedPage, parsedTake, search?.toString(), order as string);
//         },
//         {
//             onSuccess,
//             onError,
//         }
//     );
// };

// // useAddUserData Hook
// export const useAddUserData = (
//     onSuccess: (data: EntityResponse<User>) => void
// ) => {
//     const queryClient = useQueryClient();

//     // Modify mutation to expect CreateUserModel instead of User
//     return useMutation<EntityResponse<User>, ErrorResponse, CreateUserModel>(createUser, {
//         onSuccess: (data) => {
//             queryClient.invalidateQueries('Users');
//             onSuccess(data);
//         },
//     });
// };

// // useDeleteUserData Hook
// export const useDeleteUserData = (
//     onSuccess: (data: EntityResponse<null>) => void
// ) => {
//     const queryClient = useQueryClient();

//     return useMutation<EntityResponse<null>, ErrorResponse, number>(deleteUser, {
//         onSuccess: (data) => {
//             queryClient.invalidateQueries('Users');
//             onSuccess(data);
//         },
//     });
// };;

// // useUpdateUserData Hook
// export const useUpdateUserData = (
//     onSuccess?: (data: EntityResponse<User>) => void
// ) => {
//     const queryClient = useQueryClient();

//     return useMutation<EntityResponse<User>, ErrorResponse, { id: number; user: User }>(
//         ({ id, user }) => updateUser(id, user),
//         {
//             onSuccess: (data) => {
//                 queryClient.invalidateQueries('Users');
//                 if (onSuccess) {
//                     onSuccess(data);
//                 }
//             },
//         }
//     );
// };

// // useGetUserData Hook
// export const useGetUserData = (
//     UserId: number | undefined
// ) => {
//     return useQuery<EntityResponse<User>, ErrorResponse>(
//         ['User', UserId],
//         () => getUserById(UserId as number),
//         {
//             enabled: UserId !== undefined,
//         }
//     );
// };
export function useUserList(page?: number, limit?: number, search?: string, roleId?: string | number) {

    return useQuery({
        queryKey: [RQ_USERLIST, { page, limit, search }],
        queryFn: () => getAllUsers(page, limit, search, roleId.toString()),
        placeholderData: keepPreviousData,  // Sử dụng dữ liệu trước đó để tránh loading
    });
}

export function useCreateUser(onSuccess, onError) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FormData) => createUser(data),
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
                await queryClient.invalidateQueries({ queryKey: [RQ_USERLIST] });
            }
        },
    });
}

// Hook để cập nhật người dùng
export function useUpdateUser(onSuccess, onError) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: FormData }) => updateUser(id, data),
        onSuccess: (data) => {
            onSuccess(data);
        },
        onError: (error) => {
            onError(error);
        },
        onSettled: async (_, error, variables) => {
            if (error) {
                console.error("Update error:", error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_USERLIST] });
                await queryClient.invalidateQueries({
                    queryKey: [RQ_USER, { id: variables.id }],
                });
            }
        },
    });
}


export const useUser = (_id: string) => {
    return useQuery({
        queryKey: getQueryKeys({ key: RQ_USER, _id }),
        queryFn: async () => {
            return await getUserById(_id);
        },
        placeholderData: keepPreviousData,
    })
}
export function useSoftDeleteUserSelected() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids: string[]) => softDeleteUserSelected(ids),
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_USERLIST] });
            }
        },
    });
}
export function useSoftDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => softDeleteUser(id),
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_USERLIST] });
            }
        },
    });
}
export function useUserTrashList(page?: number, limit?: number, search?: string) {

    return useQuery({
        queryKey: [RQ_USERTRASHLIST, { page, limit, search }],
        queryFn: () => getAllUsersDeleted(page, limit, search),
        placeholderData: keepPreviousData,  // Sử dụng dữ liệu trước đó để tránh loading
    });
}
export function useDeleteUserSelected() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids: string[]) => deleteUserSelected(ids),
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_USERTRASHLIST] });
            }
        },
    });
}
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_USERTRASHLIST] });
            }
        },
    });
}
export function useRestoreUserSelected() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ids: string[]) => restoreUserSelected(ids),
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_USERTRASHLIST] });
            }
        },
    });
}
export function useCreateAdminAccount(onSuccess, onError) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAdminModel) => createAdminAcount(data),
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
                await queryClient.invalidateQueries({ queryKey: [RQ_USERLIST] });
            }
        },
    });
}
export function useUpdateAdminAccount(onSuccess, onError) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateAdminModel) => updateAdminAcount(data),
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
                await queryClient.invalidateQueries({ queryKey: [RQ_USERLIST] });
            }
        },
    });
}
