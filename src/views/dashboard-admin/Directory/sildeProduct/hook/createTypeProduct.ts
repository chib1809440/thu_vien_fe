import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getCabinetWaiting } from "../../../../../store/slices/cabinet";
import { openSnackbar } from "../../../../../store/slices/snackbar";
import axios from "../../../../../utils/axios";

export const useCreateTypeProduct = () => {

  const [isSubmit, setSubmit] = useState(false);
  const hanldCreateTypeProduct = useCallback(async (data) => {
    setSubmit(false)

    const dataSubmit = {
      position: data.position,
      description: data.description,
    }

    const reponse = await axios.post(USER_API.Cabinet, dataSubmit);
    try {
      if (reponse.status === 200 || reponse.status === 201) {
        setSubmit(true)
        dispatch(getCabinetWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Thêm tủ - kệ thành công',
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
          message: 'Thêm tủ - kệ thất bại',
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
        message: 'Thêm tủ - kệ thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
    } finally {
    }
  }, [])


  return { hanldCreateTypeProduct, isSubmit }
}
