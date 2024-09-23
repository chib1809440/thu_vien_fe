import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, TextField } from "@mui/material";
import React from "react";
import IBreadcrumsCustom from "../../../../ui-component/breadcrums";
import MainCard from "../../../../ui-component/cards/MainCard";
import CreateModal from "./components/ModalAdd";
import TableGroup from "./components/tableGroup";
import { useDeleteLoanSlip } from "./hook/deleteLoanSlip";
import ButtonGD from "../../../../ui-component/ButtonGD";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function StickyHeadTable(props: {
  [x: string]: any;
  projectItem: any;
  suppliesItem: any;
  dataUser: any;
}) {

  const [isSubmit, setSubmit] = React.useState<boolean>(false);
  const [keyFind, setKeyFind] = React.useState<string>('');
  const [selected, setSelected] = React.useState([]);
  const [isActiveCr, setActiveCr] = React.useState<boolean>(false);
  const { hanldDeleteLoanSlip } = useDeleteLoanSlip()
  React.useEffect(() => {
    if (isSubmit)
      setActiveCr(false)
  }, [isSubmit])

  const [open, setOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleComform = (GroupPowerID) => {
    hanldDeleteLoanSlip(GroupPowerID)
    setOpen(false);
  };

  return (
    <>
      {/* <IBreadcrumsCustom profile="TRANG CHỦ" mainProfile="QUẢN LÝ PHIẾU TRẢ" link="/trang-chu" /> */}
      <MainCard title="DANH SÁCH PHIẾU TRẢ">
          <>
            <Grid height='auto'>
              <Grid container justifyContent='space-between' width="100%" height="auto" gap={2}>
                <Grid container width='auto' gap={3} >
                  {/* {isActiveCr && <CreateGroupPower isSubmit={(newValue: any) => setSubmit(newValue)} />} */}
                  <Grid container gap={3} sx={{ width: '300px' }} height='50px'>
                    {/* {!isActiveCr && props.suppliesItem !== undefined && props.suppliesItem?.length !== 0 && props.suppliesItem.statusCode !== 422 ? <Button variant="contained" onClick={() => setIsOpen(true)}>Thêm mới</Button> : 
                   <Button disabled variant="contained" onClick={() => setIsOpen(true)} endIcon={<CircularProgress sx={{color: "#fff"}}/>}>Đang tải dữ liệu..</Button>} */}
                    {/* {isActiveCr && <Button variant="contained" onClick={() => setActiveCr(false)} sx={{ background: '#EE0000', '&:hover': { background: '#DD0000' } }}>Hủy</Button>} */}
                    {/* {!isActiveCr && props.projectItem !== undefined && props.projectItem?.length !== 0 && props.suppliesItem !== undefined && props.suppliesItem?.length !== 0 && props.dataUser !== undefined && props.dataUser?.length !== 0 && <Button disabled={selected?.length === 0} variant="contained" sx={{ background: '#EE0000', '&:hover': { background: '#DD0000' } }} onClick={() => setOpen(true)}>Xóa</Button>} */}
                  </Grid>
                </Grid>
                <Grid width={window.screen.width >= 1024 ? '300px' : '100%'} container>
                  <Grid sx={{ width: '300px' }} container justifyContent='center'>
                    <FormControl fullWidth>
                      <TextField label="Tìm kiếm theo tên bạn đọc" variant="outlined" type="text" onChange={(e) => setKeyFind(e.target.value)} />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              {props.projectItem !== undefined && props.projectItem?.length !== 0 && props.projectItem.statusCode !== 422 
              && props.suppliesItem !== undefined && props.suppliesItem?.length !== 0 && props.suppliesItem.statusCode !== 422 
              && props.dataUser !== undefined && props.dataUser?.length !== 0 && props.dataUser.statusCode !== 422 ? 
                <TableGroup dataUser={props.dataUser} data={props.projectItem} keyFind={keyFind} setSelect={(newValue: any) => setSelected(newValue)} suppliesItem={props.suppliesItem} />
                :
                <Grid container justifyContent='center' mt={5}>
                  <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
                  {/* <CircularProgress/> */}
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
              <CreateModal isOpen={isOpen} isClose={(value) => setIsOpen(value)} productItems={props.suppliesItem} />
            </>
          </>
      </MainCard >
    </>

  );
}
