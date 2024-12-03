import { EntityResponse, SingleRecordResponse } from '../interfaces/entityResponse';
import { ChangePasswordUserModel, User } from '../interfaces/user';
import { TApiModifyRecord, TApiOneRecord } from '../types/api/api.type';
import axios from '../utils/axios';

const USER_API = '/user';

// Create
export const createUser = async (formData: FormData): Promise<EntityResponse<User>> => {
    const response = await axios.post<EntityResponse<User>>(USER_API, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Đặt header cho form-data
        },
    });
    return response.data;
};

// Read all
export const getAllUsers = async (page?: number, limit?: number, search?: string, roleId?: string | number, order: string = "ASC"): Promise<EntityResponse<User[]>> => {
    let url = `${USER_API}?order=${order}`;
    if (page !== undefined && limit !== undefined && limit > 0) {
        url += `&page=${page}&limit=${limit}`;
    }
    console.log(page);
    console.log(limit);

    if (search && search.trim() !== '') {
        url += `&search=${encodeURIComponent(search.trim())}`;
    }
    if (roleId !== undefined && roleId != 0) {
        url += `&roleId=${roleId.toString()}`; // Chuyển đổi thành chuỗi
    }
    const response = await axios.get<EntityResponse<User[]>>(url);
    return response.data;
};

// Read by ID
export const getUserById = async (id: string): Promise<SingleRecordResponse<User>> => {
    const response = await axios.get<SingleRecordResponse<User>>(`${USER_API}/${id}`);
    return response.data;
};
// Read by ID
export const getUserByBarCode = async (barCode: string): Promise<EntityResponse<User>> => {
    const response = await axios.get<EntityResponse<User>>(`${USER_API}/barcode/${barCode}`);
    return response.data;
};

// Update
export const updateUser = async (id: string, formData: FormData): Promise<EntityResponse<User>> => {
    const response = await axios.patch<EntityResponse<User>>(`${USER_API}/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Đặt header cho form-data
        },
    });
    return response.data;
};

// Soft Delete
export const softDeleteUser = async (id: string): Promise<EntityResponse<User>> => {
    const response = await axios.delete<EntityResponse<User>>(`${USER_API}/soft/${id}`);
    return response.data;
};
export const softDeleteUserSelected = async (ids: string[]): Promise<EntityResponse<User>> => {
    const response = await axios.delete<EntityResponse<User>>(`${USER_API}/soft/selected`, {
        data: ids,  // Use `data` to send the body with axios.delete
    });
    return response.data;
};

//  Delete
export const deleteUser = async (id: string): Promise<EntityResponse<User>> => {
    const response = await axios.delete<EntityResponse<User>>(`${USER_API}/${id}`);
    return response.data;
};
export const deleteUserSelected = async (ids: string[]): Promise<EntityResponse<User>> => {
    const response = await axios.delete<EntityResponse<User>>(`${USER_API}/selected`, {
        data: ids,  // Use `data` to send the body with axios.delete
    });
    return response.data;
};
export const restoreUserSelected = async (ids: string[]): Promise<EntityResponse<User>> => {
    const response = await axios.patch<EntityResponse<User>>(`${USER_API}/restore`, ids);
    return response.data;
};
export const getAllUsersDeleted = async (page?: number, limit?: number, search?: string, order: string = "ASC"): Promise<EntityResponse<User[]>> => {
    let url = `${USER_API}/deleted/?order=${order}`;

    if (page !== undefined && limit !== undefined) {
        url += `&page=${page}&limit=${limit}`;
    }
    if (search && search.trim() !== '') {
        url += `&search=${encodeURIComponent(search.trim())}`;
    }
    const response = await axios.get<EntityResponse<User[]>>(url);
    return response.data;
};

export const changeInfo = async<DynamicPayload, DynamicResponse>(
    payload: DynamicPayload,
    id: string | number,
    isWithFormData: boolean = false
) => {
    if (isWithFormData) {
        const formData = new FormData();

        Object.keys(payload).forEach((key) => {
            // check is one file
            if (payload[key] instanceof File) {
                formData.append(key, payload[key]);
                return;
            }

            // check is list file
            if (Array.isArray(payload[key]) && payload[key][0] instanceof File) {
                payload[key].forEach((file) => {
                    formData.append(key, file);
                });
                return;
            }

            // check is object
            if (typeof payload[key] === "object" && payload[key] !== null) {
                formData.append(key, JSON.stringify(payload[key]));
                return;
            }

            // check is string
            if (typeof payload[key] === "string") {
                formData.append(key, payload[key]);
                return;
            }

            // check is number
            if (typeof payload[key] === "number") {
                formData.append(key, payload[key].toString());
                return;
            }

            // check is boolean
            if (typeof payload[key] === "boolean") {
                formData.append(key, payload[key].toString());
                return;
            }

            // check is null
            if (
                payload[key] === null ||
                payload[key] === undefined ||
                payload[key] === "" ||
                typeof payload[key] === "undefined"
            ) {
                return;
            }

            // check is array
            if (Array.isArray(payload[key])) {
                payload[key].forEach((file) => {
                    formData.append(key, file);
                });
                return;
            }

            formData.append(key, payload[key]);
        });

        const response = await axios.patch(`${USER_API}/change-info/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data as TApiOneRecord<DynamicResponse>;
    }

    const response = await axios.patch(`${USER_API}/change-info/${id}`, payload);
    return response.data as TApiOneRecord<DynamicResponse>;
}
// Update
export const changePasswordUser = async (data: ChangePasswordUserModel): Promise<EntityResponse<User>> => {
    const response = await axios.patch<EntityResponse<User>>(`${USER_API}/change-password`, data);
    return response.data;
};

//  block
export const blockUser = async (id: string): Promise<EntityResponse<User>> => {
    const response = await axios.patch<EntityResponse<User>>(`${USER_API}/block-account/${id}`);
    return response.data;
};
//  active
export const activeUser = async (id: string): Promise<EntityResponse<User>> => {
    const response = await axios.patch<EntityResponse<User>>(`${USER_API}/active-account/${id}`);
    return response.data;
};

//import excel
export const importExcelUser = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post(`${USER_API}/import-excel`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data as TApiModifyRecord<{ users: any; errors?: any }>;
}
