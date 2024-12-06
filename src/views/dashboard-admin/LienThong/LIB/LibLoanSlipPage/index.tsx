import { Accordion, AccordionDetails, AccordionSummary, Button, Chip, FormControl, Grid, MenuItem, Select, Typography, useTheme } from "@mui/material";
import { Box, Stack, useMediaQuery } from "@mui/system";
import { IconCalendar, IconEye, IconPencil, IconPlus, IconTrash, IconX } from "@tabler/icons";
import { vi } from "date-fns/locale";
import ExcelJS from 'exceljs';
import { useCallback, useMemo, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import ActionsForm from "../../../../../components/custom/form/ActionForm";
import TableList from "../../../../../components/custom/table-list/TableList";
import StyledButton from "../../../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../../../components/default/dialog/ConfirmDeleteDialog";
import { useAuth } from "../../../../../contexts/JWTContext";
import { capitalizeFirstLetter } from "../../../../../helpers/capitalizeFirstLetter";
import { formatDate } from "../../../../../helpers/formatDate";
import { useAddLoanSlip, useApprovalLoanSlip, useCancelLoanSlip, useDeleteLoanSlip, useEditLoanSlip, useReturnLoanSlip } from "../../../../../hooks/services/loanSlip/loanSlip-mutation";
import { useFetchLoanSlipLink, useReFetchLoanSlipLink } from "../../../../../hooks/services/loanSlip/loanSlip-query";
import useQueryString from "../../../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../../../types/common/table";
import { CreatePublication, TLoanSlip, TLoanSlipCreate } from "../../../../../types/models/loanSlip.type";
import IBreadcrumsCustom from "../../../../../ui-component/breadcrums";
import MainCard from "../../../../../ui-component/cards/MainCard";
import { parserParams } from "../../../../../utils/object";
import ViewDetailLoanSlip from "../../../LoanSlipPage/ui-components/ViewDetailLoanSlip";
import FormAddEditLibLoanSlip from "./ui-components/FormAddEditLibLoanSlip";
import { ExpandMore } from "@mui/icons-material";
import PaginationForm from "../../../../../components/custom/form/PaginationForm";
import { TLibrary } from "../../../../../types/models/library.type";
interface CustomInputProps {
    value: string;
    onClick: () => void;
}

function CustomInput({ value, onClick }: CustomInputProps) {
    return (
        <div className="input-group position-relative">
            <input
                type="text"
                className="form-control custom-input"
                value={value}
                onClick={onClick}
                readOnly
                style={{ width: '100%', height: '20px !important' }} // Giảm chiều rộng để có chỗ cho biểu tượng "X"
            />
            <span className="icon-background" onClick={onClick}>
                <IconCalendar color="white" />
            </span>

        </div>
    );
}
const LoanSlipPage = () => {
    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";
    const [barcodeSearch, setBarcodeSearch] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filterDateType, setFilterDateType] = useState<string | number>(0);
    const [filterStatus, setFilterStatus] = useState<string | number>(0);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const { user } = useAuth();

    const roleName = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?.roleId.name;
    }, [user]);

    const libraryId = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?.libraryId;
    }, [user]);


    const filter = useMemo(
        () =>
            parserParams([
                { compare: "", target: { barcodeUser: search } },
                { compare: "", target: { barcode: barcodeSearch } },
                { compare: 0, target: { type: filterDateType } },
                { compare: 0, target: { status: filterStatus } },
            ]),
        [
            barcodeSearch,
            search,
            filterDateType,
            filterStatus
        ]
    );
    const theme = useTheme();
    const { data, isLoading } = useFetchLoanSlipLink({
        limit,
        page,
        startDate,
        endDate,
        ...filter,
    });

    const mutationAdd = useAddLoanSlip();
    const mutationApproval = useApprovalLoanSlip();
    const mutationReturn = useReturnLoanSlip();
    const mutationCancel = useCancelLoanSlip();
    const mutationEdit = useEditLoanSlip();
    const mutationDelete = useDeleteLoanSlip();
    //const mutationSDeleteMany = useDeleteManyLoanSlip();
    const revalidate = useReFetchLoanSlipLink();
    const handleClearStartDate = () => {
        setStartDate(null); // Đặt lại giá trị endDate về null
    };
    const handleClearEndDate = () => {
        setEndDate(null); // Đặt lại giá trị endDate về null
    };
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TLoanSlip | null>(null);
    const [selectedPrint, setSelectedPrint] = useState<TLoanSlip | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const [loanSlipToDelete, setLoanSlipToDelete] = useState<TLoanSlip | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmSoftDeleteMultiple, setOpenConfirmSoftDeleteMultiple] = useState(false);

    const addLoanSlip = () => {
        setOpenAddEdit(true);
    };



    const handleEditLoanSlip = (row: TLoanSlip) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };
    const handlePrintLoanSlip = (row: TLoanSlip) => {
        setSelectedPrint(row);
        handlePrint()
    };
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const handleApprovalLoanSlip = (row: TLoanSlip) => {
        mutationApproval.mutate(row._id, {
            onSuccess: () => {
                revalidate();
                toast.success('Duyệt phiếu mượn thành công.');
            },
        });
    };
    const handleReturnLoanSlip = (row: TLoanSlip, publications: CreatePublication[]) => {
        mutationReturn.mutate(
            { id: row._id, publications },  // Chuyển đổi tham số thành đối tượng
            {
                onSuccess: (data) => {
                    revalidate(); // Hàm này cần phải được định nghĩa trong component
                    if (data?.data?.result) {
                        setSelectedEdit(data.data.result);
                    }
                    toast.success('Trả sách thành công.');
                },
            }
        );
    };
    const handleCancelLoanSlip = (row: TLoanSlip) => {
        mutationCancel.mutate(
            row._id,  // Chuyển đổi tham số thành đối tượng
            {
                onSuccess: (data) => {
                    revalidate(); // Hàm này cần phải được định nghĩa trong component
                    if (data?.data?.result) {
                        console.log("kk", data.data.result);
                        setSelectedEdit(data.data.result);
                    }
                    toast.success('Hủy phiếu mượn thành công.');
                },
            }
        );
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };
    console.log('edit', selectedEdit);

    const handleSubmit = (values: any) => {
        if (selectedEdit) {
            mutationEdit.mutate(
                { ...values, _id: selectedEdit._id },
                {
                    onSuccess: () => {
                        revalidate();
                        toast.success('Chỉnh sửa thành công.');
                        handleClose();
                    },
                }
            );
            return;
        }

        mutationAdd.mutate(values, {
            onSuccess: (data) => {
                revalidate();
                toast.success('Thêm thành công.');
                setOpenAddEdit(false);
            },
        });
    };

    const handleOpenConfirmDialog = (row: TLoanSlip) => {
        setLoanSlipToDelete(row);
        setOpenConfirmDialog(true);
    };
    const handleBarcodeSearch = (value) => {
        setBarcodeSearch(value);
    };
    const handleConfirmDelete = () => {
        if (loanSlipToDelete) {
            mutationDelete.mutate(loanSlipToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success('Xóa phiếu mượn thành công.');
                    setOpenConfirmDialog(false);
                },
            });
        }
    };
    const handleViewDetailLoanSlip = (row: TLoanSlip) => {
        setSelectedEdit(row);
        setOpenViewDetail(true);
    };
    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };
    const componentRef = useRef();
    // Hàm xử lý in
    const getStatusStyles = (status) => {
        switch (status) {
            case "đang mượn":
                return { color: 'white', background: '#FF9800' }; // Màu cho "Đang mượn"
            case "quá hạn":
                return { color: 'white', background: '#F44336' }; // Màu cho "Quá hạn"
            case "đã trả":
                return { color: 'white', background: '#4CAF50' }; // Màu cho "Đã trả"
            default:
                return { color: 'black', background: '#E0E0E0' }; // Màu mặc định nếu không có trạng thái phù hợp
        }
    };

    const getStatusTextStyles = (status) => {
        switch (status) {
            case "đang mượn":
                return { color: '#FF9800' }; // Màu cho "Đang mượn"
            case "quá hạn":
                return { color: '#F44336' }; // Màu cho "Quá hạn"
            case "đã trả":
                return { color: '#4CAF50' }; // Màu cho "Đã trả"
            default:
                return { color: '#616161' };
        }
    };

    const getIsAgreeTextStyles = (isAgree) => {
        switch (isAgree) {
            case true:
                return { color: '#4CAF50' };
            default:
                return { color: '#FF9800' };
        }
    };
    const columns: TColumn<TLoanSlip>[] = useMemo(
        () => [
            {
                id: "barcode",
                disablePadding: "none",
                label: "Barcode",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },
            {
                id: "info",
                disablePadding: "none",
                label: "Thông tin mượn",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 300 },
                render: (row) => {
                    return (
                        <Box
                        >
                            <Typography mt={0.5}>Ngày mượn: <strong>{formatDate(row?.borrowedDay)}</strong></Typography>
                            <Typography mt={0.5}>Ngày trả: <strong>{formatDate(row?.returnDay)}</strong></Typography>
                            {row?.publications?.length > 0 && (
                                <Box sx={{ mt: 0.5 }}>
                                    <Typography><strong>Danh sách ấn phẩm mượn:</strong></Typography>
                                    <ul style={{ margin: 0 }}>
                                        {row?.publications.map((publication, idx) => (
                                            <li key={idx}>{capitalizeFirstLetter(publication?.name)} (SLM: {publication?.quantityLoan}, Đã trả: {publication?.quantityReturn ?? 0})</li>
                                        ))}
                                    </ul>
                                </Box>
                            )}
                        </Box>
                    );
                },
            },
            {
                id: "isReturn",
                disablePadding: "none",
                label: "Tình trạng trả",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return (
                        <Box
                        >
                            {/* {
                                row.isReturn === true && <Chip
                                    style={{ color: 'white', background: '#096A5E' }}
                                    label="Đã trả"
                                    variant="filled"
                                />
                            }
                            {row.isReturn === false && (
                                <>
                                    {new Date(row.returnDay).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0) ? (
                                        <Chip
                                            style={getStatusStyles(row.isAgree)}// Màu cho "Đang mượn"
                                            label={row.isAgree === true ? 'Đang mượn' : 'Đang xử lý'}
                                            variant="filled"
                                        />
                                    ) : (
                                        <Chip
                                            style={{ color: 'white', background: theme.palette.error.dark }} // Màu cho "Quá hạn"
                                            label="Quá hạn"
                                            variant="filled"
                                        />
                                    )}
                                </>
                            )} */}
                            <Chip
                                style={getStatusStyles(row.status)} // Màu cho "Quá hạn"
                                label={capitalizeFirstLetter(row.status)}
                                variant="filled"
                            />
                        </Box>
                    );
                },
            },
            {
                id: "isAgree",
                disablePadding: "none",
                label: "Duyệt",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return (
                        <Box>
                            {
                                row?.status === "đã hủy" ? (
                                    // Nếu status là "đã hủy", render chip "Không duyệt"
                                    <Chip
                                        style={{ color: 'white', background: '#de524a' }}
                                        label="Không duyệt"
                                        variant="filled"
                                    />
                                ) : row?.status === "chờ nhận sách" ? (
                                    // Nếu status là "chờ giao sách", render chip "Giao sách"
                                    <Chip
                                        style={{ color: 'white', background: '#096A5E' }}
                                        label="Giao sách"
                                        variant="filled"
                                    />
                                ) : row.isAgree === true ? (
                                    // Nếu isAgree là true, render chip "Đã duyệt"
                                    <Chip
                                        style={{ color: 'white', background: '#096A5E' }}
                                        label="Đã duyệt"
                                        variant="filled"
                                    />
                                ) : (
                                    // Nếu isAgree là false, render chip "Chưa duyệt"
                                    <Chip
                                        style={{ color: 'black', background: 'yellow' }}
                                        label="Chưa duyệt"
                                        variant="filled"
                                    />
                                )
                            }
                        </Box>
                    );
                },
            },
            {
                id: "action",
                disablePadding: "none",
                align: "center",
                label: "Hành động",
                render: (row) => {
                    return (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <IconEye
                                onClick={() => handleViewDetailLoanSlip(row)}
                                size={20}
                                stroke={1.5}
                            />
                            {
                                row.isAgree === false &&
                                (row.status !== "chờ nhận sách" && row.status !== "đã hủy" || libraryId === row.libraryId) && (
                                    <IconPencil
                                        onClick={() => handleEditLoanSlip(row)}
                                        size={20}
                                        stroke={1.5}
                                    />
                                )
                            }
                            {
                                row.isAgree === false &&
                                (row.status !== "chờ nhận sách" && row.status !== "đã hủy" || libraryId === row.libraryId) && (
                                    <IconTrash
                                        size={20}
                                        stroke={1.5}
                                        onClick={() => handleOpenConfirmDialog(row)}
                                    />
                                )
                            }

                        </Box>
                    );
                },
            },
        ],
        [handleEditLoanSlip, handleOpenConfirmDialog]
    );
    const formatDateWithDayMonthYear = (dateString) => {
        // Hàm định dạng ngày
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // Định dạng dd/mm/yyyy
    };
    const handleCheckedDelete = useCallback((row: TLoanSlip, checked: boolean) => {
        setCheckedDelete((prev) => {
            if (prev.includes(row._id)) {
                return prev.filter((t) => t !== row._id);
            }
            return [...prev, row._id];
        });
    }, []);

    const handleCheckedDeleteAll = useCallback(
        (checked: boolean) => {
            if (data?.data?.result?.length === 0) return;
            setCheckedDelete((prev) => (checked ? data?.data?.result.map((t) => t._id) : []));
        },
        [data]
    );

    const checkedAll = useMemo(() => {
        if (data?.data?.result?.length === 0 || checkedDelete.length === 0) return false;
        return data?.data?.result?.every((t) => checkedDelete.includes(t._id));
    }, [checkedDelete, data]);

    const handleDeleteMultiple = useCallback(() => {
        if (checkedDelete.length === 0) {
            toast.error("Vui lòng chọn dữ liệu để xóa");
            return;
        }
        setOpenConfirmSoftDeleteMultiple(true);
    }, [checkedDelete]);
    const handleCloseViewDetail = () => {
        setOpenViewDetail(false);
        setSelectedEdit(null);
    };

    const handleExportLoanSlipExcel = () => {
        // Tạo một workbook mới
        console.log(data);
        console.log(isLoading);

        if (data) {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Loan Slips');

            // Thêm hàng tiêu đề chính
            worksheet.addRow(['Danh sách phiếu mượn']).font = { bold: true, size: 14 };
            worksheet.addRow([]); // Thêm hàng trống

            // Thêm hàng từ ngày đến ngày
            // const startDateExcel = startDate ? formatDate(startDate) : '';
            // const endDateExcel = endDate ? formatDate(endDate) : '';
            // worksheet.addRow([`Từ ngày: ${startDateExcel} đến ngày: ${endDateExcel}`]).font = { bold: true };
            const currentDateTime = new Date();
            const formattedDateTime = currentDateTime.toLocaleString('vi-VN', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false,
            });
            worksheet.addRow([`Ngày xuất file: ${formattedDateTime}`]).font = { bold: true };

            // Đặt header cho bảng
            worksheet.addRow([
                'Mã phiếu',
                'Tên người mượn',
                'Số điện thoại',
                'Địa chỉ',
                'Ngày mượn',
                'Ngày trả',
                'Trạng thái',
                'Sách mượn'
            ]);

            // Đặt kiểu định dạng cho các cột
            worksheet.getColumn('A').width = 15;
            worksheet.getColumn('B').width = 30;
            worksheet.getColumn('C').width = 15;
            worksheet.getColumn('D').width = 15;
            worksheet.getColumn('E').width = 20;
            worksheet.getColumn('F').width = 20;
            worksheet.getColumn('G').width = 15;
            worksheet.getColumn('H').width = 50;

            // Lấy dữ liệu từ API
            const loanSlipsData = data?.data?.result?.map((loanSlip) => {
                const bookTitles = loanSlip?.publications?.map(publication => {
                    return `${publication.name} (${publication.quantityLoan} quyển)`;
                }).join('\n');

                return {
                    barcode: loanSlip?.barcode,
                    borrowerName: loanSlip?.userId?.fullname,
                    phoneNumber: loanSlip?.userId?.phoneNumber,
                    address: loanSlip?.userId?.address,
                    borrowDate: loanSlip?.borrowedDay ? new Date(loanSlip?.borrowedDay) : null, // Ensure it's a Date object
                    returnDate: loanSlip?.returnDay ? new Date(loanSlip?.returnDay) : null, // Ensure it's a Date object
                    status: capitalizeFirstLetter(loanSlip?.status),
                    bookTitle: bookTitles || '',
                };
            });

            // loanSlipsData.sort((a: any, b: any) => {
            //     return a.borrowDate - b.borrowDate; // Sort by borrowDate in ascending order
            // });

            console.log(loanSlipsData); // Kiểm tra dữ liệu đã chuyển đổi

            // Thêm dữ liệu vào worksheet và kẻ đường viền
            loanSlipsData.forEach((dataRow) => {
                const row = worksheet.addRow([]);
                row.values = [
                    dataRow.barcode,
                    dataRow.borrowerName,
                    dataRow.phoneNumber,
                    dataRow.address,
                    dataRow.borrowDate,
                    dataRow.returnDate,
                    dataRow.status,
                    dataRow.bookTitle
                ];
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });

            // Kẻ đường viền cho header và thêm định dạng
            const headerRow = worksheet.getRow(4); // Header bắt đầu ở hàng 4
            headerRow.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFCCCCCC' } // Màu xám
                };
                cell.font = {
                    bold: true,
                    color: { argb: 'FF000000' } // Màu chữ đen
                };
            });

            // Tạo file Excel và lưu
            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'DSPMLienThong.xlsx'; // Tên file xuất
                a.click();
                URL.revokeObjectURL(url);
            });
        } else {
            toast.error("Không có dữ liệu để xuất excel");
        }
    };



    const actionMenus = useMemo((): TMenuOption[] => {
        return [];
    }, [handleDeleteMultiple, handleExportLoanSlipExcel]);

    const initialValues = useMemo((): TLoanSlipCreate => {
        if (selectedEdit) {
            const libraryId = typeof selectedEdit.libraryId === 'string'
                ? selectedEdit.libraryId // Nếu là chuỗi, sử dụng trực tiếp
                : (selectedEdit.libraryId as TLibrary)._id; // Nếu là đối tượng, lấy _id
            return {
                note: selectedEdit.note,
                borrowedDay: selectedEdit.borrowedDay,
                returnDay: selectedEdit.returnDay,
                receiptDate: selectedEdit.receiptDate,
                isPrint: selectedEdit.isPrint,
                libraryId: libraryId,
                status: 'đang xử lý',
                userId: ''
            };
        }
        return {
            note: "",
            borrowedDay: "",
            returnDay: "",
            receiptDate: "",
            libraryId: '0',
            isPrint: false,
            status: 'đang xử lý',
            userId: ''
        };
    }, [selectedEdit]);

    const isMd = useMediaQuery('(min-width: 900px)');

    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý phiếu mượn"
                mainProfile="Danh sách phiếu mượn"
                link="/quan-ly-muon-tra/phieu-muon"
            />

            {openAddEdit && (
                <FormAddEditLibLoanSlip
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    loanSlip={selectedEdit}
                    onSubmit={handleSubmit}
                    onHandleReturnLoanSlip={handleReturnLoanSlip}
                    onHandleCancelLoanSlip={handleCancelLoanSlip}
                    isEditMode={selectedEdit ? true : false}
                />
            )}
            {openViewDetail && (
                <ViewDetailLoanSlip
                    open={openViewDetail}
                    onClose={handleCloseViewDetail}
                    loanSlip={selectedEdit}
                />
            )}
            <MainCard>

                <Stack spacing={2} sx={{ paddingLeft: { xs: 0, sm: 0, md: 4 }, paddingBottom: { xs: 2, sm: 2 }, width: '100%' }}>
                    <Box display="flex" flexWrap="wrap">
                        <Box>
                            <StyledButton
                                color="primary"
                                size="small"
                                startIcon={<IconPlus stroke={2} />}
                                variant="contained"
                                onClick={addLoanSlip}
                            >
                                Đăng ký mượn sách
                            </StyledButton>
                        </Box>
                        {/* <Box>
                            <Link to="/quan-ly-muon-tra/phieu-muon/danh-sach-xoa-phieu-muon" style={{ textDecoration: 'none' }}>
                                <StyledButton
                                    sx={{ background: "#de524a", color: "white", marginLeft: "10px" }}
                                    size="small"
                                    startIcon={<IconTrash stroke={2} />}
                                    variant="contained"
                                >
                                    Thùng rác
                                </StyledButton>
                            </Link>
                        </Box> */}
                    </Box>
                </Stack>
                <ActionsForm isActive={false} actions={actionMenus} barcode={true}
                    barcodeSearch={barcodeSearch}
                    handleBarcodeSearch={handleBarcodeSearch} placeholder="Tìm kiếm theo barcode phiếu mượn" />
                <Grid container xs={12} sm={12} md={12} lg={12} gap={2} sx={{
                    display: "flex", mb: 3, flexWrap: "wrap",
                    pl: { xs: 0, sm: 0, md: 4 },
                    pr: { xs: 0, sm: 0, md: 4 },
                    mt: { xs: 2, sm: 2, md: 0 }
                }}>
                    <Grid item xs={12} sm={12} md={2} lg={2}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}> {/* Sử dụng Flexbox để căn giữa */}
                            <Typography sx={{ marginRight: "10px", whiteSpace: "nowrap", fontWeight: 'bold' }}> {/* Thêm whiteSpace để ngăn ngắt dòng */}
                                Lọc theo:
                            </Typography>
                            <div className="date-picker-container">
                                <FormControl fullWidth>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="filterDateType"
                                        name="filterDateType"
                                        type="filterDateType"
                                        value={filterDateType}
                                        onChange={(event) => {
                                            setFilterDateType(event.target.value); // Lấy giá trị từ event
                                        }}
                                        sx={{ height: '40px', fontSize: '0.875rem' }}
                                    >
                                        <MenuItem
                                            key={0}
                                            value={0}
                                        >
                                            Tất cả
                                        </MenuItem>
                                        <MenuItem
                                            key={1}
                                            value="borrowedDay"
                                        >
                                            Ngày mượn
                                        </MenuItem>
                                        <MenuItem
                                            key={2}
                                            value="returnDay"
                                        >
                                            Ngày trả
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}> {/* Sử dụng Flexbox để căn giữa */}
                            <Typography sx={{ marginRight: "10px", whiteSpace: "nowrap", fontWeight: 'bold' }}> {/* Thêm whiteSpace để ngăn ngắt dòng */}
                                Từ ngày:
                            </Typography>
                            <div className="date-picker-container">
                                <DatePicker
                                    locale={vi}
                                    selected={startDate}
                                    dateFormat="dd/MM/yyyy" // Định dạng ngày tháng năm
                                    onChange={(date: Date | null) => setStartDate(date)}
                                    customInput={<CustomInput value={startDate ? startDate.toLocaleDateString() : ''} onClick={() => { }} />
                                    }
                                />
                                {
                                    startDate && <span className="icon-clear" onClick={handleClearStartDate}>
                                        <IconX color="red" />
                                    </span>
                                }
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}> {/* Sử dụng Flexbox để căn giữa */}
                            <Typography sx={{ marginRight: "10px", whiteSpace: "nowrap", fontWeight: 'bold' }}> {/* Thêm whiteSpace để ngăn ngắt dòng */}
                                Đến ngày:
                            </Typography>
                            <div className="date-picker-container">
                                <DatePicker
                                    selected={endDate}
                                    dateFormat="dd/MM/yyyy" // Định dạng ngày tháng năm
                                    onChange={(date: Date | null) => setEndDate(date)}
                                    customInput={<CustomInput value={endDate ? endDate.toLocaleDateString() : ''} onClick={() => { }} />}
                                />
                                {
                                    endDate && <span className="icon-clear" onClick={handleClearEndDate}>
                                        <IconX color="red" />
                                    </span>
                                }
                            </div>

                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}> {/* Sử dụng Flexbox để căn giữa */}
                            <Typography sx={{ marginRight: "10px", whiteSpace: "nowrap", fontWeight: 'bold' }}> {/* Thêm whiteSpace để ngăn ngắt dòng */}
                                Trạng thái:
                            </Typography>
                            <div className="date-picker-container">
                                <FormControl fullWidth>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="filterStatus"
                                        name="filterStatus"
                                        type="filterStatus"
                                        value={filterStatus}
                                        onChange={(event) => {
                                            setFilterStatus(event.target.value); // Lấy giá trị từ event
                                        }}
                                        sx={{ height: '40px', fontSize: '0.875rem' }}
                                    >
                                        <MenuItem
                                            key={0}
                                            value={0}
                                        >
                                            Tất cả
                                        </MenuItem>
                                        <MenuItem
                                            key={1}
                                            value="currently-borrowed"
                                        >
                                            Đang mượn
                                        </MenuItem>
                                        <MenuItem
                                            key={2}
                                            value="overdue"
                                        >
                                            Quá hạn
                                        </MenuItem>
                                        <MenuItem
                                            key={2}
                                            value="returned"
                                        >
                                            Đã trả
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </Box>
                    </Grid>
                </Grid>
                {
                    isMd ? <TableList
                        checked={checkedDelete}
                        columns={columns}
                        rows={data?.data?.result || []}
                        onChecked={handleCheckedDelete}
                        onToggleCheckedAll={handleCheckedDeleteAll}
                        checkedAll={checkedAll}
                        isLoading={isLoading}
                        keyChecked="_id"
                        pagination={data?.data?.meta}
                    />
                        :
                        <Grid container spacing={2} sx={{ p: { xs: 0, sm: 0, md: "12px 32px" }, pt: 2 }}>
                            <Grid item xs={12}>
                                {
                                    data?.data?.result?.length > 0 ? (
                                        data?.data?.result?.map((row, idxRow) => {
                                            return (
                                                <>

                                                    <Accordion
                                                        key={idxRow}
                                                        sx={{
                                                            background: "#e4f2fd",
                                                            borderRadius: "8px",
                                                            mt: 2,
                                                            position: 'relative'
                                                        }}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMore />}
                                                            sx={{
                                                                background: "#e4f2fd",
                                                                boxShadow: "0px 4px 6px rgba(86, 204, 242, 0.3)",
                                                                borderRadius: "8px",
                                                            }}
                                                        >
                                                            <Box sx={{ width: '100%' }}>
                                                                <Typography>
                                                                    Mã phiếu mượn: {row?.barcode}
                                                                </Typography>
                                                            </Box>
                                                        </AccordionSummary>

                                                        <AccordionDetails>
                                                            <Box sx={{ width: '100%', py: 1 }}>
                                                                <Typography mt={0.5}>Mã phiếu mượn: <strong>{row?.barcode}</strong></Typography>
                                                                <Typography mt={0.5}>Ngày mượn: <strong>{formatDate(row?.borrowedDay)}</strong></Typography>
                                                                <Typography mt={0.5}>Ngày trả: <strong>{formatDate(row?.returnDay)}</strong></Typography>
                                                                <Typography mt={0.5}>Tình trạng trả: <strong style={getStatusTextStyles(row.status)}>{capitalizeFirstLetter(row?.status)}</strong></Typography>
                                                                <Typography mt={0.5}>Trạng thái: <strong style={getIsAgreeTextStyles(row.isAgree)}>{row?.isAgree === false ? "Chưa duyệt" : "Đã duyệt"}</strong></Typography>
                                                                {row?.publications?.length > 0 && (
                                                                    <Box sx={{ mt: 0.5 }}>
                                                                        <Typography><strong>Danh sách ấn phẩm mượn:</strong></Typography>
                                                                        <ul style={{ marginTop: 5 }}>
                                                                            {row?.publications.map((publication, idx) => (
                                                                                <li key={idx}>{capitalizeFirstLetter(publication?.name)}(SLM: {publication?.quantityLoan}, Đã trả: {publication?.quantityReturn ?? 0})</li>
                                                                            ))}
                                                                        </ul>
                                                                    </Box>
                                                                )}
                                                                <Button variant="outlined" color="inherit">
                                                                    <IconEye
                                                                        onClick={() => handleViewDetailLoanSlip(row)}
                                                                        size={22}
                                                                        stroke={1.5}
                                                                    />
                                                                </Button>

                                                                {
                                                                    row.status !== "chờ nhận sách" && row.isAgree === false && row.status !== "đã hủy" &&
                                                                    <Button variant="outlined" color="error" style={{ marginLeft: 5 }}>
                                                                        <IconTrash
                                                                            size={22}
                                                                            stroke={1.5}
                                                                            onClick={() => handleOpenConfirmDialog(row)}
                                                                        />
                                                                    </Button>
                                                                }
                                                            </Box>
                                                        </AccordionDetails>
                                                    </Accordion>

                                                </>
                                            );
                                        })
                                    ) : (
                                        <Typography>Chưa có dữ liệu</Typography>
                                    )
                                }
                            </Grid>
                            <Grid item xs={12}>
                                {data?.data?.meta && Object.keys(data?.data?.meta).length > 0 && (
                                    <PaginationForm pagination={data?.data?.meta} />
                                )}
                            </Grid>
                        </Grid>
                }

                <ConfirmDeleteDialog
                    key={"delete"}
                    open={openConfirmDialog}
                    onClose={handleCloseConfirmDialog}
                    onConfirm={handleConfirmDelete}
                    title="Xác nhận xóa?"
                    description={`Bạn có chắc chắn muốn xóa "${loanSlipToDelete?._id}" ?`}
                />
            </MainCard>
        </div>
    );
};
export default LoanSlipPage;