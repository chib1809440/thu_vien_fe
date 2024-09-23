import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getGroupPowerWaiting } from "../../../../../store/slices/groupPower";
import axios from "../../../../../utils/axios";

export const useUpdateGroupPower = () =>{

    const [isUpdate, setUpdate] = useState(false);
    
    const hanldUpdateGroupPower = useCallback(async (data) => {
      await axios.patch(USER_API.Group, data);
        try {
          setUpdate(true)
          dispatch(getGroupPowerWaiting());
        } catch (e) {
          setUpdate(false)
        } finally {
          setUpdate(false)
        }
      }, [])


    return { hanldUpdateGroupPower, isUpdate }
}
