import { FormControl, Grid, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { visuallyHidden } from '@mui/utils';
import React from 'react';
import imageVodeo from '../../../../../../../assets/images/books/book-dientu.jpg';
import sachSimple from '../../../../../../../assets/images/books/book-truyenthong.jpg';
import { ROWSPERPAGE } from '../../../../../../../config';
import { chuanHoaChuoi } from '../../../../../../../constant/mainContant';
import ButtonGD from '../../../../../../../ui-component/ButtonGD';
import ModalViewImg from '../../../ModalViewImg';
import ModalViewSchool from '../../../ModalViewSchool';

interface Data {
  id: string;
  listMedia: [];
  supplyName: string;
  isbn: string;
  status: boolean;
  schoolName: string;
  qty: number;
  edit: string;
  role: number;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'listMedia',
    numeric: false,
    disablePadding: true,
    label: 'Hình ảnh',
  },
  {
    id: 'supplyName',
    numeric: false,
    disablePadding: false,
    label: 'Tên ấn phẩm',
  },
  {
    id: 'isbn',
    numeric: false,
    disablePadding: false,
    label: 'Mã ISBN',
  },
  {
    id: 'qty',
    numeric: false,
    disablePadding: false,
    label: 'Số lượng',
  },
  {
    id: 'schoolName',
    numeric: false,
    disablePadding: false,
    label: 'Trường',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Trạng thái',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


export default function Connected(props: {
  [x: string]: any;
  data: any;
  dataRegisterSlipLT: any;
}) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('id');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [idSelected, setIdSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(ROWSPERPAGE);
  const [dense,] = React.useState(false);
  const apiLT = window.localStorage.getItem('apiLT')

  const [dataRoot, setDataRoot] = React.useState<any>([]);
  const [dataModal, setDataModal] = React.useState<any>([]);
  const [isOpenModal, setOpenModal] = React.useState(false);

  const [data, setData] = React.useState<any>([]);
  const [keyFind, setKeyFind] = React.useState<string>('');

  React.useEffect(() => {
    setDataRoot(props.dataRegisterSlipLT)
  }, [props.dataRegisterSlipLT])

  React.useEffect(() => {
    const filteredRows = dataRoot?.filter((item: any) => chuanHoaChuoi(item?.detail?.[item?.detail.length - 1]?.supplies?.supplyName).includes(chuanHoaChuoi(keyFind)))

    if (keyFind !== '') {
      setData(filteredRows)
    } else {
      setData(dataRoot)
    }
  }, [keyFind, dataRoot])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n?.id);
      const newIdSelected = data.map((n) => n?.supplyName);
      setSelected(newSelected);
      setIdSelected(newIdSelected);
      return;
    }
    setSelected([]);
    setIdSelected([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (supplyName: string) => selected.indexOf(supplyName) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(data, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, data],
  );

  function checkUrl(dataDetails) {
    let abc: string = `${apiLT}/media/${dataDetails?.medias[dataDetails?.medias.length - 1]?.['url']}`
    let lastChar = dataDetails?.medias[dataDetails?.medias.length - 1]?.['url'].slice(-4);

    if (dataDetails?.medias !== null && dataDetails?.medias.length !== 0) {
      if (lastChar === '.mp4' || lastChar === '.pdf') {
        return <video style={{ borderRadius: '5px' }} width='70px' height='auto' src={imageVodeo} />
      }
      if (lastChar === '.png' || lastChar === '.jpg' || lastChar === '.jpeg') {
        return <img style={{ borderRadius: '5px' }} width='60px' height='auto' src={abc} alt="ảnh ấn phẩm" onClick={() => {
          setDataModalViewImg(dataDetails);
          setOpenModalViewImg(true);
        }} />
      }
    } else {
      return <img style={{ borderRadius: '5px' }} width='60px' height='auto' src={sachSimple} alt="ảnh ấn phẩm" />
    }
  }

  function checkStatus(row: any) {
    const foundItem = props.dataRegisterSlipLT.find(item =>
      item?.detail[0]?.supplies?.supplyID === row?.supplyID
    );

    if (foundItem === undefined) {
      return <Typography sx={{ fontWeight: 900 }}>Chưa đăng ký</Typography>
    } else {
      if (foundItem?.state) {
        return <Typography sx={{ fontWeight: 900, color: 'green' }}>Đã duyệt</Typography>
      }
      if (!foundItem?.state) {
        return <Typography sx={{ fontWeight: 900, color: 'blue' }}>Đã đăng ký</Typography>
      }
    }
  }

  function checkDisable(row: any) {
    const foundItem = props.dataRegisterSlipLT.find(item =>
      item?.detail[0]?.supplies?.supplyID === row?.supplyID
    );

    if (foundItem === undefined) {
      return false
    } else {
      return true
    }
  }

  const [dataModalViewImg, setDataModalViewImg] = React.useState<any>([]);
  const [isOpenModalViewImg, setOpenModalViewImg] = React.useState(false);

  const [dataModalViewSchool, setDataModalViewSchool] = React.useState<any>([]);
  const [isOpenModalViewSchool, setOpenModalViewSchool] = React.useState(false);

  return (
    <>
      <ModalViewImg data={dataModalViewImg} isOpen={isOpenModalViewImg} isClose={(e) => setOpenModalViewImg(e)} />
      <ModalViewSchool data={dataModalViewSchool} isOpen={isOpenModalViewSchool} isClose={(e) => setOpenModalViewSchool(e)} />
      <Box sx={{ width: '100%' }}>
        <Grid width={{ lg: '300px', md: '250px', sm: '300px', xs: '100%' }}>
          <FormControl fullWidth>
            <TextField type="text" label="Tìm kiếm theo tên ấn phẩm" variant="outlined" onChange={(e) => setKeyFind(e.target.value)} />
          </FormControl>
        </Grid>
        {visibleRows?.length !== 0 ?
          <Paper sx={{ width: '100%', mb: 2 }}>
            {/* <EnhancedTableToolbar numSelected={selected?.length} /> */}
            <TableContainer>
              <Table
                // sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  numSelected={selected?.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={data?.length}
                />
                <TableBody>
                  {visibleRows.map((row: any, index) => {
                    const isItemSelected = isSelected(row?.id.toString());
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        // onClick={(event) => handleClick(event, row?.id.toString(), row?.supplyName.toString())}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id.toString()}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {/* {row?.supplyName} */}
                          <>
                            {
                              row?.detail[row?.detail.length - 1]?.supplies !== null ?
                                <>
                                  {checkUrl(row?.detail[row?.detail.length - 1]?.supplies)}
                                </>
                                :
                                <img style={{ borderRadius: '5px' }} width='60px' height='auto' src={sachSimple} alt="ảnh ấn phẩm" />
                            }
                          </>
                        </TableCell>
                        <TableCell align="left">{row?.detail[row?.detail.length - 1]?.supplies?.supplyName}</TableCell>
                        <TableCell align="left">{row?.detail[row?.detail.length - 1]?.supplies?.ISBN}</TableCell>
                        <TableCell align="left">{row?.detail[row?.detail.length - 1]?.qty}</TableCell>
                        <TableCell align="left" onClick={() => {
                          setDataModalViewSchool(row);
                          setOpenModalViewSchool(true);
                        }}
                          sx={{
                            fontWeight: 900,
                            '&:hover': { color: 'blue' }
                          }}>{row?.user?.schoolName}</TableCell>
                        <TableCell align="left">{checkStatus(row?.detail[row?.detail.length - 1]?.supplies)}</TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage={"Số hàng trên trang"}
              labelDisplayedRows={function defaultLabelDisplayedRows({ from, to, count }) {
                return ` từ ${from}–${to} trên ${count !== -1 ? count : `more than ${to}`}`;
              }}
            />
          </Paper>
          :
          <>
            <Grid container justifyContent='center' mt={5}>
              <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
              {/* <CircularProgress /> */}
            </Grid>
          </>
        }
      </Box>
    </>
  );
}
