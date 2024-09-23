import { Grid } from '@mui/material';
import React, { ReactElement } from 'react';
import { dispatch, useSelector } from '../store';
import { getUsbWaiting } from '../store/slices/usb';
import { GetUsb } from '../types/usb';

// ==============================|| NAVIGATION SCROLL TO TOP ||============================== //

const ProviderLoader = ({ children }: { children: ReactElement | null | any }) => {

    const [isConnected, setConnected] = React.useState<GetUsb[] | undefined | any>([]);
    const { getUsb } = useSelector((state) => state.getUsb);


    React.useEffect(() => {
        dispatch(getUsbWaiting());
    }, []);

    React.useEffect(() => {
        setConnected(getUsb)
    }, [getUsb]);

    return !isConnected?.isUsb ? children : <Grid container justifyContent='center' alignItems='center' sx={{ width: '100%', height: '100vh' }}>
        <Grid width='100%' textAlign='center'>
            <span className="loader"></span>
            <div style={{ width: '100%' }}>
                <span >Mất kết nối với KEY USB...Hãy kiểm tra lại hoặc liên hệ GD Việt Nam để được hỗ trợ!</span>
            </div>
        </Grid>
    </Grid>;
};

export default ProviderLoader;
