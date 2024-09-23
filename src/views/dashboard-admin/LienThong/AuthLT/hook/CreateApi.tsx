import React from "react";
import { dispatch } from "../../../../../store";
import { getApiLTWaiting } from "../../../../../store/slices/apiLT";
import { openSnackbar } from "../../../../../store/slices/snackbar";
import axiosServices from "../../../../../utils/axios";


export const useCreateApi = () => {

    const [isStatus, setStatus] = React.useState(false);

    const createApi = React.useCallback(async (addressApi, nameApi) => {
        setStatus(false)

        const data = {
            "api": addressApi,
            "name": nameApi
        }

        const reponse = await axiosServices.post(`apiConnection`, data);

        try {
            if (reponse.status === 200 || reponse.status === 201) {
                setStatus(true)
                dispatch(getApiLTWaiting());
                dispatch(openSnackbar({
                    open: true,
                    message: 'Thêm trung tâm liên thông thành công',
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
            setStatus(false)
            dispatch(openSnackbar({
                open: true,
                message: 'Thêm trung tâm liên thông thất bại',
                variant: 'alert',
                alert: {
                    color: 'info'
                },
                anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                close: true,
                autoHideDuration: 100,
                transition: 'SlideLeft'
            }))
        } finally {
        }
    }, [])


    return { createApi, isStatus }
}
