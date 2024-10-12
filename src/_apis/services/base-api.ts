import { AxiosInstance } from "axios";
import { TApiModifyRecord, TApiMultipleRecords, TApiOneRecord } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import axiosServices from "../../utils/axios";

class BaseApi {
    private _endpoint: string = "";
    private _httpClient: AxiosInstance;

    constructor(endpoint: string) {
        this._endpoint = endpoint;
        this._httpClient = axiosServices;
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

    public async create<DynamicPayload, DynamicResponse>(
        payload: DynamicPayload,
        isWithFormData: boolean = false
    ) {
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
                if (typeof payload[key] === "object") {
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
                if (payload[key] === null) {
                    formData.append(key, "");
                    return;
                }

                // check is undefined
                if (payload[key] === undefined) {
                    formData.append(key, "");
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

            const response = await this.httpClient.post(this.endpoint, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data as TApiModifyRecord<DynamicResponse>;
        }

        const response = await this.httpClient.post(this.endpoint, payload);
        return response.data as TApiModifyRecord<DynamicResponse>;
    }

    public async delete<DynamicType>(id: string | number) {
        const response = await this.httpClient.delete(`${this.endpoint}/${id}`);
        return response.data as TApiModifyRecord<DynamicType>;
    }

    public async update<DynamicPayload, DynamicResponse>(
        payload: DynamicPayload,
        id: string | number,
        isWithFormData: boolean = false
    ) {
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
                if (typeof payload[key] === "object") {
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
                if (payload[key] === null) {
                    formData.append(key, "");
                    return;
                }

                // check is undefined
                if (payload[key] === undefined) {
                    formData.append(key, "");
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

            const response = await this.httpClient.patch(`${this.endpoint}/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data as TApiModifyRecord<DynamicResponse>;
        }

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

    public async restore<DynamicPayload, DynamicResponse>(id: string | number) {
        const response = await this.httpClient.patch(`${this.endpoint}/restore/${id}`);
        return response.data as TApiModifyRecord<DynamicResponse>;
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

    get httpClient() {
        return this._httpClient;
    }
}

export default BaseApi;