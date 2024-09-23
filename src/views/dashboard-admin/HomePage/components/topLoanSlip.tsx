import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import React from "react";
import imgSach from "./sachlop2.jpg";


export default function TopLoanShip(props: {
  [x: string]: any;
  dataStanding: any;
}) {

  const [dataStanding, setdataStanding] = React.useState<any>([]);

  React.useEffect(() => {
    let firstThreeElements = props.dataStanding.slice(0, 3);
    setdataStanding(firstThreeElements)
  }, [props.dataStanding]);

  return (
    <Item container mb={3} md={12}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
          {/* <caption>Top 3 - sách được mượn nhiều nhất tháng</caption> */}
          <TableHead>
            <TableRow>
              <TableCell>TOP</TableCell>
              <TableCell align="left">Hình ảnh</TableCell>
              <TableCell align="left">Tên ấn phẩm</TableCell>
              <TableCell align="right">Tổng số lượt mượn</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataStanding.map((row, index) => (
              <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                <TableCell component="th" scope="row" sx={{ fontWeight: index === 0 ? 700 : 400, fontSize: index === 0 ? '20px' : '' }}>
                  Top {index + 1}
                </TableCell>
                {/* <TableCell align="left"><img width='70px' src={imgSach} alt="anh" /></TableCell> */}
                <TableCell align="left">
                {row.listMedia !== null ?
                  <img style={{borderRadius:'5px'}} width='auto' height='100px' src={`${process.env.REACT_APP_BASE_API_URL}${row.listMedia[row.listMedia.length - 1]?.url}`} alt="ảnh sách" />
                  :
                  <img style={{borderRadius:'5px'}} width='auto' height='100%' src={imgSach} alt="avata" />
                }
                </TableCell>
                <TableCell align="left" sx={{ fontWeight: index === 0 ? 700 : 400, fontSize: index === 0 ? '20px' : '' }}>{row.supplyName}</TableCell>
                <TableCell align="right" sx={{ fontWeight: index === 0 ? 700 : 400, fontSize: index === 0 ? '20px' : '' }}>{row.total_borrowed_supplies}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Item>
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