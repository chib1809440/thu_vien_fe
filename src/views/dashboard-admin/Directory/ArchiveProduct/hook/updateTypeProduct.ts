import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getSuppliesWaiting } from "../../../../../store/slices/supplies";
import axios from "../../../../../utils/axios";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useUpdateTypeProduct = () => {

  const [isUpdate, setUpdate] = useState(false);

  const hanldUpdateTypeProduct = useCallback(async (data, cabinetId, quantityCabin) => {
    const dataSubmit = {
      supplyId: data.supplyId,
      cabinet_quantity: quantityCabin,
      quantity: data.quantity,
      cabinetId: cabinetId?.length === 0 ? data.cabinets['cabinetId'] : cabinetId.id
    }

    await axios.patch(USER_API.Supplies, dataSubmit);
    try {
      setUpdate(true)
      dispatch(getSuppliesWaiting());
      dispatch(openSnackbar({
        open: true,
        message: 'Cập nhật tủ kệ thành công',
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
        message: 'Cập nhật tủ kệ thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
      setUpdate(false)
    } finally {
      setUpdate(false)
    }
  }, [])

  const hanldCleareTypeProduct = useCallback(async (data) => {
    const dataSubmit = {
      supplyId: data.supplyId,
      cabinet_quantity: 0,
      quantity: data.quantity,
      cabinetId: null
    }

    await axios.patch(USER_API.Supplies, dataSubmit);
    try {
      setUpdate(true)
      dispatch(getSuppliesWaiting());
    } catch (e) {
      setUpdate(false)
    } finally {
      setUpdate(false)
    }
  }, [])


  return { hanldUpdateTypeProduct, isUpdate, hanldCleareTypeProduct }
}
