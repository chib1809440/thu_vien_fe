import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getLoanSlipWaiting } from "../../../../../store/slices/loanSlip";
import axios from "../../../../../utils/axios";

export const useExtendLoanSlip = () => {

  const [isExtend, setExtend] = useState(false);

  const hanldExtendLoanSlip = useCallback(async (data, payDay, valueProduct, isActive) => {

    let newProduct: any = []

    valueProduct.forEach((item: any) =>
      newProduct.push(item.id)
    );
    const dataSubmit = {
      return_date: payDay === '' ? data?.return_at : new Date(payDay),
      return_at: payDay === '' ? data?.return_at : new Date(payDay),
      supplyId: newProduct,
      loanSlipNumber: data.loanSlipNumber,
    }

    await axios.patch(USER_API.LoanSlip, dataSubmit);
    try {
      setExtend(true)
      dispatch(getLoanSlipWaiting());
    } catch (e) {
      setExtend(false)
    } finally {
      setExtend(false)
    }
  }, [])


  return { hanldExtendLoanSlip, isExtend }
}
