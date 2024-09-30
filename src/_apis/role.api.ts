import { EntityResponse } from '../interfaces/entityResponse';
import { CreateRoleModel, Role } from '../interfaces/role';
import axios from '../utils/axios';

const ROLE_API = '/role';

// Create
export const createRole = async (role: CreateRoleModel): Promise<EntityResponse<Role>> => {
    const response = await axios.post<EntityResponse<Role>>(ROLE_API, role);
    return response.data;
};

// Read all
export const getAllRoles = async (page?: number, limit?: number, search?: string, order: string = "ASC"): Promise<EntityResponse<Role[]>> => {
    let url = `${ROLE_API}?order=${order}`;

    if (page !== undefined && limit !== undefined) {
        url += `&page=${page}&limit=${limit}`;
    }
    if (search && search.trim() !== '') {
        url += `&search=${encodeURIComponent(search.trim())}`;
    }
    const response = await axios.get<EntityResponse<Role[]>>(url);
    return response.data;
};

// Read by ID
export const getRoleById = async (id: string): Promise<EntityResponse<Role>> => {
    const response = await axios.get<EntityResponse<Role>>(`${ROLE_API}/${id}`);
    return response.data;
};

// Update
export const updateRole = async (id: string, role: Role): Promise<EntityResponse<Role>> => {
    const response = await axios.patch<EntityResponse<Role>>(`${ROLE_API}/${id}`, role);
    return response.data;
};

// Delete
export const deleteRole = async (id: string): Promise<EntityResponse<Role>> => {
    const response = await axios.delete<EntityResponse<Role>>(`${ROLE_API}/${id}`);
    return response.data;
};
export const deleteRoleSelected = async (ids: string[]): Promise<EntityResponse<Role>> => {
    const response = await axios.delete<EntityResponse<Role>>(`${ROLE_API}/selected`, {
        data: ids,  // Use `data` to send the body with axios.delete
    });
    return response.data;
};