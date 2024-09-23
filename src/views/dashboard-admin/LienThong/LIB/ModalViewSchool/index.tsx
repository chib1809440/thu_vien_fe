import React from 'react';

// material-ui
import { CardActions, CardContent, Divider, Grid, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// project imports
// assets
import CloseIcon from '@mui/icons-material/Close';
import imageVodeo from '../../../../../assets/images/books/book-dientu.jpg';
import sachSimple from '../../../../../assets/images/books/book-truyenthong.jpg';
import MainCard from '../../../../../ui-component/cards/MainCard';
import { dispatch, useSelector } from '../../../../../store';
import { getUserLTWaiting } from '../../../../../store/slices/userLT';

const ModalWrapper = styled('div')({
    marginBottom: 16,
    height: 500,
    flexGrow: 1,
    minWidth: 300,
    zIndex: -1,
    transform: 'translateZ(0)',
    '@media all and (-ms-high-contrast: none)': {
        display: 'none'
    }
});

// ==============================|| SERVER MODAL ||============================== //

export default function ModalViewSchool(props: {
    isOpen?: any;
    isClose?: any;
    data?: any;
}) {
    const rootRef = React.useRef(null);
    const { getUserLT } = useSelector((state) => state.getUserLT);

    const [isOpen, setOpen] = React.useState(false);
    const [data, setData] = React.useState<any>([]);

    React.useEffect(() => {
        setOpen(props.isOpen)
    }, [props.isOpen])

    React.useEffect(() => {
        dispatch(getUserLTWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const filterSchool = getUserLT?.filter((item: any) => item?.userID === props.data?.user?.userID)
        setData(filterSchool)
    }, [props.data])

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
                    minWidth: '600px',
                    zIndex: 1
                }}
                title={`Chi tiết trường ${data[0]?.schoolName}`}
                content={false}
                secondary={
                    <IconButton size="large">
                        <CloseIcon fontSize="small" onClick={handleClose} />
                    </IconButton>
                }
            >
                <CardContent>
                   <Typography fontWeight={900} fontSize={18}>Địa chỉ: {data[0]?.addressUser}</Typography>
                   <Typography fontWeight={900} fontSize={18}>Liên hệ: {data[0]?.numberPhone}</Typography>
                </CardContent>
                <Divider />
                <CardActions>

                </CardActions>
            </MainCard>
        </Modal>
    );
}
