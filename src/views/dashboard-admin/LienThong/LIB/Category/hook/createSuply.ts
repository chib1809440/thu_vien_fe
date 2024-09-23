import { useCallback } from "react";
import { USER_API } from "../../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../../store";
import { openSnackbar } from "../../../../../../store/slices/snackbar";
import axiosServicesAdditional from "../../../../../../utils/axiosV2";
import { getCategoryLTWaiting } from "../../../../../../store/slices/category";

export const useCreateCategoryLT = () => {

  const hanldCreateCategoryLTAll = useCallback(async (data) => {

    const dataSubmit: any = {
      "payload": []
    };

    for (let i = 0; i < data.length; i++) {
      dataSubmit.payload.push({
        "id": data[i].categoryId,
        "categoryName": data[i].categoryName,
        "categoryDescription": data[i].categoryDescription === null ? '' : data[i].categoryDescription
      });
    }

    const respon = await axiosServicesAdditional.post(USER_API.Category, dataSubmit);
    try {

      if (respon.status === 200 || respon.status === 201) {
        dispatch(getCategoryLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Liên thông dạng học liệu thành công',
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
        message: 'Liên thông dạng học liệu thất bại',
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
      dispatch(getCategoryLTWaiting());
    }
  }, []);

  const hanldCreateCategoryLT = useCallback(async (data) => {

    const dataSubmit = {
      "payload": [{
        "id": data.categoryId,
        "categoryName": data.categoryName,
        "categoryDescription": data.categoryDescription === null ? '' : data.categoryDescription
      }]
    }

    const respon = await axiosServicesAdditional.post(USER_API.Category, dataSubmit);

    try {

      if (respon.status === 200 || respon.status === 201) {
        dispatch(getCategoryLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Liên thông dạng học liệu thành công',
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
        message: 'Liên thông dạng học liệu thất bại',
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
      dispatch(getCategoryLTWaiting());
    }
  }, []);


  const hanldDeleteCategoryLT = useCallback(async (data) => {

    const respon = await axiosServicesAdditional.delete(USER_API.Category, { data: { "id": data.id } });

    try {
      if (respon.status === 200 || respon.status === 201) {
        dispatch(getCategoryLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Xoá liên thông dạng học liệu thành công',
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
        message: 'Xoá liên thông dạng học liệu thất bại',
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
      dispatch(getCategoryLTWaiting());
    }
  }, [])

  const hanldDeleteCategoryLTAll = useCallback(async (data) => {

    let dataSubmit: any = []

    for (let i = 0; i < data.length; i++) {
      dataSubmit.push(data[i].id)
    }

    const respon = await axiosServicesAdditional.delete(USER_API.Category, { data: { "id": dataSubmit } });

    try {
      if (respon.status === 200 || respon.status === 201) {
        dispatch(getCategoryLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Xoá liên thông dạng học liệu thành công',
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
        message: 'Xoá liên thông dạng học liệu thất bại',
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
      dispatch(getCategoryLTWaiting());
    }
  }, [])

  return { hanldCreateCategoryLT, hanldDeleteCategoryLT, hanldCreateCategoryLTAll, hanldDeleteCategoryLTAll }
}
