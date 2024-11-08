import { TApiMultipleRecords, TApiOneRecord } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import { CreatePublication } from "../../types/models/loanSlip.type";
import BaseApi from "./base-api";

class LoanSlipService extends BaseApi {
    public async approvalLoanSlip<DynamicType>(id: string | number, params?: TFilter) {
        const httpClientInstance = this.getHttpClient();
        const response = await httpClientInstance.patch(`${this.endpoint}/approval/${id}`, { params });
        return response.data as TApiOneRecord<DynamicType>;
    }
    public async cancelLoanSlip<DynamicType>(id: string | number, params?: TFilter) {
        const httpClientInstance = this.getHttpClient();
        const response = await httpClientInstance.patch(`${this.endpoint}/cancel/${id}`, { params });
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
    public async getAllLink<DynamicType>(params?: TFilter) {
        const response = await this.httpClient.get(`${this.endpoint}/link`, {
            params,
        });
        return response.data as TApiMultipleRecords<DynamicType>;
    }
    public async getAllRequestLink<DynamicType>(params?: TFilter) {
        const response = await this.httpClient.get(`${this.endpoint}/request-link`, {
            params,
        });
        return response.data as TApiMultipleRecords<DynamicType>;
    }
}

const loanSlipService = new LoanSlipService("/loan-slip");

export default loanSlipService;