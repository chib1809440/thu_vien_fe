import { TApiModifyRecord, TApiMultipleRecords } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import BaseApi from "./base-api";

class CategoryService extends BaseApi {
    public async getAllLink<DynamicType>(params?: TFilter) {
        const response = await this.httpClient.get(`${this.endpoint}/link`, {
            params,
        });
        return response.data as TApiMultipleRecords<DynamicType>;
    }

    public async createPullLink<DynamicType>(data: { ids: string[], note: string, isPublic: boolean }) {
        const response = await this.httpClient.post(`${this.endpoint}/pull-link`, data);

        return response.data as TApiModifyRecord<DynamicType>;
    }
}

const categoryService = new CategoryService("/category");

export default categoryService;