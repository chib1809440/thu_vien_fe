import { useCallback, useState } from "react";
import axios from "../../../../utils/axios";
import { USER_API } from "../../../../_apis/api-endpoint";
import { dispatch } from "../../../../store";
import { getAllAccountWaiting } from "../../../../store/slices/allAccount";
import { openSnackbar } from "../../../../store/slices/snackbar";

export const useUpdateUser = () => {

  const [isUpdate, setSubmit] = useState(false);

  const hanldUpdateUser = useCallback(async (data, imageUser, isActive, isGender, isRole) => {
    setSubmit(false)

    const formData = new FormData()
    formData.append('userID', data.userID)
    formData.append('password', data.password)
    formData.append('username', data.username)
    formData.append('gender', isGender)
    formData.append('role', isRole)
    formData.append('fullName', data.fullName)
    formData.append('addressUser', data.addressUser)
    formData.append('emailUser', data.emailUser)
    formData.append('numberPhone', data.numberPhone)
    formData.append('birthDay', data.birthDay)
    if (isActive === 0) {
      formData.append('isActive', 'true')
    } else {
      formData.append('isActive', 'false')

    }
    imageUser !== undefined && formData.append('imageUser', imageUser)

    const reponse = await axios.patch(USER_API.User, formData);

    try {
      if (reponse.status === 200 || reponse.status === 201) {
        setSubmit(true)
        dispatch(getAllAccountWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Cập nhật thành công',
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
          message: 'Cập nhật thành viên thất bại',
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
        message: 'Cập nhật thất bại',
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


  return { hanldUpdateUser, isUpdate }
}
