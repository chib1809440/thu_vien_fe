import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getAssetsLibWaiting } from "../../../../../store/slices/assetsLib";
import { openSnackbar } from "../../../../../store/slices/snackbar";
import axios from "../../../../../utils/axios";

export const useCreateAssetLib = () => {

  const [isSubmit, setSubmit] = useState(false);
  const hanldCreateAssetLib = useCallback(async (data) => {
    setSubmit(false)

    const dataSubmit = {
      name: data.name,
      qty: data.qty,
      note: data.note,
      states: [
        {"state": "DAMAGED","qty":0},
        {"state": "LIQUIDATED","qty":0},
        {"state": "USING","qty":0},
        {"state": "WAREHOUSE","qty":data.qty}
      ],
    }

    const reponse = await axios.post(USER_API.AssetLib, dataSubmit);

    try {
      setSubmit(true)
      dispatch(getAssetsLibWaiting());
      dispatch(openSnackbar({
        open: true,
        message: 'Thêm tài sản thành công',
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
      setSubmit(true)
      dispatch(openSnackbar({
        open: true,
        message: 'Thêm tài sản thất bại',
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


  return { hanldCreateAssetLib, isSubmit }
}
