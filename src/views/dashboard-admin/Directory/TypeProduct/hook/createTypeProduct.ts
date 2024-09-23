import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import axios from "../../../../../utils/axios";
import { getCategoryWaiting } from "../../../../../store/slices/category";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useCreateTypeProduct = () => {

  const [isSubmit, setSubmit] = useState(false);
  const hanldCreateTypeProduct = useCallback(async (data) => {
    const dataSubmit = {
      categoryName: data.categoryName,
      categoryDescription: data.categoryDescription,
    }
    setSubmit(false)

    const reponse = await axios.post(USER_API.Category, dataSubmit);

    try {
      if (reponse.status === 200 || reponse.status === 201) {
        setSubmit(true)
        dispatch(getCategoryWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Thêm dạng học liệu thành công',
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
          message: 'Thêm dạng học liệu thất bại',
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
        message: 'Thêm dạng học liệu thất bại',
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


  return { hanldCreateTypeProduct, isSubmit }
}
