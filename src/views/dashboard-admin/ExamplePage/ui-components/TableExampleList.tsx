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
import { EntityResponse } from "../../../../interfaces/entityResponse";
import { Example } from "../../../../interfaces/example";
import { DataType, HeadCell, Order } from "../../../../components/custom/table/type";
import useDebounce from "../../../../hooks/useDebounce";
import { deleteExample, getAllExamples } from "../../../../_apis/example.api";
import { ContainerTable, StyledTableCell, StyledTableRow } from "../../../../components/custom/table/style";
import { SearchAndFilter } from "../../../../components/custom/table/TableSearchAndFilter";
import { EnhancedTableHead } from "../../../../components/custom/table/TableHead";
import GradientCircularProgressLoading from "../../../../components/default/loading/GradientCircularProgressLoading/GradientCircularProgressLoading";
import { CsFlexRowBetween } from "../../../../components/default/flex";
import CustomInput from "../../../../components/default/input/CustomInput";
import AlertConfirmDialog from "../../../../components/default/alert/confirmAlertDialog";
// function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
//     if (b[orderBy] < a[orderBy]) {
//         return -1;
//     }
//     if (b[orderBy] > a[orderBy]) {
//         return 1;
//     }
//     return 0;
// }

// function getComparator<Key extends keyof any>(
//     order: Order,
//     orderBy: Key,
// ): (
//     a: { [key in Key]: number | string },
//     b: { [key in Key]: number | string },
// ) => number {
//     return order === 'desc'
//         ? (a, b) => descendingComparator(a, b, orderBy)
//         : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
//     const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
//     stabilizedThis.sort((a, b) => {
//         const order = comparator(a[0], b[0]);
//         if (order !== 0) {
//             return order;
//         }
//         return a[1] - b[1];
//     });
//     return stabilizedThis.map((el) => el[0]);
// }
interface TableProps<T extends DataType> {
    orderByKey: keyof T,
    headCells: HeadCell[],
    selected: number[],
    isOpenAddDilog: boolean,
    handleSelected: (selected: number[]) => void,
    setIsOpenAddDialog: (e) => void,
}

function TableExampleList<T extends DataType>({
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
    const [schools, setExamples] = useState<EntityResponse<Example[]>>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpenUpdateDilog, setIsOpenUpdateDialog] = useState<boolean>(false);
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
    const [isOpenConfirmDeleteSelectedDialog, setIsOpenConfirmDeleteSelectedDialog] = useState(false);
    const [selectedDeleteID, setSelectedDeleteID] = useState<number>()
    const debouncedSearch = useDebounce<string>(contentSearch, 1000);
    const [checked, setChecked] = useState<number[]>([]);
    const [checkedAll, setCheckedAll] = useState<boolean>(false);
    const handleCheckedAll = async () => {
        const newCheckedAll = !checkedAll;
        setCheckedAll(newCheckedAll);
        const allIdsOnPage = schools?.data?.result.map(item => item._id) || [];
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
    const fetchExamples = async () => {
        try {
            setIsLoading(true);
            const response = await getAllExamples(page, rowsPerPage, debouncedSearch);
            if (response.statusCode === 200) {
                if (response?.data?.result.length > 0) {
                    const ids = response.data.result.map(item => item._id);
                    const allChecked = ids.every(id => checked.includes(id));
                    if (allChecked) {
                        setCheckedAll(true); // Set checkedAll to true if all students are already checked
                    } else {
                        setCheckedAll(false); // Otherwise, set checkedAll to false
                    }
                }
                setExamples(response);
            } else {
                // Handle error
                console.error(response.message);
            }
            setIsLoading(false);
        } catch (error) {
            // Handle error
            setIsLoading(false);
            console.error(error);
        }
    };
    useEffect(() => {
        fetchExamples();
    }, [page, rowsPerPage, debouncedSearch]);
    useEffect(() => {
        // Update URL parameters when page, rowsPerPage, or contentSearch changes
        setSearchParams({ page: page.toString(), limit: rowsPerPage.toString(), search: contentSearch });
    }, [page, rowsPerPage, contentSearch]);

    // const visibleRows = useMemo(
    //     () =>
    //         stableSort(schools.data, getComparator(order, orderBy)).slice(
    //             (page - 1) * rowsPerPage,
    //             (page - 1) * rowsPerPage + rowsPerPage,
    //         ),
    //     [order, orderBy, page, rowsPerPage],
    // );

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

    const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
        setRowsPerPage(Number(event.target.value));
        setPage(1)
    };
    const handleClickUpdate = (id: number) => {
        let school: Example = schools.data.result.find(x => x._id === id)
        setExample(school)
        setIsOpenUpdateDialog(true)
    }
    const [school, setExample] = useState<Example>();
    const pageCount = useMemo(() => {
        return Math.ceil((schools?.data.meta.itemCount || 0) / rowsPerPage);
    }, [schools, rowsPerPage]);
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
                let response = await deleteExample(selectedDeleteID);
                if (response.statusCode === 200) {
                    setSelectedDeleteID(undefined);
                    if (page !== 1) {
                        setPage(1);
                    } else {
                        fetchExamples();
                    }
                    setIsOpenConfirmDialog(false);
                    toast.success("Xóa dữ liệu thành công", {});
                }
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
            const deleteRequests = checked.map(async (id) => {
                const response = await deleteExample(id);
                return response;
            });
            const responses = await Promise.all(deleteRequests);
            const successfulDeletes = responses.filter(response => response.statusCode === 200);
            if (successfulDeletes.length > 0) {
                toast.success(`${successfulDeletes.length} dữ liệu đã xóa thành công`, {});
            }
            setChecked([]);
            if (page !== 1) {
                setPage(1);
            } else {
                fetchExamples();
            }
            setIsOpenConfirmDeleteSelectedDialog(false);

        } catch (error) {
            setIsOpenConfirmDeleteSelectedDialog(false);
            toast.error(error.message);
        }
    };
    const handleClearSelected = async () => {
        setChecked([]);
    };
    console.log(checked);
    return (
        <>
            <SearchAndFilter onHandleDeleteSelectedItem={handleDeleteItemSelected} actionDeleteSelectedItem={true} contentSearch={contentSearch} handleContentSearch={(newSearchValue: string) => {
                setContentSearch(newSearchValue); // Update the search value
                setPage(1); // Reset the page to 1 when the search value changes
            }} />
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
                                isLoading === false ? (
                                    schools?.data?.result?.length > 0 ? (
                                        <>
                                            {schools.data.result.map((row, index) => {
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
                                                                <IconPencil onClick={() => handleClickUpdate(Number(row?._id))} size={20} stroke={1.5} />
                                                                <IconTrash size={20} stroke={1.5} onClick={(e: any) => handleDeleteItem(e, row._id)} />
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
                {/* {
                    isOpenAddDilog === true && <ExampleDialog
                        fetchData={fetchExamples}
                        title={"Thêm trường học"}
                        open={isOpenAddDilog}
                        handleOpen={setIsOpenAddDialog}
                    />
                } */}
            </Box>
            {/* {
                isOpenUpdateDilog && school && <ExampleDialog
                    id={school.id}
                    title={"Cập nhật trường học"}
                    open={isOpenUpdateDilog}
                    school={school}
                    handleOpen={setIsOpenUpdateDialog}
                    fetchData={fetchExamples}
                />
            } */}
            {
                isOpenConfirmDialog && <AlertConfirmDialog title="Xác nhận xóa dữ liệu?" message="Dữ liệu đã xóa thì không khôi khục được" onHandleConfirm={handleConfirmDeleteItem} openConfirm={isOpenConfirmDialog} handleOpenConfirmDialog={setIsOpenConfirmDialog} />
            }
            {
                isOpenConfirmDeleteSelectedDialog && <AlertConfirmDialog title="Xác nhận xóa dữ liệu?" message="Dữ liệu đã xóa thì không khôi khục được" onHandleConfirm={handleConfirmDeleteItemSelected} openConfirm={isOpenConfirmDeleteSelectedDialog} handleOpenConfirmDialog={setIsOpenConfirmDeleteSelectedDialog} />
            }
        </>

    )
}
export default TableExampleList;