import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getLoanSlipWaiting } from "../../../../../store/slices/loanSlip";
import axios from "../../../../../utils/axios";

export const useUpdateLoanSlip = () => {

  const [isUpdate, setUpdate] = useState(false);

  const hanldUpdateLoanSlip = useCallback(async (data, payDay, valueProduct, isActive) => {

    let newProduct: any = []

    let newProductDetail = [{
      detailLoanSlipId: '',
      supplyId: ''
    }]

    // valueProduct.forEach((item: any) =>
    //   newProduct.push(item.id)
    // );
    valueProduct.forEach((item: any) => {
      if (item.idv2 !== null) {
        newProductDetail.push({
          detailLoanSlipId: item.id,
          supplyId: item.idv2
        })
      }else{
        newProductDetail.push({
          detailLoanSlipId: item.id,
          supplyId: ''
        })
      }
    }
    );

    const dataSubmit = {
      return_at: isActive === 'true' ? new Date() : payDay === '' ? data?.return_at : new Date(payDay),
      name: data.name,
      numberPhone: data.numberPhone,
      loanSlipNumber: data.loanSlipNumber,
      // supplyId: newProductDetail.slice(1),
      state: isActive === 'true' ? true : false
    }


    await axios.patch(USER_API.LoanSlip, dataSubmit);
    try {
      setUpdate(true)
      dispatch(getLoanSlipWaiting());
    } catch (e) {
      setUpdate(false)
    } finally {
      setUpdate(false)
    }
  }, [])


  return { hanldUpdateLoanSlip, isUpdate }
}
