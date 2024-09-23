import { Autocomplete, Checkbox, FormControl, Grid, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { visuallyHidden } from '@mui/utils';
import React from 'react';
import imageVodeo from '../../../../../../../assets/images/books/book-dientu.jpg';
import sachSimple from '../../../../../../../assets/images/books/book-truyenthong.jpg';
import { ROWSPERPAGE } from '../../../../../../../config';
import ButtonGD from '../../../../../../../ui-component/ButtonGD';
import { chuanHoaChuoi } from '../../../../../../../constant/mainContant';

interface Data {
  id: string;
  listMedia: [];
  supplyName: string;
  isbn: string;
  status: boolean;
  schoolName: string;
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
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Trạng thái',
  },
  {
    id: 'schoolName',
    numeric: false,
    disablePadding: false,
    label: 'Trường',
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
  const [data, setData] = React.useState<any>([]);
  const [keyFind, setKeyFind] = React.useState<string>('');

  const [itemSchool, setdataSchool] = React.useState<any>([]);
  const [valueSchool, setValueSchool] = React.useState<any>([]);

  let newSchool = [{
    label: '',
    id: ''
  }]

  React.useEffect(() => {
    // const filteredRoot = props.data?.filter((item: any) => item.printedMatter === 'Học liệu điện tử' || item.printedMatter.printedMatterName === 'Học liệu điện tử' || item.printedMatter === 'Học liệu điện tử khác' || item.printedMatter.printedMatterName === 'Học liệu điện tử khác')
    const validPrintedMatters = ['Học liệu điện tử', 'Học liệu điện tử khác'];

    const filteredRoot = props.data?.filter((item: any) => {
      const printedMatter = item.printedMatter;
      const printedMatterName = printedMatter?.printedMatterName;

      return (
        printedMatter &&
        (validPrintedMatters.includes(printedMatter) ||
          validPrintedMatters.includes(printedMatterName))
      );
    });

    const newData = filteredRoot?.filter((item: any) => item.isLT === false)

    setDataRoot(newData)
  }, [props.data])

  React.useEffect(() => {
    const filteredRows = dataRoot?.filter((item: any) => chuanHoaChuoi(item.supplyName).includes(chuanHoaChuoi(keyFind)))
    if (keyFind !== '') {
      setData(filteredRows)
    } else {
      setData(dataRoot)
    }
  }, [keyFind, dataRoot])

  React.useEffect(() => {
    dataRoot.forEach((item) =>
      newSchool.push({
        label: item?.user?.schoolName,
        id: item?.user?.userID
      }));

    const uniqueSchools = newSchool.filter((school, index, self) =>
      index === self.findIndex((s) => (
        s.id === school.id
      ))
    );
    setValueSchool(uniqueSchools.slice(1));

  }, [dataRoot])

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

  const handleClick = (event: React.MouseEvent<unknown>, id: string, supplyName: string) => {

    const selectedIndex = selected.indexOf(id);
    const idSelectedIndex = idSelected.indexOf(supplyName);
    let newSelected: readonly string[] = [];
    let newIdSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

  function checkUrl(dataDetails) {
    const medias = dataDetails?.medias;
    const lastMedia = medias && medias.length > 0 && medias[medias.length - 1];
    const url = lastMedia?.url;
    const lastChar = url?.slice(-4);

    if (lastChar === '.mp4') {
      return (
        <video style={{ borderRadius: '5px' }} width='70px' height='auto' controls>
          <source src={`${apiLT}/media/${url}`} type='video/mp4' />
        </video>
      );
    } else if (lastChar === '.pdf') {
      return (
        <iframe
          style={{ borderRadius: '5px' }}
          width='70px'
          height='90px'
          src={`${apiLT}/media/${url}`}
          frameBorder='0'
          allowFullScreen
        ></iframe>
      );
    } else if (lastChar === '.png' || lastChar === '.jpg' || lastChar === '.jpeg') {
      return (
        <img
          style={{ borderRadius: '5px' }}
          width='60px'
          height='auto'
          src={`${apiLT}/media/${url}`}
          alt='ảnh ấn phẩm'
        />
      );
    } else {
      // Default case
      return (
        <img
          style={{ borderRadius: '5px' }}
          width='60px'
          height='auto'
          src={imageVodeo}
          alt='ảnh ấn phẩm'
        />
      );
    }
  }



  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid xs={12} container gap={2}>
          <Grid width={{ lg: '300px', md: '250px', sm: '300px', xs: '100%' }}>
            <FormControl fullWidth>
              <TextField type="text" label="Tìm kiếm theo tên ấn phẩm" variant="outlined" onChange={(e) => setKeyFind(e.target.value)} />
            </FormControl>
          </Grid>
          <Grid width={{ lg: '300px', md: '250px', sm: '300px', xs: '100%' }}>
            <FormControl fullWidth >
              <Autocomplete
                fullWidth
                disablePortal
                id="combo-box-Category"
                options={valueSchool}
                onChange={(event, newValue) => setdataSchool(newValue)}
                renderInput={(params) => <TextField {...params} label="Lọc theo trường" />}
              />
            </FormControl>
          </Grid>
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
                          {/* <TableCell padding="checkbox">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  'aria-labelledby': labelId,
                                }}
                              />
                            </TableCell> */}
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
                                row?.medias !== null ?
                                  <>
                                    {checkUrl(row)}
                                  </>
                                  :
                                  <img style={{ borderRadius: '5px', textAlign: 'center' }} width='60px' height='auto' src={sachSimple} alt="ảnh ấn phẩm" />
                              }
                            </>
                          </TableCell>
                          <TableCell align="left">{row?.supplyName}</TableCell>
                          <TableCell align="left">{row?.ISBN}</TableCell>
                          <TableCell align="left">{row?.isLT ? <Typography sx={{ fontWeight: 900, color: 'green' }}>Đã có</Typography> : <Typography sx={{ fontWeight: 900, color: 'blue' }}>Chưa có</Typography>}</TableCell>
                          {/* <TableCell align="left">{row?.isLT}</TableCell> */}
                          {/* <TableCell align="left"><Switch checked={row?.isLT} disabled color="secondary" /></TableCell> */}
                          <TableCell align="left">{row?.user?.schoolName}</TableCell>
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
