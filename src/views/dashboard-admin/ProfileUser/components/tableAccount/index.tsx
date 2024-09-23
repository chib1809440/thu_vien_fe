import PreviewIcon from '@mui/icons-material/Preview';
import UpdateIcon from '@mui/icons-material/Update';
import { Grid } from '@mui/material';
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
import { visuallyHidden } from '@mui/utils';
import * as React from 'react';
import { ROWSPERPAGE } from '../../../../../config';
import { chuanHoaChuoi } from '../../../../../constant/mainContant';
import { dispatch } from '../../../../../store';
import { openBarcode } from '../../../../../store/slices/barcodeV2';
import ButtonGD from '../../../../../ui-component/ButtonGD';

interface Data {
  userID: string;
  username: string;
  isActive: string;
  fullName: string;
  gender: string;
  addressUser: string;
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
    id: 'fullName',
    numeric: false,
    disablePadding: false,
    label: 'Họ tên',
  },
  {
    id: 'numberPhone',
    numeric: false,
    disablePadding: false,
    label: 'Điện thoại',
  },
  {
    id: 'userID',
    numeric: false,
    disablePadding: false,
    label: 'Mã thành viên',
  },
  {
    id: 'role',
    numeric: false,
    disablePadding: false,
    label: 'Vai trò',
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
  keyFindUser: string;
  setSelect: any;
  setSelectUser: any;
  dataDelete: any;
  setIsUpdate: any;
  dataUpdate: any;
  suppliesItem?: any;
}) {

  const [data, setData] = React.useState<any>([]);

  React.useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('fullName');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [idSelected, setIdSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense,] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(ROWSPERPAGE);

  React.useEffect(() => {
    // const filteredRows = props.data?.filter((item: any) => item.fullName.toLowerCase().includes(props.keyFind.toLowerCase()));
    const filteredRows = props.data?.filter((item: any) => chuanHoaChuoi(item.fullName).includes(chuanHoaChuoi(props.keyFind)))
    const filteredRowsKeyUser = props.data?.filter((item: any) => chuanHoaChuoi(item.userID).includes(chuanHoaChuoi(props.keyFindUser)))

    const filteredRowsKey = filteredRows?.filter((item: any) => chuanHoaChuoi(item.userID).includes(chuanHoaChuoi(props.keyFindUser)))
    if (props.keyFind !== '') {
      setData(filteredRows)
    }
    if (props.keyFindUser !== '') {
      setData(filteredRowsKeyUser)
    }
    if (props.keyFind === '' && props.keyFindUser === '') {
      setData(props.data)
    }
    if (props.keyFind !== '' && props.keyFindUser !== '') {
      setData(filteredRowsKey)
    }
  }, [props.keyFind, props.keyFindUser, props.data])

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
      const newSelected = data.map((n) => n?.username);
      const newIdSelected = data.map((n) => n?.userID);
      setSelected(newSelected);
      setIdSelected(newIdSelected);
      return;
    }
    setSelected([]);
    setIdSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, username: string, userID: string) => {

    const selectedIndex = selected.indexOf(username);
    const idSelectedIndex = idSelected.indexOf(userID);
    let newSelected: readonly string[] = [];
    let newIdSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, username);
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
      newIdSelected = newIdSelected.concat(idSelected, userID);
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

  const isSelected = (username: string) => selected.indexOf(username) !== -1;

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
    props.setSelectUser(idSelected);
    props.dataDelete(idSelected)
  }, [selected?.length]);

  const handleUpdate = (dataUpdate) => {
    props.setIsUpdate(2)
    props.dataUpdate(dataUpdate)
  };

  const handleOpen = (id) => {
    dispatch(openBarcode({
      openBC: true,
      userID: id,
    }))
  }

  return (
    <>
      {visibleRows?.length !== 0 ?
        <>
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
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
                      {visibleRows.map((row, index) => {
                        const isItemSelected = isSelected(row?.username.toString());
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row?.username.toString(), row?.userID.toString())}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.username}
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
                            >
                              {row?.fullName}
                            </TableCell>
                            <TableCell align="left">{row?.numberPhone}</TableCell>
                            <TableCell align="left">{row?.userID}</TableCell>
                            <TableCell align="left">{row?.role === 1 ? 'Giáo viên' : 'Học sinh'}</TableCell>
                            <TableCell align="right">
                              <Grid container gap={1} alignItems='right' justifyContent='right'>
                                <ButtonGD
                                  title='Cập nhật'
                                  width='130px'
                                  onClick={() => handleUpdate(row)}
                                  endIcon={<UpdateIcon />} />
                                <ButtonGD
                                  title='Chi tiết'
                                  width='130px'
                                  onClick={() => handleOpen(row?.userID)}
                                  endIcon={<PreviewIcon />} />
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
          </Box>
        </>
        :
        <>
          {/* <CircularProgress /> */}
          <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
        </>
      }
    </>
  );
}
