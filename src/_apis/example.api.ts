import { EntityResponse } from '../interfaces/entityResponse';
import { CreateExampleModel, Example } from '../interfaces/example';
import axios from '../utils/axios';

const Example_API = '/Example';

// Create
export const createExample = async (example: CreateExampleModel): Promise<EntityResponse<Example>> => {
    const response = await axios.post<EntityResponse<Example>>(Example_API, example);
    return response.data;
};

// Read all
export const getAllExamples = async (page?: number, take?: number, search?: string, order: string = "ASC"): Promise<EntityResponse<Example[]>> => {
    let url = `${Example_API}?order=${order}`;

    if (page !== undefined && take !== undefined) {
        url += `&page=${page}&take=${take}`;
    }
    const response = await axios.get<EntityResponse<Example[]>>(url);
    return response.data;
};

// Read by ID
export const getExampleById = async (id: number): Promise<EntityResponse<Example>> => {
    const response = await axios.get<EntityResponse<Example>>(`${Example_API}/${id}`);
    return response.data;
};

// Update
export const updateExample = async (id: number, example: Example): Promise<EntityResponse<Example>> => {
    const response = await axios.put<EntityResponse<Example>>(`${Example_API}/${id}`, example);
    return response.data;
};

// Delete
export const deleteExample = async (id: number): Promise<EntityResponse<null>> => {
    const response = await axios.delete<EntityResponse<null>>(`${Example_API}/${id}`);
    return response.data;
};
