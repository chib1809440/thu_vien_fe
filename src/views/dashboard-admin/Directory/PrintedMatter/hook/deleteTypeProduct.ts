import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getPrintedMatterWaiting } from "../../../../../store/slices/printedMaster";
import axios from "../../../../../utils/axios";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useDeleteTypeProduct = () => {

  const [isDelete, setDelete] = useState(0);

  const hanldDeleteTypeProduct = useCallback(async (printedMatterId) => {
    setDelete(0)

    const response = await axios.delete(USER_API.PrintedMatter, { data: { "printedMatterId": printedMatterId } });
    try {
      if (response.status === 200 || response.status === 201) {
        setDelete(2)
      }
      dispatch(getPrintedMatterWaiting());
      dispatch(openSnackbar({
        open: true,
        message: 'Xoá loại học liệu thành công',
        variant: 'alert',
        alert: {
          color: 'info'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
    } catch (e) {
      dispatch(openSnackbar({
        open: true,
        message: 'Xoá loại học liệu thất bại',
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
