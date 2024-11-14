import { FormControl, MenuItem, Box, Pagination, PaginationItem, Select, SelectChangeEvent, Typography, useTheme, CircularProgress, Alert, IconButton, Grid } from "@mui/material"
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconEye, IconPencil, IconTrash } from "@tabler/icons-react";
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
import { filterBreakpointKeys } from "@mui/system/Unstable_Grid/traverseBreakpoints";
import { DataType, HeadCell, Order } from "../../../../components/custom/table/type";
import { EntityResponse } from "../../../../interfaces/entityResponse";
import { User } from "../../../../interfaces/user";
import useDebounce, { searchDelay } from "../../../../hooks/useDebounce";
import { useDeleteUserSelected, useSoftDeleteUser, useUserList } from "../../../../hooks/react-query/userData";
import { useRoleBySuperAdminList } from "../../../../hooks/react-query/roleData";
import { SearchAndFilter } from "../../../../components/custom/table/TableSearchAndFilter";
import CustomInput from "../../../../components/default/input/CustomInput";
import { EnhancedTableHead } from "../../../../components/custom/table/TableHead";
import { StyledTableCell, StyledTableRow } from "../../../../components/custom/table-list/style";
import { formatDate } from "../../../../helpers/formatDate";
import GradientCircularProgressLoading from "../../../../components/default/loading/GradientCircularProgressLoading/GradientCircularProgressLoading";
import { CsFlexRowBetween } from "../../../../components/default/flex";
import UserDialog from "../../../../components/default/dialog/UserDialog";
import AlertConfirmDialog from "../../../../components/default/alert/confirmAlertDialog";
import AdminAccountDialog from "../../../../components/default/dialog/AdminAccountDialog";
import { TLibrary } from "../../../../types/models/library.type";
import AdminDetailDialog from "./AdminDetailDialog";
import AccountDetailDialog from "../../../../components/default/dialog/AccountDetailPage";
import { Role } from "../../../../interfaces/role";
import { capitalizeFirstLetter } from "../../../../helpers/capitalizeFirstLetter";
import { getLabelFromOptions } from "../../../../utils/object";
import { statusRole } from "../../../../utils/constants.utils";
import { activeUser, blockUser } from "../../../../_apis/user.api";
import { Lock, LockOpen } from "@mui/icons-material";
import usePermission from "../../../../utils/hasPermission";
import { useAuth } from "../../../../contexts/JWTContext";

interface TableProps<T extends DataType> {
    orderByKey: keyof T,
    headCells: HeadCell[],
    selected: number[],
    isOpenAddDilog: boolean,
    handleSelected: (selected: number[]) => void,
    setIsOpenAddDialog: (e) => void,
}

function TableAdminList<T extends DataType>({
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
    const [schools, setUsers] = useState<EntityResponse<User[]>>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState<boolean>(false);
    const [isOpenDetailDialog, setIsOpenDetailDialog] = useState<boolean>(false);
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
    const [isOpenConfirmDeleteSelectedDialog, setIsOpenConfirmDeleteSelectedDialog] = useState(false);
    const [selectedDeleteID, setSelectedDeleteID] = useState<string>()
    const [filterRoleId, setFilterRoleId] = useState<string | number>(null)
    const debouncedSearch = useDebounce<string>(contentSearch, searchDelay);
    const [checked, setChecked] = useState<string[]>([]);
    const [checkedAll, setCheckedAll] = useState<boolean>(false);
    // block_active user
    const [isOpenBlock, setIsOpenBlock] = useState(false);
    const [selectedActiveUserID, setSelectedActiveUserID] = useState<string>();
    const [isBlock, setIsBlock] = useState(false);
    const [selectedBlockUserID, setSelectedBlockUserID] = useState<string>();
    const { user: account } = useAuth();
    const { hasPermission } = usePermission();

    const accountRole = useMemo(() => {
        if (!account) return null;
        const _user = { ...account } as any;
        return _user?.data?.roleId?.name;
    }, [account]);    

    const { data: roles } = useRoleBySuperAdminList();
    const { data: users, isPending, error, isError, isPlaceholderData, isFetching, refetch } =
        useUserList(page, rowsPerPage, debouncedSearch, filterRoleId);
    useEffect(() => {

        refetch()
    }, [filterRoleId])

    const { mutate: softDeleteUser, isPending: isPendingUpdate } = useSoftDeleteUser();
    const { mutate: softDeleteUserSelected } = useDeleteUserSelected();
    useEffect(() => {
        if (roles?.data?.result.length > 0) {
            // Tìm đối tượng có item.name là "Admin"
            const adminRole = roles.data.result.find(item => item.name.trim() === "Admin");
            if (adminRole) {
                setFilterRoleId(adminRole._id)
                // Làm gì đó với adminRole ở đây
            } else {
            }
        }
    }, [roles])
    const handleCheckedAll = async () => {
        const newCheckedAll = !checkedAll;
        setCheckedAll(newCheckedAll);
        const allIdsOnPage = users?.data?.result.map(item => item._id) || [];
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
        // Update URL parameters when page, rowsPerPage, or contentSearch changes
        setSearchParams({ page: page.toString(), limit: rowsPerPage.toString(), search: contentSearch }, { replace: true });
    }, [page, rowsPerPage, contentSearch]);
    useEffect(() => {
        if (users?.data?.result) { // Kiểm tra nếu users.data.result có giá trị
            const ids = users.data.result.map(item => item._id); // Lấy danh sách _id
            const allChecked = ids.every(id => checked.includes(id)); // Kiểm tra nếu tất cả ids đều có trong checked

            if (allChecked) {
                setCheckedAll(true); // Nếu tất cả ids đều được chọn, set checkedAll thành true
            } else {
                setCheckedAll(false); // Nếu không, set checkedAll thành false
            }
        }
    }, [users, checked, setCheckedAll]);

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
        if (debouncedSearch || filterRoleId) {
            setPage(1);
        }
    }, [debouncedSearch, filterRoleId]);
    const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
        setRowsPerPage(Number(event.target.value));
        setPage(1)
    };
    const handleClickUpdate = (id: string) => {
        let user: User = users.data.result.find(x => x._id === id)
        console.log(id);
        setUser(user)
        setIsOpenUpdateDialog(true)
    }
    const handleClickDetail = (id: string) => {
        let user: User = users.data.result.find(x => x._id === id)
        setUser(user)
        setIsOpenDetailDialog(true)
    }
    const [user, setUser] = useState<User>();
    const pageCount = useMemo(() => {
        return Math.ceil((users?.data?.meta?.itemCount || 0) / rowsPerPage);
    }, [users, page, rowsPerPage]);

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
                softDeleteUser(selectedDeleteID);
                setSelectedDeleteID(undefined);
                if (page !== 1 && users.data.result.length === 1) {
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
            softDeleteUserSelected(checked)
            setChecked([]);
            if (page !== 1 && users.data.result.length === checked.length) {
                setPage(page - 1)
            }
            toast.success(`Xóa dữ liệu  thành công`, {});
            setIsOpenConfirmDeleteSelectedDialog(false);

        } catch (error) {
            setIsOpenConfirmDeleteSelectedDialog(false);
            toast.error(error.message);
        }
    };

    // account block and active
    const handleClickOpenBlock = (id: string) => {
        setIsOpenBlock(true);
        setSelectedActiveUserID(id);
    }
    const handleClickBlock = (id: string) => {
        setIsBlock(true);
        setSelectedBlockUserID(id);
    }

    const handleOpenBlock = async () => {
        if (selectedActiveUserID) {
            try {
                await activeUser(selectedActiveUserID);
                setIsOpenBlock(false);
                setSelectedActiveUserID(selectedActiveUserID);
                toast.success("Mở khóa tài khoản thành công.");
                refetch();
            } catch (error) {
                toast.error("Lỗi không thể mở khóa")
            }
        }
    }

    const handleBlockUser = async () => {
        if (selectedBlockUserID) {
            try {
                await blockUser(selectedBlockUserID);
                setIsBlock(false);
                setSelectedBlockUserID(selectedBlockUserID);
                toast.success("Khóa tài khoản thành công");
                refetch();
            } catch (error) {
                toast.error("Lỗi không thể khóa")
            }
        }
    }

    return (
        <>
            <SearchAndFilter onHandleDeleteSelectedItem={handleDeleteItemSelected} actionDeleteSelectedItem={true} contentSearch={contentSearch} handleContentSearch={setContentSearch} />
            {/* Table */}
            <Grid container pl={4} pr={4} xs={12} sm={12} md={12} lg={12} gap={2} sx={{ display: "flex", mb: 1, flexWrap: "wrap", mt: 1 }}>
                <Grid item xs={12} sm={12} md={2} lg={2}>
                    <Select
                        labelId="roles-select"
                        label="Vai trof"
                        value={filterRoleId}
                        onChange={(event) => {
                            setFilterRoleId(event.target.value)
                        }}
                        input={<CustomInput size="small" label="Vai trò" />}
                    >
                        {roles?.data.result
                            .filter((item) => item.name.toLowerCase() === "admin" || item.name.toLowerCase() === "owner")
                            .map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    {getLabelFromOptions(statusRole, item.name)}
                                </MenuItem>
                            ))}
                    </Select>
                </Grid>
            </Grid>
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
                                    users?.data?.result?.length > 0 ? (
                                        <>
                                            {users.data.result.map((row, index) => {
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
                                                        <StyledTableCell padding="none" align="left" sx={{ paddingRight: 4 }}>{row?.barcode}</StyledTableCell>
                                                        <StyledTableCell padding="none" align="left" sx={{ paddingRight: 4, p: 2 }}>
                                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                Thư viện: <Typography ml={1} fontWeight={600}>{capitalizeFirstLetter((row?.libraryId as TLibrary)?.name)}</Typography>
                                                            </Box>
                                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                Họ tên: <Typography ml={1} fontWeight={600}>{capitalizeFirstLetter(row?.fullname)}</Typography>
                                                            </Box>
                                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                                Số điện thoại: <Typography ml={1} fontWeight={600}>{row?.phoneNumber}</Typography>
                                                            </Box>

                                                        </StyledTableCell>
                                                        <StyledTableCell padding="none" align="left" sx={{ paddingRight: 4 }}>  {getLabelFromOptions(statusRole, (row?.roleId as Role)?.name)}</StyledTableCell>
                                                        {
                                                            row?.isActive ?
                                                                (
                                                                    <StyledTableCell padding="none" align="center">
                                                                        <Box sx={{
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                            alignItems: "center",
                                                                            gap: 1
                                                                        }}>
                                                                            <IconEye onClick={() => handleClickDetail(row?._id)} size={20} stroke={1.5} />
                                                                            <IconPencil onClick={() => handleClickUpdate(row?._id)} size={20} stroke={1.5} />
                                                                            <IconTrash size={20} stroke={1.5} onClick={(e: any) => handleDeleteItem(e, row._id)} />
                                                                            {
                                                                                hasPermission([
                                                                                    { resource: "all", action: "manage" },
                                                                                    { resource: "activeaccounts", action: "update" },
                                                                                ]) && accountRole === "Super Admin" &&
                                                                                <LockOpen onClick={() => handleClickBlock(row?._id)} />
                                                                            }

                                                                        </Box>
                                                                    </StyledTableCell>
                                                                ) :
                                                                (
                                                                    <StyledTableCell padding="none" align="center">
                                                                        <Box sx={{
                                                                            display: "flex",
                                                                            justifyContent: "center",
                                                                            alignItems: "center",
                                                                            gap: 1
                                                                        }}
                                                                        >
                                                                            <Lock onClick={() => handleClickOpenBlock(row?._id)} />
                                                                        </Box>
                                                                    </StyledTableCell>
                                                                )
                                                        }
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
                {
                    isOpenAddDilog === true && <AdminAccountDialog
                        title={"Thêm tài khoản thủ thư"}
                        open={isOpenAddDilog}
                        roleId={filterRoleId as string}
                        handleOpen={setIsOpenAddDialog}
                    />
                }
                {
                    isOpenDetailDialog === true && <AccountDetailDialog
                        title={"Chi tiết tài khoản"}
                        open={isOpenDetailDialog}
                        user={user}
                        roleId={filterRoleId as string}
                        handleOpen={setIsOpenDetailDialog}
                    />
                }
            </Box>

            {
                isOpenUpdateDialog && user && <AdminAccountDialog
                    id={user._id}
                    title={"Cập nhật tài khoản thủ thư"}
                    open={isOpenUpdateDialog}
                    user={user}
                    roleId={filterRoleId as string}
                    handleOpen={setIsOpenUpdateDialog}
                />
            }
            {
                isOpenConfirmDialog && <AlertConfirmDialog title="Xác nhận xóa dữ liệu?" message="Dữ liệu đã xóa thì không khôi khục được" onHandleConfirm={handleConfirmDeleteItem} openConfirm={isOpenConfirmDialog} handleOpenConfirmDialog={setIsOpenConfirmDialog} />
            }
            {
                isOpenConfirmDeleteSelectedDialog && <AlertConfirmDialog title="Xác nhận xóa dữ liệu?" message="Dữ liệu đã xóa thì không khôi khục được" onHandleConfirm={handleConfirmDeleteItemSelected} openConfirm={isOpenConfirmDeleteSelectedDialog} handleOpenConfirmDialog={setIsOpenConfirmDeleteSelectedDialog} />
            }
            {
                isBlock && <AlertConfirmDialog title="Xác nhận khóa tài khoản?" onHandleConfirm={handleBlockUser} openConfirm={isBlock} handleOpenConfirmDialog={setIsBlock} />
            }
            {
                isOpenBlock && <AlertConfirmDialog title="Xác nhận mở khóa tài khoản?" onHandleConfirm={handleOpenBlock} openConfirm={isOpenBlock} handleOpenConfirmDialog={setIsOpenBlock} />
            }
        </>

    )
}
export default TableAdminList;