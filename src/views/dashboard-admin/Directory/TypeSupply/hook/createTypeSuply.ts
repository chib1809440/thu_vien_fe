import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getTypeSuplyWaiting } from "../../../../../store/slices/typeSuplly";
import axios from "../../../../../utils/axios";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useCreateTypeSuply = () => {

  const [isSubmit, setSubmit] = useState(false);
  const hanldCreateTypeSuply = useCallback(async (data) => {
    const dataSubmit = {
      name: data.categoryName,
      note: data.categoryDescription,
    }
    setSubmit(false)

    const reponse = await axios.post(USER_API.TypeOfSupplies, dataSubmit);

    try {
      if (reponse.status === 200 || reponse.status === 201) {
        setSubmit(true)
        dispatch(getTypeSuplyWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Thêm lĩnh vực thành công',
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
          message: 'Thêm lĩnh vực thất bại',
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
        message: 'Thêm lĩnh vực thất bại',
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


  return { hanldCreateTypeSuply, isSubmit }
}
