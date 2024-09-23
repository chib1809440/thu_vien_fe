import React from 'react';

// material-ui
import { Button, CardActions, CardContent, Divider, Grid, IconButton, Modal, Typography } from '@mui/material';

// project imports
// assets
import CloseIcon from '@mui/icons-material/Close';
import MainCard from '../../../../../../ui-component/cards/MainCard';
import { useSyncPublisher } from '../hook/syncPublisher';


export default function ModalSyncPublisher(props: {
    isOpen?: any;
    isClose?: any;
    data?: any;
    dataSync?: any;
}) {
    const rootRef = React.useRef(null);

    const [isOpen, setOpen] = React.useState(false);
    const [data, setData] = React.useState<any>([]);

    const { hanldSyncPublisher, isSubmit } = useSyncPublisher()

    React.useEffect(() => {
        setOpen(props.isOpen)
    }, [props.isOpen])

    React.useEffect(() => {
        if (isSubmit) {
            setOpen(false)
            props.isClose(false)
        }
    }, [isSubmit])

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
                secondary={
                    <IconButton size="large">
                        <CloseIcon fontSize="small" onClick={handleClose} />
                    </IconButton>
                }
            >
                <CardContent>
                    <Typography fontWeight={900} fontSize={18}>Xác nhận đồng bộ dữ liệu Nhà xuất bản!</Typography>
                </CardContent>
                <Divider />
                <CardActions>
                    <Grid container justifyContent="flex-end" gap={2}>
                        <Button variant="contained" type="button" sx={{ textTransform: 'none' }} onClick={() => hanldSyncPublisher(props.dataSync)}>
                            Xác nhận
                        </Button>
                        <Button variant="contained" color='error' type="button" sx={{ textTransform: 'none' }} onClick={handleClose}>
                            Huỷ
                        </Button>
                    </Grid>
                </CardActions>
            </MainCard>
        </Modal>
    );
}
