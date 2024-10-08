import { CardMedia, Grid, Input, InputLabel, Typography } from "@mui/material";
import IconEmail from '../../../assets/images/contact/email.svg';
import IconFacebook from '../../../assets/images/contact/facebook.svg';
import IconMap from '../../../assets/images/contact/map.svg';
import IconZalo from '../../../assets/images/contact/zalo.svg';
import { useUserList } from "../../../hooks/react-query/userData";
import ButtonGD from "../../../ui-component/ButtonGD";
import MainCard from "../../../ui-component/cards/MainCard";
import { useParams } from "react-router-dom";


const LibInformationPage = () => {
    const { libraryId } = useParams(); // Lấy ID từ params
    const { data: users } = useUserList();
    

    return (
        <>
            <MainCard>
                <Grid md={12} container justifyContent='flex-end'>
                    {/* {!isUp ? */}
                    <ButtonGD title="Cập nhật" />
                    {/* : */}
                    {/* <ButtonGD onClick={() => handlClickUp()} title="Xác nhận" /> */}
                    {/* } */}
                </Grid>
                <Grid container md={12} justifyContent='space-around'>
                    <Grid md={3} container >
                        <Grid lg={12}>
                            <img style={{ borderRadius: '5px' }} width='256px' height='256px' src="../../logo.png" />
                            {/* {preview === '' ? <img style={{ borderRadius: '5px' }} width='256px' height='256px' src="../../logo.png" /> : <img style={{ borderRadius: '5px' }} width='256px' height='auto' src={preview} />} */}
                        </Grid>
                        <Grid lg={12} container gap={2}>
                            <InputLabel sx={{ fontWeight: '700', fontSize: '16px' }} id="upload-photo"> Chọn hình ảnh
                                <Input type="file" name="photo" id="upload-photo" sx={{ display: 'none' }}
                                    inputProps={{ accept: 'image/*' }}
                                // onChange={handleImageInput}
                                />
                            </InputLabel>
                            {/* {preview !== '' &&  onClick={handlClickUpLogo} */}
                            <ButtonGD title="Xác nhận" ></ButtonGD>
                            {/* } */}
                        </Grid>
                    </Grid>
                    <Grid md={8} container justifyContent='flex-start' alignItems='flex-start'>
                        <Grid container justifyContent='space-between'>
                            <Grid md={8}>
                                <Typography mt={2} textAlign='left' variant='h4'>Cơ quan quản lý: </Typography>
                                <Typography mt={2} textAlign='left' variant='h4'>Tên trường: </Typography>
                                <Typography mt={2} textAlign='left' variant='h4'>Địa chỉ: </Typography>
                                <Typography mt={2} textAlign='left' variant='h4'>Điện thoại: </Typography>
                                <Typography mt={2} textAlign='left' variant='h4'>Hotline: </Typography>
                            </Grid>
                            <Grid md={4}>
                                <Grid container alignItems='center' justifyContent='flex-end'>
                                    {/* <Typography variant='h5'><a href={props.dataContact?.facebookContact} target="_blank" rel="noreferrer">{gioiHanChuoi(props.dataContact?.facebookContact || '')}</a></Typography> */}
                                    <CardMedia
                                        component="img"
                                        image={IconFacebook}
                                        sx={{ width: 40, height: 40 }}
                                    />
                                </Grid>
                                <Grid container alignItems='center' justifyContent='flex-end'>
                                    {/* <Typography variant='h5'><a href={props.dataContact?.zaloContact} target="_blank" rel="noreferrer">{gioiHanChuoi(props.dataContact?.zaloContact || '')}</a></Typography> */}
                                    <CardMedia
                                        component="img"
                                        image={IconZalo}
                                        sx={{ width: 40, height: 40 }}
                                    />
                                </Grid>
                                <Grid container alignItems='center' justifyContent='flex-end'>
                                    {/* <Typography variant='h5'><a href={props.dataContact?.urlGoogleMap} target="_blank" rel="noreferrer">{gioiHanChuoi(props.dataContact?.urlGoogleMap || '')}</a></Typography> */}
                                    <CardMedia
                                        component="img"
                                        image={IconMap}
                                        sx={{ width: 40, height: 40 }}
                                    />
                                </Grid>
                                <Grid container alignItems='center' justifyContent='flex-end'>
                                    {/* <Typography variant='h5'><a href={props.dataContact?.emailContact} target="_blank" rel="noreferrer">{gioiHanChuoi(props.dataContact?.emailContact || '')}</a></Typography> */}
                                    <CardMedia
                                        component="img"
                                        image={IconEmail}
                                        sx={{ width: 40, height: 40 }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
}

export default LibInformationPage;
