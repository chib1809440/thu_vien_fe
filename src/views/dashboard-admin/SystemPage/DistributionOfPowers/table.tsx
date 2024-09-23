import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, TextField } from "@mui/material";
import React from "react";
import ButtonGD from "../../../../ui-component/ButtonGD";
import MainCard from "../../../../ui-component/cards/MainCard";
import CreateGroupPower from "./components/formInput";
import TableGroup from "./components/tableGroup";
import { useDeleteGroupPower } from "./hook/deleteGroupPower";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function StickyHeadTable(props: {
  [x: string]: any;
  projectItem: any;
}) {

  const [isSubmit, setSubmit] = React.useState<boolean>(false);
  const [keyFind, setKeyFind] = React.useState<string>('');
  const [selected, setSelected] = React.useState([]);
  const [isActiveCr, setActiveCr] = React.useState<boolean>(false);
  const { hanldDeleteGroupPower } = useDeleteGroupPower()
  React.useEffect(() => {
    if (isSubmit)
      setActiveCr(false)
  }, [isSubmit])

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleComform = (GroupPowerID) => {
    hanldDeleteGroupPower(GroupPowerID)
    setOpen(false);
  };

  return (
    <>
      {/* <IBreadcrumsCustom profile="TRANG CHỦ" mainProfile="NHÓM PHÂN QUYỀN" link="/trang-chu" /> */}
      <MainCard title="DANH SÁCH NHÓM">
        <Grid height='auto'>
          <Grid container justifyContent='space-between' width="100%" height="auto" gap={2}>
            <Grid container width='auto' gap={3} >
              {isActiveCr && <CreateGroupPower isSubmit={(newValue: any) => setSubmit(newValue)} />}
              <Grid container gap={3} sx={{ width: '300px' }} height='50px'>
                {!isActiveCr && <Button variant="contained" onClick={() => setActiveCr(true)}>Thêm mới</Button>}
                {isActiveCr && <Button variant="contained" onClick={() => setActiveCr(false)} sx={{ background: '#EE0000', '&:hover': { background: '#DD0000' } }}>Hủy</Button>}
                {!isActiveCr && <Button variant="contained" sx={{ background: '#EE0000', '&:hover': { background: '#DD0000' } }} onClick={() => setOpen(true)}>Xóa</Button>}
              </Grid>
            </Grid>
            <Grid width={window.screen.width >= 1024 ? '300px' : '100%'} container>
              <Grid sx={{ width: '300px' }} container justifyContent='center'>
                <FormControl fullWidth>
                  <TextField id="outlined-basic" label="Tìm kiếm" variant="outlined" type="text" onChange={(e) => setKeyFind(e.target.value)} />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <TableGroup data={props.projectItem} keyFind={keyFind} setSelect={(newValue: any) => setSelected(newValue)} />
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
              <ButtonGD title="Chắn chắn" onClick={() => handleComform(selected)} />
              <ButtonGD isColor={true} title="Hủy bỏ" onClick={handleClose} />
            </DialogActions>
          </Dialog>
        </>
      </MainCard >
    </>

  );
}
