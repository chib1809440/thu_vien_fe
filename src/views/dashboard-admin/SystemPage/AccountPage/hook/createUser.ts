import { useCallback, useState } from "react";
import axios from "../../../../../utils/axios";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getAllAccountWaiting } from "../../../../../store/slices/allAccount";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useCreateUser = () => {

  const [isSubmit, setSubmit] = useState(false);

  const hanldCreateUser = useCallback(async (data, imageUser, isGender) => {
    setSubmit(false)
    const formData = new FormData()
    formData.append('password', data.anoPassword)
    formData.append('username', data.anotherName)
    formData.append('gender', isGender)
    formData.append('role', '2')
    formData.append('fullName', data.fullName)
    formData.append('addressUser', data.addressUser)
    formData.append('emailUser', data.emailUser)
    formData.append('numberPhone', data.numberPhone)
    formData.append('imageUser', imageUser)
    formData.append('birthDay', data.birthDay)

    const reponse = await axios.post(USER_API.CreateUser, formData);
    try {
      if (reponse.status === 201 || reponse.status === 200) {
        setSubmit(true)
        dispatch(getAllAccountWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Thêm tài khoản thành công',
          variant: 'alert',
          alert: {
            color: 'info'
          },
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          close: true,
          autoHideDuration: 100,
          transition: 'SlideLeft'
        }))
      } else {
        dispatch(openSnackbar({
          open: true,
          message: 'Thêm tài khoản thất bại',
          variant: 'alert',
          alert: {
            color: 'error'
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
        message: 'Thêm tài khoản thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
    } finally { }
  }, [])


  return { hanldCreateUser, isSubmit }
}
