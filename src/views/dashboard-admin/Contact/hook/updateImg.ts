import { useCallback, useState } from "react";
import { USER_API } from "../../../../_apis/api-endpoint";
import { dispatch } from "../../../../store";
import { getSuppliesWaiting } from "../../../../store/slices/supplies";
import axios from "../../../../utils/axios";
import { openSnackbar } from "../../../../store/slices/snackbar";
import { getContactSchoolWaiting } from "../../../../store/slices/contactSchool";

export const useUpdateLogo = () => {

    const [isSubmit, setSubmit,] = useState(false);

    const hanldUpdateLogo = useCallback(async (imageSupply) => {

        const formData = new FormData()
        formData.append('imageContact', imageSupply)
        const respon = await axios.patch(USER_API.ContactImg, formData);

        try {
            if (respon.status === 200 || respon.status === 201) {

                setSubmit(true)
                dispatch(getContactSchoolWaiting());
                dispatch(openSnackbar({
                    open: true,
                    message: 'Cập nhật Logo thành công',
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
                    message: 'Cập nhật Logo thất bại',
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
                message: 'Cập nhật Logo thất bại',
                variant: 'alert',
                alert: {
                    color: 'error'
                },
                anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                close: true,
                autoHideDuration: 100,
                transition: 'SlideLeft'
            }))
            // setSubmit(false)
        } finally {
        }
    }, [])


    return { hanldUpdateLogo, isSubmit }
}
