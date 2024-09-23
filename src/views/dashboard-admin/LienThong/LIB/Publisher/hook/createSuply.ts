import { useCallback } from "react";
import { USER_API } from "../../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../../store";
import { openSnackbar } from "../../../../../../store/slices/snackbar";
import axiosServicesAdditional from "../../../../../../utils/axiosV2";
import { getProducerLTWaiting } from "../../../../../../store/slices/producer";

export const useCreatePublisherLT = () => {

  const hanldCreatePublisherLTAll = useCallback(async (data) => {

    const dataSubmit: any = {
      "payload": []
    };

    for (let i = 0; i < data.length; i++) {
      dataSubmit.payload.push({
        "id": data[i].publisherId,
        "publisherName": data[i].publisherName,
        "publisherNote": data[i].publisherNote === null ? '' : data[i].publisherNote
      });
    }

    const respon = await axiosServicesAdditional.post(USER_API.Publisher, dataSubmit);
    try {

      if (respon.status === 200 || respon.status === 201) {
        dispatch(getProducerLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Liên thông nhà xuất bản thành công',
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
        message: 'Liên thông nhà xuất bản thất bại',
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
      dispatch(getProducerLTWaiting());
    }
  }, []);

  const hanldCreatePublisherLT = useCallback(async (data) => {

    const dataSubmit = {
      "payload": [{
        "id": data.publisherId,
        "publisherName": data.publisherName,
        "publisherNote": data.publisherNote === null ? '' : data.publisherNote
      }]
    }

    const respon = await axiosServicesAdditional.post(USER_API.Publisher, dataSubmit);

    try {

      if (respon.status === 200 || respon.status === 201) {
        dispatch(getProducerLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Liên thông nhà xuất bản thành công',
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
        message: 'Liên thông nhà xuất bản thất bại',
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
      dispatch(getProducerLTWaiting());
    }
  }, []);


  const hanldDeletePublisherLT = useCallback(async (data) => {

    const respon = await axiosServicesAdditional.delete(USER_API.Publisher, { data: { "id": data.id } });

    try {
      if (respon.status === 200 || respon.status === 201) {
        dispatch(getProducerLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Xoá liên thông nhà xuất bản thành công',
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
        message: 'Xoá liên thông nhà xuất bản thất bại',
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
      dispatch(getProducerLTWaiting());
    }
  }, [])

  const hanldDeletePublisherLTAll = useCallback(async (data) => {

    let dataSubmit: any = []

    for (let i = 0; i < data.length; i++) {
      dataSubmit.push(data[i].id)
    }

    const respon = await axiosServicesAdditional.delete(USER_API.Publisher, { data: { "id": dataSubmit } });

    try {
      if (respon.status === 200 || respon.status === 201) {
        dispatch(getProducerLTWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Xoá liên thông nhà xuất bản thành công',
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
        message: 'Xoá liên thông nhà xuất bản thất bại',
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
      dispatch(getProducerLTWaiting());
    }
  }, [])

  return { hanldCreatePublisherLT, hanldDeletePublisherLT, hanldCreatePublisherLTAll, hanldDeletePublisherLTAll }
}
