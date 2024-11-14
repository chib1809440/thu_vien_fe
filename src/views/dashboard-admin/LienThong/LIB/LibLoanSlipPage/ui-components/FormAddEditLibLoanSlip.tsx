import { Autocomplete, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableContainer, TableHead, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import * as yup from "yup";
import InputForm from "../../../../../../components/custom/form/InputForm";
import SwitchForm from "../../../../../../components/custom/form/SwitchForm";
import { CreatePublication, TLoanSlip, TLoanSlipCreate } from "../../../../../../types/models/loanSlip.type";
import DatePicker from "react-datepicker";
import { Label } from "@mui/icons-material";
import { vi } from "date-fns/locale";
import useDebounce, { searchDelay } from "../../../../../../hooks/useDebounce";
import { getUserByBarCode } from "../../../../../../_apis/user.api";
import { EntityResponse } from "../../../../../../interfaces/entityResponse";
import { User } from "../../../../../../interfaces/user";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TPublications } from "../../../../../../types/models/publications.type";
import { positions } from "@mui/system";
import publicationsService from "../../../../../../_apis/services/publications.service";
import useDebounceArray from "../../../../../../hooks/useDebounceArray";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { capitalizeFirstLetter } from "../../../../../../helpers/capitalizeFirstLetter";
import { useFetchLibrariesFromGroup } from "../../../../../../hooks/services/group/group-query";
import { Role } from "../../../../../../interfaces/role";
import { useAuth } from "../../../../../../contexts/JWTContext";
import PrintLoanSlip from "../../../../LoanSlipPage/ui-components/PrintLoanSlip";
import { formatDate } from "../../../../../../helpers/formatDate";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../../../../../../store/slices/cartLoanSlip";
import StyledButton from "../../../../../../components/default/button/StyledButton";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));



type Props = {
    open: boolean;
    onClose: () => void;
    onHandleReturnLoanSlip?: (loanSlip: TLoanSlip, publications: CreatePublication[]) => void;
    onHandleCancelLoanSlip?: (loanSlip: TLoanSlip) => void;
    onSubmit?: (values: TLoanSlipCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues?: TLoanSlipCreate;
    loanSlip?: TLoanSlip;
    isEditMode?: boolean;
    isCart?: boolean;

};

const schema = yup.object().shape({
    note: yup
        .string(),
    libraryId: yup
        .string()
        .required("Vui lòng chọn thư viện").notOneOf(['0'], "Vui lòng chọn thư viện"),
});

const FormAddEditLoanSlip: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    onHandleReturnLoanSlip,
    onHandleCancelLoanSlip,
    initialValues = {
        note: "",
        borrowedDay: "",
        returnDay: "",
        userId: "",
        isPrint: false,
        receiptDate: '',
        libraryId: '0',
        status: 'đang xử lý',
    },
    isFetching = false,
    isEditMode = false,
    loanSlip,
    isCart,
}) => {
    const [arrayError, setArrayError] = useState<{ name: string; position: string }[]>([]);
    const items = useSelector((state: { cartLoanSlip: { items: CreatePublication[] } }) => state.cartLoanSlip.items);
    const dispatch = useDispatch();
    const { logout, user } = useAuth();
    const userID = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?._id;
    }, [user]);


    const libraryId = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?.libraryId;
    }, [user]);
    const formik = useFormik<TLoanSlipCreate>({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            let filteredPublications = publications.filter(
                (publication) => publication.publicationId !== ''
            );
            // Reset mảng lỗi trước khi kiểm tra
            setArrayError([]);

            if (!isEditMode) {
                const errors = filteredPublications.reduce((acc, item) => {
                    if (item.position === "trong kho" && item.quantity < item.quantityLoan) {
                        acc.push({
                            name: item.name,
                            position: item.position,
                        });
                    } else if (item.position === "trên kệ" && item.shelvesQuantity < item.quantityLoan) {
                        acc.push({
                            name: item.name,
                            position: item.position,
                        });
                    }
                    return acc;
                }, []);
                // Nếu có lỗi, cập nhật state và không thực hiện onSubmit
                if (errors.length > 0) {
                    setArrayError(errors);
                    return; // Dừng thực hiện onSubmit
                }
            }
            if (onSubmit) {
                const createLoanSlip: TLoanSlipCreate = {
                    note: values.note,
                    ...(isEditMode ? {} : { userId: userID }),
                    borrowedDay: borrowedDay.toDateString(),
                    returnDay: returnDay.toDateString(),
                    libraryId: values.libraryId,
                    isPrint: false,
                    isLink: true,
                    receiptDate: new Date().toDateString(),
                    status: isEditMode ? loanSlip?.status : 'đang xử lý',
                    // Sử dụng danh sách publications đã lọc
                    publications: filteredPublications,
                }
                onSubmit(createLoanSlip, resetForm);
            }
        },
    });

    const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = useMemo(
        () => formik,
        [formik]
    );
    const [borrowedDay, setBorrowedDay] = useState(new Date());
    const { data: dataGroups, isLoading } = useFetchLibrariesFromGroup();

    const [returnDay, setReturnDay] = useState(new Date());
    const [barcodeUserId, setbarcodeUserId] = useState<string>('');
    const [searchBarCode, setSearchBarCode] = useState<string>('');
    const [userData, setUserData] = useState<EntityResponse<User>>(null);
    const [publications, setPublications] = useState<CreatePublication[]>([
        {
            name: '',
            publicationId: '',
            position: '',
            quantityLoan: 1,
            quantity: 0,
            shelvesQuantity: 0,
            barcode: '',
        },
    ]);
    useEffect(() => {
        if (items?.length > 0 && !loanSlip) {
            setPublications([...items]);
            if (isCart === true) {
                const firstItem = items[0];
                formik.setFieldValue('libraryId', firstItem.libraryId)
            }
        }

    }, [items])

    const debouncedBarCodeUserId = useDebounce(barcodeUserId, 500);
    const [dropdownOptions, setDropdownOptions] = useState<CreatePublication[]>([]);

    const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
    useEffect(() => {
        if (debouncedBarCodeUserId) {
            // Chỉ gọi API khi có giá trị barcode
            const fetchUser = async () => {
                try {
                    const result = await getUserByBarCode(debouncedBarCodeUserId);
                    setUserData(result); // Lưu kết quả tìm kiếm
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            };
            fetchUser();
        }
    }, [debouncedBarCodeUserId]);
    useEffect(() => {
        if (loanSlip) {
            setbarcodeUserId(loanSlip.userId.barcode);
            setBorrowedDay(new Date(loanSlip.borrowedDay));
            setReturnDay(new Date(loanSlip.returnDay));
            let editPublications: CreatePublication[] = [];
            // Giả sử loanSlip.publications là mảng chứa các đối tượng cần đẩy vào
            loanSlip.publications.forEach((publication) => {
                const newPublication: CreatePublication = {
                    publicationId: publication.publicationId,
                    name: publication.name,
                    quantityLoan: publication.quantityLoan,
                    quantityReturn: publication?.quantityReturn,
                    quantityModify: publication.quantityReturn === 0 ? publication.quantityLoan : (publication.quantityLoan - publication.quantityReturn),
                    quantity: publication.quantity,
                    shelvesQuantity: publication.shelvesQuantity,
                    position: publication.position,
                    barcode: publication.barcode,
                };
                // Đẩy object vào mảng editPublications
                editPublications.push(newPublication);
            });
            setPublications(editPublications);
        }
    }, [loanSlip])
    const handleBarCodeChange = (index: number, newBarCode: string) => {
        //  const updatedPublications = [...publications];
        //   updatedPublications[index].barcode = newBarCode;
        setSearchBarCode(newBarCode + ' ' + index);
        // setPublications(updatedPublications);

    };
    const handleReturnLoanSlip = () => {
        const filteredPublications = publications.map((publication) => ({
            ...publication,           // Giữ nguyên tất cả các thuộc tính hiện có
            quantityReturn: publication.quantityModify, // Gán quantityReturn
        }));
        onHandleReturnLoanSlip(loanSlip, filteredPublications)
    };
    const handleCancelLoanSlip = (loanSlip: TLoanSlip) => {
        if (onHandleCancelLoanSlip) {
            onHandleCancelLoanSlip(loanSlip); // Gọi hàm
        } else {
            console.error("onHandleCancelLoanSlip is not a function");
        }
    };
    // Use custom hook to debounce array of barcodes
    const debouncedBarcode = useDebounce(searchBarCode, 500);
    console.log("dsdsd", loanSlip);

    useEffect(() => {
        if (debouncedBarcode && debouncedBarcode.length >= 5) {
            const fetchPublicationByBarCode = async () => {
                try {

                    const parts = debouncedBarcode.split(' '); // Tách chuỗi theo dấu cách
                    const barcode = parts.slice(0, parts.length - 1).join(' '); // Lấy tất cả các phần ngoại trừ phần cuối cùng và ghép lại
                    const index = Number(parts[parts.length - 1]); // Lấy phần cuối cùng và chuyển đổi thành số
                    setLoadingSearch(true)
                    const result = await publicationsService.getByName<TPublications>({ search: barcode, libraryId: formik?.values?.libraryId });
                    // Chuyển đổi kết quả thành mảng CreatePublication[]
                    const convertedPublications: CreatePublication[] = result.data.result.map((pub: TPublications) => ({
                        name: pub.name || '',  // Cung cấp giá trị mặc định nếu không có
                        publicationId: pub._id || '',
                        position: 'trên kệ', // Giá trị mặc định
                        quantityLoan: pub.quantityLoan || 1, // Giá trị mặc định
                        quantity: pub.quantity || 0, // Giá trị mặc định
                        shelvesQuantity: pub.shelvesQuantity || 0, // Giá trị mặc định
                        barcode: pub.barcode || '', // Cung cấp giá trị mặc định nếu không có
                    }));
                    setDropdownOptions(convertedPublications);
                    setLoadingSearch(false)

                    //    const publicationData = result.data.result; // Assuming result.data.result contains the publication info
                    // if (publicationData) {
                    //     setPublications((prevPublications) => {
                    //         // Check if the barcode already exists in the publications state
                    //         const existingPublication = prevPublications.find(
                    //             (pub) => pub.publicationId === publicationData._id
                    //         );

                    //         if (existingPublication) {
                    //             // If it exists, update the quantityLoan
                    //             let newPublications = [...publications];
                    //             newPublications[index] = {
                    //                 ...newPublications[index],
                    //                 name: '', // Set name to empty string
                    //                 barcode: '' // Set name to empty string
                    //             };
                    //             newPublications = newPublications.map((pub) =>
                    //                 pub.publicationId === publicationData._id
                    //                     ? { ...pub, quantityLoan: pub.quantityLoan + 1 } // Increment the quantityLoan
                    //                     : pub
                    //             );
                    //             return newPublications
                    //         } else {
                    //             let newPublications = [...publications];
                    //             newPublications = newPublications.map((pub) =>
                    //                 pub.barcode === publicationData.barcode
                    //                     ? { name: publicationData.name, publicationId: publicationData._id, quantityLoan: 1, position: 'trên kệ', barcode: publicationData.barcode, quantity: publicationData.quantity, shelvesQuantity: publicationData.shelvesQuantity } // Increment the quantityLoan
                    //                     : pub
                    //             );
                    //             newPublications.push({
                    //                 name: '',
                    //                 publicationId: '',
                    //                 position: 'trên kệ',
                    //                 quantityLoan: 1,
                    //                 quantity: 0,
                    //                 shelvesQuantity: 0,
                    //                 barcode: '',
                    //             },)
                    //             return newPublications;
                    //         }
                    //     });
                    // }
                    setSearchBarCode('');
                } catch (error) {
                    console.error('Error fetching publication data:', error);
                }
            };

            fetchPublicationByBarCode();
        }
    }, [debouncedBarcode]);

    const barcodeUserIdRef = useRef(null);

    useEffect(() => {
        // Focus the input field on mount
        if (barcodeUserIdRef.current) {
            barcodeUserIdRef.current.focus();
        }
    }, []);
    const lastInputRef = useRef<HTMLInputElement | null>(null); // Reference for the last input

    // Focus the last input field when the component mounts or updates
    useEffect(() => {
        // Chỉ focus nếu phần tử cuối cùng là phần tử mới (không có barcode)
        if (lastInputRef.current && publications[publications.length - 1]?.barcode === '') {
            lastInputRef.current.focus();
        }
    }, [publications.length]);
    const handleRemovePublication = (index: number) => {
        const updatedPublications = [...publications];
        const removedPublication = updatedPublications[index];
        updatedPublications.splice(index, 1); // Xóa phần tử tại vị trí index
        setPublications(updatedPublications); // Cập nhật lại state
        if (items?.length > 0) {
            const itemToRemove = items.find(item => item.publicationId === removedPublication.publicationId);
            if (itemToRemove) {
                dispatch(removeItem(itemToRemove.publicationId)); // Gọi dispatch với ID của item cần xóa
            }
        }
    };
    // Hàm để thêm một phần tử mới vào danh sách publications
    const handleAddPublication = () => {
        const newPublication: CreatePublication = {
            name: '',
            publicationId: '',
            position: '',
            quantityLoan: 1,
            quantity: 0,
            shelvesQuantity: 0,
            barcode: '',
        };
        setPublications([...publications, newPublication]); // Thêm phần tử mới vào danh sách
    };
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: `
            @page {
                margin: 10mm; /* Thiết lập margin */
                size: A6; /* Thiết lập kích thước */
            }
            body {
                margin: 0; /* Đảm bảo không có margin thừa */
            }
        `,
    });
    // Hàm xử lý sự kiện onChange
    const handleLibraryChange = (event) => {
        const selectedLibraryId = event.target.value;
        formik.setFieldValue('libraryId', selectedLibraryId);
        setPublications([
            {
                name: '',
                publicationId: '',
                position: '',
                quantityLoan: 1,
                quantity: 0,
                shelvesQuantity: 0,
                barcode: '',
            },
        ]);

    };
    console.log('dsds', publications);

    const handlePublicationChange = (
        event: any,
        value: CreatePublication | null,
        index: number,
    ) => {
        // Kiểm tra xem giá trị có hợp lệ không
        if (value) {
            const updatedPublications = [...publications]; // Tạo bản sao của publications

            // Tìm xem publicationId đã tồn tại hay chưa
            const existingIndex = updatedPublications.findIndex(pub => pub.publicationId === value.publicationId);

            if (existingIndex !== -1) {
                // Nếu publicationId đã tồn tại, tăng quantityLoan lên 1
                updatedPublications[existingIndex].quantityLoan += 1;
            } else {
                // Nếu không, thêm mới vào publications
                updatedPublications[index] = {
                    name: value.name, // Cập nhật tên
                    publicationId: value.publicationId || '', // Cập nhật ID
                    position: 'trên kệ', // Hoặc giá trị mặc định khác
                    quantityLoan: 1, // Đặt quantityLoan là 1
                    quantity: value.quantity, // Giá trị mặc định
                    shelvesQuantity: value.shelvesQuantity, // Giá trị mặc định
                    barcode: value.barcode || '', // Cập nhật barcode
                };
                // Chỉ thêm một mục mới trống nếu không có mục nào khác đang chờ
                if (index === updatedPublications.length - 1) {
                    updatedPublications.push({
                        name: '',
                        publicationId: '',
                        position: '',
                        quantityLoan: 1,
                        quantity: 0,
                        shelvesQuantity: 0,
                        barcode: '',
                    });
                }
            }

            setPublications(updatedPublications); // Cập nhật state publications
            setDropdownOptions([]); // Xóa dropdown options nếu cần
        }
    };


    const libraryDetail = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?.libraryDetail;
    }, [user]);
    // console.log("sss", loanSlip.libraryId);
    // console.log("sss", user);

    return (
        <FormikProvider value={formik}>
            <Dialog
                maxWidth="xl"
                fullWidth
                open={open}
                onClose={(event, reason) => {
                    if (reason !== "backdropClick") {
                        // Ngăn tắt khi bấm ra ngoài
                        onClose();
                    }
                }}
                disableEscapeKeyDown
            >
                <DialogTitle sx={{ p: 4 }}>
                    {isEditMode ? "Sửa phiếu mượn" : "Thêm phiếu mượn mới"} {loanSlip?.isCancel === true ? <span style={{ color: '#c62828' }}>(Đã hủy phiếu)</span> : ""}
                </DialogTitle>

                <DialogContent sx={{ p: 8 }} >
                    <Box sx={{ display: 'none' }}>
                        {
                            loanSlip && libraryDetail && <PrintLoanSlip libraryDetail={libraryDetail} ref={componentRef} loanSlip={loanSlip} />
                        }
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <StyledButton
                                color="primary"
                                size="small"
                                variant="contained"
                                disableHoverEffect
                                sx={{ paddingTop: 1.1, paddingBottom: 1.1 }}

                            >
                                Thông tin mượn - trả
                            </StyledButton>

                            <Form autoComplete="none" noValidate onSubmit={handleSubmit}>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box style={{ width: "100%" }} sx={{ mt: 2 }}>
                                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                Ngày mượn  <span className="required_text">(*)</span>{" "}
                                            </Typography>
                                            <DatePicker
                                                disabled={isEditMode}
                                                locale={vi}
                                                className="react-date-picker"
                                                selected={borrowedDay}
                                                onChange={(date: Date) => {
                                                    setBorrowedDay(date);
                                                }}
                                                onYearChange={(date: Date) => {
                                                    setBorrowedDay(date);
                                                }}
                                                onMonthChange={(date: Date) => {
                                                    setBorrowedDay(date);
                                                }}
                                                dateFormat="dd/MM/yyyy" // Định dạng ngày tháng năm
                                                showMonthDropdown // Hiển thị dropdown chọn tháng
                                                dropdownMode="select"
                                                showYearDropdown // Hiển thị dropdown chọn năm
                                                popperPlacement="top-end"
                                                minDate={new Date()}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box style={{ width: "100%" }} sx={{ mt: 2 }}>
                                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                Ngày trả  <span className="required_text">(*)</span>{" "}
                                            </Typography>
                                            <DatePicker
                                                disabled={loanSlip?.isReturn === true}
                                                locale={vi}
                                                className="react-date-picker"
                                                selected={returnDay}
                                                onChange={(date: Date) => {
                                                    setReturnDay(date);
                                                }}
                                                onYearChange={(date: Date) => {
                                                    setReturnDay(date);
                                                }}
                                                onMonthChange={(date: Date) => {
                                                    setReturnDay(date);
                                                }}
                                                dateFormat="dd/MM/yyyy" // Định dạng ngày tháng năm
                                                showMonthDropdown // Hiển thị dropdown chọn tháng
                                                dropdownMode="select"
                                                showYearDropdown // Hiển thị dropdown chọn năm
                                                minDate={new Date()}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>


                            </Form>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item md={12}>
                            <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontWeight: "bold" }}>
                                    <span style={{ marginRight: '8px' }}>Nhóm thư viện</span>
                                    <span className="required_text">(*)</span>
                                </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="libraryId"
                                        name="libraryId"
                                        type="libraryId"
                                        disabled={loanSlip ? true : false || isCart}
                                        value={formik?.values?.libraryId}
                                        onChange={handleLibraryChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.libraryId &&
                                            Boolean(formik.errors.libraryId)
                                        }
                                    >
                                        <MenuItem value='0' disabled>
                                            Nhóm thư viện
                                        </MenuItem>
                                        {loanSlip ? (
                                            // Nếu loanSlip tồn tại
                                            dataGroups?.data?.result?.libraries?.length > 0 ? (
                                                dataGroups.data.result.libraries.map((item, index) => (
                                                    <MenuItem key={index} value={item._id}>
                                                        {capitalizeFirstLetter(item.name)}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="0" disabled>
                                                    Nhóm thư viện
                                                </MenuItem>
                                            )
                                        ) : (
                                            // Nếu loanSlip không tồn tại
                                            dataGroups?.data?.result?.libraries?.length > 0 ? (
                                                dataGroups.data.result.libraries.filter(x => x._id !== libraryId).map((item, index) => (
                                                    <MenuItem key={index} value={item._id}>
                                                        {capitalizeFirstLetter(item.name)}
                                                    </MenuItem>
                                                ))
                                            ) : (
                                                <MenuItem value="0" disabled>
                                                    Nhóm thư viện
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                                {formik.touched.libraryId &&
                                    Boolean(formik.errors.libraryId) && (
                                        <FormHelperText className="required_text">
                                            {" "}
                                            {formik.errors.libraryId
                                                ? formik.errors.libraryId.toString()
                                                : ""}
                                        </FormHelperText>
                                    )}
                            </Box>
                        </Grid>
                    </Grid>
                    {
                        formik.values.libraryId !== '0' &&
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                    <StyledButton
                                        color="primary"
                                        size="small"
                                        variant="contained"
                                        disableHoverEffect
                                        sx={{ paddingTop: 1.1, paddingBottom: 1.1 }}

                                    >
                                        Thông tin ấn phẩm
                                    </StyledButton>
                                    <IconCirclePlusFilled
                                        style={{ cursor: 'pointer', marginLeft: '10px' }} // Khoảng cách giữa Chip và Icon
                                        onClick={() => handleAddPublication()} // Gọi hàm thêm
                                        color="green"
                                        size={30}
                                        stroke={1.5}
                                    />
                                </Box>
                                {arrayError.length > 0 && (
                                    <div>
                                        <Typography variant="h4" className="required-text" sx={{ color: 'red', mt: 2 }}>
                                            Số lượng không đủ:
                                        </Typography>
                                        <ul>
                                            {arrayError.map((error, index) => (
                                                <li key={index}>
                                                    {error.name} - {error.position}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <TableContainer component={Paper} sx={{ mt: 4 }}>
                                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left" width='20%'>BarCode</StyledTableCell>
                                                <StyledTableCell align="left" width='40%'>Tên sách</StyledTableCell>
                                                {
                                                    isEditMode === false && <>  <StyledTableCell align="left" width='15%'>Số lượng trong kho</StyledTableCell>
                                                        <StyledTableCell align="left" width='15%'>Số lượng trên kệ</StyledTableCell></>
                                                }
                                                {/* {
                                                    loanSlip?.isAgree === false && <>  <StyledTableCell align="left" width='15%'>Số lượng trong kho</StyledTableCell>
                                                        <StyledTableCell align="left" width='15%'>Số lượng trên kệ</StyledTableCell></>
                                                } */}
                                                {

                                                    isEditMode ? <>  <StyledTableCell align="left" width='10%'>Số lượng mượn</StyledTableCell></> : <> </>
                                                }
                                                {

                                                    isEditMode && loanSlip?.isAgree == true ? <>  <StyledTableCell align="left" width='10%'>Số lượng đã trả</StyledTableCell></> : <> </>
                                                }
                                                {
                                                    isEditMode && loanSlip?.isAgree === true && loanSlip?.isReturn === false ? (
                                                        <StyledTableCell align="left" width='30%'>Số lượng cần trả</StyledTableCell>
                                                    ) : null
                                                }
                                                {

                                                    !isEditMode ? <>  <StyledTableCell align="left" width='15%'>Số lượng mượn</StyledTableCell></> : <> </>
                                                }
                                                <StyledTableCell align="center" width='15%'>Vị trí</StyledTableCell>
                                                <StyledTableCell align="center" width='15%'>Hành động</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {publications?.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell align="left">
                                                        {row.barcode || "Không có dữ liệu"}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        <Box style={{ width: "100%" }} >
                                                            {
                                                                row.publicationId !== '' ? <>{row.name}</> : <>
                                                                    <Autocomplete
                                                                        getOptionLabel={(option) => (option?.name)}
                                                                        loading={loadingSearch}
                                                                        options={dropdownOptions}
                                                                        onChange={(event, value) =>
                                                                            handlePublicationChange(event, value, index)
                                                                        }
                                                                        disablePortal
                                                                        value={publications[index] || null}
                                                                        onInputChange={(event, newInputValue, reason) => {
                                                                            if (reason === 'reset') {
                                                                                setDropdownOptions([])
                                                                                return
                                                                            }
                                                                        }}
                                                                        renderInput={(params) => <TextField
                                                                            inputRef={index === publications.length - 1 ? lastInputRef : null}
                                                                            onChange={(event) =>
                                                                                handleBarCodeChange(index, event.target.value)
                                                                            }  {...params} />}
                                                                    />
                                                                </>
                                                            }

                                                        </Box>
                                                    </StyledTableCell>

                                                    {
                                                        isEditMode === false && <> <StyledTableCell align="left">
                                                            {row.quantity}
                                                        </StyledTableCell>
                                                            <StyledTableCell align="left">
                                                                {row.shelvesQuantity}
                                                            </StyledTableCell></>
                                                    }
                                                    {/* {
                                                        loanSlip?.isAgree === false && <>   <StyledTableCell align="left">
                                                            {row.quantity}
                                                        </StyledTableCell>
                                                            <StyledTableCell align="left">
                                                                {row.shelvesQuantity}
                                                            </StyledTableCell></>
                                                    } */}
                                                    {
                                                        isEditMode && loanSlip?.isAgree === true && <>
                                                            <StyledTableCell align="left">
                                                                {row?.quantityLoan || 0}
                                                            </StyledTableCell>
                                                            <StyledTableCell align="left">
                                                                {row?.quantityReturn || 0}
                                                            </StyledTableCell>
                                                        </>
                                                    }


                                                    {
                                                        isEditMode && loanSlip?.isAgree === true ? <>
                                                            {
                                                                loanSlip?.isReturn === false &&
                                                                <StyledTableCell align="center">

                                                                    <Box style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                                                        <TextField
                                                                            variant="outlined"
                                                                            fullWidth
                                                                            placeholder="Số lượng"
                                                                            type="number"
                                                                            value={isEditMode && loanSlip.isAgree == true ? row.quantityModify : row.quantityLoan}
                                                                            onChange={(e) => {
                                                                                const updatedPublications = [...publications];
                                                                                const updatedItem = { ...updatedPublications[index] }; // Tạo bản sao sâu của đối tượng

                                                                                if (isEditMode && loanSlip.isAgree === true) {
                                                                                    if (Number(e.target.value) > updatedItem.quantityLoan - updatedItem.quantityReturn) {
                                                                                        toast.error("Số lượng trả không lớn hơn số lượng mượn");
                                                                                        return;
                                                                                    }
                                                                                    updatedItem.quantityModify = Number(e.target.value);
                                                                                } else {
                                                                                    updatedItem.quantityLoan = Number(e.target.value);
                                                                                }

                                                                                updatedPublications[index] = updatedItem; // Gán bản sao đã chỉnh sửa vào mảng
                                                                                setPublications(updatedPublications); // Cập nhật state
                                                                            }}
                                                                            sx={{ flexShrink: 1, width: '40%', mr: 1 }} // Điều chỉnh width và margingjgvhjghghghghghgutytyt phải
                                                                        />
                                                                        <Typography variant="h6">{`/${row.quantityLoan - row.quantityReturn}`}</Typography> {/* Hiển thị giá trị bên cạnh */}
                                                                    </Box>
                                                                </StyledTableCell>
                                                            }
                                                        </> : <>
                                                            <StyledTableCell align="center">

                                                                <Box style={{ width: "100%" }}>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        placeholder="Số lượng"
                                                                        value={row.quantityLoan}
                                                                        onChange={(e) => {
                                                                            let updatedPublications = [...publications];
                                                                            updatedPublications[index] = { ...updatedPublications[index] }; // Create a copy of the specific item
                                                                            updatedPublications[index].quantityLoan = Number(e.target.value); // Modify the copy
                                                                            setPublications(updatedPublications); // Update the state
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </StyledTableCell>

                                                        </>
                                                    }

                                                    <StyledTableCell align="center">
                                                        {(!isEditMode || (isEditMode && loanSlip?.isAgree === false)) ? (
                                                            <Select
                                                                value={row.position || 'trên kệ'} // Default value is "trên kệ"
                                                                onChange={(e) => {
                                                                    const updatedPublications = [...publications]; // Shallow copy of publications array
                                                                    const updatedRow = { ...updatedPublications[index] }; // Deep copy of the specific row object
                                                                    updatedRow.position = e.target.value; // Update the position field on the copied object
                                                                    updatedPublications[index] = updatedRow; // Replace the original item with the updated copy
                                                                    setPublications(updatedPublications); // Update state
                                                                }}
                                                            >
                                                                <MenuItem value="trong kho">Trong kho</MenuItem>
                                                                <MenuItem value="trên kệ">Trên kệ</MenuItem>
                                                            </Select>
                                                        ) : (
                                                            capitalizeFirstLetter(row?.position)
                                                        )}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        {
                                                            loanSlip?.isAgree === false && <IconTrash
                                                                style={{ cursor: 'pointer', color: 'red' }}
                                                                onClick={() => handleRemovePublication(index)} // Gọi hàm xóa
                                                                color="red"
                                                                size={20}
                                                                stroke={1.5}
                                                            />
                                                        }
                                                        {
                                                            (isCart || !loanSlip) && (
                                                                <IconTrash
                                                                    style={{ cursor: 'pointer', color: 'red' }}
                                                                    onClick={() => handleRemovePublication(index)} // Gọi hàm xóa
                                                                    color="red"
                                                                    size={20}
                                                                    stroke={1.5}
                                                                />
                                                            )
                                                        }
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Box sx={{ mt: 4 }}>
                                    <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                        Ghi chú
                                    </Typography>
                                    <TextareaAutosize
                                        id="note"
                                        name="note"
                                        value={formik.values.note}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        minRows={4}
                                    />
                                    {formik.touched.note &&
                                        Boolean(formik.errors.note) && (
                                            <FormHelperText className="required_text">
                                                {" "}
                                                {formik.errors.note
                                                    ? formik.errors.note.toString()
                                                    : ""}
                                            </FormHelperText>
                                        )}
                                </Box>
                            </Grid>
                        </Grid>
                    }
                    {
                        loanSlip?.historys?.length > 0 && <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                                    <Chip
                                        color='primary'
                                        label="Thông tin Lịch sử mượn"
                                        variant="filled"
                                    />
                                </Box>
                                <TableContainer component={Paper} sx={{ mt: 4 }}>
                                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell align="left" width='20%'>BarCode</StyledTableCell>
                                                <StyledTableCell align="left" width='40%'>Tên sách</StyledTableCell>
                                                <StyledTableCell align="left" width='15%'>Số lượng đã trả</StyledTableCell>
                                                <StyledTableCell align="left" width='15%'>Ngày trả</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {loanSlip?.historys?.map((row, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell align="left">
                                                        <Box style={{ width: "100%" }} >
                                                            {row?.barcode || "Không có dữ liệu"}
                                                        </Box>
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        {row?.name || "Không có dữ liệu"}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        {row?.quantityReturn || "Không có dữ liệu"}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left">
                                                        {formatDate(row?.historyDate) || "Không có dữ liệu"}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    }
                </DialogContent>

                <DialogActions sx={{ p: 4 }}>
                    <Button disabled={isFetching} onClick={onClose} color="error">
                        Đóng
                    </Button>
                    {

                        loanSlip && ((libraryId as string) === loanSlip.libraryId) && isEditMode && !loanSlip?.isReturn && loanSlip?.isAgree && <Button onClick={handleReturnLoanSlip} style={{ background: '#07624e', color: 'white' }} variant="contained"  >
                            Trả sách
                        </Button>
                    }
                    {

                        loanSlip && ((libraryId as string) === loanSlip.libraryId) && isEditMode && <Button onClick={() => handlePrint()} style={{ background: '#212121', color: 'white' }} variant="contained"  >
                            In
                        </Button>
                    }
                    {
                        loanSlip &&
                        isEditMode &&
                        loanSlip.status !== "đang mượn" && loanSlip.status !== "đã trả" && // Kiểm tra status
                        !loanSlip.isCancel && (
                            <Button
                                onClick={() => handleCancelLoanSlip(loanSlip)}
                                style={{ background: '#c62828', color: 'white' }}
                                variant="contained"
                            >
                                Hủy phiếu mượn
                            </Button>
                        )
                    }
                    {
                        !loanSlip?.isReturn && <Button
                            disabled={isFetching}
                            onClick={handleSubmit as () => void}
                            variant="contained"
                            color="primary"
                        >
                            {isFetching ? "Đang thêm..." : isEditMode ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    }

                </DialogActions>
            </Dialog>
        </FormikProvider >
    );
};

export default FormAddEditLoanSlip;
const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const TextareaAutosize = styled(BaseTextareaAutosize)(
    ({ theme }) => `
  box-sizing: border-box;
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);