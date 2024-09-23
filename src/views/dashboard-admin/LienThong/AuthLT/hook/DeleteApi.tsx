import React from "react";
import { dispatch } from "../../../../../store";
import { getApiLTWaiting } from "../../../../../store/slices/apiLT";
import { openSnackbar } from "../../../../../store/slices/snackbar";
import axiosServices from "../../../../../utils/axios";


export const useDeleteApi = () => {

    const [isStatus, setStatus] = React.useState(false);

    const deleteApi = React.useCallback(async (idApi) => {
        setStatus(false)

        const data = {
            "id": ["08d11a0d-72cb-4692-baf5-c189aba5735b"]
        }

        const reponse = await axiosServices.delete(`apiConnection`, { data: { "id": idApi } });


        try {
            if (reponse.status === 200 || reponse.status === 201) {
                setStatus(true)
                dispatch(getApiLTWaiting());
                dispatch(openSnackbar({
                    open: true,
                    message: 'Xoá trung tâm liên thông thành công',
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
                message: 'Xoá trung tâm liên thông thất bại',
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


    return { deleteApi, isStatus }
}
