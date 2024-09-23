import { Alert, Grid, Snackbar } from '@mui/material';
import React, { ReactElement } from 'react';
import { useDispatch } from '../store';
import { openSnackbar } from '../store/slices/snackbar';

// ==============================|| NAVIGATION SCROLL TO TOP ||============================== //

const ProviderNotifications = ({ children }: { children: ReactElement | null | any }) => {

    const [openAlert, setOpenAlert] = React.useState(true);

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return <Grid>
        {children}
        <Snackbar open={openAlert} autoHideDuration={80000000} onClose={handleCloseAlert}>
            <Alert onClose={handleCloseAlert} variant='filled'  severity="success" sx={{ width: '100%', color: '#fff'}}>
                {`Thêm thành công ấn phẩm `}
            </Alert>
        </Snackbar>
    </Grid>
};

export default ProviderNotifications;
