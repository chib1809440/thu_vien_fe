import { Button, Chip, FormControl, Grid, MenuItem, Select, Switch, useTheme } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { IconCalendar, IconEye, IconFileExport, IconPencil, IconPlus, IconPrinter, IconTrash, IconX } from "@tabler/icons";
import { IconClockSearch, IconTrashXFilled } from "@tabler/icons-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ActionsForm from "../../../components/custom/form/ActionForm";
import TableList from "../../../components/custom/table-list/TableList";
import StyledButton from "../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../components/default/dialog/ConfirmDeleteDialog";
import { useAddLoanSlip, useApprovalLoanSlip, useCancelLoanSlip, useDeleteSoftLoanSlip, useDeleteSoftManyLoanSlip, useEditLoanSlip, useReturnLoanSlip } from "../../../hooks/services/loanSlip/loanSlip-mutation";
import { useFetchLoanSlip, useReFetchLoanSlip } from "../../../hooks/services/loanSlip/loanSlip-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { TColumn, TMenuOption } from "../../../types/common/table";
import { CreatePublication, TLoanSlip, TLoanSlipCreate } from "../../../types/models/loanSlip.type";
import IBreadcrumsCustom from "../../../ui-component/breadcrums";
import MainCard from "../../../ui-component/cards/MainCard";
import FormAddEditLoanSlip from "./ui-components/FormAddEditLoanSlip";
import { formatDate } from "../../../helpers/formatDate";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import { useReactToPrint } from "react-to-print";
import { vi } from "date-fns/locale";
import Html2Pdf from 'html2pdf.js';
import PrintLoanSlip from "./ui-components/PrintLoanSlip";
import { parserParams } from "../../../utils/object";
import { useFetchPublications } from "../../../hooks/services/publications/publications-query";
import DatePicker from "react-datepicker";
import ExcelJS from 'exceljs';
import ViewDetailLoanSlip from "./ui-components/ViewDetailLoanSlip";
import { useAuth } from "../../../contexts/JWTContext";
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
    const filter = useMemo(
        () =>
            parserParams([
                { compare: "", target: { barcodeUser: search } },
                { compare: "", target: { barcode: barcodeSearch } },
                { compare: 0, target: { type: filterDateType } },
                { compare: 0, target: { status: filterStatus } },
                { compare: 0, target: { isLink: false } },
            ]),
        [
            barcodeSearch,
            search,
            filterDateType,
            filterStatus
        ]
    );
    const theme = useTheme();
    const { data, isLoading } = useFetchLoanSlip({
        limit,
        page,
        startDate,
        endDate,
        ...filter,
    });
    console.log(filterDateType);

    const mutationAdd = useAddLoanSlip();
    const mutationApproval = useApprovalLoanSlip();
    const mutationReturn = useReturnLoanSlip();
    const mutationEdit = useEditLoanSlip();
    const mutationSoftDelete = useDeleteSoftLoanSlip();
    const mutationSoftDeleteMany = useDeleteSoftManyLoanSlip();
    const revalidate = useReFetchLoanSlip();
    const handleClearStartDate = () => {
        setStartDate(null); // Đặt lại giá trị endDate về null
    };
    const handleClearEndDate = () => {
        setEndDate(null); // Đặt lại giá trị endDate về null
    };
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [openViewDetail, setOpenViewDetail] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TLoanSlip | null>(null);
    const [selectedPrint, setSelectedPrint] = useState<TLoanSlip | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const [loanSlipToDelete, setLoanSlipToDelete] = useState<TLoanSlip | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmSoftDeleteMultiple, setOpenConfirmSoftDeleteMultiple] = useState(false);

    const addLoanSlip = () => {
        setOpenAddEdit(true);
    };
    const { user } = useAuth();

    const roleName = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?.roleId.name;
    }, [user]);

    const userId = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?._id;
    }, [user]);

    const handleEditLoanSlip = (row: TLoanSlip) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };
    const handleViewDetailLoanSlip = (row: TLoanSlip) => {
        setSelectedEdit(row);
        setOpenViewDetail(true);
    };
    const handlePrintLoanSlip = (row: TLoanSlip) => {
        setSelectedPrint(row);
        handlePrint()
    };
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    const handleApprovalLoanSlip = (row: TLoanSlip) => {
        row.status = "chờ nhận sách";

        mutationEdit.mutate(
            { ...row as any, _id: row._id, userId: row.userId._id },
            {
                onSuccess: () => {
                    revalidate();
                    toast.success('Giao sách thành công.');
                    handleClose();
                },
            }
        );
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
    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };
    const handleCloseViewDetail = () => {
        setOpenViewDetail(false);
        setSelectedEdit(null);
    };
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
            mutationSoftDelete.mutate(loanSlipToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success('Xóa phiếu mượn thành công.');
                    setOpenConfirmDialog(false);
                },
            });
        }
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
    const mutationCancel = useCancelLoanSlip();
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
    const handleDeliveryBook = (row: TLoanSlip) => {
        mutationApproval.mutate(
            row._id,
            {
                onSuccess: () => {
                    revalidate();
                    toast.success('Chỉnh sửa thành công.');
                    handleClose();
                },
            }
        );
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
                id: "borrowedDay",
                disablePadding: "none",
                label: "Ngày mượn",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return (
                        <Box
                        >
                            {formatDate(row.borrowedDay)}
                        </Box>
                    );
                },
            },
            {
                id: "returnDay",
                disablePadding: "none",
                label: "Ngày trả",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => {
                    return (
                        <Box
                        >
                            {formatDate(row.returnDay)}
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
                            {row?.status === "chờ nhận sách" ? ( // Kiểm tra nếu trạng thái là "chờ nhận sách"
                                roleName === "Owner" ? ( // Kiểm tra nếu roleName là "Owner"
                                    <Button
                                        variant="contained"
                                        sx={{ color: theme.palette.common.white, background: theme.palette.success.dark }}
                                        onClick={() => handleDeliveryBook(row)}
                                    >
                                        Giao sách
                                    </Button>
                                ) : (
                                    <Chip
                                        style={{ color: 'white', background: theme.palette.success.dark }}
                                        label="Giao sách"
                                        variant="filled"
                                    />
                                )
                            ) : row?.status === "đã hủy" ? (
                                <Chip
                                    style={{ color: 'white', background: '#de524a' }}
                                    label="Không duyệt"
                                    variant="filled"
                                />
                            ) : row.isAgree ? (
                                <Chip
                                    style={{ color: 'white', background: '#096A5E' }}
                                    label="Đã duyệt"
                                    variant="filled"
                                />
                            ) : roleName === 'Owner' ? (
                                <Button
                                    variant="contained"
                                    sx={{ color: theme.palette.common.white, background: theme.palette.error.dark }}
                                    onClick={() => handleApprovalLoanSlip(row)}
                                >
                                    Chưa duyệt
                                </Button>
                            ) : (
                                <Chip
                                    style={{ color: 'white', background: theme.palette.error.dark }}
                                    label="Chưa duyệt"
                                    variant="filled"
                                />
                            )}
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
                                ((row.status !== "chờ nhận sách" || roleName === "Owner") &&
                                    (row.isAgree === false || roleName === "Owner")) && (
                                    <IconPencil
                                        onClick={() => handleEditLoanSlip(row)}
                                        size={20}
                                        stroke={1.5}
                                    />
                                )
                            }

                            {
                                row.status !== "chờ nhận sách" && row.isAgree === false &&
                                <IconTrash
                                    size={20}
                                    stroke={1.5}
                                    onClick={() => handleOpenConfirmDialog(row)}
                                />
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

    const handleConfirmSoftDeleteMultiple = useCallback(() => {
        if (checkedDelete.length === 0) return;
        mutationSoftDeleteMany.mutate(checkedDelete, {
            onSuccess: () => {
                revalidate();
                toast.success("Xóa các mục đã chọn thành công.");
                setOpenConfirmSoftDeleteMultiple(false);
                setCheckedDelete([]);
            },
        });
    }, [checkedDelete]);
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
            const startDateExcel = startDate ? formatDate(startDate) : '';
            const endDateExcel = endDate ? formatDate(endDate) : '';
            worksheet.addRow([`Từ ngày: ${startDateExcel} đến ngày: ${endDateExcel}`]).font = { bold: true };

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
                    borrowDate: formatDate(loanSlip?.borrowedDay),
                    returnDate: formatDate(loanSlip?.returnDay),
                    status: capitalizeFirstLetter(loanSlip?.status),
                    bookTitle: bookTitles || '',
                };
            });

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
                a.download = 'loan_slips.xlsx'; // Tên file xuất
                a.click();
                URL.revokeObjectURL(url);
            });
        } else {
            toast.error("Không có dữ liệu để xuất excel");
        }
    };



    const actionMenus = useMemo((): TMenuOption[] => {
        return [
            // {
            //     label: "Xóa các dữ liệu vào thùng rác",
            //     icon: <IconTrashXFilled size={20} stroke={1.5} />,
            //     onClick: handleDeleteMultiple,
            // },
            {
                label: "Xuất excel",
                icon: <IconFileExport size={20} stroke={1.5} />,
                onClick: handleExportLoanSlipExcel,
            },
        ];
    }, [handleDeleteMultiple, handleExportLoanSlipExcel]);

    const initialValues = useMemo((): TLoanSlipCreate => {
        if (selectedEdit) {
            return {
                note: selectedEdit.note,
                borrowedDay: selectedEdit.borrowedDay,
                returnDay: selectedEdit.returnDay,
                receiptDate: selectedEdit.receiptDate,
                isPrint: selectedEdit.isPrint,
                status: 'đang xử lý',
                userId: ''
            };
        }
        return {
            note: "",
            borrowedDay: "",
            returnDay: "",
            receiptDate: "",
            isPrint: false,
            status: 'đang xử lý',
            userId: ''
        };
    }, [selectedEdit]);
    return (
        <div>
            <IBreadcrumsCustom
                profile="Quản lý phiếu mượn"
                mainProfile="Danh sách phiếu mượn"
                link="/quan-ly-muon-tra/phieu-muon"
            />

            {openAddEdit && (
                <FormAddEditLoanSlip
                    open={openAddEdit}
                    roleName={roleName}
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

                <Stack spacing={2} sx={{ paddingLeft: { xs: 4, sm: 4 }, paddingBottom: { xs: 2, sm: 2 }, width: '100%' }}>
                    <Box display="flex" flexWrap="wrap">
                        <Box>
                            <StyledButton
                                color="primary"
                                size="small"
                                startIcon={<IconPlus stroke={2} />}
                                variant="contained"
                                onClick={addLoanSlip}
                            >
                                {roleName === "Owner" ? "Thêm mới" : "Đăng ký mượn sách"}
                            </StyledButton>
                        </Box>

                        <Box>
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
                        </Box>
                    </Box>
                </Stack>
                <ActionsForm actions={actionMenus} barcode={true}
                    barcodeSearch={barcodeSearch}
                    handleBarcodeSearch={handleBarcodeSearch} placeholder="Tìm kiếm theo barcode" />
                <Grid container pl={4} pr={4} xs={12} sm={12} md={12} lg={12} gap={2} sx={{ display: "flex", mb: 3, flexWrap: "wrap" }}>
                    <Grid item xs={12} sm={12} md={2} lg={2}>
                        <div style={{ display: "flex", alignItems: "center" }}> {/* Sử dụng Flexbox để căn giữa */}
                            <span style={{ marginRight: "10px", whiteSpace: "nowrap", fontWeight: 'bold' }}> {/* Thêm whiteSpace để ngăn ngắt dòng */}
                                Lọc theo:
                            </span>
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
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div style={{ display: "flex", alignItems: "center" }}> {/* Sử dụng Flexbox để căn giữa */}
                            <span style={{ marginRight: "10px", whiteSpace: "nowrap", fontWeight: 'bold' }}> {/* Thêm whiteSpace để ngăn ngắt dòng */}
                                Từ ngày:
                            </span>
                            <div className="date-picker-container">
                                <DatePicker
                                    locale={vi}
                                    selected={startDate}
                                    dateFormat="dd/MM/yyyy" // Định dạng ngày tháng năm
                                    onChange={(date: Date | null) => setStartDate(date)}
                                    customInput={<CustomInput value={startDate ? startDate.toLocaleDateString() : ''} onClick={() => { }} />}
                                />
                                {
                                    startDate && <span className="icon-clear" onClick={handleClearStartDate}>
                                        <IconX color="red" />
                                    </span>
                                }
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div style={{ display: "flex", alignItems: "center" }}> {/* Sử dụng Flexbox để căn giữa */}
                            <span style={{ marginRight: "10px", whiteSpace: "nowrap", fontWeight: 'bold' }}> {/* Thêm whiteSpace để ngăn ngắt dòng */}
                                Đến ngày:
                            </span>
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

                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        <div style={{ display: "flex", alignItems: "center" }}> {/* Sử dụng Flexbox để căn giữa */}
                            <span style={{ marginRight: "10px", whiteSpace: "nowrap", fontWeight: 'bold' }}> {/* Thêm whiteSpace để ngăn ngắt dòng */}
                                Trạng thái:
                            </span>
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
                        </div>
                    </Grid>
                </Grid>
                <TableList
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

                <ConfirmDeleteDialog
                    key={"delete"}
                    open={openConfirmDialog}
                    onClose={handleCloseConfirmDialog}
                    onConfirm={handleConfirmDelete}
                    title="Xác nhận xóa?"
                    description={`Bạn có chắc chắn muốn xóa "${loanSlipToDelete?._id}" ?`}
                />
                <ConfirmDeleteDialog
                    key={"deleteMultiple"}
                    open={openConfirmSoftDeleteMultiple}
                    onClose={() => setOpenConfirmSoftDeleteMultiple(false)}
                    onConfirm={handleConfirmSoftDeleteMultiple}
                    title="Xác nhận xóa các mục đã chọn?"
                    description={`Bạn có chắc chắn muốn xóa?`}
                />
            </MainCard>
        </div>
    );
};
export default LoanSlipPage;