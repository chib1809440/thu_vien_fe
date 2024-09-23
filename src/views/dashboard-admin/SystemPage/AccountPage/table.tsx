import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormHelperText, Grid, TextField } from "@mui/material";
import React from "react";
import ButtonGD from "../../../../ui-component/ButtonGD";
import MainCard from "../../../../ui-component/cards/MainCard";
import CreateAccount from "./components/formInput";
import UpdateAccount from "./components/formUpdate";
import EnhancedTable from "./components/tableAccount";
import { useDeleteUser } from "./hook/deleteUser";
import { useImportExcelUsers } from "./hook/importExcel";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function StickyHeadTable(props: {
  [x: string]: any;
  data: any;
}) {

  const [keyFind, setKeyFind] = React.useState<string>('');
  const [isSelect, setSelect] = React.useState<number>(0);
  const [dataDele, setDatale] = React.useState([]);
  const [dataDeleteUser, setDataleUser] = React.useState([]);
  const [isCreate, setIsCreate] = React.useState<number>(0);
  const [dataUpdate, setDataUpdate] = React.useState<any>([]);

  const { hanldDeleteUser, isDelete } = useDeleteUser()

  const [isCrea, setCre] = React.useState<number>(0);
  const [isUpdate, setUpdate] = React.useState<number>(0);

  React.useEffect(() => {
    if (isCrea || isUpdate || isDelete) {
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

  function CheckAdmin(data) {
    if (data.indexOf('admin') !== -1) {
      return true
    } else {
      return false
    }
  }

  const {hanldImportExcelUsers} = useImportExcelUsers()

  const handleExcelInput = async (e: any)  => {
    const file = e.target.files[0];
    await hanldImportExcelUsers(file)
  }

  return (
    <>
      {isCreate === 0 &&
        <>
          {/* <IBreadcrumsCustom profile="TRANG CHỦ" mainProfile="QUẢN LÝ TÀI KHOẢN" link="/trang-chu" /> */}
          <MainCard title="DANH SÁCH TÀI KHOẢN">
            <Grid height='auto'>
              <Grid container justifyContent='space-between'>
                <Grid container justifyContent={{ lg: 'flex-start', xs: 'space-between' }} lg={7} xs={12} height="auto" gap={{ lg: 2, xs: 0 }}>
                  <Grid sx={{ width: '300px' }}>
                    <FormControl fullWidth>
                      <TextField type="text" label="Tìm kiếm theo tên tài khoản" variant="outlined" onChange={(e) => setKeyFind(e.target.value)} />
                    </FormControl>
                  </Grid>
                  <Grid container gap={3} sx={{ width: '300px'}} justifyContent='flex-end'>
                    <ButtonGD title="Thêm mới" onClick={handleTabCreate} />
                    <ButtonGD title="Xóa" isColor={true} disabled={isSelect === 0 || CheckAdmin(dataDeleteUser)} onClick={handleOpen} />
                    {CheckAdmin(dataDeleteUser) &&
                      <FormHelperText error id="standard-weight-helper-text-addressUser">
                        Không thể xoá admin
                      </FormHelperText>
                    }
                  </Grid>
                </Grid>
                <Grid container justifyContent={{ lg: 'flex-end', xs: 'flex-end' }} mt={{ lg: 0, xs: 2 }} lg={5} xs={12} height="auto">
                  {/* <ButtonGD title="Thêm từ Excel" type='file' /> */}
                  <Button
                    variant="contained"
                    component="label"
                  >
                    Tải lên từ file Excel
                    <input
                      type="file"
                      hidden
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      onChange={handleExcelInput}
                    />
                  </Button>
                  {/* <Input type="file" /> */}
                </Grid>
              </Grid>

              <Grid mt={2}>
                <Grid mt={2}>
                  {props.data !== undefined && props.data?.length !== 0 ?
                    <EnhancedTable data={props.data} keyFind={keyFind} dataDeleteUser={(newValue: any) => setDataleUser(newValue)} setSelect={(newValue: any) => setSelect(newValue)} dataDelete={(data) => setDatale(data)} setIsUpdate={(newIs) => setIsCreate(newIs)} dataUpdate={(newUp) => setDataUpdate(newUp)} />
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
                    {CheckAdmin(dataDeleteUser) ?

                      <DialogContentText sx={{ fontWeight: '600' }}>Không thể xoá admin</DialogContentText>
                      :
                      <>
                        <DialogContentText sx={{ fontWeight: '600', color: '#000' }}>{dataDele?.length} </DialogContentText>
                        <DialogContentText sx={{ fontWeight: '600' }}>Tài khoản</DialogContentText>
                      </>
                    }

                  </Grid>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <ButtonGD disabled={CheckAdmin(dataDeleteUser)} title="Chắn chắn" onClick={() => handleComform(dataDele)} />
                <ButtonGD isColor={true} title="Hủy bỏ" onClick={handleClose} />
              </DialogActions>
            </Dialog>
          </MainCard>
        </>
      }
      {isCreate === 1 &&
        <>
          <CreateAccount isSubmit={(newValue: any) => setCre(newValue)} isCancel={(newCancel) => setIsCreate(newCancel)} />
        </>
      }
      {isCreate === 2 &&
        <>
          <UpdateAccount dataUpdate={dataUpdate} isUp={(newValue: any) => setUpdate(newValue)} isCancel={(newCancel) => setIsCreate(newCancel)} />
        </>
      }
    </>


  );
}
