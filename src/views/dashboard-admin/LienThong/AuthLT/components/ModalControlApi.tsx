import React from 'react';

// material-ui
import { Button, CardActions, CardContent, Divider, FormControl, FormHelperText, Grid, IconButton, Input, InputLabel, Modal, OutlinedInput, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, TextField } from '@mui/material';

// project imports
// assets
import CloseIcon from '@mui/icons-material/Close';
import MainCard from '../../../../../ui-component/cards/MainCard';
import { useCreateApi } from '../hook/CreateApi';
import { Box } from '@mui/system';
import { visuallyHidden } from '@mui/utils';
import ButtonGD from '../../../../../ui-component/ButtonGD';
import { ROWSPERPAGE } from '../../../../../config';
import { useDeleteApi } from '../hook/DeleteApi';

interface Data {
    id: string;
    api: string;
    name: string;
    edit: string;
}
type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}
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
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Tên Trung Tâm',
    },
    {
        id: 'api',
        numeric: false,
        disablePadding: false,
        label: 'Địa chỉ trung tâm',
    },
    {
        id: 'edit',
        numeric: true,
        disablePadding: false,
        label: 'Công cụ',
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



export default function ModalControlApi(props: {
    isOpen?: any;
    isClose?: any;
    data?: any;
}) {
    const rootRef = React.useRef(null);

    const [isOpen, setOpen] = React.useState(false);
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('id');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.data?.length) : 0;

    const { deleteApi, isStatus } = useDeleteApi()

    React.useEffect(() => {
        setOpen(props.isOpen)
    }, [props.isOpen])

    // React.useEffect(() => {
    //     if (isStatus) {
    //         setOpen(false)
    //         props.isClose(false)
    //     }
    // }, [isStatus])

    function handleClose() {
        setOpen(false)
        props.isClose(false)
    }

    const handleRequestSort = () => {

    };

    const handleSelectAllClick = () => {

    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> | undefined) => {
        event?.target.value && setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };


    return (
        <Modal
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            open={isOpen}
            aria-labelledby="server-modal-title"
            aria-describedby="server-modal-description"
            sx={{
                display: 'flex',
                p: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}
            container={() => rootRef.current}
        >
            <MainCard
                sx={{
                    width: 'auto',
                    zIndex: 1
                }}
                title='Cài đặt trung tâm liên thông'
                content={false}
                secondary={
                    <IconButton size="large">
                        <CloseIcon fontSize="small" onClick={handleClose} />
                    </IconButton>
                }
            >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        {/* <EnhancedTableToolbar numSelected={selected?.length} /> */}
                        <TableContainer>
                            <Table
                                aria-labelledby="tableTitle"
                            >
                                <EnhancedTableHead
                                    numSelected={1}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={props.data?.length}
                                />
                                {props.data?.length !== 0 && props.data !== undefined ?
                                    <TableBody>
                                        {props.data.map((row: any, index) => {
                                            const labelId = `enhanced-table-checkbox-${index}`;
                                            return (
                                                <TableRow
                                                    hover
                                                    // onClick={(event) => handleClick(event, row?.id.toString(), row?.supplyName.toString())}
                                                    role="checkbox"
                                                    tabIndex={-1}
                                                    key={row.id.toString()}
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    <TableCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                    // sx={{ alignItems: 'center', display: 'flex' }}
                                                    // sx={{display:'flex', alignItems:'center'}}
                                                    >
                                                        {row?.name}

                                                    </TableCell>
                                                    <TableCell align="left">{row?.api}</TableCell>
                                                    <TableCell align="center">
                                                        <Grid container gap={1} alignItems='center' justifyContent='center'>
                                                            <ButtonGD
                                                                title='Xóa'
                                                                width='60px'
                                                                isColor
                                                                onClick={() => deleteApi(row.id)}
                                                            />
                                                        </Grid>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {emptyRows > 0 && (
                                            <TableRow
                                                style={{
                                                    height: (33) * emptyRows,
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
                            count={props.data?.length}
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
                </CardContent>
                <Divider />
                {/* <CardActions>
                    <Grid container justifyContent="flex-end">
                        <Button variant="contained" type="button" sx={{ textTransform: 'none' }} onClick={() => createApi(addressApi, nameApi)}>
                            Xác nhận
                        </Button>
                    </Grid>
                </CardActions> */}
            </MainCard>
        </Modal>
    );
}
