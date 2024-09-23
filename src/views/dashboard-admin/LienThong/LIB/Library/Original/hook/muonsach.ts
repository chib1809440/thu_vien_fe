import React from "react";
import { dispatch } from "../../../../../../../store";
import { getRegisterSlipLTWaiting } from "../../../../../../../store/slices/registerSlip";
import { openSnackbar } from "../../../../../../../store/slices/snackbar";
import axiosServicesAdditional from "../../../../../../../utils/axiosV2";



export const useRegisterSlip = () => {

    const [isStatus, setStatus] = React.useState(false);

    const registerSlip = React.useCallback(async (data, qty) => {
        setStatus(false)

        const dataSubmit = {
            userId: data.user.userID,
            create_at: new Date(Date.now()),
            return_date: new Date(Date.now() + (36000 * 10000 * 240)),
            supplies: [{
                supplyId: data.supplyID,
                qty: qty
            }],
            state: false
        }

        const reponse = await axiosServicesAdditional.post(`registerSlip`, dataSubmit);

        try {
            if (reponse.status === 200 || reponse.status === 201) {
                setStatus(true)
                dispatch(getRegisterSlipLTWaiting());
                dispatch(openSnackbar({
                    open: true,
                    message: 'Mượn sách thành công',
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
                message: 'Mượn sách thất bại',
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


    return { registerSlip, isStatus }
}
