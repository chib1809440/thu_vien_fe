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

    const reponse = await axios.post(USER_API.Author, dataSubmit);

    try {
      if (reponse.status === 200 || reponse.status === 201) {
        setSubmit(true)
        dispatch(getAuthorWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Thêm tủ kệ thành công',
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
          message: 'Thêm tủ kệ thất bại',
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
        message: 'Thêm tủ kệ thất bại',
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
