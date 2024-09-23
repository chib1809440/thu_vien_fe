import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, FormControl, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import Modal from '@mui/material/Modal';
import { styled } from "@mui/styles";
import React from "react";
import useScanDetection from 'use-scan-detection';
import { dispatch, useSelector } from "../../../store";
import { getAllAccountWaiting } from "../../../store/slices/allAccount";
import { getLoanSlipWaiting } from "../../../store/slices/loanSlip";
import { getSuppliesWaiting } from "../../../store/slices/supplies";
import { GetAllAccount } from "../../../types/allAccount";
import { GetLoanSlip } from "../../../types/loanSlip";
import { GetSupplies } from "../../../types/supplies";
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import ModalExtend from "../BorrowToPayPage/BorrowPage/components/ModalExtend";
import UpdateModal from "../BorrowToPayPage/BorrowPage/components/ModalUpdate";
import CreateModal from "./ModalAdd";
import { useCreateLoanSlip } from "./hook/createLoanSlip";
import logoNam from './nam.png';
import logoNu from './nu.png';
import { openBarcode } from '../../../store/slices/barcodeV2';

interface Column {
    id: 'supply' | 'code' | 'population';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: 'supply', label: 'Phiếu\u00a0mượn', minWidth: 170 },
    { id: 'code', label: 'Tên ấn phẩm', minWidth: 170 },
    {
        id: 'population',
        label: 'Trạng\u00a0Thái',
        minWidth: 170,
        align: 'right',
        format: (value: number) => value.toLocaleString('en-US'),
    },
];

interface Data {
    supply: string;
    code: string;
    population: number;

}

function createData(
    supply: string,
    code: string,
    population: number


): Data {
    return { supply, code, population };
}

const rows = [
    createData('Tiếng việt 1', '22/10/2023', 1324171354),
    createData('Tiếng việt 1', '22/10/2023', 1324171354),
    createData('Tiếng việt 1', '22/10/2023', 1324171354),
    createData('Tiếng việt 1', '22/10/2023', 1324171354),
    createData('Tiếng việt 1', '22/10/2023', 1324171354),
];
// 
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '22px'
};

export default function ModalUserRoot(props: {
    [x: string]: any;
    userID?: string;
    isOpen?: any;
    isClose?: () => void;
    barCode?: any;
}) {

    const [dataLoanSlip, setDataLoanSlip] = React.useState<GetLoanSlip[] | undefined | any>([]);
    const [dataAccount, setDataAccount] = React.useState<GetAllAccount[] | undefined | any>([]);
    const [dataSupplies, setDataSupplies] = React.useState<GetSupplies[] | undefined>([]);

    const [dataLoanSlipDetailsPay, setDataLoanSlipDetailsPay] = React.useState<GetLoanSlip[] | undefined | any>([]);
    const [dataLoanSlipDetailsUnPay, setDataLoanSlipDetailsUnPay] = React.useState<GetLoanSlip[] | undefined | any>([]);
    const [barcodeScan, setBarcodeScan] = React.useState<any>('')
    const [isOpenRoot, setOpenRoot] = React.useState<boolean>(false);
    const [isHover, setHover] = React.useState<boolean>(false);

    const { hanldMuonlaiLoanSlip } = useCreateLoanSlip()

    const { getLoanSlip } = useSelector((state) => state.getLoanSlip);
    const { allAccount } = useSelector((state) => state.getAllAccount);
    const { getSupplies } = useSelector((state) => state.getSupplies);

    React.useEffect(() => {
        setDataLoanSlip(getLoanSlip);
        setDataSupplies(getSupplies);
    }, [getLoanSlip, allAccount, getSupplies]);
    React.useEffect(() => {
        dispatch(getLoanSlipWaiting());
        dispatch(getAllAccountWaiting());
        dispatch(getSuppliesWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        setDataAccount(allAccount?.filter((items) => items.userID === barcodeScan || items.userID === props.userID));
    }, [allAccount, barcodeScan, props.userID]);

    useScanDetection({
        onComplete: (code: any) => {

            const idReplace = code.replace(/Shift|rrowLeftBackspace/g, "").toUpperCase()
            const isValidateBarcode = idReplace.indexOf("GDU")

            if (idReplace?.length === 13 && isValidateBarcode === 0) {
                setBarcodeScan(idReplace)
                dispatch(openBarcode({
                    openBC: true,
                    userID: idReplace,
                }))
            }
        }
    });

    React.useEffect(() => {
        const dataRows = dataLoanSlip?.filter((data) => data?.users?.userID === dataAccount[0]?.userID);
        // const dataRowsFilterPay = dataRows?.filter((data) => data?.state === true);
        const dataRowsFilterUnPay = dataRows?.filter((data) => data?.state === false);
        setDataLoanSlipDetailsPay(dataRows)
        setDataLoanSlipDetailsUnPay(dataRowsFilterUnPay)
    }, [dataLoanSlip, dataAccount]);

    React.useEffect(() => {
        setBarcodeScan(props.userID)
    }, [props.userID])

    React.useEffect(() => {
        setOpenRoot(props.isOpen);
    }, [props.isOpen])

    const handleCloseRoot = () => {
        if (isHover) {
            dispatch(openBarcode({
                openBC: false,
                userID: '',
            }))
        }
    }

    // React.useEffect(() => {
    //     // Gọi hàm isClose khi component con được mount
    //     props.isClose && props.isClose();

    //     // Thêm hàm handleCloseRoot vào sự kiện cần xử lý, ví dụ: sự kiện click
    //     window.addEventListener('click', handleCloseRoot);

    //     // Xóa bỏ sự kiện khi component con bị unmount
    //     return () => {
    //         window.removeEventListener('click', handleCloseRoot);
    //     };
    // }, [props.isClose, isHover]);

    function ChildModalConform(row) {

        const [open, setOpen] = React.useState(false);
        const [, setUpdateLoanSlip] = React.useState(false);

        const handleOpen = () => {
            setOpen(true);
        };
        return (
            <React.Fragment>
                <Button onClick={handleOpen} variant="contained" color="info" sx={{ color: '#fff', borderRadius: '10px' }}>Trả ấn phẩm</Button>
                <UpdateModal isOpen={open} isClose={(newValue) => setOpen(newValue)} dataUpdate={row?.loanSlipNumber} isUpdate={(newValue) => setUpdateLoanSlip(newValue)} />
            </React.Fragment>
        );
    }

    function ChildModalExtent(data) {
        const [open, setOpen] = React.useState(false);
        const handleOpen = () => {
            setOpen(true);
        };
        return (
            <React.Fragment>
                <Button onClick={handleOpen} variant="contained" color="info" sx={{ color: '#fff', borderRadius: '10px' }}>Gia hạn</Button>
                <ModalExtend isOpen={open} isClose={(newValue) => setOpen(newValue)} dataUpdate={data?.loanSlipNumber} />

            </React.Fragment>
        );
    }

    function ChildModalHis(data) {

        const [valueDate, setValueDate] = React.useState('');

        function getFormattedDate(date) {
            let year = date.getFullYear();
            let month = (1 + date.getMonth()).toString().padStart(2, '0');
            let day = date.getDate().toString().padStart(2, '0');

            return year + '-' + month + '-' + day;
        }
        const dateOff = new Date(data?.data?.return_at);
        const dateMonth = new Date(Date.now() + (3600 * 1000 * 24 * 60))
        const [open, setOpen] = React.useState(false);
        const handleOpen = () => {
            setOpen(true);
        };
        return (
            <React.Fragment>
                <Button onClick={handleOpen} variant="contained" color="info" sx={{ color: '#fff', borderRadius: '10px' }}>Mượn lại</Button>
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style }}>
                        <Grid md={12} xs={12}>
                            <Grid xs={12} container justifyContent='center' borderRadius={{ xs: 'none', md: '1px solid' }}>
                                <Typography fontSize={{ xs: '12px', md: '28px' }} fontWeight={900}>Xác nhận mượn lại?</Typography>
                            </Grid>
                            <Grid md={12} sm={12} xs={12} mt={2}>
                                <FormControl fullWidth>
                                    <TextField
                                        type="date"
                                        defaultValue={getFormattedDate(dateOff)}
                                        label="Ngày trả"
                                        onChange={(e) => setValueDate(e.target.value)}
                                        inputProps={{ min: getFormattedDate(dateOff), max: getFormattedDate(dateMonth) }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid xs={12} mt={4} gap={4} container justifyContent='center' borderRadius={{ xs: 'none', md: '1px solid' }}>
                                <Button onClick={() => hanldMuonlaiLoanSlip(data, valueDate)} variant="contained" color="info" sx={{ color: '#fff', borderRadius: '10px' }}>Xác nhận</Button>
                                <Button onClick={() => setOpen(false)} variant="contained" color="error" sx={{ color: '#fff', borderRadius: '10px' }}>Huỷ</Button>
                            </Grid>
                        </Grid>
                        <ClearIcon sx={{
                            position: 'absolute', top: 10, right: 10, '&:hover': {
                                bgcolor: '#0288d1',
                                color: 'warning.light',
                                borderRadius: '10px'
                            }
                        }} onClick={() => setOpen(false)} />
                    </Box>
                </Modal>
            </React.Fragment>
        );
    }
    function ChildModalCre() {
        const [open, setOpen] = React.useState(false);
        const handleOpen = () => {
            setOpen(true);
        };
        return (
            <React.Fragment>
                <Button onClick={handleOpen} sx={{ color: '#33CC00' }} fullWidth endIcon={<SendIcon />}>
                    TIẾP
                </Button>
                {/* <CreateModal isOpen={open} isClose={(newValue) => setOpen(newValue)} dataAccount={dataAccount} isCre={(newIsCre) => setCre(newIsCre)} /> */}
                <CreateModal isOpen={open} isClose={(value) => setOpen(value)} productItems={dataSupplies} dataUser={dataAccount} />
            </React.Fragment>
        );
    }

    function ChildModal() {
        const [open, setOpen] = React.useState(false);
        const handleOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };
        // 
        const [page, setPage] = React.useState(0);
        const [rowsPerPage, setRowsPerPage] = React.useState(10);

        const handleChangePage = (event: unknown, newPage: number) => {
            setPage(newPage);
        };

        const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
        };

        return (
            <React.Fragment>
                <Button onClick={handleOpen} sx={{ color: '#33CC00' }} fullWidth endIcon={<SendIcon />}>
                    TIẾP
                </Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style }}>
                        <Grid md={12} xs={12}>
                            <Grid xs={12} container justifyContent='center' borderRadius={{ xs: 'none', md: '1px solid' }}>
                                <Typography fontSize={{ xs: '12px', md: '32px' }} fontWeight={900}>DANH SÁCH MƯỢN</Typography>
                            </Grid>
                            <Grid xs={12} height='500px' width={{ md: '750px', xs: '350px' }} container justifyContent='center' borderRadius={{ xs: 'none', md: '1px solid' }}>
                                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    {columns.map((column) => (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                            style={{ minWidth: column.minWidth }}
                                                        >
                                                            {column.label}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {dataLoanSlipDetailsUnPay
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((row) => {
                                                        return (
                                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.loanSlipNumber}>
                                                                <TableCell>
                                                                    PM{row?.loanSlipNumber}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {row.supplies.map((items) =>
                                                                        <Grid>
                                                                            <Typography>{items?.supply?.supplyName}</Typography>
                                                                        </Grid>
                                                                    )}
                                                                    {/* {row?.users?.fullName} */}
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    {row.return_date !== null ?
                                                                        <Grid container gap={2} justifyContent='flex-end'>
                                                                            <ChildModalExtent loanSlipNumber={row} />
                                                                            <ChildModalConform loanSlipNumber={row} />
                                                                        </Grid>
                                                                        :
                                                                        <Grid container gap={2} justifyContent='flex-end'>
                                                                            <ChildModalExtent loanSlipNumber={row} />
                                                                            <ChildModalConform loanSlipNumber={row} />
                                                                        </Grid>
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 100]}
                                        component="div"
                                        count={rows?.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        labelRowsPerPage={"Số hàng trên trang"}
                                        labelDisplayedRows={function defaultLabelDisplayedRows({ from, to, count }) {
                                            return ` từ ${from}–${to} trên ${count !== -1 ? count : `more than ${to}`}`;
                                        }}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                        <ClearIcon sx={{
                            position: 'absolute', top: 10, right: 10, '&:hover': {
                                bgcolor: '#0288d1',
                                color: 'warning.light',
                                borderRadius: '10px'
                            }
                        }} onClick={handleClose} />
                    </Box>
                </Modal>
            </React.Fragment>
        );
    }

    function ChildModalHistory() {
        const [open, setOpen] = React.useState(false);
        const handleOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };
        // 
        const [page, setPage] = React.useState(0);
        const [rowsPerPage, setRowsPerPage] = React.useState(10);

        const handleChangePage = (event: unknown, newPage: number) => {
            setPage(newPage);
        };

        const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(+event.target.value);
            setPage(0);
        };

        return (
            <React.Fragment>
                <Button onClick={handleOpen} sx={{ color: '#33CC00' }} fullWidth endIcon={<SendIcon />}>
                    TIẾP
                </Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="child-modal-title"
                    aria-describedby="child-modal-description"
                >
                    <Box sx={{ ...style }}>
                        <Grid md={12} xs={12}>
                            <Grid xs={12} container justifyContent='center' borderRadius={{ xs: 'none', md: '1px solid' }}>
                                <Typography fontSize={{ xs: '12px', md: '32px' }} fontWeight={900}>LỊCH SỬ MƯỢN</Typography>
                            </Grid>
                            <Grid xs={12} height='500px' width={{ md: '750px', xs: '350px' }} container justifyContent='center' borderRadius={{ xs: 'none', md: '1px solid' }}>
                                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                                    <TableContainer sx={{ maxHeight: 440 }}>
                                        <Table stickyHeader aria-label="sticky table">
                                            <TableHead>
                                                <TableRow>
                                                    {columns.map((column) => (
                                                        <TableCell
                                                            key={column.id}
                                                            align={column.align}
                                                            style={{ minWidth: column.minWidth }}
                                                        >
                                                            {column.label}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {dataLoanSlipDetailsPay
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((row) => {
                                                        return (
                                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.loanSlipNumber}>
                                                                <TableCell>
                                                                    {row.supplies.map((items) =>
                                                                        <Grid>
                                                                            <Typography>PM{row?.loanSlipNumber}</Typography>
                                                                        </Grid>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {/* {row?.supplies[0]?.supply?.supplyName} */}
                                                                    {row.supplies.map((items) =>
                                                                        <Grid>
                                                                            <Typography>{items?.supply?.supplyName}</Typography>
                                                                        </Grid>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    <ChildModalHis data={row} />
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <TablePagination
                                        rowsPerPageOptions={[10, 25, 100]}
                                        component="div"
                                        count={rows?.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                        labelRowsPerPage={"Số hàng trên trang"}
                                        labelDisplayedRows={function defaultLabelDisplayedRows({ from, to, count }) {
                                            return ` từ ${from}–${to} trên ${count !== -1 ? count : `more than ${to}`}`;
                                        }}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                        <ClearIcon sx={{
                            position: 'absolute', top: 10, right: 10, '&:hover': {
                                bgcolor: '#0288d1',
                                color: 'warning.light',
                                borderRadius: '10px'
                            }
                        }} onClick={handleClose} />
                    </Box>
                </Modal>
            </React.Fragment>
        );
    }

    return (
        <Grid>
            <Grid>
                <Modal
                    open={isOpenRoot}
                    // onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{ border: 'none' }}
                >
                    <Box sx={style}>
                        <Grid sx={{ position: 'absolute', top: 10, right: 10 }} borderRadius={{ xs: 'none', md: '1px solid' }}>
                            <AnimateButton>
                                <Button
                                    onMouseEnter={() => setHover(true)}
                                    onMouseLeave={() => setHover(false)}
                                    onClick={handleCloseRoot} variant='outlined' color='error'>Thoát</Button>
                            </AnimateButton>
                        </Grid>
                        <Grid xs={12}>
                            <Grid xs={12} container justifyContent='center' borderRadius={{ xs: 'none', md: '1px solid' }}>
                                <Typography fontSize={{ xs: '12px', md: '32px' }} fontWeight={900}>HỒ SƠ CÁ NHÂN</Typography>
                            </Grid>
                            <Grid container xs={12}>
                                <Grid md={4} sm={4} xs={12} container justifyContent='center'>
                                    {dataAccount?.length !== 0 && dataAccount !== undefined &&
                                        <>
                                            {dataAccount[0]?.imageUser === null || dataAccount[0]?.imageUser === 'default_image.jpg' ?
                                                <>
                                                    {dataAccount[0]?.gender === '0' ?
                                                        <img style={{ borderRadius: '5px' }} width='80px' src={logoNam} alt="ảnh thành viên" />
                                                        :
                                                        <img style={{ borderRadius: '5px' }} width='80px' src={logoNu} alt="ảnh thành viên" />
                                                    }
                                                </>
                                                :
                                                <img style={{ borderRadius: '5px' }} width='100px' height='auto' src={`${process.env.REACT_APP_BASE_API_URL}/${dataAccount[0]?.imageUser}`} alt="ảnh thành viên" />
                                            }
                                        </>
                                    }
                                </Grid>
                                {dataAccount?.length !== 0 && dataAccount !== undefined &&
                                    <Grid pl={{ md: 4, sm: 1, xs: 0 }} md={8} sm={4} xs={12} container justifyContent='flex-start'>
                                        <Grid container gap={2} md={12} xs={12} justifyContent='flex-start' >
                                            <Typography fontSize={{ md: '18px', xs: '12px' }} fontWeight={500}>HỌ VÀ TÊN: </Typography>
                                            <Typography fontSize={{ md: '18px', xs: '12px' }} fontWeight={500}>{dataAccount[0]?.fullName}</Typography>
                                        </Grid>
                                        <Grid container gap={2} xs={12}>
                                            <Typography fontSize={{ md: '18px', xs: '12px' }} fontWeight={500}>SỐ ĐIỆN THOẠI: </Typography>
                                            <Typography fontSize={{ md: '18px', xs: '12px' }} fontWeight={500}>{dataAccount[0]?.numberPhone}</Typography>
                                        </Grid>
                                        <Grid container gap={2} xs={12}>
                                            <Typography fontSize={{ md: '18px', xs: '12px' }} fontWeight={500}>EMAIL: </Typography>
                                            <Typography fontSize={{ md: '18px', xs: '12px' }} fontWeight={500}>{dataAccount[0]?.emailUser}</Typography>
                                        </Grid>
                                        <Grid container gap={2} xs={12}>
                                            <Typography fontSize={{ md: '18px', xs: '12px' }} fontWeight={500}>ĐỊA CHỈ: </Typography>
                                            <Typography fontSize={{ md: '18px', xs: '12px' }} fontWeight={500}>{dataAccount[0]?.addressUser}</Typography>
                                        </Grid>
                                    </Grid>
                                }
                            </Grid>
                            <Grid xs={12} mt={5} container justifyContent='center'>
                                <Grid container xs={12} pt={3} justifyContent='space-around' gap={{ xs: 1, md: 0 }}>
                                    <Item md={3.5} xs={12} sx={{ borderBottom: '4px solid #0099FF' }} height={{ md: '80px', xs: '60px' }}>
                                        <Title fontSize={{ xs: '12px', md: '16px' }} >MƯỢN SÁCH</Title>
                                        <ChildModalCre />
                                    </Item>
                                    <Item md={3.5} xs={12} sx={{ borderBottom: '4px solid #0099FF' }} height={{ md: '80px', xs: '60px' }}>
                                        <Title fontSize={{ xs: '12px', md: '16px' }}>TRẢ SÁCH</Title>
                                        <ChildModal />
                                    </Item>
                                    <Item md={3.5} xs={12} sx={{ borderBottom: '4px solid #0099FF' }} height={{ md: '80px', xs: '60px' }}>
                                        <Title fontSize={{ xs: '12px', md: '16px' }}>LỊCH SỬ MƯỢN</Title>
                                        <ChildModalHistory />
                                    </Item>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </Grid>
        </Grid>
    );
}

const Item = styled(Grid)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    borderRadius: '24px',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
}));
const Title = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    fontWeight: 600
}));