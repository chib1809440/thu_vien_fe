import { TApiOneRecord } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import BaseApi from "./base-api";

class WareHouseReceiptService extends BaseApi {
    public async acceptWareHouseReceipt<DynamicType>(id: string | number, params?: TFilter) {
        const httpClientInstance = this.getHttpClient();
        const response = await httpClientInstance.get(`${this.endpoint}/accept/${id}`, { params });
        return response.data as TApiOneRecord<DynamicType>;
    }

}

const warehouseReceiptService = new WareHouseReceiptService("/warehouse-receipt");

export default warehouseReceiptService;