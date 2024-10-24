import { TApiMultipleRecords } from "../../types/api/api.type";
import { TFilter } from "../../types/models/entity-common.type";
import BaseApi from "./base-api";

class GroupService extends BaseApi {
    public async getAllLibrariesFromGroup<DynamicType>(params?: TFilter) {
        const response = await this.httpClient.get(`${this.endpoint}/libraries`, {
            params,
        });
        return response.data as TApiMultipleRecords<DynamicType>;
    }
}

const groupService = new GroupService("/group");

export default groupService;