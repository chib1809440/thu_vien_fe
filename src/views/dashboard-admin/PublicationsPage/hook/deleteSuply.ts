import { useCallback, useState } from "react";
import { USER_API } from "../../../../_apis/api-endpoint";
import { dispatch } from "../../../../store";
import { getSuppliesWaiting } from "../../../../store/slices/supplies";
import axios from "../../../../utils/axios";
import { openSnackbar } from "../../../../store/slices/snackbar";

export const useDeleteSupplies = () => {

  const [isDelete, setDelete] = useState(false);

  const hanldDeleteSupplies = useCallback(async (supplyId) => {
    setDelete(false)

    const respon = await axios.delete(USER_API.Supplies, { data: { "supplyId": supplyId } });
    try {
      if (respon.status === 200 || respon.status === 201) {
        setDelete(true)
        dispatch(getSuppliesWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Xoá ấn phẩm thành công',
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
          message: 'Xoá ấn phẩm thất bại',
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
        message: 'Xoá ấn phẩm thất bại',
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
      dispatch(getSuppliesWaiting());
    }
  }, [])


  return { hanldDeleteSupplies, isDelete }
}
