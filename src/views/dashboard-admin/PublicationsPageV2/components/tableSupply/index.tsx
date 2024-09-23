import PreviewIcon from '@mui/icons-material/Preview';
import UpdateIcon from '@mui/icons-material/Update';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { default as imageVodeo, default as sachSimple } from '../../../../../assets/images/books/book-dientu.jpg';
import { ROWSPERPAGE } from '../../../../../config';
import { chuanHoaChuoi } from '../../../../../constant/mainContant';
import ButtonGD from '../../../../../ui-component/ButtonGD';

interface Data {
  supplyId: string;
  listMedia: [];
  supplyName: string;
  isbn: string;
  numberPages: string;
  quantity: number;
  authors: object;
  publisher: string;
  emailUser: string;
  numberPhone: string;
  imageUser: string;
  birthDay: string;
  departmentID: string;
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
    label: 'Tên học liệu',
  },
  // {
  //   id: 'quantity',
  //   numeric: false,
  //   disablePadding: false,
  //   label: 'Số lượng',
  // },
  {
    id: 'authors',
    numeric: false,
    disablePadding: false,
    label: 'Tác giả',
  },
  {
    id: 'publisher',
    numeric: false,
    disablePadding: false,
    label: 'Nhà xuất bản',
  },
  {
    id: 'isbn',
    numeric: false,
    disablePadding: false,
    label: 'Mã ISBN',
  },
  {
    id: 'edit',
    numeric: true,
    disablePadding: false,
    label: 'Thao tác',
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
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
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

export default function EnhancedTable(props: {
  [x: string]: any;
  data: any;
  keyFind: string;
  setSelect: any;
  dataDelete: any;
  setIsCreate: any;
  dataUpdate: any;
}) {
  const navigate = useNavigate();

  const [data, setData] = React.useState<any>([]);

  // React.useEffect(() => {
  //   setData(props.data);
  // }, [props.data]);

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('supplyId');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [idSelected, setIdSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense,] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(ROWSPERPAGE);

  React.useEffect(() => {
    // const filteredRows = props.data?.filter((item: any) => item.supplyName.toLowerCase().includes(props.keyFind.toLowerCase()));
    const filteredRows = props.data?.filter((item: any) => chuanHoaChuoi(item.supplyName).includes(chuanHoaChuoi(props.keyFind)))

    if (props.keyFind !== '') {
      setData(filteredRows)
    } else {
      setData(props.data.filter(item => {
        return item.printedMatter?.printedMatterName !== props.dataPrintedMatter?.[0]?.printedMatterName;
      })
  )
    }
  }, [props.keyFind, props.data])

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
      const newSelected = data.map((n) => n?.supplyId);
      const newIdSelected = data.map((n) => n?.supplyName);
      setSelected(newSelected);
      setIdSelected(newIdSelected);
      return;
    }
    setSelected([]);
    setIdSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, supplyId: string, supplyName: string) => {

    const selectedIndex = selected.indexOf(supplyId);
    const idSelectedIndex = idSelected.indexOf(supplyName);
    let newSelected: readonly string[] = [];
    let newIdSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, supplyId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected?.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    if (idSelectedIndex === -1) {
      newIdSelected = newIdSelected.concat(idSelected, supplyName);
    } else if (idSelectedIndex === 0) {
      newIdSelected = newIdSelected.concat(idSelected.slice(1));
    } else if (idSelectedIndex === idSelected?.length - 1) {
      newIdSelected = newIdSelected.concat(idSelected.slice(0, -1));
    } else if (idSelectedIndex > 0) {
      newIdSelected = newIdSelected.concat(
        idSelected.slice(0, idSelectedIndex),
        idSelected.slice(idSelectedIndex + 1),
      );
    }

    setSelected(newSelected);
    setIdSelected(newIdSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (supplyName: string) => selected.indexOf(supplyName) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
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

  React.useEffect(() => {
    props.setSelect(selected?.length);
    props.dataDelete(selected)
  }, [selected?.length]);

  const handleUpdate = (dataUpdate) => {
    props.setIsCreate(2)
    props.dataUpdate(dataUpdate)
  };

  const [open, setOpen] = React.useState(false);
  const [dataDialog, ] = React.useState<any>([]);
  // const handleOpen = (data) => {
  //   setOpen(true);
  //   setDataDialog(data)
  // };

  const handleClose = () => {
    setOpen(false);
  };

  function checkUrl(dataDetails) {
    
    if (dataDetails?.listMedia !== null || dataDetails !== null) {
      let lastChar = dataDetails?.listMedia[dataDetails?.listMedia.length -1]['url'].slice(-4);
      
      if (lastChar === '.mp4' || lastChar === '.pdf' || lastChar === 'pptx') {
        return <img style={{borderRadius:'5px'}} width='70px' height='auto' src={imageVodeo} alt="ảnh ấn phẩm" />
      }
      if (lastChar === '.png' || lastChar === '.jpg' || lastChar === '.jpeg') {
        return <img style={{borderRadius:'5px'}} width='60px' height='auto' src={`${process.env.REACT_APP_BASE_API_URL}/${dataDetails?.listMedia[dataDetails?.listMedia.length -1]?.['url']}`} alt="ảnh học liệu" />
      }
    } else {
      return <img style={{borderRadius:'5px'}} width='60px' height='auto' src={sachSimple} alt="ảnh học liệu" />
    }
  }

  return (
    <>
      {visibleRows?.length !== 0 ?
        <>
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              {/* <EnhancedTableToolbar numSelected={selected?.length} /> */}
              <TableContainer>
                <Table
                  sx={{ minWidth: 750 }}
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
                  {props.data?.length !== 0 || props.data !== undefined ?
                    <TableBody>
                      {visibleRows.map((row: any, index) => {
                        const isItemSelected = isSelected(row?.supplyId.toString());
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row?.supplyId.toString(), row?.supplyName.toString())}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.supplyId.toString()}
                            selected={isItemSelected}
                            sx={{ cursor: 'pointer' }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  'aria-labelledby': labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                              // sx={{display:'flex', alignItems:'center'}}
                            >
                              {/* {row?.supplyName} */}
                              <>
                                {
                                  row?.listMedia !== null ?
                                  <>
                                    {/* <img width='50px' src={`${process.env.REACT_APP_BASE_API_URL}/${row?.listMedia[0]['url']}`} alt="ảnh học liệu" /> */}
                                    {checkUrl(row)}
                                  </>
                                  :
                                  <img style={{borderRadius:'5px'}} width='60px' height='auto' src={imageVodeo} alt="ảnh ấn phẩm" />

                                }
                              </>
                            </TableCell>
                            <TableCell align="left">{row?.supplyName}</TableCell>
                            {/* <TableCell align="left">{Number(row?.quantity)}</TableCell> */}
                            <TableCell align="left">{row?.authors?.list[0].authorName}</TableCell>
                            <TableCell align="left">{row?.publisher?.['publisherName']}</TableCell>
                            <TableCell align="left">{row?.ISBN}</TableCell>
                            <TableCell align="right">
                              <Grid container gap={1} alignItems='right' justifyContent='right'>
                                {/* <VisibilityIcon onClick={() => handleOpen(row)} sx={{ fontSize: '32px', color: '#009933', '&:hover': { transform: 'scale(1.2)' } }} /> */}
                                {/* <UpdateIcon
                                  onClick={() => handleUpdate(row)}
                                  sx={{
                                    fontSize: '32px', color: '#2196f3', '&:hover': { transform: 'scale(1.2)' }
                                  }}
                                /> */}
                                <ButtonGD
                                  title='Cập nhật'
                                  width='130px'
                                  onClick={() => handleUpdate(row)}
                                  endIcon={<UpdateIcon />}>

                                </ButtonGD>
                                <ButtonGD
                                  title='Chi tiết'
                                  width='130px'
                                  // onClick={() => handleUpdate(row)}
                                  onClick={() => navigate('/chi-tiet-hoc-lieu', { state: row })}
                                  endIcon={<PreviewIcon />}>
                                </ButtonGD>
                                {/* <Button
                                  // onClick={() => handleUpdate(row)}
                                  onClick={()=> navigate('/chi-tiet-danh-muc', {state: row })}
                                  variant="contained" endIcon={<PreviewIcon />}>
                                  Chi tiết
                                </Button> */}
                              </Grid>
                            </TableCell>
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
                    :
                    <></>
                  }
                </Table>
                <>
                  {props.data?.length !== 0 || props.data !== undefined ?
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="draggable-dialog-title"
                      maxWidth="sm" fullWidth
                    >
                      <DialogContent
                        sx={{ width: 'auto', height: 'auto' }}
                      >
                        <DialogContentText>
                          <Grid>
                            <Grid container justifyContent='center' alignItems='center'>
                              <Grid sx={{ width: '100px', height: '100px', borderRadius: '30px' }}>
                                <img width='auto' height='100%' src={`${process.env.REACT_APP_BASE_API_URL}/${dataDialog?.imageUser}`} alt="avata" />
                              </Grid>
                            </Grid>
                            <Grid mt={2}>
                              <Grid container gap={1}>
                                <Typography fontSize='26px' fontWeight='600' color='#000'>Tài khoản:</Typography>
                                <Typography fontSize='26px' fontWeight='500'>{dataDialog?.supplyName}</Typography>
                              </Grid>
                              <Grid container gap={1}>
                                <Typography fontSize='26px' fontWeight='600' color='#000'>Họ và tên:</Typography>
                                <Typography fontSize='26px' fontWeight='500'>{dataDialog?.fullName}</Typography>
                              </Grid>
                              <Grid container gap={1}>
                                <Typography fontSize='26px' fontWeight='600' color='#000'>Địa chỉ:</Typography>
                                <Typography fontSize='26px' fontWeight='500'>{dataDialog?.addressUser}</Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        {/* <Button  onClick={handleClose}>
                                  Hủy bỏ
                                </Button> */}
                        <Button onClick={handleClose}>Thoát</Button>
                      </DialogActions>
                    </Dialog>
                    : <></>
                  }
                </>
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
          </Box>
        </>
        :
        <>
          <Grid container justifyContent='center' mt={5}>
            <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
            {/* <CircularProgress /> */}
          </Grid>
        </>
      }
    </>
  );
}


