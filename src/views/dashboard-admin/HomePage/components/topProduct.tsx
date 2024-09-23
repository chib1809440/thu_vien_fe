import { Grid, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import React from "react";

// ==============================|| TABLE - STICKY HEADER ||============================== //



export default function TopProduct(props: {
  [x: string]: any;
  dataSupplies: any;
}) {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    setData(props.dataSupplies)
  }, [props.dataSupplies]);



  return (
    <Grid height='200px' container justifyContent='center' alignItems='center' fontSize='26px'>
      Sắp ra mắt (đang chỉnh sửa)
    </Grid>
  );
}

const Item = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 'auto',
  border: '1px 0px 1px 0px solid #000'
}));
const Title = styled(Typography)(({ theme }) => ({
  marginTop: '1rem',
  color: theme.palette.text.primary,
  fontFamily: theme.typography.fontFamily,
  fontSize: '22px',
  fontWeight: 600
}));