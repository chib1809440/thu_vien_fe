import { EntityResponse } from '../interfaces/entityResponse';
import { CreateUserModel, User } from '../interfaces/user';
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
export const getAllUsers = async (page?: number, limit?: number, search?: string, order: string = "ASC"): Promise<EntityResponse<User[]>> => {
    let url = `${USER_API}?order=${order}`;

    if (page !== undefined && limit !== undefined) {
        url += `&page=${page}&limit=${limit}`;
    }
    if (search && search.trim() !== '') {
        url += `&search=${encodeURIComponent(search.trim())}`;
    }
    const response = await axios.get<EntityResponse<User[]>>(url);
    return response.data;
};

// Read by ID
export const getUserById = async (id: string): Promise<EntityResponse<User>> => {
    const response = await axios.get<EntityResponse<User>>(`${USER_API}/${id}`);
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