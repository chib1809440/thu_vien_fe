import { RefreshToken } from '../interfaces/auth';
import { EntityResponse, ModifyRecordResponse, SingleRecordResponse } from '../interfaces/entityResponse';
import { CreateExampleModel, Example } from '../interfaces/example';
import { CreateAdminModel } from '../interfaces/user';
import axios from '../utils/axios';

const AUTH_API = '/auth';

// Read all
export const getAllResources = async (): Promise<EntityResponse<string[]>> => {

    const response = await axios.get<EntityResponse<string[]>>(`${AUTH_API}/resources`);
    return response.data;
};
// Read all
export const getAllPermissions = async (): Promise<EntityResponse<string[]>> => {

    const response = await axios.get<EntityResponse<string[]>>(`${AUTH_API}/permissions`);
    return response.data;
};

// Read all
export const createAdminAcount = async (data: CreateAdminModel): Promise<EntityResponse<string[]>> => {

    const response = await axios.post<EntityResponse<string[]>>(`${AUTH_API}/signup`, data);
    return response.data;
};
export const updateAdminAcount = async (data: CreateAdminModel): Promise<EntityResponse<string[]>> => {

    const response = await axios.patch<EntityResponse<string[]>>(`${AUTH_API}/${data._id}`, data);
    return response.data;
};

// RefreshToken
export const refreshTokenAccount = async (formData: FormData): Promise<ModifyRecordResponse<RefreshToken>> => {
    const response = await axios.post<ModifyRecordResponse<RefreshToken>>(`${AUTH_API}/refresh-token`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Đặt header cho form-data
        },
    });
    return response.data;
};