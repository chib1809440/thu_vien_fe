import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import axios from "../../../../../utils/axios";
import { getCategoryWaiting } from "../../../../../store/slices/category";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useUpdateTypeProduct = () => {

  const [isUpdate, setUpdate] = useState(false);

  const hanldUpdateTypeProduct = useCallback(async (data) => {
    setUpdate(false)

    const dataSubmit = {
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      categoryDescription: data.categoryDescription,
    }

    const reponse = await axios.patch(USER_API.Category, dataSubmit);
    try {
      if (reponse.status === 200 || reponse.status === 201) {

        setUpdate(true)
        dispatch(getCategoryWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Cập nhật dạng học liệu thành công',
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
          message: 'Cập nhật dạng học liệu thất bại',
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
        message: 'Cập nhật dạng học liệu thất bại',
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
