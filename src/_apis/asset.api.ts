import { EntityResponse } from '../interfaces/entityResponse';
import { CreateAssetModel, Asset } from '../interfaces/asset';
import axios from '../utils/axios';

const Asset_API = '/asset';

// Create
export const createAsset = async (asset: CreateAssetModel): Promise<EntityResponse<Asset>> => {
    const response = await axios.post<EntityResponse<Asset>>(Asset_API, asset);
    return response.data;
};

// Read all
export const getAllAssets = async (page?: number, limit?: number, search?: string, order: string = "ASC"): Promise<EntityResponse<Asset[]>> => {
    let url = `${Asset_API}?order=${order}`;

    if (page !== undefined && limit !== undefined) {
        url += `&page=${page}&limit=${limit}`;
    }
    if (search && search.trim() !== '') {
        url += `&search=${encodeURIComponent(search.trim())}`;
    }
    const response = await axios.get<EntityResponse<Asset[]>>(url);
    return response.data;
};

// Read by ID
export const getAssetById = async (id: string): Promise<EntityResponse<Asset>> => {
    const response = await axios.get<EntityResponse<Asset>>(`${Asset_API}/${id}`);
    return response.data;
};

// Update
export const updateAsset = async (id: string, asset: Asset): Promise<EntityResponse<Asset>> => {
    const response = await axios.patch<EntityResponse<Asset>>(`${Asset_API}/${id}`, asset);
    return response.data;
};

// Delete
export const deleteAsset = async (id: string): Promise<EntityResponse<Asset>> => {
    const response = await axios.delete<EntityResponse<Asset>>(`${Asset_API}/${id}`);
    return response.data;
};
export const deleteAssetSelected = async (ids: string[]): Promise<EntityResponse<Asset>> => {
    const response = await axios.delete<EntityResponse<Asset>>(`${Asset_API}/selected`, {
        data: ids,  // Use `data` to send the body with axios.delete
    });
    return response.data;
};