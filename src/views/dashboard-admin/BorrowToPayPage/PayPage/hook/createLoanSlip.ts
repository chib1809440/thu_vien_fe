import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getLoanSlipWaiting } from "../../../../../store/slices/loanSlip";
import axios from "../../../../../utils/axios";

export const useCreateLoanSlip = () => {

  const [isSubmit, setSubmit] = useState(false);
  const idCreater = localStorage.getItem('userID')
  const hanldCreateLoanSlip = useCallback(async (data, payDay, valueProduct) => {



    let newProduct: any = []

    valueProduct.forEach((item: any) =>
      newProduct.push(item.id)
    );
    const dataSubmit = {
      create_at: new Date(),
      return_at: payDay !== '' ? payDay : new Date(Date.now() + (3600 * 1000 * 24)),
      creator_id: idCreater,
      name: data.name,
      numberPhone: data.numberPhone,
      supplyId: newProduct,
      quantity: 1
    }
    setSubmit(false)
    const reponse = await axios.post(USER_API.LoanSlip, dataSubmit);
    try {
      setSubmit(true)
      dispatch(getLoanSlipWaiting());
    } catch (e) {
      setSubmit(false)
    } finally {
    }
  }, [])


  return { hanldCreateLoanSlip, isSubmit }
}
