import { TApiModifyRecord, TApiOneRecord } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import BaseApi from "./base-api";

class GroupService extends BaseApi {
    public async getAllLibrariesFromGroup<DynamicType>(params?: TFilter) {
        const response = await this.httpClient.get(`${this.endpoint}/libraries`, {
            params,
        });
        return response.data as TApiOneRecord<DynamicType>;
    }
    public async leaveGroup<DynamicType>() {
        const response = await this.httpClient.patch(`${this.endpoint}/leave`);
        return response.data as TApiModifyRecord<DynamicType>;
    }
}

const groupService = new GroupService("/group");

export default groupService;