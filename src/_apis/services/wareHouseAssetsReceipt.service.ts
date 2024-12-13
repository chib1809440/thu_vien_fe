import { TApiOneRecord } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import BaseApi from "./base-api";

class WareHouseAssetsReceiptService extends BaseApi {
    public async acceptWareHouseAssetsReceipt<DynamicType>(id: string | number, params?: TFilter) {
        const httpClientInstance = this.getHttpClient();
        const response = await httpClientInstance.get(`${this.endpoint}/accept/${id}`, { params });
        return response.data as TApiOneRecord<DynamicType>;
    }

}

const warehouseAssetsReceiptService = new WareHouseAssetsReceiptService("/warehouse-assets-receipt");

export default warehouseAssetsReceiptService;