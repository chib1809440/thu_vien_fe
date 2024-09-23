import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getPrintedMatterWaiting } from "../../../../../store/slices/printedMaster";
import axios from "../../../../../utils/axios";
import { openSnackbar } from "../../../../../store/slices/snackbar";
import { getAssetsLibWaiting } from "../../../../../store/slices/assetsLib";

export const useUpdateAssetLib = () => {

  const [isUpdate, setUpdate] = useState(false);

  const hanldUpdateAssetLib = useCallback(async (data) => {
    setUpdate(false)

    const dataSubmit = {
      id: data.id,
      name: data.name,
      qty: data.qty,
      note: data.note,
      states: [{
        "id": data.idLIQUIDATED,
        "qty": data.qtyLIQUIDATED,
        "state": "LIQUIDATED"
      },
      {
        "id": data.idDAMAGED,
        "qty": data.qtyDAMAGED,
        "state": "DAMAGED"
      },
      {
        "id": data.idUSING,
        "qty": data.qtyUSING,
        "state": "USING"
      },
      {
        "id": data.idWAREHOUSE,
        "qty": data.qtyWAREHOUSE,
        "state": "WAREHOUSE"
      }]
    }

    const response = await axios.patch(USER_API.AssetLib, dataSubmit);
    try {
      if (response.status === 200 || response.status === 201) {
        setUpdate(true)
        dispatch(openSnackbar({
          open: true,
          message: 'Cập nhật tài sản thành công',
          variant: 'alert',
          alert: {
            color: 'info'
          },
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          close: true,
          autoHideDuration: 100,
          transition: 'SlideLeft'
        }))
      }
      dispatch(getAssetsLibWaiting());

    } catch (e) {
      dispatch(openSnackbar({
        open: true,
        message: 'Cập nhật tài sản thất bại',
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


  return { hanldUpdateAssetLib, isUpdate }
}
