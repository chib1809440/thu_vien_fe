import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { Button, Grid, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';

// ==============================|| TABLE - STICKY HEADER ||============================== //

export default function StatisticsFl() {

    return (
        <CsGrid container mb={3} gap={2}>
            <Grid width='100%' paddingBottom={2} sx={{ borderBottom: '2px solid #9e9e9e' }} container justifyContent='flex-start'>
                <Title>Thống kê nhanh (đang chỉnh sửa)</Title>
            </Grid>
            <Grid container md={12} justifyContent='space-around'>
                <Item container md={3} xs={12} height='150px' sx={{ borderBottom: '4px solid #33CC00' }}>
                    <Grid item textAlign='left' md={8}>
                        <Total ml={2}>Số lượng sách</Total>
                        <Quality ml={2} color='#33CC00'>20</Quality>
                    </Grid>
                    <Grid container md={4} justifyContent='center' alignItems='center'>
                        <AutoStoriesIcon sx={{ fontSize: '42px'}} />
                        {/* <Total width='100%'>Thêm mới</Total> */}
                        <Grid md={12} container justifyContent='center' alignItems='center'>
                            <Button
                                // onClick={() => handleUpdate(row)}
                                //   onClick={()=> navigate('/chi-tiet-hoc-lieu', {state: row })}
                                color="inherit"
                                fullWidth
                                endIcon={<AddCircleOutlineIcon fontSize="inherit" />}>
                                Thêm mới
                            </Button>
                        </Grid>
                    </Grid>
                </Item>
                <Item container md={3} xs={12} height='150px' sx={{ borderBottom: '4px solid #0099FF' }}>
                    <Grid item textAlign='left' md={8}>
                        <Total ml={2}>Số lượng sách</Total>
                        <Quality ml={2} color='#0099FF'>20</Quality>
                    </Grid>
                    <Grid md={4}>
                        <Total >Số lượng sách</Total>
                    </Grid>
                </Item>
                <Item container md={3} xs={12} height='150px' sx={{ borderBottom: '4px solid #6600FF' }}>
                    <Grid item textAlign='left' md={8}>
                        <Total ml={2}>Số lượng sách</Total>
                        <Quality ml={2} color='#6600FF'>20</Quality>
                    </Grid>
                    <Grid md={4}>
                        <Total >Số lượng sách</Total>
                    </Grid>
                </Item>
            </Grid>
        </CsGrid>
    );
}

const CsGrid = styled(Grid)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 'auto',
    border: '1px 0px 1px 0px solid #000'
}));
const Item = styled(Grid)(({ theme }) => ({
    // borderBottom: '4px solid #33CC00',
    borderTop: '1px solid #9e9e9e',
    borderLeft: '1px solid #9e9e9e',
    borderRight: '1px solid #9e9e9e',
    borderRadius: '20px',
    justifyContent: 'flex-start',
    padding: '10px'
}));
const Title = styled(Typography)(({ theme }) => ({
    marginTop: '1rem',
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    fontSize: '22px',
    fontWeight: 600
}));
const Total = styled(Typography)(({ theme }) => ({
    marginTop: '1rem',
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    fontSize: '18px',
    fontWeight: 600
}));
const Quality = styled(Typography)(({ theme }) => ({
    marginTop: '1rem',
    // color: theme.palette.mode === 'dark' ? '#1A2027' : '#33CC33',
    fontFamily: theme.typography.fontFamily,
    fontSize: '28px',
    fontWeight: 900
}));