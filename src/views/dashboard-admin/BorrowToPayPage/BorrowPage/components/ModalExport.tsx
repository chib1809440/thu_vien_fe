import ClearIcon from '@mui/icons-material/Clear';
import SendIcon from '@mui/icons-material/Send';
import {
    Button,
    Grid,
    Typography,
    FormControl,
    TextField
} from '@mui/material';
import Modal from '@mui/material/Modal';
import { Box } from "@mui/system";
import React from "react";
import ExportEX from '../../../Excel/ExportExcel';
import ButtonGD from '../../../../../ui-component/ButtonGD';
// ==============================|| TABLE - STICKY HEADER ||============================== //

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
    borderRadius: '22px',
    minWidth: '300px'
};

export default function ExportReport(props: {
    data?: any;
}) {
    const date = new Date();
    const dateMonth = new Date(Date.now() + (3600 * 1000 * 24 * -30))

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    function getFormattedDate(date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');

        return year + '-' + month + '-' + day;
    }
    const [valueDateFrom, setValueDateFrom] = React.useState<any>(dateMonth);
    const [valueDateTo, setValueDateTo] = React.useState<any>(date);

    const [dataIsTrue, setIsTrue] = React.useState(null);
    const [dataIsFalse, setIsFalse] = React.useState(null);
    const [dataIsAll, setIsAll] = React.useState(null);

    function convertTime(dataTime) {
        let newDate = new Date(dataTime)
        return newDate.getTime()
    }

    React.useEffect(() => {
        setIsTrue(props.data?.filter((data) => data.state === true && convertTime(data?.create_at) >= convertTime(valueDateFrom) && convertTime(data?.create_at) <= convertTime(valueDateTo)))
        setIsFalse(props.data?.filter((data) => data.state === false && convertTime(data?.create_at) >= convertTime(valueDateFrom) && convertTime(data?.create_at) <= convertTime(valueDateTo)))
        setIsAll(props.data?.filter((data) => convertTime(data?.create_at) >= convertTime(valueDateFrom) && convertTime(data?.create_at) <= convertTime(valueDateTo)))
    }, [props.data, valueDateTo, valueDateFrom])

    return (
        <React.Fragment>
            <ButtonGD title='Xuất báo cáo' width='150px' onClick={handleOpen} endIcon={<SendIcon />} />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style }}>
                    <Grid container md={12} gap={3}>
                        <Grid md={12} container justifyContent='center'>
                            <Typography fontSize={28}>XUẤT BÁO CÁO</Typography>
                        </Grid>
                        <Grid md={12} container justifyContent='center' gap={2}>
                            <Grid md={5} xs={12}>
                                <FormControl fullWidth >
                                    <TextField
                                        type="date"
                                        label="Ngày xuất"
                                        defaultValue={getFormattedDate(dateMonth)}
                                        variant="outlined"
                                        onChange={(e) => setValueDateFrom(e.target.value)}
                                    />

                                </FormControl>
                            </Grid>
                            <Grid md={5} xs={12}>
                                <FormControl fullWidth >
                                    <TextField
                                        type="date"
                                        label="Đến ngày"
                                        defaultValue={getFormattedDate(date)}
                                        variant="outlined"
                                        onChange={(e) => setValueDateTo(e.target.value)}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid md={12} container justifyContent='center' gap={2} justifyItems='center' alignItems='center' >
                            <Grid container md={3} justifyItems='center'>
                                <ExportEX title={'Danh sách mượn'} nameFile={'danhsachmuon'} data={dataIsFalse} />
                            </Grid>
                            <Grid container md={3} justifyItems='center'>
                                <ExportEX title={'Danh sách trả'} nameFile={'danhsachtra'} data={dataIsTrue} />
                            </Grid>
                            <Grid container md={3} justifyItems='center'>
                                <ExportEX title={'Tất cả danh sách'} nameFile={'danhsachmuontra'} data={dataIsAll} />
                            </Grid>
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
