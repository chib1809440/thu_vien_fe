import { useCallback, useState } from "react";
import { USER_API } from "../../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../../store";
import axios from "../../../../../../utils/axios";
import { getCategoryWaiting } from "../../../../../../store/slices/category";
import { openSnackbar } from "../../../../../../store/slices/snackbar";

export const useSyncCategory = () => {

    const [isSubmit, setSubmit] = useState(false);
    const hanldSyncCategory = useCallback(async (data) => {        
        setSubmit(false); 
        try {
            const promises = data.map(async (item) => {
                const dataSubmit = {
                    categoryName: item.categoryName,
                    categoryDescription: item.categoryDescription,
                }
                await axios.post(USER_API.Category, dataSubmit);
            });

            await Promise.all(promises);
            dispatch(getCategoryWaiting());
            dispatch(openSnackbar({
                open: true,
                message: 'Thêm dạng học liệu thành công',
                variant: 'alert',
                alert: {
                    color: 'info'
                },
                anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                close: true,
                autoHideDuration: 100,
                transition: 'SlideLeft'
            }));
        } catch (error) {
            console.error('Error during sync:', error);
            dispatch(openSnackbar({
                open: true,
                message: 'Thêm dạng học liệu thất bại',
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
            setSubmit(true)
        }
    }, []);


    return { hanldSyncCategory, isSubmit };
};
