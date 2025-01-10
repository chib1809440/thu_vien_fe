import { TApiModifyRecord, TApiMultipleRecords } from "../../types/api/api.type";
import BaseApi from "./base-api";

class LiquidationService extends BaseApi {
    public async confirmSignature<DynamicType>(id: string) {
        const response = await this.httpClient.patch(`${this.endpoint}/signature/${id}`);
        return response.data as TApiMultipleRecords<DynamicType>;;
    }
    public async upLoadFile(file: File, id: string) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("update", "1");
    
        const response = await this.httpClient.patch(`${this.endpoint}/upload/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    
        return response.data as TApiModifyRecord<any>;
    }
}

const liquidationService = new LiquidationService("/liquidation");

export default liquidationService;