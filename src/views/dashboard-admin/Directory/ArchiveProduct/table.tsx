import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, TextField } from "@mui/material";
import React from "react";
import IBreadcrumsCustom from "../../../../ui-component/breadcrums";
import MainCard from "../../../../ui-component/cards/MainCard";
import EnhancedTable from "./components/tableGroup";
import ButtonGD from "../../../../ui-component/ButtonGD";

// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function StickyHeadTable(props: {
  [x: string]: any;
  projectItem: any;
  dataCabinet: any;
  dataLoanSlip: any;
}) {

  const [keyFind, setKeyFind] = React.useState<string>('');
  const [keyFindV2, setKeyFindV2] = React.useState<string>('');
  const [selected, setSelected] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  // const filteredRows = props.projectItem?.filter((item: any) => item.cabinets !== null);

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      {/* <IBreadcrumsCustom profile="TRANG CHỦ" mainProfile="QUẢN LÝ TỦ - KỆ" link="/trang-chu" /> */}
      <MainCard title="DANH SÁCH TỦ - KỆ">
        <Grid height='auto'>
          <Grid container justifyContent='flex-start' width="100%" height="auto" gap={2}>
            <Grid width={window.screen.width >= 1024 ? '300px' : '100%'} container>
              <Grid sx={{ width: '300px' }} container justifyContent='center'>
                <FormControl fullWidth>
                  <TextField label="Tìm kiếm theo tên ấn phẩm" variant="outlined" onChange={(e) => setKeyFind(e.target.value)} />
                </FormControl>
              </Grid>
            </Grid>
            <Grid width={window.screen.width >= 1024 ? '300px' : '100%'} container>
              <Grid sx={{ width: '300px' }} container justifyContent='center'>
                <FormControl fullWidth>
                  <TextField label="Tìm kiếm vị trí" variant="outlined" onChange={(e) => setKeyFindV2(e.target.value)} />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          
          {props.projectItem !== undefined && props.projectItem?.length !== 0 
            && props.dataCabinet !== undefined && props.dataCabinet?.length !== 0 ?
            <EnhancedTable dataCabinet={props.dataCabinet} data={props.projectItem} keyFind={keyFind} keyFindV2={keyFindV2} setSelect={(newValue: any) => setSelected(newValue)} dataLoanSlip={props.dataLoanSlip}/>
            :
            <Grid container justifyContent='center' mt={5}>
              <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
              {/* <CircularProgress /> */}
            </Grid>
          }
        </Grid>
      </MainCard>
    </>

  );
}
