import { useCallback } from "react";
import { USER_API } from "../../../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../../../store";
import { openSnackbar } from "../../../../../../../store/slices/snackbar";
import { getSuppliesLTWaiting } from "../../../../../../../store/slices/supplies";
import axiosServicesAdditional from "../../../../../../../utils/axiosV2";

export const useCreateSuppliesLT = () => {

  const hanldCreateSuppliesLTAll = useCallback(async (data) => {
    try {

      const formData = new FormData();

      for (let i = 0; i < data.length; i++) {
        const filePath = `${process.env.REACT_APP_BASE_API_URL}${data[i].listMedia?.[data[i].listMedia.length - 1]?.url}`;

        // Fetch file từ đường dẫn và chờ cho đến khi hoàn tất
        const response = await fetch(filePath);
        const blob = await response.blob();

        // Tạo một biến thời (File) từ Blob
        const file = new File([blob], data[i].listMedia?.[data[i].listMedia.length - 1]?.url, { type: blob.type });

        formData.append(`payload[${i}][id]`, data[i].supplyId)
        formData.append(`payload[${i}][supplyName]`, data[i].supplyName)
        formData.append(`payload[${i}][publisher]`, data[i]?.publisher?.publisherName)
        formData.append(`payload[${i}][printedMatter]`, data[i].printedMatter?.printedMatterName)
        formData.append(`payload[${i}][typeOfSupply]`, data[i].typeOfSupply?.[0]?.name)
        formData.append(`payload[${i}][category]`, data[i].category?.list?.[0]?.categoryName)
        formData.append(`payload[${i}][authors]`, data[i].authors?.list?.[0]?.authorName)
        formData.append(`payload[${i}][imageName]`, data[i].listMedia?.[data[i].listMedia.length - 1]?.url)
        formData.append(`payload[${i}][ISBN]`, data[i].ISBN)
        formData.append(`payload[${i}][quantity]`, data[i].quantity)
        formData.append('imageSupply', file);
      }

      const respon = await axiosServicesAdditional.post(USER_API.Supplies, formData);

      if (respon.status === 200 || respon.status === 201) {
        dispatch(getSuppliesLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Liên thông ấn phẩm thành công',
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
        message: 'Liên thông ấn phẩm thất bại',
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
      dispatch(getSuppliesLTWaiting());
    }
  }, []);

  const hanldCreateSuppliesLT = useCallback(async (data) => {
    try {
      const filePath = `${process.env.REACT_APP_BASE_API_URL}${data.listMedia?.[data.listMedia.length - 1]?.url}`;

      // Fetch file từ đường dẫn và chờ cho đến khi hoàn tất
      const response = await fetch(filePath);
      const blob = await response.blob();

      // Tạo một biến thời (File) từ Blob
      const file = new File([blob], data.listMedia?.[data.listMedia.length - 1]?.url, { type: blob.type });

      const formData = new FormData();

      formData.append('payload[0][id]', data.supplyId)
      formData.append('payload[0][supplyName]', data.supplyName)
      formData.append('payload[0][publisher]', data?.publisher?.publisherName)
      formData.append('payload[0][printedMatter]', data.printedMatter?.printedMatterName)
      formData.append('payload[0][typeOfSupply]', data.typeOfSupply?.[0]?.name)
      formData.append('payload[0][category]', data.category?.list?.[0]?.categoryName)
      formData.append('payload[0][authors]', data.authors?.list?.[0]?.authorName)
      formData.append('payload[0][imageName]', data.listMedia?.[data.listMedia.length - 1]?.url)
      formData.append('payload[0][ISBN]', data.ISBN)
      formData.append('payload[0][quantity]', data.quantity)
      formData.append('imageSupply', file);

      const respon = await axiosServicesAdditional.post(USER_API.Supplies, formData);

      if (respon.status === 200 || respon.status === 201) {
        dispatch(getSuppliesLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Liên thông ấn phẩm thành công',
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
        message: 'Liên thông ấn phẩm thất bại',
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
      dispatch(getSuppliesLTWaiting());
    }
  }, []);


  const hanldDeleteSuppliesLT = useCallback(async (data) => {

    const respon = await axiosServicesAdditional.delete(USER_API.Supplies, { data: { "supplyId": data.supplyId } });

    try {
      if (respon.status === 200 || respon.status === 201) {
        dispatch(getSuppliesLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Xoá liên thông ấn phẩm thành công',
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
        message: 'Xoá liên thông ấn phẩm thất bại',
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
      dispatch(getSuppliesLTWaiting());
    }
  }, [])

  const hanldDeleteSuppliesLTAll = useCallback(async (data) => {

    let dataSubmit: any = []

    for (let i = 0; i < data.length; i++) {
      dataSubmit.push(data[i].supplyId)
    }

    const respon = await axiosServicesAdditional.delete(USER_API.Supplies, { data: { "supplyId": dataSubmit } });

    try {
      if (respon.status === 200 || respon.status === 201) {
        dispatch(getSuppliesLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Xoá liên thông ấn phẩm thành công',
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
        message: 'Xoá liên thông ấn phẩm thất bại',
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
      dispatch(getSuppliesLTWaiting());
    }
  }, [])

  return { hanldCreateSuppliesLT, hanldDeleteSuppliesLT, hanldCreateSuppliesLTAll, hanldDeleteSuppliesLTAll }
}
