import SendIcon from '@mui/icons-material/Send';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, TextField } from "@mui/material";
import React from "react";
import { dispatch, useSelector } from '../../../store';
import { getContactSchoolWaiting } from '../../../store/slices/contactSchool';
import ButtonGD from "../../../ui-component/ButtonGD";
import MainCard from "../../../ui-component/cards/MainCard";
import AnimateButton from '../../../ui-component/extended/AnimateButton';
import { useImportExcelUsers } from '../SystemPage/AccountPage/hook/importExcel';
import CreateAccount from "./components/formInput";
import UpdateAccount from "./components/formUpdate";
import EnhancedTable from "./components/tableAccount";
import { useDeleteUser } from "./hook/deleteUser";
import Invoice from "./printCode";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function StickyHeadTable(props: {
  [x: string]: any;
  data: any;
}) {

  const { getContactSchool } = useSelector((state) => state.getContactSchool);
  React.useEffect(() => {
    dispatch(getContactSchoolWaiting());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [data, setData] = React.useState<any>(null);

  React.useEffect(() => {
    setData(props.data?.filter((item) => item.role === 0 || item.role === 1))
  }, [props.data]);

  const [keyFind, setKeyFind] = React.useState<string>('');
  const [keyFindUser, setKeyFindUser] = React.useState<string>('');
  const [isSelect, setSelect] = React.useState<number>(0);
  const [selectUser, setSelectUser] = React.useState<any>([]);
  const [dataDele, setDatale] = React.useState([]);
  const [isCreate, setIsCreate] = React.useState<number>(0);
  const [dataUpdate, setDataUpdate] = React.useState<any>([]);

  const { hanldDeleteUser, isDelete } = useDeleteUser()

  const [isCrea, setCre] = React.useState<number>(0);
  const [isUpdate, setUpdate] = React.useState<number>(0);

  React.useEffect(() => {
    if (isCrea || isDelete || isUpdate) {
      setIsCreate(0)
    }
  }, [isCrea, isDelete, isUpdate]);

  const handleTabCreate = () => {
    setIsCreate(1)
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleComform = (dataDele) => {
    hanldDeleteUser(dataDele)
    setOpen(false);
  };

  const { hanldImportExcelUsers } = useImportExcelUsers()

  const handleExcelInput = async (e: any) => {
    const file = e.target.files[0];
    await hanldImportExcelUsers(file)
  }

  return (
    <>
      {isCreate === 0 &&
        <>
          {/* <IBreadcrumsCustom profile="TRANG CHỦ" mainProfile="QUẢN LÝ THÀNH VIÊN" link="/trang-chu" /> */}
          <MainCard title="DANH SÁCH THÀNH VIÊN">
            <Grid height='auto'>
              <Grid container justifyContent='space-between' gap={{ xs: 2 }} md={12} height="auto">
                <Grid container md={12} xs={12}>
                  <Grid container gap={2} lg={6} md={5}>
                    <FormControl sx={{ width: { lg: '300px', xs: '100%' } }}>
                      <TextField type="text" label="Tìm kiếm theo tên thành viên" variant="outlined" onChange={(e) => setKeyFind(e.target.value)} />
                    </FormControl>
                    <FormControl sx={{ width: { lg: '300px', xs: '100%' } }}>
                      <TextField type="text" label="Tìm kiếm theo mã thành viên" variant="outlined" onChange={(e) => setKeyFindUser(e.target.value)} />
                    </FormControl>
                  </Grid>
                  <Grid container justifyContent={{ xs: 'space-around' }} gap={2} lg={6} md={7} mt={{ lg: 0, md: 0, xs: 2 }}>
                    <Grid container justifyContent={'flex-end'} gap={2}>
                      <Grid md={4} xs={12}>
                        <ButtonGD width='100%' title="Thêm mới" onClick={handleTabCreate} />
                      </Grid>
                      <Grid md={4} xs={12}>
                        <ButtonGD width='100%' title="Xóa" isColor={true} disabled={isSelect === 0} onClick={handleOpen} />
                      </Grid>
                    </Grid>
                    <Grid container justifyContent={'flex-end'} gap={2}>
                      <Grid md={4} xs={12} >
                        <AnimateButton>
                          <Button
                            style={{ height: '50px', width: '100%', background: '#2196F2', border: 'none', borderRadius: '5px' }}
                          >
                            <a style={{ color: '#fff' }} href='https://drive.google.com/drive/folders/10LZEB_gqJvGW_IHXotONHVmAMWM-7i26?usp=sharing' target="_blank" rel="noreferrer">Tải xuống mẫu</a>
                          </Button>
                        </AnimateButton>
                      </Grid>
                      <Grid md={4} xs={12} >
                        <AnimateButton>
                          <Button
                            variant="contained"
                            component="label"
                            sx={{ height: '50px', width: '100%' }}
                          >
                            Tải lên từ file Excel
                            <input
                              type="file"
                              hidden
                              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                              onChange={handleExcelInput}
                            />
                          </Button>
                        </AnimateButton>
                      </Grid>
                      <Grid md={4} xs={12} >
                        <ButtonGD title='In mã vạch' onClick={() => setIsCreate(3)} width="100%" endIcon={<SendIcon />}>
                        </ButtonGD>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid mt={2}>
                <Grid mt={2}>
                  {data !== null && data?.length !== 0 && data?.statusCode !== 422
                    ?
                    <EnhancedTable data={data} keyFind={keyFind} keyFindUser={keyFindUser} setSelectUser={(newValue: any) => setSelectUser(newValue)} setSelect={(newValue: any) => setSelect(newValue)} dataDelete={(data) => setDatale(data)} setIsUpdate={(newIs) => setIsCreate(newIs)} dataUpdate={(newUp) => setDataUpdate(newUp)} />
                    :
                    <Grid container justifyContent='center' mt={5}>
                      <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
                      {/* <CircularProgress /> */}
                    </Grid>
                  }
                </Grid>
              </Grid>
            </Grid>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle textAlign='center' style={{ cursor: 'move' }} id="draggable-dialog-title">
                Thông báo
              </DialogTitle>
              <DialogContent>
                <DialogContentText textAlign='center' sx={{ fontWeight: '700', color: '#AA0000', fontSize: '16px' }}>
                  Bạn chắc chắn muốn xóa?
                  <Grid mt={1} container gap={1} justifyContent='center'>
                    <DialogContentText sx={{ fontWeight: '600', color: '#000' }}>{dataDele?.length} </DialogContentText>
                    <DialogContentText sx={{ fontWeight: '600' }}>Tài khoản</DialogContentText>
                  </Grid>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <ButtonGD title="Chắn chắn" onClick={() => handleComform(dataDele)} />
                <ButtonGD title="Hủy bỏ" isColor={true} onClick={handleClose} />
              </DialogActions>
            </Dialog>
          </MainCard>
        </>
      }
      {isCreate === 1 &&
        <>
          <CreateAccount dataGroupPower={props.dataGroupPower} isSubmit={(newValue: any) => setCre(newValue)} isCancel={(newCancel) => setIsCreate(newCancel)} />
        </>
      }
      {isCreate === 2 &&
        <>
          <UpdateAccount dataUpdate={dataUpdate} isUp={(newValue: any) => setUpdate(newValue)} isCancel={(newCancel) => setIsCreate(newCancel)} />
        </>
      }
      {isCreate === 3 &&
        <>
          <Invoice getContactSchool={getContactSchool} selectUser={selectUser} data={data} isCancel={(newCancel) => setIsCreate(newCancel)} />
        </>
      }
    </>


  );
}
