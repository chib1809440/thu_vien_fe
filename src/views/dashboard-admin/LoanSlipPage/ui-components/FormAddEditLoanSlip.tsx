import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableContainer, TableHead, TextField, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import SwitchForm from "../../../../components/custom/form/SwitchForm";
import { CreatePublication, TLoanSlip, TLoanSlipCreate } from "../../../../types/models/loanSlip.type";
import DatePicker from "react-datepicker";
import { Label } from "@mui/icons-material";
import { vi } from "date-fns/locale";
import useDebounce, { searchDelay } from "../../../../hooks/useDebounce";
import { getUserByBarCode } from "../../../../_apis/user.api";
import { EntityResponse } from "../../../../interfaces/entityResponse";
import { User } from "../../../../interfaces/user";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TPublications } from "../../../../types/models/publications.type";
import { positions } from "@mui/system";
import publicationsService from "../../../../_apis/services/publications.service";
import useDebounceArray from "../../../../hooks/useDebounceArray";
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import PrintLoanSlip from "./PrintLoanSlip";
import { useReactToPrint } from "react-to-print";

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

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}



type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TLoanSlipCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TLoanSlipCreate;
    loanSlip?: TLoanSlip;
    isEditMode?: boolean;

};

const schema = yup.object().shape({
    note: yup
        .string()
});

const FormAddEditLoanSlip: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        note: "",
        borrowedDay: "",
        returnDay: "",
        userId: "",
        isPrint: false,
        receiptDate: '',
        status: 'đang xử lý',
    },
    isFetching = false,
    isEditMode = false,
    loanSlip,
}) => {
    const formik = useFormik<TLoanSlipCreate>({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            const filteredPublications = publications.filter(
                (publication) => publication.publicationId !== ''
            );
            if (onSubmit) {
                const createLoanSlip: TLoanSlipCreate = {
                    note: values.note,
                    userId: userData?.data?.result._id,
                    borrowedDay: borrowedDay.toDateString(),
                    returnDay: returnDay.toDateString(),
                    isPrint: false,
                    receiptDate: new Date().toDateString(),
                    status: 'đang xử lý',
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
    const debouncedBarCodeUserId = useDebounce(barcodeUserId, 500);

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
            console.log(loanSlip.borrowedDay);
            setReturnDay(new Date(loanSlip.returnDay));
            let editPublications: CreatePublication[] = [];
            // Giả sử loanSlip.publications là mảng chứa các đối tượng cần đẩy vào
            loanSlip.publications.forEach((publication) => {
                const newPublication: CreatePublication = {
                    publicationId: publication.publicationId,
                    name: publication.name,
                    quantityLoan: publication.quantityLoan,
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
        const updatedPublications = [...publications];
        updatedPublications[index].barcode = newBarCode;
        setSearchBarCode(newBarCode + ' ' + index);
        setPublications(updatedPublications);
    };
    // Use custom hook to debounce array of barcodes
    const debouncedBarcode = useDebounce(searchBarCode, 500);
    console.log(publications);

    useEffect(() => {
        if (debouncedBarcode) {
            const fetchPublicationByBarCode = async () => {
                try {
                    const barcode = debouncedBarcode.split(' ')[0];
                    const index = Number(debouncedBarcode.split(' ')[1]);
                    const result = await publicationsService.getByBarcode<TPublications>(barcode);
                    const publicationData = result.data.result; // Assuming result.data.result contains the publication info
                    if (publicationData) {
                        setPublications((prevPublications) => {
                            // Check if the barcode already exists in the publications state
                            const existingPublication = prevPublications.find(
                                (pub) => pub.publicationId === publicationData._id
                            );
                            console.log('id', publicationData._id);
                            console.log('list', prevPublications);

                            if (existingPublication) {
                                // If it exists, update the quantityLoan
                                let newPublications = [...publications];
                                newPublications[index] = {
                                    ...newPublications[index],
                                    name: '', // Set name to empty string
                                    barcode: '' // Set name to empty string
                                };
                                newPublications = newPublications.map((pub) =>
                                    pub.publicationId === publicationData._id
                                        ? { ...pub, quantityLoan: pub.quantityLoan + 1 } // Increment the quantityLoan
                                        : pub
                                );
                                return newPublications
                            } else {
                                let newPublications = [...publications];
                                newPublications = newPublications.map((pub) =>
                                    pub.barcode === publicationData.barcode
                                        ? { name: publicationData.name, publicationId: publicationData._id, quantityLoan: 1, position: '', barcode: publicationData.barcode, quantity: publicationData.quantity, shelvesQuantity: publicationData.shelvesQuantity } // Increment the quantityLoan
                                        : pub
                                );
                                newPublications.push({
                                    name: '',
                                    publicationId: '',
                                    position: '',
                                    quantityLoan: 1,
                                    quantity: 0,
                                    shelvesQuantity: 0,
                                    barcode: '',
                                },)
                                return newPublications;
                            }
                        });
                    }
                    setSearchBarCode('');
                } catch (error) {
                    console.error('Error fetching publication data:', error);
                }
            };

            fetchPublicationByBarCode();
        }
    }, [debouncedBarcode]);
    console.log(publications);

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
        updatedPublications.splice(index, 1); // Xóa phần tử tại vị trí index
        setPublications(updatedPublications); // Cập nhật lại state
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
    });
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
                    {isEditMode ? "Sửa phiếu mượn" : "Thêm phiếu mượn mới"}
                </DialogTitle>

                <DialogContent sx={{ p: 8 }} >
                    <Grid container spacing={2}>
                        <Box sx={{ display: 'none' }}>
                            {
                                loanSlip && <PrintLoanSlip ref={componentRef} loanSlip={loanSlip} />
                            }
                        </Box>
                        <Grid item xs={12}>
                            <Box >
                                <Chip
                                    color='primary'
                                    label="Thông tin người dùng"
                                    variant="filled"
                                />
                            </Box>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <Box style={{ width: "100%" }} sx={{ mt: 2, mb: 2, ml: 2 }}>
                                    <TextField
                                        variant="outlined"
                                        fullWidth
                                        id="barcodeUserId"
                                        name="barcodeUserId"
                                        placeholder="Nhập barcode người dùng"
                                        value={barcodeUserId}
                                        onChange={(e) => setbarcodeUserId(e.target.value)}
                                        inputRef={barcodeUserIdRef}
                                        autoFocus
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ ml: 4, mt: 2, fontWeight: "bold" }}>
                                    Họ và tên:
                                    <span style={{ fontWeight: "normal", marginLeft: '4px' }}>
                                        {userData?.data?.result?.fullname || "Không có dữ liệu"}
                                    </span>
                                </Typography>
                                <Typography sx={{ ml: 4, mt: 2, fontWeight: "bold" }}>
                                    Địa chỉ:
                                    <span style={{ fontWeight: "normal", marginLeft: '4px' }}>
                                        {userData?.data?.result?.address || "Không có dữ liệu"}
                                    </span>
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ ml: 2, mt: 2, fontWeight: "bold" }}>
                                    Số điện thoại:
                                    <span style={{ fontWeight: "normal", marginLeft: '4px' }}>
                                        {userData?.data?.result?.phoneNumber || "Không có dữ liệu"}
                                    </span>
                                </Typography>
                                <Typography sx={{ ml: 2, mt: 2, fontWeight: "bold" }}>
                                    Giới tính:
                                    <span style={{ fontWeight: "normal", marginLeft: '4px' }}>
                                        {userData?.data?.result?.gender || "Không có dữ liệu"}
                                    </span>
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ ml: 2, mt: 2, fontWeight: "bold" }}>
                                    Email:
                                    <span style={{ fontWeight: "normal", marginLeft: '4px' }}>
                                        {userData?.data?.result?.email || "Không có dữ liệu"}
                                    </span>
                                </Typography>
                                <Typography sx={{ ml: 2, mt: 2, fontWeight: "bold" }}>
                                    Vai trò:
                                    <span style={{ fontWeight: "normal", marginLeft: '4px' }}>
                                        {userData?.data?.result?.roleId?.name || "Không có dữ liệu"}
                                    </span>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Chip
                                color='primary'
                                label="Thông tin mượn - trả"
                                variant="filled"
                            />

                            <Form autoComplete="none" noValidate onSubmit={handleSubmit}>


                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box style={{ width: "100%" }} sx={{ mt: 2 }}>
                                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                Ngày mượn  <span className="required_text">(*)</span>{" "}
                                            </Typography>
                                            <DatePicker
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
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box style={{ width: "100%" }} sx={{ mt: 2 }}>
                                            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                Ngày trả  <span className="required_text">(*)</span>{" "}
                                            </Typography>
                                            <DatePicker
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
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>


                            </Form>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                                <Chip
                                    color='primary'
                                    label="Thông tin sách"
                                    variant="filled"
                                />
                                <IconCirclePlusFilled
                                    style={{ cursor: 'pointer', marginLeft: '10px' }} // Khoảng cách giữa Chip và Icon
                                    onClick={() => handleAddPublication()} // Gọi hàm thêm
                                    color="green"
                                    size={30}
                                    stroke={1.5}
                                />
                            </Box>
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

                                            <StyledTableCell align="center" width='15%'>Số lượng</StyledTableCell>
                                            <StyledTableCell align="center" width='15%'>Vị trí</StyledTableCell>
                                            <StyledTableCell align="center" width='15%'>Hành động</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {publications?.map((row, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell align="left">
                                                    <Box style={{ width: "100%" }} >
                                                        {
                                                            row.publicationId !== '' ? <>{row.barcode}</> : <>   <TextField
                                                                variant="outlined"
                                                                fullWidth
                                                                placeholder="Nhập barcode sách"
                                                                value={row.barcode}
                                                                onChange={(e) => handleBarCodeChange(index, e.target.value)}
                                                                inputRef={index === publications.length - 1 ? lastInputRef : null} // Focus on the last input
                                                            /></>
                                                        }

                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    {row.name || "Không có dữ liệu"}
                                                </StyledTableCell>
                                                {
                                                    isEditMode === false && <> <StyledTableCell align="left">
                                                        {row.quantity}
                                                    </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            {row.shelvesQuantity}
                                                        </StyledTableCell></>
                                                }

                                                <StyledTableCell align="center">
                                                    <Box style={{ width: "100%" }}>
                                                        <TextField
                                                            variant="outlined"
                                                            fullWidth
                                                            placeholder="Số lượng"
                                                            value={row.quantityLoan}
                                                            onChange={(e) => {
                                                                const updatedPublications = [...publications];
                                                                updatedPublications[index].quantityLoan = Number(e.target.value);
                                                                setPublications(updatedPublications);
                                                            }}
                                                        />
                                                    </Box>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <FormControl fullWidth>
                                                        <Select
                                                            value={row.position || 'trên kệ'} // Default value is "trên kệ"
                                                            onChange={(e) => {
                                                                const updatedPublications = [...publications];
                                                                updatedPublications[index].position = e.target.value; // Update the position field
                                                                setPublications(updatedPublications);
                                                            }}
                                                        >
                                                            <MenuItem value="trong kho">Trong kho</MenuItem>
                                                            <MenuItem value="trên kệ">Trên kệ</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </StyledTableCell>
                                                <StyledTableCell align="center">
                                                    <IconTrash
                                                        style={{ cursor: 'pointer', color: 'red' }}
                                                        onClick={() => handleRemovePublication(index)} // Gọi hàm xóa
                                                        color="red"
                                                        size={20}
                                                        stroke={1.5}
                                                    />
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
                </DialogContent>

                <DialogActions sx={{ p: 4 }}>
                    <Button disabled={isFetching} onClick={onClose} color="error">
                        Huỷ
                    </Button>
                    {

                        isEditMode &&  <Button onClick={handlePrint} style={{ background: '#07624e', color: 'white' }} variant="contained"  >
                            Trả sách
                        </Button>
                    }
                    {

                        isEditMode && <Button onClick={handlePrint} style={{ background: '#212121', color: 'white' }} variant="contained"  >
                            In
                        </Button>
                    }
                    <Button
                        disabled={isFetching}
                        onClick={handleSubmit as () => void}
                        variant="contained"
                        color="primary"
                    >
                        {isFetching ? "Đang thêm..." : isEditMode ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </DialogActions>
            </Dialog>
        </FormikProvider>
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