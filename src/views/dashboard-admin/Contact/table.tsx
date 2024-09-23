import { CardMedia, Grid, Input, InputLabel, TextField, Typography } from "@mui/material";
import React from "react";
import IconFacebook from '../../../assets/images/contact/facebook.svg';
import IconMap from '../../../assets/images/contact/map.svg';
import IconZalo from '../../../assets/images/contact/zalo.svg';
import IconEmail from '../../../assets/images/contact/email.svg';
import { GetContactSchool } from "../../../types/contactSchool";
import ButtonGD from "../../../ui-component/ButtonGD";
import MainCard from "../../../ui-component/cards/MainCard";
import { useUpdateContact } from "./hook/createAssetLib";
import Map from "./components/Map";
import { useUpdateLogo } from "./hook/updateImg";

export default function StickyHeadTable(props: {
  [x: string]: any;
  dataContact: GetContactSchool | undefined;
}) {

  function gioiHanChuoi(chuoi: string): string {
    if (chuoi.length <= 20) {
      return chuoi;
    } else {
      return chuoi.substring(12, 30) + '...';
    }
  }
  const [isUp, setUp] = React.useState(false)
  const [nameContactEN, setNameContactEN] = React.useState(props?.dataContact?.nameContactEN)
  const [nameContact, setnameContact] = React.useState(props?.dataContact?.nameContact)
  const [addressContact, setaddressContact] = React.useState(props?.dataContact?.addressContact)
  const [phoneContact, setphoneContact] = React.useState(props?.dataContact?.phoneContact)
  const [hotline, sethotline] = React.useState(props?.dataContact?.hotline)
  const [facebook, setFacebook] = React.useState(props?.dataContact?.facebookContact)
  const [zalo, setZalo] = React.useState(props?.dataContact?.zaloContact)
  const [map, setMap] = React.useState(props?.dataContact?.urlGoogleMap)
  const [email, setEmail] = React.useState(props?.dataContact?.emailContact)
  const [preview, setPreview] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState();

  const handleImageInput = (e: any) => {
    const file = e.target.files[0];
    const _5MB = 5242880;
    if (file.size > _5MB)
      setSelectedFile(file);
    else {
      setSelectedFile(file);
    }
  }

  React.useEffect(() => {
    if (!selectedFile) {
      setPreview('');
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl)

  }, [selectedFile])

  const { hanldUpdateContact, isUpdate } = useUpdateContact()
  const { hanldUpdateLogo } = useUpdateLogo()

  function handlClickUp() {
    hanldUpdateContact(nameContact, nameContactEN, addressContact, phoneContact, hotline, facebook, zalo, map, email)
  }
  function handlClickUpLogo() {
    hanldUpdateLogo(selectedFile)
  }
  React.useEffect(() => {
    if (isUpdate) {
      setUp(false)
    }
  }, [isUpdate])

  return (
    <>
      <MainCard>
        <Grid md={12} container justifyContent='flex-end'>
          {!isUp ?
            <ButtonGD onClick={() => setUp(true)} title="Cập nhật" />
            :
            <ButtonGD onClick={() => handlClickUp()} title="Xác nhận" />
          }
        </Grid>
        <Grid container md={12} justifyContent='space-around'>
          <Grid md={3} container >
            <Grid lg={12}>
              {preview === '' ? <img style={{ borderRadius: '5px' }} width='256px' height='256px' src="../../logo.png" /> : <img style={{ borderRadius: '5px' }} width='256px' height='auto' src={preview} />}
            </Grid>
            <Grid lg={12} container gap={2}>
              <InputLabel sx={{ fontWeight: '700', fontSize: '16px' }} id="upload-photo"> Chọn hình ảnh
                <Input type="file" name="photo" id="upload-photo" sx={{ display: 'none' }}
                  inputProps={{ accept: 'image/*' }}
                  onChange={handleImageInput}
                />
              </InputLabel>
              {preview !== '' &&
                <ButtonGD title="Xác nhận" onClick={handlClickUpLogo}></ButtonGD>
              }
            </Grid>
          </Grid>
          <Grid md={8} container justifyContent='flex-start' alignItems='flex-start'>
            <Grid container justifyContent='space-between'>
              {!isUp ?
                <Grid md={8}>
                  <Typography mt={2} textAlign='left' variant='h4'>Cơ quan quản lý: {props?.dataContact?.nameContactEN}</Typography>
                  <Typography mt={2} textAlign='left' variant='h4'>Tên trường: {props?.dataContact?.nameContact}</Typography>
                  <Typography mt={2} textAlign='left' variant='h4'>Địa chỉ: {props?.dataContact?.addressContact}</Typography>
                  <Typography mt={2} textAlign='left' variant='h4'>Điện thoại: {props?.dataContact?.phoneContact}</Typography>
                  <Typography mt={2} textAlign='left' variant='h4'>Hotline: {props?.dataContact?.hotline}</Typography>
                </Grid>
                :
                <Grid md={8} container gap={2}>
                  <TextField fullWidth id="outlined-basic" label="Cơ quan quản lý" variant="outlined" value={nameContactEN} onChange={(e) => setNameContactEN(e.target.value)} />
                  <TextField fullWidth id="outlined-basic" label="Tên trường" variant="outlined" value={nameContact} onChange={(e) => setnameContact(e.target.value)} />
                  <TextField fullWidth id="outlined-basic" label="Địa chỉ" variant="outlined" value={addressContact} onChange={(e) => setaddressContact(e.target.value)} />
                  <TextField fullWidth id="outlined-basic" label="Điện thoại" variant="outlined" value={phoneContact} onChange={(e) => setphoneContact(e.target.value)} />
                  <TextField fullWidth id="outlined-basic" label="Hotline" variant="outlined" value={hotline} onChange={(e) => sethotline(e.target.value)} />
                  <TextField fullWidth id="outlined-basic" label="Email" variant="outlined" value={email} onChange={(e) => setFacebook(e.target.value)} />
                  <TextField fullWidth id="outlined-basic" label="Facebook" variant="outlined" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                  <TextField fullWidth id="outlined-basic" label="Zalo" variant="outlined" value={zalo} onChange={(e) => setZalo(e.target.value)} />
                  <TextField fullWidth id="outlined-basic" label="Map" variant="outlined" value={map} onChange={(e) => setMap(e.target.value)} />
                </Grid>
              }
              <Grid md={4}>
                <Grid container alignItems='center' justifyContent='flex-end'>
                  <Typography variant='h5'><a href={props.dataContact?.facebookContact} target="_blank" rel="noreferrer">{gioiHanChuoi(props.dataContact?.facebookContact || '')}</a></Typography>
                  <CardMedia
                    component="img"
                    image={IconFacebook}
                    sx={{ width: 40, height: 40 }}
                  />
                </Grid>
                <Grid container alignItems='center' justifyContent='flex-end'>
                  <Typography variant='h5'><a href={props.dataContact?.zaloContact} target="_blank" rel="noreferrer">{gioiHanChuoi(props.dataContact?.zaloContact || '')}</a></Typography>
                  <CardMedia
                    component="img"
                    image={IconZalo}
                    sx={{ width: 40, height: 40 }}
                  />
                </Grid>
                <Grid container alignItems='center' justifyContent='flex-end'>
                  <Typography variant='h5'><a href={props.dataContact?.urlGoogleMap} target="_blank" rel="noreferrer">{gioiHanChuoi(props.dataContact?.urlGoogleMap || '')}</a></Typography>
                  <CardMedia
                    component="img"
                    image={IconMap}
                    sx={{ width: 40, height: 40 }}
                  />
                </Grid>
                <Grid container alignItems='center' justifyContent='flex-end'>
                  <Typography variant='h5'><a href={props.dataContact?.emailContact} target="_blank" rel="noreferrer">{gioiHanChuoi(props.dataContact?.emailContact || '')}</a></Typography>
                  <CardMedia
                    component="img"
                    image={IconEmail}
                    sx={{ width: 40, height: 40 }}
                  />
                </Grid>
              </Grid>

              {/* <FormControl fullWidth>
                <TextField
                  type="text"
                  label={`${nameContact !== '' ? nameContact : 'Tên trường'}`}
                  value={nameContact}
                  onChange={(e) => setNameContact(e.target.value)}
                />
              </FormControl> */}
            </Grid>
          </Grid>
          {/* <Grid md={4} container maxHeight='200px'>
            <Grid container alignItems='center' justifyContent='flex-end'>
              <Typography variant='h5'>Facebook</Typography>
              <CardMedia
                component="img"
                image={IconFacebook}
                sx={{ width: 40, height: 40 }}
              />
            </Grid>
            <Grid container alignItems='center' justifyContent='flex-end'>
              <Typography variant='h5'>Zalo</Typography>
              <CardMedia
                component="img"
                image={IconZalo}
                sx={{ width: 40, height: 40 }}
              />
            </Grid>
            <Grid container alignItems='center' justifyContent='flex-end'>
              <Typography variant='h5'>Google Map</Typography>
              <CardMedia
                component="img"
                image={IconMap}
                sx={{ width: 40, height: 40 }}
              />
            </Grid>
          </Grid> */}
        </Grid>
      </MainCard>
      <Grid lg={12} mt={2}>
        {/* <Map
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDMn5aiBliksApNCoq-d9d53yUnXat8h5M&callback=initMap`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `700px`, width: '100%', margin: `auto` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        /> */}
      </Grid>
    </>
  );
}
// AIzaSyDMn5aiBliksApNCoq-d9d53yUnXat8h5M