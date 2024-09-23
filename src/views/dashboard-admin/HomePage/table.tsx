import BeenhereIcon from '@mui/icons-material/Beenhere';
import StyleIcon from '@mui/icons-material/Style';
import { Grid, Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from 'react';
import CardHome from './components/CardWrapper';
import CardHomeLight from './components/CardWrapperLight';
import ChatWrapper from './components/ChatWrapper';


// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function StickyHeadTable(props: {
  [x: string]: any;
  dataStanding: any;
  dataSupplies: any;
  dataLoanSlip: any;
  dataStateOfBook: any;
  dataRegisterSlip: any;
}) {

  const namHienTai = new Date();
  const getMonth = namHienTai.getMonth();

  // const [dataIsLoan, setDataIsLoan] = React.useState<any>([]);
  const [dataStanding, setDataStanding] = React.useState<any>([]);

  function getLengthMonthYearFilter(month) {
    if (month === 8) { return 0; }
    if (month === 9) { return 1; }
    if (month === 10) { return 2; }
    if (month === 11) { return 3; }
    if (month === 12) { return 4; }
    if (month === 1) { return 5; }
    if (month === 2) { return 6; }
    if (month === 3) { return 7; }
    if (month === 4) { return 8; }
    if (month === 5) { return 9; }
    if (month === 6) { return 10; }
    if (month === 7) { return 11; }
    return 0;
  }

  React.useEffect(() => {

    let firstThreeElements = props.dataStanding[getLengthMonthYearFilter(getMonth + 1)].slice(0, 3);
    setDataStanding(firstThreeElements)
  }, [props.dataSupplies, props.dataLoanSlip, props.dataStanding]);

  function totalQuantity() {
    let total = 0;
    for (let i = 0; i < props.dataSupplies.length; i++) {
      total += props.dataSupplies[i].quantity;
    }
    return total;
  }
  function totalCabinQuantity() {
    let total = 0;
    for (let i = 0; i < props.dataSupplies.length; i++) {
      total += props.dataSupplies[i].cabinet_quantity;
    }
    return total;
  }

  return (
    <>
      <Box sx={{ flexGrow: 1, height: 'auto' }}>
        <Grid container md={12} justifyContent='space-between' gap={{ xs: 2, height: 'auto' }}>
          <Grid container lg={3} md={3} sm={12} xs={12} justifyContent='flex-end' gap={{ xs: 2 }}>
            <Grid lg={12} xs={12}>
              {/* <CardHomeV2 content='Sách hiện có' contentV2='Sách đang cho mượn' quantity={totalQuantity()} quantityV2={totalLoanSlip()} navigate='hoc-lieu' navigateV2='quan-ly-muon-tra/phieu-muon' icon={<StyleIcon />} iconV2={<LocalLibraryIcon />} /> */}
              {props.dataSupplies.length === 0 ?
                <Skeleton variant="rectangular" width='100%' height={80} sx={{ borderRadius: 5 }} />
                :
                <CardHome content='Sách hiện có' quantity={totalQuantity()} navigate='an-pham' icon={<StyleIcon />} />
              }
            </Grid>
            <Grid lg={12} xs={12}>
              {/* <CardHomeV2 content='Sách có thể mượn' contentV2='Sách tồn kho' quantity={totalCabinQuantity()} quantityV2={totalWarehouseQuantity()} navigate='quan-ly-muon-tra/phieu-muon' navigateV2='quan-ly-kho/kho' icon={<BeenhereIcon />} iconV2={<BookmarksIcon />} /> */}
              {props.dataSupplies.length === 0 ?
                <Skeleton variant="rectangular" width='100%' height={80} sx={{ borderRadius: 5 }} />
                :
                <CardHome content='Sách có thể mượn' quantity={totalCabinQuantity()} navigate='quan-ly-muon-tra/phieu-muon' icon={<BeenhereIcon />} />
              }
            </Grid>
            <Grid lg={12} xs={12}>
              {/* <CardHomeV2 content='Sách thanh lý' contentV2='Sách hư hỏng' quantity={totalLIQUIDATED()} quantityV2={totalDAMAGED()} navigate='quan-ly-kho/thanh-ly-hu-hong' navigateV2='quan-ly-kho/thanh-ly-hu-hong' icon={<CardMembershipIcon />} iconV2={<BookmarkRemoveIcon />} /> */}
              {/* <CardHome content='Sách thanh lý - hư hỏng' quantity={totalLIQUIDATED() + totalDAMAGED()} navigate='quan-ly-kho/thanh-ly-hu-hong' icon={<CardMembershipIcon />} /> */}
            </Grid>
            <Grid lg={12} xs={12}>
              {dataStanding.length === 0 ? <>
                <Typography fontSize={{ lg: '18px', xs: '12px' }} textAlign='center'>{`Chưa có sách được mượn`}</Typography>
              </> :
                <Grid lg={12} xs={12} maxHeight='200px' >
                  <Typography fontSize={{ lg: '18px', xs: '12px' }} textAlign='center'>{`TOP SÁCH ĐƯỢC MƯỢN TRONG THÁNG ${getMonth + 1}`}</Typography>
                </Grid>
              }
              <Grid mt={1} lg={12} xs={12} container gap={1} justifyContent='center'>
                {dataStanding.length === 0 ? <>
                  <Skeleton variant="rectangular" width='100%' height={80} sx={{ borderRadius: 5 }} />
                </> :
                  <>
                    {dataStanding.map((item: any, index: number) => (
                      <CardHomeLight dataLoanSlip={props.dataLoanSlip} dataDetails={item} content={index} />
                    ))}
                  </>}
              </Grid>
            </Grid>
          </Grid>
          <Grid container md={8.5} sm={12} xs={12} alignItems='flex-start'>
            {props.dataLoanSlip && props.dataStanding && props.dataRegisterSlip ?
              <ChatWrapper dataLoanSlip={props.dataLoanSlip} dataStanding={props.dataStanding} dataRegisterSlip={props.dataRegisterSlip} />
              :
              <Skeleton variant="rectangular" width='100%' height={500} sx={{ borderRadius: 5 }} />
            }
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
