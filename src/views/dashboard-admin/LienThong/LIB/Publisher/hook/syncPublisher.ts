import { useCallback, useState } from "react";
import { USER_API } from "../../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../../store";
import { openSnackbar } from "../../../../../../store/slices/snackbar";
import axios from "../../../../../../utils/axios";
import { getProducerWaiting } from "../../../../../../store/slices/producer";

export const useSyncPublisher = () => {

    const [isSubmit, setSubmit] = useState(false);
    const hanldSyncPublisher = useCallback(async (data) => {
        setSubmit(false);
        try {
            const promises = data.map(async (item) => {
                const dataSubmit = {
                    publisherName: item.publisherName,
                    publisherNote: item.publisherNote,
                }
                await axios.post(USER_API.Publisher, dataSubmit);
            });

            await Promise.all(promises);
            dispatch(getProducerWaiting());
            dispatch(openSnackbar({
                open: true,
                message: 'Đồng bộ nhà xuất bản thành công',
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
                message: 'Đồng bộ nhà xuất bản thất bại',
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


    return { hanldSyncPublisher, isSubmit };
};
