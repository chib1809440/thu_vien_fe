import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getCabinetWaiting } from "../../../../../store/slices/cabinet";
import axios from "../../../../../utils/axios";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useUpdateTypeProduct = () => {

  const [isUpdate, setUpdate] = useState(false);

  const hanldUpdateTypeProduct = useCallback(async (data) => {
    setUpdate(false)
    const dataSubmit = {
      cabinetId: data.cabinetId,
      position: data.position,
      description: data.description,
    }
    const response = await axios.patch(USER_API.Cabinet, dataSubmit);
    try {
      if (response.status === 200 || response.status === 201) {
        setUpdate(true)
        dispatch(getCabinetWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Cập nhật tủ - kệ thành công',
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
          message: 'Cập nhật tủ - kệ thất bại',
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
        message: 'Cập nhật tủ - kệ thất bại',
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


  return { hanldUpdateTypeProduct, isUpdate }
}
