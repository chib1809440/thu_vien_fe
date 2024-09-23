import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getGroupPowerWaiting } from "../../../../../store/slices/groupPower";
import axios from "../../../../../utils/axios";

export const useCreateGroupPower = () =>{

    const [isSubmit, setSubmit] = useState(false);
    
    const hanldCreateGroupPower = useCallback(async (data) => {
     await axios.post(USER_API.Group, data);
        try {
          setSubmit(true)
          dispatch(getGroupPowerWaiting());
            
        } catch (e) {
          setSubmit(false)
          
        } finally {
        }
      }, [])


    return { hanldCreateGroupPower, isSubmit }
}
