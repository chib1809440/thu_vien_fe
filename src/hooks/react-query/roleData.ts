// import { useQuery, useMutation, useQueryClient } from 'react-query';
// import { createRole, deleteRole, getAllRoles, getRoleById, updateRole } from '../../_apis/role.api';
// import { CreateRoleModel, Role } from '../../interfaces/role';
// import { EntityResponse } from '../../interfaces/entityResponse';
// import { ErrorResponse } from 'react-router-dom';

import { keepPreviousData, useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPermissionToRole, createRole, deleteRole, deleteRoleSelected, getAllRoles, getRoleById, updateRole } from "../../_apis/role.api";
import { RQ_ROLE, RQ_ROLELIST } from "./constants_react_query";
import { AddPermissionToRoleModel, CreateRoleModel, Role } from "../../interfaces/role";

// // useRolesData Hook
// export const useRolesData = (
//     page?: number,
//     take?: number,
//     search?: string,
//     order: string = "ASC",
//     onSuccess?: (data: EntityResponse<Role[]>) => void,
//     onError?: (error: any) => void
// ) => {
//     return useQuery<EntityResponse<Role[]>, ErrorResponse>(
//         ['Roles', page, take, search, order],
//         ({ queryKey }) => {
//             const [_key, page, take, search, order] = queryKey;
//             const parsedPage = page !== undefined ? Number(page) : undefined;
//             const parsedTake = take !== undefined ? Number(take) : undefined;
//             return getAllRoles(parsedPage, parsedTake, search?.toString(), order as string);
//         },
//         {
//             onSuccess,
//             onError,
//         }
//     );
// };

// // useAddRoleData Hook
// export const useAddRoleData = (
//     onSuccess: (data: EntityResponse<Role>) => void
// ) => {
//     const queryClient = useQueryClient();

//     // Modify mutation to expect CreateRoleModel instead of Role
//     return useMutation<EntityResponse<Role>, ErrorResponse, CreateRoleModel>(createRole, {
//         onSuccess: (data) => {
//             queryClient.invalidateQueries('Roles');
//             onSuccess(data);
//         },
//     });
// };

// // useDeleteRoleData Hook
// export const useDeleteRoleData = (
//     onSuccess: (data: EntityResponse<null>) => void
// ) => {
//     const queryClient = useQueryClient();

//     return useMutation<EntityResponse<null>, ErrorResponse, number>(deleteRole, {
//         onSuccess: (data) => {
//             queryClient.invalidateQueries('Roles');
//             onSuccess(data);
//         },
//     });
// };;

// // useUpdateRoleData Hook
// export const useUpdateRoleData = (
//     onSuccess?: (data: EntityResponse<Role>) => void
// ) => {
//     const queryClient = useQueryClient();

//     return useMutation<EntityResponse<Role>, ErrorResponse, { id: number; role: Role }>(
//         ({ id, role }) => updateRole(id, role),
//         {
//             onSuccess: (data) => {
//                 queryClient.invalidateQueries('Roles');
//                 if (onSuccess) {
//                     onSuccess(data);
//                 }
//             },
//         }
//     );
// };

// // useGetRoleData Hook
// export const useGetRoleData = (
//     RoleId: number | undefined
// ) => {
//     return useQuery<EntityResponse<Role>, ErrorResponse>(
//         ['Role', RoleId],
//         () => getRoleById(RoleId as number),
//         {
//             enabled: RoleId !== undefined,
//         }
//     );
// };
export function useRoleList(page?: number, limit?: number, search?: string) {

    return useQuery({
        queryKey: [RQ_ROLELIST, { page, limit, search }],
        queryFn: () => getAllRoles(page, limit, search),
        placeholderData: keepPreviousData,  // Sử dụng dữ liệu trước đó để tránh loading
    });
}

export function useCreateRole(onSuccess, onError) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateRoleModel) => createRole(data),
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
                await queryClient.invalidateQueries({ queryKey: [RQ_ROLELIST] });
            }
        },
    });
}
export function useAddPermissionToRole(onSuccess, onError) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: AddPermissionToRoleModel) => addPermissionToRole(data),
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
                await queryClient.invalidateQueries({ queryKey: [RQ_ROLELIST] });
            }
        },
    });
}
export function useDeleteRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteRole(id),
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_ROLELIST] });
            }
        },
    });
}
export function useUpdateRole(onSuccess, onError) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Role) => updateRole(data._id, data),
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
                await queryClient.invalidateQueries({ queryKey: [RQ_ROLELIST] });
                await queryClient.invalidateQueries({
                    queryKey: [RQ_ROLE, { id: variables._id }],
                });
            }
        },
    });
}

export function useRole(ids: (string | undefined)[] | undefined) {
    return useQueries({
        queries: (ids ?? []).map((id) => {
            return {
                queryKey: [RQ_ROLE, { id }],
                queryFn: () => getRoleById(id),
            };
        }),
    });
}
export function useDeleteRoleSelected() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids: string[]) => deleteRoleSelected(ids),
        onSettled: async (_, error) => {
            if (error) {
                console.log(error);
            } else {
                await queryClient.invalidateQueries({ queryKey: [RQ_ROLELIST] });
            }
        },
    });
}