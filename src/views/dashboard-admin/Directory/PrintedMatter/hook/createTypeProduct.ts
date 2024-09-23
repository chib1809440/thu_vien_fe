import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getPrintedMatterWaiting } from "../../../../../store/slices/printedMaster";
import { openSnackbar } from "../../../../../store/slices/snackbar";
import axios from "../../../../../utils/axios";

export const useCreateTypeProduct = () => {

  const [isSubmit, setSubmit] = useState(0);
  const hanldCreateTypeProduct = useCallback(async (data) => {
    setSubmit(0)

    const dataSubmit = {
      printedMatterName: data.printedMatterName,
      printedMatterDescription: data.printedMatterDescription,
    }

    const reponse = await axios.post(USER_API.PrintedMatter, dataSubmit);

    try {

      setSubmit(1)

      dispatch(getPrintedMatterWaiting());
      dispatch(openSnackbar({
        open: true,
        message: 'Thêm loại học liệu thành công',
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
        message: 'Thêm loại học liệu thất bại',
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
