import { FormControl, MenuItem, Box, Pagination, PaginationItem, Select, SelectChangeEvent, Typography, useTheme, CircularProgress, Alert, IconButton } from "@mui/material"
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconPencil, IconTrash } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { useSearchParams } from "react-router-dom";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { toast } from "react-toastify";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { DataType, HeadCell, Order } from "../../../../../components/custom/table/type";
import { EntityResponse } from "../../../../../interfaces/entityResponse";
import { Role } from "../../../../../interfaces/role";
import useDebounce, { searchDelay } from "../../../../../hooks/useDebounce";
import { useDeleteRole, useDeleteRoleSelected, useRoleBySuperAdminList } from "../../../../../hooks/react-query/roleData";
import { SearchAndFilter } from "../../../../../components/custom/table/TableSearchAndFilter";
import { EnhancedTableHead } from "../../../../../components/custom/table/TableHead";
import { StyledTableCell, StyledTableRow } from "../../../../../components/custom/table/style";
import GradientCircularProgressLoading from "../../../../../components/default/loading/GradientCircularProgressLoading/GradientCircularProgressLoading";
import { CsFlexRowBetween } from "../../../../../components/default/flex";
import CustomInput from "../../../../../components/default/input/CustomInput";
import AlertConfirmDialog from "../../../../../components/default/alert/confirmAlertDialog";
import { formatDate } from "../../../../../helpers/formatDate";
import RoleDecentralizeDialog from "../../../../../components/default/dialog/RoleDecentralizeDialog";

interface TableProps<T extends DataType> {
    orderByKey: keyof T,
    headCells: HeadCell[],
    selected: number[],
    isOpenAddDilog: boolean,
    handleSelected: (selected: number[]) => void,
    setIsOpenAddDialog: (e) => void,
}

function TableRoleList<T extends DataType>({
    orderByKey,
    headCells,
    selected,
    handleSelected,
    isOpenAddDilog,
    setIsOpenAddDialog
}: TableProps<T>) {
    const theme = useTheme();
    const [searchParams, setSearchParams] = useSearchParams();
    const [contentSearch, setContentSearch] = useState<string>('');
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof DataType>(orderByKey.toString());
    const [page, setPage] = useState<number>(Number(searchParams.get("page")) || 1); // get page from URL or default to 1
    const [rowsPerPage, setRowsPerPage] = useState<number>(Number(searchParams.get("limit")) || 10); // get rowsPerPage from URL or default to 10
    const [schools, setRoles] = useState<EntityResponse<Role[]>>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpenDecentralizeDilog, setIsOpenDecentralizeDialog] = useState<boolean>(false);
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
    const [isOpenConfirmDeleteSelectedDialog, setIsOpenConfirmDeleteSelectedDialog] = useState(false);
    const [selectedDeleteID, setSelectedDeleteID] = useState<string>()
    const debouncedSearch = useDebounce<string>(contentSearch, searchDelay);
    const [checked, setChecked] = useState<string[]>([]);
    const [checkedAll, setCheckedAll] = useState<boolean>(false);
    const { data: roles, isPending, error, isError, isPlaceholderData, isFetching, refetch } =
        useRoleBySuperAdminList(page, rowsPerPage, debouncedSearch);


    const { mutate: deleteRole, isPending: isPendingDecentralize } = useDeleteRole();
    const { mutate: deleteRoleSelected } = useDeleteRoleSelected();

    const handleCheckedAll = async () => {
        const newCheckedAll = !checkedAll;
        setCheckedAll(newCheckedAll);
        const allIdsOnPage = roles?.data?.result.map(item => item._id) || [];
        if (newCheckedAll) {
            // Select all items on the current page and add them to the existing checked items
            setChecked(prev => {
                const newCheckedSet = new Set([...prev, ...allIdsOnPage]); // Add new items and keep existing ones
                return Array.from(newCheckedSet); // Convert Set back to Array to ensure uniqueness
            });

            // Check if all items on the current page are already in the checked list
            const allChecked = allIdsOnPage.every(id => checked.includes(id));
            if (allChecked) {
                setCheckedAll(true); // Ensure the checkedAll state is true if all items are already checked
            }
        } else {
            // Deselect all items on the current page without affecting other selected items
            setChecked(prev => {
                return prev.filter(id => !allIdsOnPage.includes(id)); // Remove only current page's items
            });

            // Ensure checkedAll is set to false if any item on the page is unchecked
            setCheckedAll(false);
        }
    };

    useEffect(() => {
        // Decentralize URL parameters when page, rowsPerPage, or contentSearch changes
        setSearchParams({ page: page.toString(), limit: rowsPerPage.toString(), search: contentSearch }, { replace: true });
    }, [page, rowsPerPage, contentSearch]);
    useEffect(() => {
        if (roles?.data?.result) { // Kiểm tra nếu roles.data.result có giá trị
            const ids = roles.data.result.map(item => item._id); // Lấy danh sách _id
            const allChecked = ids.every(id => checked.includes(id)); // Kiểm tra nếu tất cả ids đều có trong checked

            if (allChecked) {
                setCheckedAll(true); // Nếu tất cả ids đều được chọn, set checkedAll thành true
            } else {
                setCheckedAll(false); // Nếu không, set checkedAll thành false
            }
        }
    }, [roles, checked, setCheckedAll]);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof DataType,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
    const handleRefetchTable = () => {
        refetch();
    };
    useEffect(() => {
        if (debouncedSearch) {
            setPage(1);
        }
    }, [debouncedSearch])
    const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
        setRowsPerPage(Number(event.target.value));
        setPage(1)
    };
    const handleClickDecentralize = (id: string) => {
        let role: Role = roles.data.result.find(x => x._id === id)
        console.log(id);
        setRole(role)
        setIsOpenDecentralizeDialog(true)
    }
    const [role, setRole] = useState<Role>();
    const pageCount = useMemo(() => {
        return Math.ceil((roles?.data?.meta?.itemCount || 0) / rowsPerPage);
    }, [roles, page, rowsPerPage]);

    const handleDeleteItem = (e: React.MouseEventHandler<HTMLTableRowElement> | undefined, id: any) => {
        setIsOpenConfirmDialog(true);
        setSelectedDeleteID(id);
    }
    const handleDeleteItemSelected = () => {
        setIsOpenConfirmDeleteSelectedDialog(true);
    }
    const handleConfirmDeleteItem = async () => {
        if (selectedDeleteID)
            try {
                deleteRole(selectedDeleteID);
                setSelectedDeleteID(undefined);
                if (page !== 1 && roles.data.result.length === 1) {
                    setPage(page - 1);
                }
                setIsOpenConfirmDialog(false);
                toast.success("Xóa dữ liệu thành công", {});
            } catch (error) {
                toast.error(error.message);
            }
    }
    const handleChecked = (id) => {
        setChecked((prev) => {
            const isChecked = checked.includes(id);
            if (isChecked) {
                setCheckedAll(false);
                return checked.filter((item) => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };
    const handleConfirmDeleteItemSelected = async () => {
        try {
            deleteRoleSelected(checked)
            setChecked([]);
            if (page !== 1 && roles.data.result.length === checked.length) {
                setPage(page - 1)
            }
            toast.success(`Xóa dữ liệu  thành công`, {});
            setIsOpenConfirmDeleteSelectedDialog(false);

        } catch (error) {
            setIsOpenConfirmDeleteSelectedDialog(false);
            toast.error(error.message);
        }
    };
    return (
        <>
            <SearchAndFilter onHandleDeleteSelectedItem={handleDeleteItemSelected} actionDeleteSelectedItem={true} contentSearch={contentSearch} handleContentSearch={setContentSearch} />
            {/* Table */}
            <Box p={4} pt={0}>
                {
                    checked && checked.length > 0 && (
                        <Alert severity="info" sx={{ mb: 3 }}>
                            Có <Typography component="span" sx={{ fontWeight: 'bold' }}>{checked.length}</Typography> dữ liệu đã chọn
                        </Alert>
                    )
                }
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            headCells={headCells}
                            checkedAll={checkedAll}
                            onSelectAllClick={handleCheckedAll}
                        />
                        <TableBody>
                            {
                                isPending === false && isFetching === false ? (
                                    roles?.data?.result?.length > 0 ? (
                                        <>
                                            {roles.data.result.map((row, index) => {
                                                const labelId = `enhanced-table-checkbox-${index}`;
                                                return (
                                                    <StyledTableRow
                                                        hover
                                                        role="checkbox"
                                                        aria-checked={checked.includes(row._id)}
                                                        tabIndex={-1}
                                                        key={row._id}
                                                        selected={checked.includes(row._id)}
                                                        sx={{ cursor: 'pointer', }}
                                                    >
                                                        <StyledTableCell padding="checkbox" sx={{ p: "8px" }}>
                                                            <Checkbox
                                                                checked={checked.includes(row._id)}
                                                                onChange={() => handleChecked(row._id)}
                                                                inputProps={{ 'aria-labelledby': labelId, }}
                                                                style={{
                                                                    color: theme.palette.primary.dark,
                                                                }}
                                                            />
                                                        </StyledTableCell>
                                                        <StyledTableCell
                                                            component="th"
                                                            id={labelId}
                                                            scope="row"
                                                            padding="none"
                                                            align="left"
                                                            sx={{ p: "16px" }}
                                                        >
                                                            {(page - 1) * rowsPerPage + index + 1}
                                                        </StyledTableCell>
                                                        <StyledTableCell padding="none" align="left" sx={{ paddingRight: 4 }}>{row?.name}</StyledTableCell>
                                                        <StyledTableCell padding="none" align="center">
                                                            <Box sx={{
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                gap: 1
                                                            }}>
                                                                <IconPencil onClick={() => handleClickDecentralize(row?._id)} size={20} stroke={1.5} />
                                                            </Box>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                );
                                            })}
                                        </>
                                    ) : (
                                        <StyledTableRow hover role="checkbox" tabIndex={-1} sx={{ cursor: 'pointer' }}>
                                            <StyledTableCell colSpan={8} sx={{ p: "12px" }} padding="checkbox" align="center">
                                                Không có dữ liệu
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    )
                                ) : (
                                    <StyledTableRow hover role="checkbox" tabIndex={-1} sx={{ cursor: 'pointer' }}>
                                        <StyledTableCell colSpan={8} padding="checkbox" sx={{ p: "12px" }} align="center">
                                            <GradientCircularProgressLoading />
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* Panigation */}
                <CsFlexRowBetween>
                    <Box sx={{
                        py: 2,
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: 1
                    }}>
                        <FormControl sx={{ minWidth: 64 }}>
                            <Select
                                value={rowsPerPage.toString()}
                                size="small"
                                onChange={handleChangeRowsPerPage}
                                input={<CustomInput size="small" />}
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                            </Select>
                        </FormControl>
                        <Typography variant="body2">Dòng trên trang</Typography>
                    </Box>
                    <Pagination
                        count={pageCount === 0 ? 1 : pageCount}
                        page={page}
                        onChange={handleChange}
                        variant="outlined"

                        renderItem={(item) => (
                            <PaginationItem
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.dark', // Màu nền khi được chọn
                                        color: 'white', // Màu chữ khi được chọn
                                        '&:hover': {
                                            backgroundColor: 'primary.dark', // Màu nền khi hover trên nút đã chọn
                                        },
                                    },
                                }}
                                components={{
                                    last: (props) => <IconChevronsRight  {...props} stroke={1.5} />,
                                    next: (props) => <IconChevronRight {...props} stroke={1.5} />,
                                    first: (props) => <IconChevronsLeft {...props} stroke={1.5} />,
                                    previous: (props) => <IconChevronLeft {...props} stroke={1.5} />,

                                }}
                                {...item}
                            />
                        )}
                        showFirstButton
                        showLastButton
                    />
                </CsFlexRowBetween>
            </Box>

            {
                isOpenDecentralizeDilog && role && <RoleDecentralizeDialog
                    title={"Phân quyền vai trò"}
                    role={role}
                    open={isOpenDecentralizeDilog}
                    handleOpen={setIsOpenDecentralizeDialog}
                />
            }
        </>

    )
}
export default TableRoleList;