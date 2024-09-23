import { useCallback, useState } from "react";
import { USER_API } from "../../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../../store";
import axios from "../../../../../../utils/axios";
import { openSnackbar } from "../../../../../../store/slices/snackbar";
import { getTypeSuplyWaiting } from "../../../../../../store/slices/typeSuplly";

export const useSyncTypeOfSupplies = () => {

    const [isSubmit, setSubmit] = useState(false);
    const hanldSyncTypeOfSupplies = useCallback(async (data) => {
        
        setSubmit(false);
        try {
            const promises = data.map(async (item) => {
                const dataSubmit = {
                    name: item.name,
                    note: item.note,
                }
                await axios.post('type-of-supplies', dataSubmit);
            });

            await Promise.all(promises);
            dispatch(getTypeSuplyWaiting());
            dispatch(openSnackbar({
                open: true,
                message: 'Đồng bộ lĩnh vực liệu thành công',
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
                message: 'Đồng bộ lĩnh vực liệu thất bại',
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


    return { hanldSyncTypeOfSupplies, isSubmit };
};
