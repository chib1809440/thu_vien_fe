import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getProducerWaiting } from "../../../../../store/slices/producer";
import axios from "../../../../../utils/axios";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useUpdateTypeProduct = () => {

  const [isUpdate, setUpdate] = useState(false);

  const hanldUpdateTypeProduct = useCallback(async (data) => {
    setUpdate(false)

    const dataSubmit = {
      publisherId: data.publisherId,
      publisherName: data.publisherName,
      publisherNote: data.publisherNote,
    }

    const response = await axios.patch(USER_API.Publisher, dataSubmit);
    try {
      if (response.status === 200 || response.status === 201) {
        setUpdate(true)
        dispatch(getProducerWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Cập nhật nhà xuất bản thành công',
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
          message: 'Cập nhật nhà xuất bản thất bại',
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
        message: 'Cập nhật nhà xuất bản thất bại',
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
