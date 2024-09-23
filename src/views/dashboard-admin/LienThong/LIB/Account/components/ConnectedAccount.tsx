import { FormControl, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { visuallyHidden } from '@mui/utils';
import React from 'react';
import { ROWSPERPAGE } from '../../../../../../config';
import { chuanHoaChuoi } from '../../../../../../constant/mainContant';
import ButtonGD from '../../../../../../ui-component/ButtonGD';
import ModalAddAccount from './ModalAddAccount';
import ModalUpdateAccount from './ModalUpdateAccount';

interface Data {
  userID: string;
  userName: string;
  fullName: string;
  numberPhone: string;
  schoolName: string;
  addressUser: string;
  userDescription: string;
  status: boolean;
  edit: string;
}

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
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
    id: 'userName',
    numeric: false,
    disablePadding: true,
    label: 'Tên tài khoản',
  },
  {
    id: 'schoolName',
    numeric: false,
    disablePadding: false,
    label: 'Tên trường',
  },
  {
    id: 'fullName',
    numeric: false,
    disablePadding: false,
    label: 'Tên thủ thư',
  },
  {
    id: 'addressUser',
    numeric: false,
    disablePadding: false,
    label: 'Địa chỉ',
  },
  {
    id: 'numberPhone',
    numeric: false,
    disablePadding: false,
    label: 'Số điện thoại',
  },
  {
    id: 'status',
    numeric: true,
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


export default function ConnectedAccount(props: {
  [x: string]: any;
  data?: any;
}) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('userID');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [idSelected, setIdSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(ROWSPERPAGE);
  const [dense,] = React.useState(false);
  const [dataRoot, setDataRoot] = React.useState<any>([]);
  const [data, setData] = React.useState<any>([]);
  const [keyFind, setKeyFind] = React.useState<string>('');

  const [isOpenModalAdd, setOpenModalAdd] = React.useState(false);
  const [isOpenModalUp, setOpenModalUp] = React.useState(false);
  const [dataUpdate, setDataUpdate] = React.useState<any>([]);

  React.useEffect(() => {
    setDataRoot(props.data)
  }, [props.data])

  React.useEffect(() => {
    const filteredRows = dataRoot?.filter((item: any) => chuanHoaChuoi(item.userName).includes(chuanHoaChuoi(keyFind)))
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
      const newSelected = data.map((n) => n?.userID);
      const newIdSelected = data.map((n) => n?.userName);
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

  const isSelected = (userName: string) => selected.indexOf(userName) !== -1;

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


  return (
    <>
      <Box sx={{ width: '100%' }}>
        <ModalAddAccount isOpen={isOpenModalAdd} isClose={(e) => setOpenModalAdd(e)} />
        <ModalUpdateAccount isOpen={isOpenModalUp} isClose={(e) => setOpenModalUp(e)} data={dataUpdate}/>
        <Grid xs={12} container justifyContent={{ md: 'flex-start', xs: 'center' }} gap={{ lg: 2, xs: 3 }}>
          <Grid lg={2.5} md={2.5} xs={12}>
            <FormControl fullWidth>
              <TextField type="text" label="Tìm kiếm theo tên tài khoản" variant="outlined" onChange={(e) => setKeyFind(e.target.value)} />
            </FormControl>
          </Grid>
          <ButtonGD title='Thêm tài khoản' onClick={() => setOpenModalAdd(true)} />
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
                {data?.length !== 0 || data !== undefined ?
                  <TableBody>
                    {visibleRows.map((row: any, index) => {
                      const isItemSelected = isSelected(row?.userID.toString());
                      const labelId = `enhanced-table-checkbox-${index}`;
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.userID.toString()}
                          selected={isItemSelected}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            align="left"
                          >
                            {row?.username}
                          </TableCell>
                          <TableCell align="left">{row?.schoolName}</TableCell>
                          <TableCell align="left">{row?.fullName}</TableCell>
                          <TableCell align="left">{row?.addressUser}</TableCell>
                          <TableCell align="left">{row?.numberPhone}</TableCell>
                          <TableCell align="center">
                            <Grid container gap={1} alignItems='center' justifyContent='center'>
                              <ButtonGD title='Cập nhật' width='130px' onClick={() => {
                                setDataUpdate(row);
                                setOpenModalUp(true);
                              }} />
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
