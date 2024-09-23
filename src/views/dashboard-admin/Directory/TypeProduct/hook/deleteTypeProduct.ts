import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import axios from "../../../../../utils/axios";
import { getCategoryWaiting } from "../../../../../store/slices/category";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useDeleteTypeProduct = () => {

  const [isDelete, setDelete] = useState(false);

  const hanldDeleteTypeProduct = useCallback(async (categoryId) => {
    setDelete(false)

    const reponse = await axios.delete(USER_API.Category, { data: { "categoryId": categoryId } });
    try {
      if (reponse.status === 200 || reponse.status === 201) {
        setDelete(true)
        dispatch(getCategoryWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Xoá dạng học liệu thành công',
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
          message: 'Xoá dạng học liệu thất bại',
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
        message: 'Xoá dạng học liệu thất bại',
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


  return { hanldDeleteTypeProduct, isDelete }
}
