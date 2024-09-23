import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getAssetsLibWaiting } from "../../../../../store/slices/assetsLib";
import { openSnackbar } from "../../../../../store/slices/snackbar";
import axios from "../../../../../utils/axios";

export const useDeleteAssetLib = () => {

  const [isDelete, setDelete] = useState(false);

  const hanldDeleteAssetLib = useCallback(async (id) => {
    setDelete(false)

    const response = await axios.delete(USER_API.AssetLib, { data: { "id": id } });
    try {
      if (response.status === 200 || response.status === 201) {
        setDelete(true)
      }
      dispatch(getAssetsLibWaiting());
      dispatch(openSnackbar({
        open: true,
        message: 'Xoá tài sản thành công',
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
        message: 'Xoá tài sản thất bại',
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


  return { hanldDeleteAssetLib, isDelete }
}
