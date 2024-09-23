import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SendIcon from '@mui/icons-material/Send';
import UpdateIcon from '@mui/icons-material/Update';
import { CircularProgress, Grid, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
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
import ButtonGD from '../../../../../ui-component/ButtonGD';
import { useUpdateGroupPower } from '../../../SystemPage/DistributionOfPowers/hook/updateGroupPower';
import ModalDetails from './ModalDetails';
import ModalExtend from './ModalExtend';
import UpdateModal from './ModalUpdate';

interface Data {
  loanSlipNumber: string;
  name: string;
  create_at: string;
  return_date: string;
  limited_date: string;
  return_at: string;
  users: {
    fullName: string;
    numberPhone: string;
  };
  creator_id: string;
  approver_id: string;
  quantity: number;
  state: string;
  note: string;
  supplies: [];
  edit: string;
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
    id: 'loanSlipNumber',
    numeric: false,
    disablePadding: true,
    label: 'Số phiếu',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Tên bạn đọc',
  },
  // {
  //   id: 'users',
  //   numeric: false,
  //   disablePadding: true,
  //   label: 'Số điện thoại',
  // },
  {
    id: 'create_at',
    numeric: false,
    disablePadding: true,
    label: 'Ngày lập',
  },
  {
    id: 'return_at',
    numeric: false,
    disablePadding: true,
    label: 'Ngày hẹn trả',
  },
  {
    id: 'limited_date',
    numeric: false,
    disablePadding: true,
    label: 'Ngày gia hạn',
  },
  {
    id: 'state',
    numeric: false,
    disablePadding: true,
    label: 'Trạng thái',
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
  dataUser: any;
  suppliesItem: any;

}) {

  const [data, setData] = React.useState<any>([]);

  // React.useEffect(() => {
  //   setData(props.data?.filter((item: any) => item?.state === false));
  // }, [props.data]);

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('name');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [idSelected, setIdSelected] = React.useState<readonly string[]>([]);
  const [dataUpdate, setDataUpdate] = React.useState<any>([]);
  const [dataExtend, setDataExtend] = React.useState<any>([]);
  const [dataDetails, setDataDetails] = React.useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [dense,] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(ROWSPERPAGE);

  const [isUpdateLoanSlip, setUpdateLoanSlip] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [openAlertError, setOpenAlertError] = React.useState(false);

  React.useEffect(() => {
    if (isUpdateLoanSlip) {
      setOpenAlert(true)
      setTimeout(() => {
        setOpenAlert(false)
      }, 3000);
    }

  }, [isUpdateLoanSlip])

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const handleCloseAlertError = () => {
    setOpenAlertError(false);
  };

  React.useEffect(() => {
    // const filteredRows = props.data?.filter((item: any) => item?.name?.toLowerCase().includes(props.keyFind?.toLowerCase()));
    const filteredRowsRoot = props.data?.filter((item: any) => item?.state === false)

    const filteredRows = filteredRowsRoot?.filter((item: any) => chuanHoaChuoi(item?.users?.fullName).includes(chuanHoaChuoi(props.keyFind)))

    if (props.keyFind !== '') {
      setData(filteredRows)
    } else {
      // setData(props.data?.filter((item: any) => item.state === false))
      setData(props.data?.filter((item: any) => item?.state === false));
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
      const newSelected = data.map((n) => n?.loanSlipNumber?.toString());
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string, loanSlipNumber: string) => {

    const selectedIndex = selected.indexOf(loanSlipNumber);
    const idSelectedIndex = idSelected.indexOf(loanSlipNumber);

    let newSelected: readonly string[] = [];
    let newIdSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, loanSlipNumber);
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
      newIdSelected = newIdSelected.concat(idSelected, loanSlipNumber);
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

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

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
    props.setSelect(idSelected);
  }, [selected]);

  const handleUpdate = (event) => {
    if (event) {
      // setname(event?.name?.toString())
      setDataUpdate(event)
      setOpen(true);
    }
  };
  const handleExtend = (event) => {
    if (event) {
      setDataExtend(event)
      setOpenExtend(true);
    }
  };
  const handleDetails = (event) => {
    if (event) {
      setDataDetails(event)
      setOpenDetails(true);
    }
  }


  const [open, setOpen] = React.useState(false);
  const [openExtend, setOpenExtend] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);
  // const [name, setname] = React.useState<any>([]);
  const { isUpdate } = useUpdateGroupPower();

  React.useEffect(() => {
    setOpen(false);
  }, [isUpdate]);

  function getFormattedDate(datev1) {
    const date = new Date(datev1);
    return date.toLocaleDateString('en-GB')
  }

  function compareDate(dataDate) {
    const newDate = Date.parse(dataDate)
    if (newDate < Date.now()) {
      return true
    }
    else {
      return false
    }
  }

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <>
      {visibleRows?.length !== 0 ?
        <>
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2, mt: 2 }}>
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

                  <TableBody>
                    {visibleRows.map((row, index) => {
                      const isItemSelected = isSelected(row?.loanSlipNumber?.toString());
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row?.name?.toString(), row?.loanSlipNumber?.toString())}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.loanSlipNumber}
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
                            PM{row.loanSlipNumber}
                          </TableCell>
                          <TableCell align="left">{row?.users['fullName']}</TableCell>
                          {/* <TableCell align="left">{row?.users['numberPhone']}</TableCell> */}
                          <TableCell align="left">{getFormattedDate(row?.create_at)}</TableCell>
                          <TableCell align="left">{getFormattedDate(row?.return_at)}</TableCell>
                          {row?.limited_date !== null ?
                            <TableCell align="left">{getFormattedDate(row?.limited_date)}</TableCell>
                            :
                            <TableCell align="left">Chưa gia hạn</TableCell>
                          }
                          <TableCell align="left">
                            {row?.state ?
                              <Grid sx={{ background: 'green', width: '75px', fontSize: '16px', color: '#fff', borderRadius: '10px' }} container justifyContent='center'>Đã trả</Grid>
                              :
                              <>
                                {row.limited_date ?
                                  <>
                                    {compareDate(row?.limited_date) ?
                                      <Grid sx={{ background: '#FF0000', width: '75px', fontSize: '16px', color: '#fff', borderRadius: '10px' }} container justifyContent='center'>Quá hạn</Grid>
                                      :
                                      <>
                                        {row.limited_date !== null ?
                                          <Grid sx={{ background: '#0099FF', width: '75px', fontSize: '16px', color: '#fff', borderRadius: '10px' }} container justifyContent='center'>Gia hạn</Grid>
                                          :
                                          <Grid sx={{ background: '#FF6600', width: '75px', fontSize: '16px', color: '#fff', borderRadius: '10px' }} container justifyContent='center'>Chưa trả</Grid>
                                        }
                                      </>
                                    }
                                  </>
                                  :
                                  <>
                                    {compareDate(row?.return_at) ?
                                      <Grid sx={{ background: '#FF0000', width: '75px', fontSize: '16px', color: '#fff', borderRadius: '10px' }} container justifyContent='center'>Quá hạn</Grid>
                                      :
                                      <>
                                        {row.limited_date !== null ?
                                          <Grid sx={{ background: '#0099FF', width: '75px', fontSize: '16px', color: '#fff', borderRadius: '10px' }} container justifyContent='center'>Gia hạn</Grid>
                                          :
                                          <Grid sx={{ background: '#FF6600', width: '75px', fontSize: '16px', color: '#fff', borderRadius: '10px' }} container justifyContent='center'>Chưa trả</Grid>
                                        }
                                      </>
                                    }
                                  </>
                                }
                              </>
                            }
                          </TableCell>
                          <TableCell align="right">
                            <Grid container gap={1} alignItems='right' justifyContent='right'>
                              <ButtonGD
                                width='130px'
                                title='Gia hạn'
                                onClick={() => handleExtend(row)}
                                endIcon={<AccessTimeIcon />}>
                              </ButtonGD>
                              <ButtonGD
                                width='130px'

                                onClick={() => handleUpdate(row)}
                                title='Trả ấn phẩm'
                                endIcon={<UpdateIcon />}>
                              </ButtonGD>
                              <ButtonGD
                                width='130px'
                                onClick={() => handleDetails(row)}
                                title='Chi tiết'
                                endIcon={<SendIcon />}>
                              </ButtonGD>
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
                </Table>
                <>
                  <UpdateModal isOpen={open} isClose={(newValue) => setOpen(newValue)} productItems={props.suppliesItem} dataUpdate={dataUpdate} isUpdate={(newValue) => setUpdateLoanSlip(newValue)} />
                  <ModalExtend isOpen={openExtend} isClose={(newValue) => setOpenExtend(newValue)} productItems={props.suppliesItem} dataUpdate={dataExtend} />
                  <ModalDetails isOpen={openDetails} isClose={(newValue) => setOpenDetails(newValue)} productItems={props.suppliesItem} dataUpdate={dataDetails} />
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
          {/* <CircularProgress /> */}
          <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
        </>
      }
    </>
  );
}
