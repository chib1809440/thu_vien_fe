import { TApiOneRecord } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import axiosServices from "../../utils/axios";
import BaseApi from "./base-api";

class PublicationsService extends BaseApi {
    public async getByBarcode<DynamicType>(id: string | number, params?: TFilter) {
        const httpClientInstance = this.getHttpClient();
        const response = await httpClientInstance.get(`${this.endpoint}/barcode/${id}`, { params });
        return response.data as TApiOneRecord<DynamicType>;
    }
}

const publicationsService = new PublicationsService("/publications");

export default publicationsService;
