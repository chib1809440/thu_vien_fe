import { useCallback, useState } from "react";
import { dispatch } from "../../../../store";
import { getSuppliesWaiting } from "../../../../store/slices/supplies";
import axios from "../../../../utils/axios";
import { USER_API } from "../../../../_apis/api-endpoint";
import { openSnackbar } from "../../../../store/slices/snackbar";

export const useImportExcelSupplies = () => {

    const [isImport, setImport] = useState(false);
    const hanldImportExcelSupplies = useCallback(async (file) => {

        const formData = new FormData()
        formData.append('file', file)
        const reponse = await axios.post(USER_API.SuppliesImport, formData);
        try {
            if (reponse.status === 200 || reponse.status === 201) {
                setImport(true)
                dispatch(getSuppliesWaiting());
                dispatch(openSnackbar({
                    open: true,
                    message: 'Thêm từ file Excel thành công',
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
                    message: 'Thêm từ file Excel thất bại',
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
                message: 'Thêm từ file Excel thất bại',
                variant: 'alert',
                alert: {
                    color: 'error'
                },
                anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                close: true,
                autoHideDuration: 100,
                transition: 'SlideLeft'
            }))
            setImport(false)
        } finally {
            dispatch(getSuppliesWaiting());
        }
    }, [])


    return { hanldImportExcelSupplies, isImport }
}
