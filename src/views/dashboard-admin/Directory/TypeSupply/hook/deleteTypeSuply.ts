import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import axios from "../../../../../utils/axios";
import { getTypeSuplyWaiting } from "../../../../../store/slices/typeSuplly";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useDeleteTypeSuply = () => {

  const [isDelete, setDelete] = useState(false);

  const hanldDeleteTypeSuply = useCallback(async (categoryId) => {
    setDelete(false)

    const reponse = await axios.delete(USER_API.TypeOfSupplies, { data: { "id": categoryId } });
    try {
      if (reponse.status === 200 || reponse.status === 201) {
        setDelete(true)
        dispatch(getTypeSuplyWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Xoá lĩnh vực thành công',
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
          message: 'Xoá lĩnh vực thất bại',
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
        message: 'Xoá lĩnh vực thất bại',
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


  return { hanldDeleteTypeSuply, isDelete }
}
