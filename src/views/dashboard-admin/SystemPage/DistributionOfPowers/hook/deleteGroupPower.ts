import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getGroupPowerWaiting } from "../../../../../store/slices/groupPower";
import axios from "../../../../../utils/axios";

export const useDeleteGroupPower = () =>{

    const [isDelete, setDelete] = useState(false);
    
    const hanldDeleteGroupPower = useCallback(async (GroupPowerID) => {
      
      await axios.delete(USER_API.Group, {data: {"groupId": GroupPowerID}});
        try {
          setDelete(true)
          dispatch(getGroupPowerWaiting());
            
        } catch (e) {
          setDelete(false)
        } finally {
        }
      }, [])


    return { hanldDeleteGroupPower, isDelete }
}
