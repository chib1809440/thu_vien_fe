import { EntityResponse } from '../interfaces/entityResponse';
import { CreateExampleModel, Example } from '../interfaces/example';
import axios from '../utils/axios';

const Example_API = '/example';

// Create
export const createExample = async (example: CreateExampleModel): Promise<EntityResponse<Example>> => {
    const response = await axios.post<EntityResponse<Example>>(Example_API, example);
    return response.data;
};

// Read all
export const getAllExamples = async (page?: number, limit?: number, search?: string, order: string = "ASC"): Promise<EntityResponse<Example[]>> => {
    let url = `${Example_API}?order=${order}`;
    if (search && page != 1) {
        return;
    }
    if (page !== undefined && limit !== undefined) {
        url += `&page=${page}&limit=${limit}`;
    }
    if (search && search.trim() !== '') {
        url += `&search=${encodeURIComponent(search.trim())}`;
    }
    const response = await axios.get<EntityResponse<Example[]>>(url);
    return response.data;
};

// Read by ID
export const getExampleById = async (id: string): Promise<EntityResponse<Example>> => {
    const response = await axios.get<EntityResponse<Example>>(`${Example_API}/${id}`);
    return response.data;
};

// Update
export const updateExample = async (id: string, example: Example): Promise<EntityResponse<Example>> => {
    const response = await axios.patch<EntityResponse<Example>>(`${Example_API}/${id}`, example);
    return response.data;
};

// Delete
export const deleteExample = async (id: string): Promise<EntityResponse<Example>> => {
    const response = await axios.delete<EntityResponse<Example>>(`${Example_API}/${id}`);
    return response.data;
};
