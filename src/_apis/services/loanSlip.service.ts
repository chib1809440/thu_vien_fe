import { TApiMultipleRecords, TApiOneRecord } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import { CreatePublication } from "../../types/models/loanSlip.type";
import BaseApi from "./base-api";

class LoanSlipService extends BaseApi {
    public async approvalLoanSlip<DynamicType>(id: string | number, params?: TFilter) {
        const httpClientInstance = this.getHttpClient();
        const response = await httpClientInstance.get(`${this.endpoint}/approval/${id}`, { params });
        return response.data as TApiOneRecord<DynamicType>;
    }
    public async returnLoanSlip<DynamicType>(id: string | number, publications: CreatePublication[], params?: TFilter) {
        const httpClientInstance = this.getHttpClient();
        const response = await httpClientInstance.patch(`${this.endpoint}/return/${id}`, { publications });
        return response.data as TApiOneRecord<DynamicType>;
    }
    public async getAllFilterByDate<DynamicType>(params?: TFilter) {
        const httpClientInstance = this.getHttpClient();
        const response = await httpClientInstance.get(`${this.endpoint}/filter-date`, {
            params,
        });
        return response.data as TApiMultipleRecords<DynamicType>;
    }
}

const loanSlipService = new LoanSlipService("/loan-slip");

export default loanSlipService;