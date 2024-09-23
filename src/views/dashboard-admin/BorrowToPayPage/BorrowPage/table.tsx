import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, TextField } from "@mui/material";
import React from "react";
import ButtonGD from "../../../../ui-component/ButtonGD";
import IBreadcrumsCustom from "../../../../ui-component/breadcrums";
import MainCard from "../../../../ui-component/cards/MainCard";
import CreateModal from "./components/ModalAdd";
import ExportReport from "./components/ModalExport";
import TableGroup from "./components/tableGroup";
import { useDeleteLoanSlip } from "./hook/deleteLoanSlip";
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
      {/* <IBreadcrumsCustom profile="TRANG CHỦ" mainProfile="QUẢN LÝ PHIẾU MƯỢN" link="/trang-chu" /> */}
      <MainCard title="DANH SÁCH PHIẾU MƯỢN">
        <>
          <Grid height='auto'>
            <Grid container justifyContent='space-between' width="100%" height="auto" gap={2}>
              <Grid container width='auto' gap={3} >
                <Grid container gap={3} sx={{ width: '300px' }} height='50px'>
                  {!isActiveCr && props.suppliesItem !== undefined && props.suppliesItem?.length !== 0 && props.suppliesItem.statusCode !== 422 ? <ButtonGD title="Thêm mới" onClick={() => setIsOpen(true)} /> :
                    // <ButtonGD title="Đang tải dữ liệu.." width="150px" disabled onClick={() => setIsOpen(true)} endIcon={<CircularProgress sx={{ color: "#fff" }} />} />}
                    <ButtonGD title="Thêm phiếu mượn" width="150px"  onClick={() => setIsOpen(true)} />}
                  {isActiveCr && <ButtonGD title="Hủy" onClick={() => setActiveCr(false)} />}
                  {!isActiveCr && props.projectItem !== undefined && props.projectItem?.length !== 0 && props.suppliesItem !== undefined && props.suppliesItem?.length !== 0 && props.dataUser !== undefined && props.dataUser?.length !== 0 && <ButtonGD title="Xóa" disabled={selected?.length === 0} isColor={true} onClick={() => setOpen(true)} />}
                </Grid>
              </Grid>
              <Grid lg={4} md={6} xs={12} container justifyContent='space-between' gap={2} >
                <Grid  md={7} sm={12} xs={12} container justifyContent='center'>
                  <FormControl fullWidth>
                    <TextField label="Tìm kiếm" variant="outlined" type="text" onChange={(e) => setKeyFind(e.target.value)} />
                  </FormControl>
                </Grid>
                <Grid md={4} sm={12} xs={12} container justifyContent='center'>
                  <ExportReport data={props.projectItem} />
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
                <ButtonGD color="success" title="Chắn chắn" onClick={() => handleComform(selected)} />
                <ButtonGD color="error" title="Hủy bỏ" isColor onClick={handleClose} />
              </DialogActions>
            </Dialog>
            <CreateModal dataUser={props.dataUser} isOpen={isOpen} isClose={(value) => setIsOpen(value)} productItems={props.suppliesItem} />
          </>
        </>
      </MainCard >
    </>

  );
}
