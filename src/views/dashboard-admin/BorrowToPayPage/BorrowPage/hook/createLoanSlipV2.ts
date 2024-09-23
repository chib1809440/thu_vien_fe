import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getLoanSlipWaiting } from "../../../../../store/slices/loanSlip";
import axios from "../../../../../utils/axios";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useCreateLoanSlipV2 = () => {

  const [isSubmit, setSubmit] = useState(false);
  const idCreater = localStorage.getItem('userID')
  const hanldCreateLoanSlipV2 = useCallback(async (data, payDay, valueProduct, UsersItem, listProduct, listQuality) => {

    let newProduct: any = []

    listProduct.forEach((item: any, index) =>
      newProduct.push({
        supplyId: item,
        qty: listQuality[index],
      })
    );
    const dataSubmitV2 = {
      create_at: new Date(),
      return_at: payDay !== '' ? payDay : new Date(Date.now() + (3600 * 1000 * 24)),
      limited_date : '',
      creator_id: idCreater,
      userID: UsersItem?.id,
      supplies: newProduct,
      note: data.note
    }

    setSubmit(false)

    const reponse = await axios.post(USER_API.LoanSlip, dataSubmitV2);
    try {
      setSubmit(true)
      dispatch(getLoanSlipWaiting());
      dispatch(openSnackbar({
        open: true,
        message: 'Thêm phiếu mượn thành công',
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
        message: 'Thêm phiếu mượn thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
      setSubmit(false)
    } finally {
    }
  }, [])


  return { hanldCreateLoanSlipV2, isSubmit }
}
