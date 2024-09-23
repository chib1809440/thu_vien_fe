import { useCallback, useState } from "react";
import axios from "../../../../utils/axios";
import { USER_API } from "../../../../_apis/api-endpoint";
import { dispatch } from "../../../../store";
import { getAllAccountWaiting } from "../../../../store/slices/allAccount";
import { openSnackbar } from "../../../../store/slices/snackbar";

export const useDeleteUser = () => {

  const [isDelete, setDelete] = useState(false);

  const hanldDeleteUser = useCallback(async (userID) => {
    setDelete(false)
    const reponse = await axios.delete(USER_API.DeleteUser, { data: { "userID": userID } });
    try {
      if (reponse.status === 200 || reponse.status === 201) {
        setDelete(true)
        dispatch(getAllAccountWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Xoá thành công',
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
          message: 'Xoá thất bại',
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
        message: 'Xoá thất bại',
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


  return { hanldDeleteUser, isDelete }
}
