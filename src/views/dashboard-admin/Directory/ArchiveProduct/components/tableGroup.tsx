import UpdateIcon from '@mui/icons-material/Update';
import { Button, CircularProgress, Grid } from '@mui/material';
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
import UpdateModal from './ModalUpdate';
import { ROWSPERPAGE } from '../../../../../config';
import ButtonGD from '../../../../../ui-component/ButtonGD';
import { chuanHoaChuoi } from '../../../../../constant/mainContant';

interface Data {
  supplyId: string;
  supplyName: string;
  authorDescription: string;
  cabinetsDescription: string;
  quantity: Number;
  cabinet_quantity: Number;
  warehouse_quantity: Number;
  loan_slip_quantity: Number;
  cabinets: any;
  cabinet: any;
  authors: {};
  publisher: {};
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
    id: 'supplyId',
    numeric: false,
    disablePadding: true,
    label: 'Mã ấn phẩm',
  },
  {
    id: 'supplyName',
    numeric: false,
    disablePadding: false,
    label: 'Tên ấn phẩm',
  },
  {
    id: 'cabinets',
    numeric: false,
    disablePadding: false,
    label: 'Tên kệ',
  },
  {
    id: 'cabinet_quantity',
    numeric: false,
    disablePadding: false,
    label: 'Số lượng còn lại',
  },
  {
    id: 'loan_slip_quantity',
    numeric: false,
    disablePadding: false,
    label: 'Số lượng đã mượn',
  },
  {
    id: 'cabinetsDescription',
    numeric: false,
    disablePadding: false,
    label: 'Ghi chú',
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
  keyFindV2: string;
  setSelect: any;
  dataCabinet: any;
  dataLoanSlip: any;
}) {

  const [data, setData] = React.useState<any>([]);

  React.useEffect(() => {
    const filteredData = props.data?.filter((item: any) => item?.cabinet_quantity !== 0);
    setData(filteredData);
  }, [props.data]);

  function filterLoanSlip(supplyId) {
    let total = 0;
    const filter = props.dataLoanSlip?.filter((item) => 
    item?.supplies.filter((item2)=>{
      if(item2?.supply.supplyId === supplyId){
        total += item2?.qty
      return total
      }
    }));
    return total;
  }

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('supplyName');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [idSelected, setIdSelected] = React.useState<readonly string[]>([]);
  const [dataUpdate, setDataUpdate] = React.useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [dense,] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(ROWSPERPAGE);

  React.useEffect(() => {
    const filteredData = props.data?.filter((item: any) => item?.cabinet_quantity !== 0);

    const filteredRows = filteredData?.filter((item: any) => chuanHoaChuoi(item.supplyName).includes(chuanHoaChuoi(props.keyFind)))
    const filteredRowsV2 = filteredData?.filter((item: any) => chuanHoaChuoi(item?.cabinets?.position).includes(chuanHoaChuoi(props.keyFindV2)))
    const filteredRowsKey = filteredRows?.filter((item: any) => chuanHoaChuoi(item?.cabinets?.position).includes(chuanHoaChuoi(props.keyFindV2)))
    
    if (props.keyFind === '' && props.keyFindV2 === '') {
      setData(filteredData)
    }
    if (props.keyFind !== '') {
      setData(filteredRows)
    }
    if (props.keyFindV2 !== '') {
      setData(filteredRowsV2)
    }
    if (props.keyFind !== '' && props.keyFindV2 !== '') {
      setData(filteredRowsKey)
    }
  }, [props.keyFind, props.data, props.keyFindV2])

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
      const newIdSelected = data.map((n) => n?.supplyId);
      setSelected(newSelected);
      setIdSelected(newIdSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, supplyName: string, supplyId: string) => {

    const selectedIndex = selected.indexOf(supplyId);
    const idSelectedIndex = idSelected.indexOf(supplyId);

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
      newIdSelected = newIdSelected.concat(idSelected, supplyId);
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
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    props.setSelect(idSelected);
  }, [selected]);

  const handleUpdate = (event) => {
    if (event) {
      setDataUpdate(event)
      setOpen(true);
    }
  };

  React.useEffect(() => {
    setOpen(false);
  }, []);

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
                    {visibleRows.map((row: any, index) => {
                      const isItemSelected = isSelected(row?.supplyId);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row?.supplyId, row?.supplyId)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.supplyId}
                          selected={isItemSelected}
                          sx={{ cursor: 'pointer', background: Number(row.quantity) <= 0 ? '#FFCCCC' : '#fff' }}
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
                            {/* {row?.cabinets['position']} */}
                            {row?.ISBN}
                          </TableCell>
                          <TableCell align="left">{row?.supplyName}</TableCell>
                          <TableCell sx={{ fontWeight: 900 }} align="left">{row?.cabinets?.position}</TableCell>
                          <TableCell align="left">{row?.cabinet_quantity}</TableCell>
                          <TableCell align="left">{filterLoanSlip(row?.supplyId)}</TableCell>
                          <TableCell align="left">{row?.cabinets?.description}</TableCell>
                          <TableCell align="right">
                            <Grid container gap={1} alignItems='right' justifyContent='right'>
                              <ButtonGD
                                title='Cập nhật'
                                width='130px'
                                onClick={() => handleUpdate(row)}
                                endIcon={<UpdateIcon />}>
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
                  <UpdateModal dataCabinet={props.dataCabinet} isOpen={open} isClose={(newValue) => setOpen(newValue)} dataUpdate={dataUpdate} />
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
