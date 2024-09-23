import React from 'react';

// material-ui
import { Button, CardActions, CardContent, Divider, Grid, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// project imports
// assets
import CloseIcon from '@mui/icons-material/Close';
import MainCard from '../../../../../../../ui-component/cards/MainCard';
import imageVodeo from '../../../../../../../assets/images/books/book-dientu.jpg';
import sachSimple from '../../../../../../../assets/images/books/book-truyenthong.jpg';
import { useApproveRegisterSlip } from '../../Loan/hook/approve';
import { useApproveLoanSlip } from '../hook/approve';


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

export default function ModalTraSach(props: {
    isOpen?: any;
    isClose?: any;
    data?: any;
}) {
    const rootRef = React.useRef(null);
    const apiLT = window.localStorage.getItem('apiLT')

    const [isOpen, setOpen] = React.useState(false);

    const { approveLoanSlip, isStatus } = useApproveLoanSlip()

    React.useEffect(() => {
        setOpen(props.isOpen)
    }, [props.isOpen])

    function checkUrl(dataDetails) {

        if (props.data?.supplies !== undefined && props.data?.length !== 0) {
            let abc: string = `${apiLT}/media/${dataDetails?.medias[dataDetails?.medias?.length - 1]?.['url']}`
            let lastChar = dataDetails?.medias[dataDetails?.medias?.length - 1]?.['url'].slice(-4);

            if (dataDetails?.medias !== null && dataDetails?.medias?.length !== 0) {
                if (lastChar === '.mp4' || lastChar === '.pdf') {
                    return <video style={{ borderRadius: '5px' }} width='70px' height='auto' src={imageVodeo} />
                }
                if (lastChar === '.png' || lastChar === '.jpg' || lastChar === '.jpeg') {
                    return <img style={{ borderRadius: '5px' }} width='60px' height='auto' src={abc} alt="ảnh ấn phẩm" />
                }
            } else {
                return <img style={{ borderRadius: '5px' }} width='60px' height='auto' src={sachSimple} alt="ảnh ấn phẩm" />
            }
        }
    }

    function handleClose() {
        setOpen(false)
        props.isClose(false)
    }

    React.useEffect(() => {
        if (isStatus) {
            setOpen(false)
            props.isClose(false)
        }
    }, [isStatus])

    function getFormattedDate(date) {
        const newDate = new Date(date);

        return newDate.toLocaleDateString('en-GB')
    }

    return (
        <>
            {props.data?.supplies !== undefined &&
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
                            width: 'auto',
                            zIndex: 1
                        }}
                        title={`Xác nhận trả sách`}
                        content={false}
                        secondary={
                            <IconButton size="large">
                                <CloseIcon fontSize="small" onClick={handleClose} />
                            </IconButton>
                        }
                    >
                        <CardContent>
                            {props.data &&
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Hình ảnh</TableCell>
                                                <TableCell align="center">Tên ấn phẩm</TableCell>
                                                <TableCell align="center">Mã ISBN</TableCell>
                                                <TableCell align="center">Ngày mượn</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow
                                                key={props.data.supplyID}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {checkUrl(props.data?.supplies[props.data?.supplies?.length - 1]?.supply)}
                                                </TableCell>
                                                <TableCell align="center">{props.data?.supplies[props.data?.supplies?.length - 1]?.supply?.supplyName}</TableCell>
                                                <TableCell align="center">{props.data?.supplies[props.data?.supplies?.length - 1]?.supply?.ISBN}</TableCell>
                                                <TableCell align="center">{getFormattedDate(props.data?.create_at)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            }
                        </CardContent>
                        <Divider />
                        <CardActions>
                            <Grid container justifyContent="flex-end">
                                <Button variant="contained" type="button" sx={{ textTransform: 'none' }} onClick={() => approveLoanSlip(props.data)}>
                                    Xác nhận
                                </Button>
                            </Grid>
                        </CardActions>
                    </MainCard>
                </Modal>
            }
        </>

    );
}
