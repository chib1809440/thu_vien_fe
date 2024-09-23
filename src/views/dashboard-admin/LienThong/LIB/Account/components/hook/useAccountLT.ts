import React, { useCallback } from "react";
import { USER_API } from "../../../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../../../store";
import { openSnackbar } from "../../../../../../../store/slices/snackbar";
import { getUserLTWaiting } from "../../../../../../../store/slices/userLT";
import axiosServicesAdditional from "../../../../../../../utils/axiosV2";

export const useCreateSuppliesLT = () => {

    const [isAddAcount, setAddAcount] = React.useState(false);
    const [isUpAcount, setUpAcount] = React.useState(false);

    const hanldCreateAccount = useCallback(async (data) => {
        setAddAcount(false)
        try {
            const formData = new FormData();
            formData.append(`username`, data.username)
            formData.append(`password`, data.password)
            formData.append(`fullName`, data.fullName)
            formData.append(`schoolName`, data.schoolName)
            formData.append(`addressUser`, data.addressUser)
            formData.append(`numberPhone`, data.numberPhone)
            formData.append(`gender`, '0')
            formData.append(`nameContact`, '')
            formData.append(`role`, '0')

            const respon = await axiosServicesAdditional.post(USER_API.CreateUser, formData);

            if (respon.status === 200 || respon.status === 201) {
                setAddAcount(true)
                dispatch(getUserLTWaiting());
                dispatch(openSnackbar({
                    open: true,
                    message: 'Tạo tài khoản thành công',
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
            dispatch(openSnackbar({
                open: true,
                message: 'Tạo tài khoản thất bại',
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

        }
    }, []);

    const hanldUpdateAccount = useCallback(async (data) => {
        setUpAcount(false)
        try {
            const formData = new FormData();
            formData.append(`userID`, data.userID)
            formData.append(`username`, data.username)
            if (data.password !== '') {
                formData.append(`password`, data.password)
            }
            formData.append(`fullName`, data.fullName)
            formData.append(`schoolName`, data.schoolName)
            formData.append(`addressUser`, data.addressUser)
            formData.append(`numberPhone`, data.numberPhone)

            const respon = await axiosServicesAdditional.patch(USER_API.CreateUser, formData);

            if (respon.status === 200 || respon.status === 201) {
                setUpAcount(true)
                dispatch(getUserLTWaiting());
                dispatch(openSnackbar({
                    open: true,
                    message: 'Cập nhật tài khoản thành công',
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
            dispatch(openSnackbar({
                open: true,
                message: 'Cập nhật tài khoản thất bại',
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

        }
    }, []);


    return { hanldCreateAccount, hanldUpdateAccount, isUpAcount, isAddAcount }
}
