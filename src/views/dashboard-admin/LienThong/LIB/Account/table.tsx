import { Grid, Typography } from "@mui/material";
import MainCard from "../../../../../ui-component/cards/MainCard";
import ConnectedAccount from "./components/ConnectedAccount";

// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function StickyHeadTable(props: {
  [x: string]: any;
  projectItem: any;
}) {
  const role = window.localStorage.getItem('reactR')

  return (
    <>
      {role === '1' ?
        <MainCard title="Quản lý tài khoản">
          <ConnectedAccount data={props.projectItem} />
        </MainCard>
        :
        <Grid xs={12} mt={5} container justifyContent='center' alignItems='center'>
          <Typography fontWeight={900} fontSize={28}>Không có quyền truy cập!</Typography>
        </Grid>
      }
    </>
  );
}
