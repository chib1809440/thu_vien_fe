import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { styled } from "@mui/material/styles";
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { gridSpacing } from '../../../store/constant';
import SubCard from '../../../ui-component/cards/SubCard';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
// table data
function createData(product: string, description: string, quantity: string, amount: string, total: string) {
    return { product, description, quantity, amount, total };
}

const rows = [
    createData('SS0001', 'Sách lớp 1', '6', '$200.00', '$1200.00'),
    createData('SS0002', 'Sách lớp 2', '7', '$100.00', '$700.00'),
    createData('SS0001', 'Sách lớp 3', '5', '$150.00', '$750.00')
]
const shoolName = 'TRƯỜNG TIỂU HỌC A'

const Invoice = () => {
    const componentRef: React.Ref<HTMLDivElement> = useRef(null);
    
    return (
        <Grid container justifyContent="center" spacing={gridSpacing}>
            <Grid item xs={12} md={10} lg={8} ref={componentRef}>
                <SubCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <Typography >{shoolName}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography ml={shoolName?.length / 3.5} variant="subtitle1">THƯ VIỆN</Typography>
                                </Grid>
                                <Grid item xs={12} textAlign='center' mt={5}>
                                    <Typography variant="subtitle1">SỔ MƯỢN VÀ TRẢ SÁCH, TÀI LIỆU CỦA HỌC SINH</Typography>
                                </Grid>
                                <Grid item xs={12} textAlign='center'>
                                    <Typography variant="subtitle1">NĂM HỌC 2023 - 2024</Typography>
                                </Grid>
                                {/* <Grid container justifyContent='center' xs={3.5}>
                                    <Barcode value="12cf9349-5867-4201-959d-8feb4b99befe"  />
                                </Grid> */}
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <TableContainer sx={{ border: '1px solid gray' }}>
                                <Table>
                                    <TableHead >
                                        <TableRow >
                                            <TableCell>
                                                <CsTypographyTT>STT</CsTypographyTT>
                                            </TableCell>
                                            <TableCell align="center">
                                                <CsTypographyTT>HỌ VÀ TÊN</CsTypographyTT>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Grid container justifyContent='center'>
                                                    <CsTableCell><CsTypographyTT>SÁCH</CsTypographyTT></CsTableCell>
                                                </Grid>
                                                <Grid container justifyContent='center'>
                                                    <CsTableCell><CsTypographyTT>MÃ SÁCH</CsTypographyTT></CsTableCell>
                                                    <CsTableCell><CsTypographyTT>TÊN SÁCH</CsTypographyTT></CsTableCell>
                                                </Grid>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Grid container justifyContent='center'>
                                                    <CsTableCell><CsTypographyTT>MƯỢN</CsTypographyTT></CsTableCell>
                                                </Grid>
                                                <Grid container justifyContent='center'>
                                                    <CsTableCell><CsTypographyTT>NGÀY MƯỢN</CsTypographyTT></CsTableCell>
                                                    <CsTableCell><CsTypographyTT>HS KÝ</CsTypographyTT></CsTableCell>
                                                </Grid>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Grid container justifyContent='center'>
                                                    <CsTableCell><CsTypographyTT>TRẢ</CsTypographyTT></CsTableCell>
                                                </Grid>
                                                <Grid container justifyContent='center'>
                                                    <CsTableCell><CsTypographyTT>NGÀY TRẢ</CsTypographyTT></CsTableCell>
                                                    <CsTableCell><CsTypographyTT>HS KÝ</CsTypographyTT></CsTableCell>
                                                </Grid>
                                            </TableCell>
                                            {/* <TableCell width='100px'>
                                                <CsTypographyTT>GHI CHÚ</CsTypographyTT>
                                            </TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell width='50px'>
                                                    <Typography align="left" variant="subtitle1">
                                                        {index + 1}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center"><CsTypographyBD>THÁI HỬU LƯỢNG</CsTypographyBD></TableCell>
                                                <CsTableCell3 align="center">
                                                    <Grid container justifyContent='center'>
                                                        <CsTableCell align="center"><CsTypographyBD>GD202310</CsTypographyBD></CsTableCell>
                                                        <CsTableCell align="center"><CsTypographyBD>TIẾNG VIỆT 1</CsTypographyBD></CsTableCell>
                                                    </Grid>
                                                </CsTableCell3>
                                                <CsTableCell3 align="center">
                                                    <Grid container justifyContent='center'>
                                                        <CsTableCell align="center"><CsTypographyBD>19/10/2023</CsTypographyBD></CsTableCell>
                                                        <CsTableCell align="center"><CsTypographyBD>Đã ký</CsTypographyBD></CsTableCell>
                                                    </Grid>
                                                </CsTableCell3>
                                                <CsTableCell3 align="center">
                                                    <Grid container justifyContent='center'>
                                                        <CsTableCell align="center"><CsTypographyBD>19/10/2023</CsTypographyBD></CsTableCell>
                                                        <CsTableCell align="center"><CsTypographyBD>Đã ký</CsTypographyBD></CsTableCell>
                                                    </Grid>
                                                </CsTableCell3>
                                                {/* <TableCell align="right">
                                                    .
                                                </TableCell> */}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} textAlign='right'>
                                    <Typography pr={3} variant="h6">THỦ THƯ</Typography>
                                    <Typography pr={0} variant="h6">{"(Ký và ghi rõ họ tên)"}</Typography>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
            <Grid item xs={12} md={10} lg={8}>
                <Grid
                    container
                    spacing={1}
                    justifyContent="center"
                    sx={{
                        maxWidth: 850,
                        mx: 'auto',
                        mt: 0,
                        mb: 2.5,
                        '& > .MuiCardContent-root': {
                            py: { xs: 3.75, md: 5.5 },
                            px: { xs: 2.5, md: 5 }
                        }
                    }}
                >
                    <Grid item>
                        <AnimateButton>
                            <ReactToPrint trigger={() => <Button variant="contained">IN BÁO CÁO</Button>} content={() => componentRef.current} />
                        </AnimateButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Invoice;

const CsTypographyTT = styled(Typography)(({ theme }) => ({
    fontSize: '10px',
    fontWeight: '700'
}));
const CsTypographyBD = styled(Typography)(({ theme }) => ({
    fontSize: '10px',
}));
const CsTableCell = styled(TableCell)(({ theme }) => ({
    border: 'none'
}));
const CsTableCell3 = styled(TableCell)(({ theme }) => ({

}));