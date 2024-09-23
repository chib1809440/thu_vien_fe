import React from "react";
import { dispatch } from "../../../../../../../store";
import { getAllLoanSlipLTWaiting } from "../../../../../../../store/slices/loanSlip";
import { openSnackbar } from "../../../../../../../store/slices/snackbar";
import axiosServicesAdditional from "../../../../../../../utils/axiosV2";



export const useApproveLoanSlip = () => {

    const [isStatus, setStatus] = React.useState(false);

    const approveLoanSlip = React.useCallback(async (data) => {
        setStatus(false)

        const dataSubmit = {
            loanSlipNumber: data.loanSlipNumber,
            state: true
        }

        const reponse = await axiosServicesAdditional.patch(`loan-slip`, dataSubmit);

        try {
            if (reponse.status === 200 || reponse.status === 201) {
                setStatus(true)
                dispatch(getAllLoanSlipLTWaiting());
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


    return { approveLoanSlip, isStatus }
}
