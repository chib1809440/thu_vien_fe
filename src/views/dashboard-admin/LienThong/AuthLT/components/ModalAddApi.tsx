import React from 'react';

// material-ui
import { Button, CardActions, CardContent, Divider, FormControl, FormHelperText, Grid, IconButton, Input, InputLabel, Modal, OutlinedInput, TextField } from '@mui/material';

// project imports
// assets
import CloseIcon from '@mui/icons-material/Close';
import MainCard from '../../../../../ui-component/cards/MainCard';
import { useCreateApi } from '../hook/CreateApi';


export default function ModalAddApi(props: {
    isOpen?: any;
    isClose?: any;
    data?: any;
}) {
    const rootRef = React.useRef(null);

    const [isOpen, setOpen] = React.useState(false);
    const [addressApi, setAddressApi] = React.useState('');
    const [nameApi, setNameApi] = React.useState('');

    const { createApi, isStatus } = useCreateApi()

    React.useEffect(() => {
        setOpen(props.isOpen)
    }, [props.isOpen])

    React.useEffect(() => {
        if (isStatus) {
            setOpen(false)
            props.isClose(false)
        }
    }, [isStatus])

    function handleClose() {
        setOpen(false)
        props.isClose(false)
    }

    return (
        <Modal
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            open={isOpen}
            aria-labelledby="server-modal-title"
            aria-describedby="server-modal-description"
            sx={{
                display: 'flex',
                p: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}
            container={() => rootRef.current}
        >
            <MainCard
                sx={{
                    width: '450px',
                    zIndex: 1
                }}
                title='Thêm trung tâm liên thông'
                content={false}
                secondary={
                    <IconButton size="large">
                        <CloseIcon fontSize="small" onClick={handleClose} />
                    </IconButton>
                }
            >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth>
                        <TextField
                            id="outlined-address"
                            label="Tên trung tâm"
                            onChange={(e) => setNameApi(e.target.value)}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <TextField
                            id="outlined-address"
                            label="Địa chỉ trung tâm"
                            onChange={(e) => setAddressApi(e.target.value)}
                        />
                    </FormControl>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button" sx={{ textTransform: 'none' }} onClick={() => createApi(addressApi, nameApi)}>
                            Xác nhận
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
}
