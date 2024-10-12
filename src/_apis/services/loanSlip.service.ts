import { TApiOneRecord } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import BaseApi from "./base-api";

class LoanSlipService extends BaseApi {
    public async approvalLoanSlip<DynamicType>(id: string | number, params?: TFilter) {
        const httpClientInstance = this.getHttpClient();
        const response = await httpClientInstance.get(`${this.endpoint}/approval/${id}`, { params });
        return response.data as TApiOneRecord<DynamicType>;
    }
    public async returnLoanSlip<DynamicType>(id: string | number, params?: TFilter) {
        const httpClientInstance = this.getHttpClient();
        const response = await httpClientInstance.get(`${this.endpoint}/return/${id}`, { params });
        return response.data as TApiOneRecord<DynamicType>;
    }
}

const loanSlipService = new LoanSlipService("/loan-slip");

export default loanSlipService;