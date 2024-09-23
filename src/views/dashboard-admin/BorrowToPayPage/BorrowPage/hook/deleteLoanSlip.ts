import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getLoanSlipWaiting } from "../../../../../store/slices/loanSlip";
import { openSnackbar } from "../../../../../store/slices/snackbar";
import axios from "../../../../../utils/axios";

export const useDeleteLoanSlip = () => {

  const [isDelete, setDelete] = useState(false);

  const hanldDeleteLoanSlip = useCallback(async (LoanSlipID) => {

    await axios.delete(USER_API.LoanSlip, { data: { "loanSlipNumber": LoanSlipID } });
    try {
      setDelete(true)
      dispatch(getLoanSlipWaiting());
      dispatch(openSnackbar({
        open: true,
        message: 'Xoá phiếu mượn thành công',
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
        message: 'Xoá phiếu mượn thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
      setDelete(false)
    } finally {
    }
  }, [])


  return { hanldDeleteLoanSlip, isDelete }
}
