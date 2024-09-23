import { useCallback, useState } from "react";
import { USER_API } from "../../../../_apis/api-endpoint";
import { dispatch } from "../../../../store";
import { getLoanSlipWaiting } from "../../../../store/slices/loanSlip";
import axios from "../../../../utils/axios";
import { openSnackbar } from "../../../../store/slices/snackbar";

export const useCreateLoanSlip = () => {

  const [isCre, setCre] = useState(false);
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
      quantity: 1,
      note: data.note
    }
    setCre(false)

    const reponse = await axios.post(USER_API.LoanSlip, dataSubmit);
    try {
      if (reponse.status === 200 || reponse.status === 201) {
        setCre(true)
        dispatch(getLoanSlipWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Mượn thành công',
          variant: 'alert',
          alert: {
            color: 'info'
          },
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          close: true,
          autoHideDuration: 100,
          transition: 'SlideLeft'
        }))
      } else {
        dispatch(openSnackbar({
          open: true,
          message: 'Mượn thất bại',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          close: true,
          autoHideDuration: 100,
          transition: 'SlideLeft'
        }))
      }

    } catch (e) {
      dispatch(openSnackbar({
        open: true,
        message: 'Mượn thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
      setCre(false)
    } finally {
      setCre(false)
    }
  }, [])

  const [isMuonlai, setMuonlai] = useState(false);

  const hanldMuonlaiLoanSlip = useCallback(async (data, payDay) => {

    let newProduct: any = []

    data.data?.supplies.forEach((item: any, index) =>
      newProduct.push({
        supplyId: item?.supply?.supplyId,
        qty: item?.qty,
      })
    );

    const dataSubmitV2 = {
      create_at: new Date(),
      return_at: payDay !== '' ? payDay : new Date(Date.now() + (3600 * 1000 * 24)),
      limited_date: '',
      creator_id: idCreater,
      userID: data?.data?.users?.userID,
      supplies: newProduct,
      note: data.note
    }
    setMuonlai(false)
    const reponse = await axios.post(USER_API.LoanSlip, dataSubmitV2);
    try {
      if (reponse.status === 200 || reponse.status === 201) {

        setMuonlai(true)
        dispatch(getLoanSlipWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Mượn lại thành công',
          variant: 'alert',
          alert: {
            color: 'info'
          },
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          close: true,
          autoHideDuration: 100,
          transition: 'SlideLeft'
        }))
      } else {
        dispatch(openSnackbar({
          open: true,
          message: 'Mượn lại thất bại',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          close: true,
          autoHideDuration: 100,
          transition: 'SlideLeft'
        }))
      }
    } catch (e) {
      dispatch(openSnackbar({
        open: true,
        message: 'Mượn lại thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
      setMuonlai(false)
    } finally {
    }
  }, [])


  return { hanldCreateLoanSlip, isCre, hanldMuonlaiLoanSlip, isMuonlai }
}
