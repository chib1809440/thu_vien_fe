import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, TextField } from "@mui/material";
import React from "react";
import ButtonGD from "../../../../ui-component/ButtonGD";
import MainCard from "../../../../ui-component/cards/MainCard";
import CreateModal from "./components/ModalAdd";
import EnhancedTable from "./components/tableGroup";
import { useDeleteTypeProduct } from "./hook/deleteTypeProduct";

// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function StickyHeadTable(props: {
  [x: string]: any;
  projectItem: any;
}) {

  const [keyFind, setKeyFind] = React.useState<string>('');
  const [selected, setSelected] = React.useState([]);
  const [isActiveCr, setActiveCr] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const { hanldDeleteTypeProduct } = useDeleteTypeProduct()


  const handleClose = () => {
    setOpen(false);
  };
  const handleComform = (TypeProductID) => {
    hanldDeleteTypeProduct(TypeProductID)
    setOpen(false);
  };

  return (
    <>
      {/* <IBreadcrumsCustom profile="TRANG CHỦ" mainProfile="QUẢN LÝ NHÀ XUẤT BẢN" link="/trang-chu" /> */}
      <MainCard title="DANH SÁCH NHÀ XUẤT BẢN">
        <Grid height='auto'>
          <Grid container justifyContent='space-between' width="100%" height="auto" gap={2}>
            <Grid container width='auto' gap={3} >
              <Grid container gap={3} sx={{ width: '300px' }} height='50px'>
                {!isActiveCr && <ButtonGD title="Thêm mới" onClick={() => setIsOpen(true)}></ButtonGD>}
                {isActiveCr && <ButtonGD title="Hủy" onClick={() => setActiveCr(false)} isColor></ButtonGD>}
                {!isActiveCr && props.projectItem !== undefined && props.projectItem?.length !== 0 && <ButtonGD disabled={selected?.length === 0} title="Xóa" isColor onClick={() => setOpen(true)}></ButtonGD>}
              </Grid>
            </Grid>
            <Grid width={window.screen.width >= 1024 ? '300px' : '100%'} container>
              <Grid sx={{ width: '300px' }} container justifyContent='center'>
                <FormControl fullWidth>
                  <TextField label="Tìm kiếm theo tên nhà sản xuất" variant="outlined" onChange={(e) => setKeyFind(e.target.value)} />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          {props.projectItem !== undefined && props.projectItem?.length !== 0 && props.projectItem.statusCode !== 422 ?
            <EnhancedTable data={props.projectItem} keyFind={keyFind} setSelect={(newValue: any) => setSelected(newValue)}/>
            :
            <Grid container justifyContent='center' mt={5}>
              <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
              {/* <CircularProgress /> */}
            </Grid>
          }
        </Grid>
        <>
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
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <ButtonGD title="Chắn chắn" onClick={() => handleComform(selected)}></ButtonGD>
              <ButtonGD title="Hủy bỏ" isColor onClick={handleClose}></ButtonGD>
            </DialogActions>
          </Dialog>
          <CreateModal isOpen={isOpen} isClose={(value) => setIsOpen(value)}/>
        </>
      </MainCard>
    </>

  );
}
