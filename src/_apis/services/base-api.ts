import { AxiosInstance } from "axios";
import { TApiModifyRecord, TApiMultipleRecords, TApiOneRecord } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import axiosServices from "../../utils/axios";

class BaseApi {
    private _endpoint: string = "";
    private httpClient: AxiosInstance;

    constructor(endpoint: string) {
        this._endpoint = endpoint;
        this.httpClient = axiosServices;
    }
    // Getter method to access httpClient
    public getHttpClient(): AxiosInstance {
        return this.httpClient;
    }
    // Methods
    public async getAll<DynamicType>(params?: TFilter) {
        const response = await this.httpClient.get(this.endpoint, {
            params,
        });
        return response.data as TApiMultipleRecords<DynamicType>;
    }

    public async getById<DynamicType>(id: string | number, params?: TFilter) {
        const response = await this.httpClient.get(`${this.endpoint}/${id}`, { params });
        return response.data as TApiOneRecord<DynamicType>;
    }

    public async create<DynamicPayload, DynamicResponse>(payload: DynamicPayload) {
        const response = await this.httpClient.post(this.endpoint, payload);
        return response.data as TApiModifyRecord<DynamicResponse>;
    }

    public async delete<DynamicType>(id: string | number) {
        const response = await this.httpClient.delete(`${this.endpoint}/${id}`);
        return response.data as TApiModifyRecord<DynamicType>;
    }

    public async update<DynamicPayload, DynamicResponse>(
        payload: DynamicPayload,
        id: string | number
    ) {
        const response = await this.httpClient.patch(`${this.endpoint}/${id}`, payload);
        return response.data as TApiModifyRecord<DynamicResponse>;
    }

    public async deleteMultiple<DynamicType>(ids: string[]) {
        const response = await this.httpClient.delete(`${this.endpoint}/selected`, {
            data: ids,
        });
        return response.data as TApiModifyRecord<DynamicType>;
    }

    // soft delete methods
    public async getAllDeleted<DynamicType>(params?: TFilter) {
        const response = await this.httpClient.get(`${this.endpoint}/deleted`, {
            params,
        });
        return response.data as TApiMultipleRecords<DynamicType>;
    }

    public async getByIdDeleted<DynamicType>(id: string | number, params?: TFilter) {
        const response = await this.httpClient.get(`${this.endpoint}/deleted/${id}`, { params });
        return response.data as TApiOneRecord<DynamicType>;
    }

    public async softDelete<DynamicType>(id: string | number) {
        const response = await this.httpClient.delete(`${this.endpoint}/soft/${id}`);
        return response.data as TApiModifyRecord<DynamicType>;
    }

    public async softDeleteMultiple<DynamicType>(ids: string[]) {
        const response = await this.httpClient.delete(`${this.endpoint}/soft/selected`, {
            data: ids,
        });
        return response.data as TApiModifyRecord<DynamicType>;
    }

    public async restore<DynamicType>(id: string | number) {
        const response = await this.httpClient.patch(`${this.endpoint}/restore/${id}`);
        return response.data as TApiModifyRecord<DynamicType>;
    }

    public async restoreMany<DynamicType>(ids: string[]) {
        const response = await this.httpClient.patch(`${this.endpoint}/restore`, ids);

        return response.data as TApiModifyRecord<DynamicType>;
    }

    // Setter and Getter
    get endpoint() {
        return this._endpoint;
    }

    set endpoint(endpoint: string) {
        this._endpoint = endpoint;
    }
}

export default BaseApi;