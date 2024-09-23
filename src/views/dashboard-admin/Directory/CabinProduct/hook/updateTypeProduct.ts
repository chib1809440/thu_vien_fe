import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getSuppliesWaiting } from "../../../../../store/slices/supplies";
import axios from "../../../../../utils/axios";
import { getStateOfBookWaiting } from "../../../../../store/slices/stateOfBook";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useUpdateTypeProduct = () => {

  const [isUpdate, setUpdate] = useState(false);

  const hanldUpdateTypeProduct = useCallback(async (data, cabinetId, quantityCabin) => {

    const dataSubmitV2 = {
      supplies: [
        {
          supplyId: data.supplyId,
          cabinet_quantity: quantityCabin,
        }
      ],
      cabinetId: cabinetId.id
    }

    const reponse = await axios.patch(USER_API.SuppliesV2, dataSubmitV2);
    try {
      if (reponse.status === 200 || reponse.status === 201) {
        setUpdate(true)
        dispatch(getSuppliesWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Cập nhật thành công',
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
          message: 'Cập nhật thất bại',
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
        message: 'Cập nhật thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
      setUpdate(false)
    } finally {
      setUpdate(false)
    }
  }, [])

  const hanldUpdateStateOfBook = useCallback(async (data, quantityCabin, state) => {

    const dataSubmit = {
      supplyId: data.supplyId,
      state: state === '2' ? 'LIQUIDATED' : 'DAMAGED',
      qty: quantityCabin.toString(),
      note: '',
    }

    const reponse = await axios.post(USER_API.StateOfBook, dataSubmit);
    try {
      if (reponse.status === 200 || reponse.status === 201) {
        setUpdate(true)
        dispatch(getSuppliesWaiting());
        dispatch(getStateOfBookWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Cập nhật thành công',
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
          message: 'Cập nhật thất bại',
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
        message: 'Cập nhật thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
      setUpdate(false)
    } finally {
      setUpdate(false)
    }
  }, [])


  return { hanldUpdateTypeProduct, isUpdate, hanldUpdateStateOfBook }
}
