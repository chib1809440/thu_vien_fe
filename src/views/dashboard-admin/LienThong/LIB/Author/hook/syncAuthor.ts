import { useCallback, useState } from "react";
import { USER_API } from "../../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../../store";
import { getAuthorWaiting } from "../../../../../../store/slices/author";
import { openSnackbar } from "../../../../../../store/slices/snackbar";
import axios from "../../../../../../utils/axios";

export const useSyncAuthor = () => {

    const [isSubmit, setSubmit] = useState(false);
    const hanldSyncAuthor = useCallback(async (data) => {
        setSubmit(false);
        try {
            const promises = data.map(async (item) => {
                const dataSubmit = {
                    authorName: item.authorName,
                    authorDescription: item.authorDescription,
                  }
                await axios.post(USER_API.Author, dataSubmit);
            });

            await Promise.all(promises);
            dispatch(getAuthorWaiting());
            dispatch(openSnackbar({
                open: true,
                message: 'Đồng bộ tác giả thành công',
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
                message: 'Đồng bộ tác giả thất bại',
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


    return { hanldSyncAuthor, isSubmit };
};
