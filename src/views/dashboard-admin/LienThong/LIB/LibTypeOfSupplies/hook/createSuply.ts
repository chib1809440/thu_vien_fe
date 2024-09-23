import { useCallback } from "react";
import { USER_API } from "../../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../../store";
import { openSnackbar } from "../../../../../../store/slices/snackbar";
import axiosServicesAdditional from "../../../../../../utils/axiosV2";
import { getTypeOfSuppliesLTWaiting } from "../../../../../../store/slices/typeSuplly";

export const useCreateTypeOfSuppliesLT = () => {

  const hanldCreateTypeOfSuppliesLTAll = useCallback(async (data) => {

    const dataSubmit: any = {
      "payload": []
    };

    for (let i = 0; i < data.length; i++) {
      dataSubmit.payload.push({
        "id": data[i].id,
        "name": data[i].name,
        "note": data[i].note === null ? '' : data[i].note
      });
    }

    const respon = await axiosServicesAdditional.post(USER_API.TypeOfSupplieslt, dataSubmit);
    try {

      if (respon.status === 200 || respon.status === 201) {
        dispatch(getTypeOfSuppliesLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Liên thông lĩnh vực thành công',
          variant: 'alert',
          alert: {
            color: 'info'
          },
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          close: true,
          autoHideDuration: 100,
          transition: 'SlideLeft'
        }));
      }
    } catch (e) {
      console.error('Error:', e);

      dispatch(openSnackbar({
        open: true,
        message: 'Liên thông lĩnh vực thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }));
    } finally {
      dispatch(getTypeOfSuppliesLTWaiting());
    }
  }, []);

  const hanldCreateTypeOfSuppliesLT = useCallback(async (data) => {

    const dataSubmit = {
      "payload": [{
        "id": data.id,
        "name": data.name,
        "note": data.note === null ? '' : data.note
      }]
    }

    const respon = await axiosServicesAdditional.post(USER_API.TypeOfSupplieslt, dataSubmit);

    try {

      if (respon.status === 200 || respon.status === 201) {
        dispatch(getTypeOfSuppliesLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Liên thông lĩnh vực thành công',
          variant: 'alert',
          alert: {
            color: 'info'
          },
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          close: true,
          autoHideDuration: 100,
          transition: 'SlideLeft'
        }));
      }
    } catch (e) {
      console.error('Error:', e);

      dispatch(openSnackbar({
        open: true,
        message: 'Liên thông lĩnh vực thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }));
    } finally {
      dispatch(getTypeOfSuppliesLTWaiting());
    }
  }, []);


  const hanldDeleteTypeOfSuppliesLT = useCallback(async (data) => {

    const respon = await axiosServicesAdditional.delete(USER_API.TypeOfSupplieslt, { data: { "id": data.id } });

    try {
      if (respon.status === 200 || respon.status === 201) {
        dispatch(getTypeOfSuppliesLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Xoá liên thông lĩnh vực thành công',
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
    } catch (e) {
      dispatch(openSnackbar({
        open: true,
        message: 'Xoá liên thông lĩnh vực thất bại',
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
      dispatch(getTypeOfSuppliesLTWaiting());
    }
  }, [])

  const hanldDeleteTypeOfSuppliesLTAll = useCallback(async (data) => {

    let dataSubmit: any = []

    for (let i = 0; i < data.length; i++) {
      dataSubmit.push(data[i].id)
    }

    const respon = await axiosServicesAdditional.delete(USER_API.TypeOfSupplieslt, { data: { "id": dataSubmit } });

    try {
      if (respon.status === 200 || respon.status === 201) {
        dispatch(getTypeOfSuppliesLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Xoá liên thông lĩnh vực thành công',
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
    } catch (e) {
      dispatch(openSnackbar({
        open: true,
        message: 'Xoá liên thông lĩnh vực thất bại',
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
      dispatch(getTypeOfSuppliesLTWaiting());
    }
  }, [])

  return { hanldCreateTypeOfSuppliesLT, hanldDeleteTypeOfSuppliesLT, hanldCreateTypeOfSuppliesLTAll, hanldDeleteTypeOfSuppliesLTAll }
}
