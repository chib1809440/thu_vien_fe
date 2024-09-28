import { AxiosInstance } from "axios";
import { TApiModifyRecord, TApiMultipleRecords } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import axiosServices from "../../utils/axios";

axiosServices.interceptors.response.use((response) => response.data);

class BaseApi {
    private _endpoint: string = "";
    private httpClient: AxiosInstance;

    constructor(endpoint: string) {
        this._endpoint = endpoint;
        this.httpClient = axiosServices;
    }

    // Methods
    public getAll<DynamicType>(params?: TFilter) {
        return this.httpClient.get<
            TApiMultipleRecords<DynamicType>,
            TApiMultipleRecords<DynamicType>
        >(this.endpoint, {
            params,
        });
    }

    public getById<DynamicType>(id: string | number, params?: TFilter) {
        return this.httpClient.get<
            TApiMultipleRecords<DynamicType>,
            TApiMultipleRecords<DynamicType>
        >(`${this.endpoint}/${id}`, { params });
    }

    public create<DynamicPayload, DynamicResponse>(payload: DynamicPayload) {
        return this.httpClient.post<
            TApiModifyRecord<DynamicResponse>,
            TApiModifyRecord<DynamicResponse>
        >(this.endpoint, payload);
    }

    public delete<DynamicType>(id: string | number) {
        return this.httpClient.delete<TApiModifyRecord<DynamicType>, TApiModifyRecord<DynamicType>>(
            `${this.endpoint}/${id}`
        );
    }

    public update<DynamicPayload, DynamicResponse>(payload: DynamicPayload, id: string | number) {
        return this.httpClient.patch<
            TApiModifyRecord<DynamicResponse>,
            TApiModifyRecord<DynamicResponse>
        >(`${this.endpoint}/${id}`, payload);
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