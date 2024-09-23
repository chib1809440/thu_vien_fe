import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getPrintedMatterWaiting } from "../../../../../store/slices/printedMaster";
import axios from "../../../../../utils/axios";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useUpdateTypeProduct = () => {

  const [isUpdate, setUpdate] = useState(0);

  const hanldUpdateTypeProduct = useCallback(async (data) => {
    setUpdate(0)

    const dataSubmit = {
      printedMatterId: data.printedMatterId,
      printedMatterName: data.printedMatterName,
      printedMatterDescription: data.printedMatterDescription,
    }

    const response = await axios.patch(USER_API.PrintedMatter, dataSubmit);
    try {
      if (response.status === 200 || response.status === 201) {
        setUpdate(3)
      }
      dispatch(getPrintedMatterWaiting());
      dispatch(openSnackbar({
        open: true,
        message: 'Cập nhật loại học liệu thành công',
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
        message: 'Cập nhật loại học liệu thất bại',
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
