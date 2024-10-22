import { TApiMultipleRecords } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import BaseApi from "./base-api";

class MaterialService extends BaseApi {
    public async getAllLink<DynamicType>(params?: TFilter) {
        const response = await this.httpClient.get(`${this.endpoint}/link`, {
            params,
        });
        return response.data as TApiMultipleRecords<DynamicType>;
    }
 }

const materialService = new MaterialService("/material");

export default materialService;