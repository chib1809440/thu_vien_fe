import { useCallback, useState } from "react";
import axios from "../../../../../utils/axios";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getAllAccountWaiting } from "../../../../../store/slices/allAccount";
import { openSnackbar } from "../../../../../store/slices/snackbar";
import { useNavigate } from "react-router-dom";
export const useImportExcelUsers = () => {
    const navigate = useNavigate();

    const [isImport, setImport] = useState(false);
    const hanldImportExcelUsers = useCallback(async (file) => {
        const formData = new FormData()
        formData.append('file', file)
        const reponse = await axios.post(USER_API.UserImport, formData);
        try {
            if (reponse.status === 200 || reponse.status === 201) {
                setImport(true)
                dispatch(getAllAccountWaiting());
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
                navigate('/quan-ly-thanh-vien', { replace: true });
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
        }
    }, [])


    return { hanldImportExcelUsers, isImport }
}
