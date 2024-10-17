import { TApiOneRecord } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import BaseApi from "./base-api";

class StatisticalService extends BaseApi {
    // Methods
    public async getStatistical<DynamicType>(params?: TFilter) {
        const response = await this.httpClient.get(this.endpoint, {
            params,
        });
        return response.data as TApiOneRecord<DynamicType>;
    }
}

const statisticalService = new StatisticalService("/statistical");

export default statisticalService;