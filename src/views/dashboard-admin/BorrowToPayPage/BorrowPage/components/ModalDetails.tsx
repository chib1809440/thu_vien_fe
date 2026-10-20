// material-ui
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import React from 'react';

// third party
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function ModalDetails(props: {
    isOpen: any;
    isClose: any;
    productItems: any;
    dataUpdate: any;
}) {

    const [data, setData] = React.useState<any>([]);

    React.useEffect(() => {
        setData(props.dataUpdate)
    }, [props.dataUpdate])
    const handleClose = () => {
        props.isClose(false);
    };

    function getFormattedDate(datev) {
        const date = new Date(datev);

        return date.toLocaleDateString('en-GB')
    }

    function plusReturnedQty(dataDetails) {
        let returned_qty = 0;

        if (dataDetails?.length > 0) {
            dataDetails.forEach((item) => {
                returned_qty = returned_qty + item.returned_qty;
            });
            return Number(returned_qty);
        }
    }

    return (
        <>
            <Dialog
                open={props.isOpen}
                onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle textAlign='center' style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Chi tiết phiếu mượn
                </DialogTitle>
                <DialogContent>
                    <Grid container gap={0.5} >
                        <CsGrid container>
                            <CsTypography>Mã phiếu</CsTypography>
                            <CsTypographyContent>{`PM${data?.loanSlipNumber}`}</CsTypographyContent>
                        </CsGrid>
                        <CsGrid container >
                            <CsTypography>Họ và tên</CsTypography>
                            <CsTypographyContent color='#2196F3'>{data?.users?.fullName}</CsTypographyContent>
                        </CsGrid>
                        <CsGrid container >
                            <CsTypography>Số điện thoại</CsTypography>
                            <CsTypographyContent color='#2196F3'>{data?.users?.numberPhone}</CsTypographyContent>
                        </CsGrid>
                        <CsGrid container >
                            <CsTypography>Ngày mượn </CsTypography>
                            <CsTypographyContent>{getFormattedDate(data?.create_at)}</CsTypographyContent>
                        </CsGrid>
                        <CsGrid container >
                            <CsTypography>Ngày hẹn trả </CsTypography>
                            <CsTypographyContent>{getFormattedDate(data?.return_at)}</CsTypographyContent>
                        </CsGrid>
                        <CsGrid container >
                            <CsTypography>Gia hạn</CsTypography>
                            {data?.limited_date === null ? <CsTypographyContent>Chưa gia hạn</CsTypographyContent> : <CsTypographyContent>{getFormattedDate(data?.limited_date)}</CsTypographyContent>}
                        </CsGrid>
                        <CsGrid container >
                            <CsTypography>Trạng thái </CsTypography>
                            {data?.state === false ? <CsTypographyContent>Chưa trả</CsTypographyContent> : <CsTypographyContent>Đã trả</CsTypographyContent>}
                        </CsGrid>
                        <CsGrid container >
                            <CsTypography>Ghi chú </CsTypography>
                            <CsTypographyContent>{data?.note}</CsTypographyContent>
                        </CsGrid>
                        <CsGrid container>
                            <CsTypography>Sách mượn </CsTypography>
                        </CsGrid>
                        <Grid container justifyContent=''>
                            <Grid sx={{ width: '137px' }}>
                                <CsTypographyV2 display={{ lg: 'block', md: 'block', sm: 'block', xl: 'block', xs: 'none' }}>Ảnh sách </CsTypographyV2>

                            </Grid>
                            <Grid sx={{ width: '250px' }}>
                                <CsTypographyV2>Tên ấn phẩm </CsTypographyV2>

                            </Grid>
                            <Grid sx={{ width: '200px' }}>
                                <CsTypographyV2>Số lượng </CsTypographyV2>

                            </Grid>
                        </Grid>
                        {data?.supplies !== undefined &&
                            <>
                                {data?.supplies.map((items, i) => (
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<GridExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Grid container justifyContent=''>
                                                <Grid sx={{ width: '120px' }}>
                                                    <img src={`${import.meta.env.REACT_APP_BASE_API_URL}${items?.supply?.listMedia[items?.supply?.listMedia.length -1]?.url}`} height='60px' alt='ảnh sách' />
                                                </Grid>
                                                <Grid sx={{ width: '250px' }}>
                                                    <CsTypographyContent alignItems='center' sx={{ display: 'flex' }} height='70px' color='#2196F3' key={i}>{`${items?.supply?.supplyName}\u00a0`}</CsTypographyContent>
                                                </Grid>
                                                <Grid sx={{ width: '200px' }}>
                                                    {plusReturnedQty(items?.detail) === items?.qty ?
                                                        <CsTypographyContent alignItems='center' sx={{ display: 'flex' }} height='70px' color='#00CC00' key={i}>Đã trả</CsTypographyContent>
                                                        :
                                                        <CsTypographyContent alignItems='center' sx={{ display: 'flex' }} height='70px' color='#2196F3' key={i}>{`Đã trả ${plusReturnedQty(items?.detail) === undefined ? '0' : plusReturnedQty(items?.detail)} / ${items?.qty}\u00a0`}</CsTypographyContent>
                                                    }
                                                </Grid>
                                            </Grid>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography textAlign='center' fontSize='16px' fontWeight={900}>
                                                Lịch sử trả
                                            </Typography>
                                            {items?.detail.map((itemDetail) => (
                                                <Grid container justifyContent='center'>
                                                <Grid container justifyContent='space-between' md={7}>
                                                    <Typography fontSize='15px' fontWeight={600}>Ngày trả</Typography>
                                                    <Typography fontSize='15px' fontWeight={600}>Số lượng</Typography>
                                                </Grid>
                                                <Grid container justifyContent='space-between' md={7} mt={2}>
                                                    <Typography>{getFormattedDate(itemDetail?.date)}</Typography>
                                                    <Typography mr={3}>{itemDetail?.returned_qty}</Typography>
                                                </Grid>
                                            </Grid>
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </>

                        }

                        {/* <CsGrid container justifyContent='center' maxHeight='400px'>
                            <CsTypography display={{ lg: 'block', md: 'block', sm: 'block', xl: 'block', xs: 'none' }}>
                                {data?.supplies !== undefined &&
                                    <>
                                        {data?.supplies.map((items, i) => (
                                            // <CsTypographyContent pl={1} key={i}>{`${items?.supply?.supplyName}\u00a0`}</CsTypographyContent>
                                            <Grid container alignItems='center' pl={1} height='70px' sx={{ borderBottom: '1px solid #CCCCCC' }}>
                                                <img src={`${import.meta.env.REACT_APP_BASE_API_URL}${items?.supply?.listMedia[0]?.url}`} height='60px' alt='ảnh sách' />
                                            </Grid>
                                        ))}
                                    </>
                                }
                            </CsTypography>
                            <CsTypography >
                                {data?.supplies !== undefined &&
                                    <>
                                        {data?.supplies.map((items, i) => (
                                            <>
                                                <CsTypographyContent alignItems='center' sx={{ display: 'flex', borderBottom: '1px solid #CCCCCC' }} height='70px' color='#2196F3' key={i}>{`${items?.supply?.supplyName}\u00a0`}</CsTypographyContent>
                                            </>
                                        ))}
                                    </>
                                }
                            </CsTypography>

                            <CsTypography>
                                {data?.supplies !== undefined &&
                                    <>

                                        {data?.supplies.map((items, i) => (
                                            <>
                                                {plusReturnedQty(items?.detail) === items?.qty ?
                                                    <CsTypographyContent alignItems='center' sx={{ display: 'flex', borderBottom: '1px solid #CCCCCC' }} height='70px' color='#00CC00' key={i}>Đã trả</CsTypographyContent>
                                                    :
                                                    <CsTypographyContent alignItems='center' sx={{ display: 'flex', borderBottom: '1px solid #CCCCCC' }} height='70px' color='#2196F3' key={i}>{`Đã trả ${plusReturnedQty(items?.detail) === undefined ? '0' : plusReturnedQty(items?.detail)} / ${items?.qty}\u00a0`}</CsTypographyContent>
                                                }
                                            </>
                                        ))}
                                    </>
                                }
                            </CsTypography>
                        </CsGrid> */}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color="error" variant="contained" onClick={handleClose}>
                        Quay lại
                    </Button>
                    {/* <Button color="success" onClick={() => handleComform(selected)}>Chắn chắn</Button> */}
                </DialogActions>
            </Dialog>
        </>

    );
}

const CsGrid = styled(Grid)(({ theme }) => ({
    // borderBottom: '0.1px dotted #616161'
}));
const CsTypography = styled(Typography)(({ theme }) => ({
    fontSize: 22,
    width: '200px',
    fontWeight: 900,
    [theme.breakpoints.only("xs")]: {
        fontSize: 16,
        width: '130px',
        fontWeight: 900
    },
    [theme.breakpoints.only("sm")]: {
        fontSize: 16,
        width: '130px',
        fontWeight: 900
    },
    [theme.breakpoints.only("md")]: {
        fontSize: 16,
        width: '130px',
        fontWeight: 900
    },
    [theme.breakpoints.only("lg")]: {
        fontSize: 16,
        width: '130px',
        fontWeight: 900
    },
}));
const CsTypographyV2 = styled(Typography)(({ theme }) => ({
    fontSize: 18,
    width: '200px',
    fontWeight: 900,
    [theme.breakpoints.only("xs")]: {
        fontSize: 16,
        width: '130px',
        fontWeight: 900
    },
    [theme.breakpoints.only("sm")]: {
        fontSize: 16,
        width: '130px',
        fontWeight: 900
    },
    [theme.breakpoints.only("md")]: {
        fontSize: 16,
        width: '130px',
        fontWeight: 900
    },
    [theme.breakpoints.only("lg")]: {
        fontSize: 16,
        width: '130px',
        fontWeight: 900
    },
}));

const CsTypographyContent = styled(Typography)(({ theme }) => ({
    fontSize: 22,
    width: 'auto',
    [theme.breakpoints.only("xs")]: {
        fontSize: 16,
        width: 'auto'
    },
    [theme.breakpoints.only("sm")]: {
        fontSize: 16,
        width: 'auto'
    },
    [theme.breakpoints.only("md")]: {
        fontSize: 16,
        width: 'auto'
    },
    [theme.breakpoints.only("lg")]: {
        fontSize: 16,
        width: 'auto'
    },
}));