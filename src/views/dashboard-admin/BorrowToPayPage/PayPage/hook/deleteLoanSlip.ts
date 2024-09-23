import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getGroupPowerWaiting } from "../../../../../store/slices/groupPower";
import axios from "../../../../../utils/axios";
import { getLoanSlipWaiting } from "../../../../../store/slices/loanSlip";

export const useDeleteLoanSlip = () =>{

    const [isDelete, setDelete] = useState(false);
    
    const hanldDeleteLoanSlip = useCallback(async (LoanSlipID) => {
      
      await axios.delete(USER_API.LoanSlip, {data: {"loanSlipNumber": LoanSlipID}});
        try {
          setDelete(true)
          dispatch(getLoanSlipWaiting());
            
        } catch (e) {
          setDelete(false)
        } finally {
          dispatch(getLoanSlipWaiting());
        }
      }, [])


    return { hanldDeleteLoanSlip, isDelete }
}
