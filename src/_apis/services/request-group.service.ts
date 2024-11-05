import { TApiModifyRecord, TApiMultipleRecords } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import BaseApi from "./base-api";

class RequestGroupService extends BaseApi {
    public async getAllRequestGroupFromAdmin<DynamicType>(params?: TFilter) {
        const response = await this.httpClient.get(`${this.endpoint}/admin`, {
            params,
        });
        return response.data as TApiMultipleRecords<DynamicType>;
    }

    public async requestGroup(groupId: string) {
        const response = await this.httpClient.post(`${this.endpoint}`, { groupId });
        return response.data as TApiModifyRecord<any>;
    }
}

const requestGroupService = new RequestGroupService("/request-group");

export default requestGroupService;