import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getAuthorWaiting } from "../../../../../store/slices/author";
import axios from "../../../../../utils/axios";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useCreateTypeProduct = () => {

  const [isSubmit, setSubmit] = useState(false);
  const hanldCreateTypeProduct = useCallback(async (data) => {
    const dataSubmit = {
      authorName: data.authorName,
      authorDescription: data.authorDescription,
    }
    setSubmit(false)
    const response = await axios.post(USER_API.Author, dataSubmit);

    try {
      if (response.status === 200 || response.status === 201) {
      setSubmit(true)
      dispatch(getAuthorWaiting());
      dispatch(openSnackbar({
        open: true,
        message: 'Thêm tác giả thành công',
        variant: 'alert',
        alert: {
          color: 'info'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))}else{
        dispatch(openSnackbar({
          open: true,
          message: 'Thêm tác giả thất bại',
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
        message: 'Thêm tác giả thất bại',
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
