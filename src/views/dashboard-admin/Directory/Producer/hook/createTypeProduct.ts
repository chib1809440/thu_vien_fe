import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getProducerWaiting } from "../../../../../store/slices/producer";
import axios from "../../../../../utils/axios";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useCreateTypeProduct = () => {

  const [isSubmit, setSubmit] = useState(false);
  const hanldCreateTypeProduct = useCallback(async (data) => {
    setSubmit(false)
    const dataSubmit = {
      publisherName: data.publisherName,
      publisherNote: data.publisherNote,
    }

    const reponse = await axios.post(USER_API.Publisher, dataSubmit);

    try {
      if (reponse.status === 200 || reponse.status === 201) {
        setSubmit(true)
        dispatch(getProducerWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Thêm nhà xuất bản thành công',
          variant: 'alert',
          alert: {
            color: 'info'
          },
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          close: true,
          autoHideDuration: 100,
          transition: 'SlideLeft'
        }))
      }else{
        dispatch(openSnackbar({
          open: true,
          message: 'Thêm nhà xuất bản thất bại',
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
        message: 'Thêm nhà xuất bản thất bại',
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
