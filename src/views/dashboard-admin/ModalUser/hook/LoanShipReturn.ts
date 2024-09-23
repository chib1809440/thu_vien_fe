import { useCallback, useState } from "react";
import { USER_API } from "../../../../_apis/api-endpoint";
import { dispatch } from "../../../../store";
import { getLoanSlipWaiting } from "../../../../store/slices/loanSlip";
import axios from "../../../../utils/axios";
import { openSnackbar } from "../../../../store/slices/snackbar";

export const useReturnLoanSlip = () => {

  const [isReturn, setReturn] = useState(false);
  const [isExtend, setExtend] = useState(false);

  const hanldReturnLoanSlip = useCallback(async (loanSlipNumber) => {
    setReturn(false)
    const dataSubmit = {
      loanSlipNumber: loanSlipNumber?.loanSlipNumber,
      return_at: new Date(),
      state: true
    }

    await axios.patch(USER_API.LoanSlip, dataSubmit);
    try {
      setReturn(true)
      dispatch(getLoanSlipWaiting());
      dispatch(openSnackbar({
        open: true,
        message: 'Trả thành công',
        variant: 'alert',
        alert: {
          color: 'info'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
    } catch (e) {
      dispatch(openSnackbar({
        open: true,
        message: 'Trả thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
      setReturn(false)
    } finally {
      setReturn(false)
    }
  }, [])

  const hanldExtendLoanSlip = useCallback(async (data, payDay) => {
    setExtend(false)

    let newSupply: any = [];

    let newProduct: any = [{
      supplyId: ''
    }];

    data?.loanSlipNumber?.supplies.forEach((item: any) => {
      newSupply.push(item)
    });

    newSupply.forEach((item: any) => {
      newProduct.push({
        supplyId: item?.supply?.supplyId
      })
    });

    const dataSubmit = {
      loanSlipNumber: data?.loanSlipNumber.loanSlipNumber,
      return_date: payDay === '' ? data?.loanSlipNumber?.return_at : new Date(payDay),
      return_at: payDay === '' ? data?.loanSlipNumber?.return_at : new Date(payDay),
      supplyId: newProduct.slice(1)
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

  return { hanldReturnLoanSlip, isReturn, hanldExtendLoanSlip, isExtend }
}
