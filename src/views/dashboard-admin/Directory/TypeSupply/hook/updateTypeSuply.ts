import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import axios from "../../../../../utils/axios";
import { getTypeSuplyWaiting } from "../../../../../store/slices/typeSuplly";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useUpdateTypeSuply = () => {

  const [isUpdate, setUpdate] = useState(false);

  const hanldUpdateTypeSuply = useCallback(async (data) => {
    setUpdate(false)

    const dataSubmit = {
      id: data.categoryId,
      name: data.categoryName,
      note: data.categoryDescription,
    }

    const reponse = await axios.patch(USER_API.TypeOfSupplies, dataSubmit);
    try {
      if (reponse.status === 200 || reponse.status === 201) {
        setUpdate(true)
        dispatch(getTypeSuplyWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Cập nhật lĩnh vực thành công',
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
        setUpdate(true)
        dispatch(openSnackbar({
          open: true,
          message: 'Cập nhật lĩnh vực thất bại',
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
        message: 'Cập nhật lĩnh vực thất bại',
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


  return { hanldUpdateTypeSuply, isUpdate }
}
