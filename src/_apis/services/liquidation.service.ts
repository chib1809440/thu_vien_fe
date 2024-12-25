import { TApiModifyRecord, TApiMultipleRecords } from "../../types/api/api.type";
import BaseApi from "./base-api";

class LiquidationService extends BaseApi {
    public async confirmSignature<DynamicType>(id: string) {
        const response = await this.httpClient.patch(`${this.endpoint}/signature/${id}`);
        return response.data as TApiMultipleRecords<DynamicType>;;
    }
    public async upLoadFile<DynamicPayload, DynamicResponse>(payload: DynamicPayload, id: string) {
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
            if (typeof payload[key] === "object" && payload[key] !== null) {
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
            if (
                payload[key] === null ||
                payload[key] === undefined ||
                payload[key] === "" ||
                typeof payload[key] === "undefined"
            ) {
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

        const response = await this.httpClient.patch(`${this.endpoint}/upload/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data as TApiModifyRecord<DynamicResponse>;
    }
}

const liquidationService = new LiquidationService("/liquidation");

export default liquidationService;