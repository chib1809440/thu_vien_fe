import { TApiModifyRecord, TApiOneRecord } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import BaseApi from "./base-api";

class PublicationsService extends BaseApi {
    public async getByBarcode<DynamicType>(id: string | number, params?: TFilter) {
        const httpClientInstance = this.getHttpClient();
        const response = await httpClientInstance.get(`${this.endpoint}/barcode/${id}`, { params });
        return response.data as TApiOneRecord<DynamicType>;
    }

    public async importExcel(file: File) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await this.httpClient.post(`${this.endpoint}/import-excel`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data as TApiOneRecord<boolean>;
    }

    public async updateShelvesQuantity(data: { id: string; shelvesId: string; quantity: number }) {
        const response = await this.httpClient.patch(`${this.endpoint}/shelves-quantity`, data);
        return response.data;
    }

    public async updateStockQuantity(data: {id: string; quantity: number }) {
        const response = await this.httpClient.patch(`${this.endpoint}/move-stock`, data);
        return response.data;
    }
}

const publicationsService = new PublicationsService("/publications");

export default publicationsService;
