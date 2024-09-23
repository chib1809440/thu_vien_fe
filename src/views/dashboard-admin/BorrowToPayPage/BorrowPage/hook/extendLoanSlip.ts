import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getLoanSlipWaiting } from "../../../../../store/slices/loanSlip";
import axios from "../../../../../utils/axios";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useExtendLoanSlip = () => {

  const [isExtend, setExtend] = useState(false);

  const hanldExtendLoanSlip = useCallback(async (data, payDay, valueProduct, isActive) => {

    let newProduct: any = [{
      supplyId: ''
    }]

    valueProduct.forEach((item: any) =>
      newProduct.push({
        supplyId: item.id
      })
    );
    const dataSubmit = {
      // return_date: payDay === '' ? data?.return_at : new Date(payDay),
      limited_date: payDay === '' ? data?.return_at : new Date(payDay),
      loanSlipNumber: data.loanSlipNumber,
      note: data.note,
    }

    await axios.patch(USER_API.LoanSlip, dataSubmit);
    try {
      setExtend(true)
      dispatch(getLoanSlipWaiting());
      dispatch(openSnackbar({
        open: true,
        message: 'Gia hạn phiếu mượn thành công',
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
        message: 'Gia hạn phiếu mượn thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
      setExtend(false)
    } finally {
      setExtend(false)
    }
  }, [])


  return { hanldExtendLoanSlip, isExtend }
}
