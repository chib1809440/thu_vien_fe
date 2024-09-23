import React from "react";
import { dispatch } from "../../../../../../../store";
import { getAllRegisterSlipLTWaiting, getRegisterSlipLTWaiting } from "../../../../../../../store/slices/registerSlip";
import { openSnackbar } from "../../../../../../../store/slices/snackbar";
import axiosServicesAdditional from "../../../../../../../utils/axiosV2";



export const useApproveRegisterSlip = () => {

    const [isStatus, setStatus] = React.useState(false);

    const approveRegisterSlip = React.useCallback(async (data) => {
        setStatus(false)

        const dataSubmit = {
            id: data.id,
            state: true
        }

        const reponse = await axiosServicesAdditional.patch(`registerSlip`, dataSubmit);

        try {
            if (reponse.status === 200 || reponse.status === 201) {
                setStatus(true)
                dispatch(getAllRegisterSlipLTWaiting());
                dispatch(openSnackbar({
                    open: true,
                    message: 'Xác nhận thành công',
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
                message: 'Xác nhận thất bại',
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


    return { approveRegisterSlip, isStatus }
}
