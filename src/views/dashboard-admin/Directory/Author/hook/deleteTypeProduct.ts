import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getAuthorWaiting } from "../../../../../store/slices/author";
import axios from "../../../../../utils/axios";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useDeleteTypeProduct = () => {

  const [isDelete, setDelete] = useState(false);

  const hanldDeleteTypeProduct = useCallback(async (authorId) => {
    setDelete(false)

    const response = await axios.delete(USER_API.Author, { data: { "authorId": authorId } });
    try {
      if (response.status === 200 || response.status === 201) {
        setDelete(true)
        dispatch(getAuthorWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Xoá tác giả thành công',
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
          message: 'Xoá tác giả thất bại',
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
        message: 'Xoá tác giả thất bại',
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
