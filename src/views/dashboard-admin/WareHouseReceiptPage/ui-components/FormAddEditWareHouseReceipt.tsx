import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, Grid, IconButton, MenuItem, Paper, Select, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Box } from "@mui/system";
import { IconPlus, IconTrash } from "@tabler/icons";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import * as yup from "yup";
import publicationsService from "../../../../_apis/services/publications.service";
import { StyledTableCell, StyledTableRow } from "../../../../components/custom/table-list/style";
import StyledButton from "../../../../components/default/button/StyledButton";
import { useFetchAuthor } from "../../../../hooks/services/author/author-query";
import { useFetchCategory } from "../../../../hooks/services/category/category-query";
import { useFetchMaterial } from "../../../../hooks/services/material/material-query";
import { useAddPublications, useEditPublications } from "../../../../hooks/services/publications/publications-mutation";
import { useReFetchPublications } from "../../../../hooks/services/publications/publications-query";
import { useFetchPublisher } from "../../../../hooks/services/publisher/publisher-query";
import { useAddSupplier } from '../../../../hooks/services/supplier/supplier-mutation';
import { useFetchSupplier, useReFetchSupplier } from "../../../../hooks/services/supplier/supplier-query";
import useDebounce from "../../../../hooks/useDebounce";
import { TPublications, TPublicationsCreate } from "../../../../types/models/publications.type";
import { TSupplierCreate } from '../../../../types/models/supplier.type';
import { CreatePublicationWareHouseReceipt, TWareHouseReceipt, TWareHouseReceiptCreate } from "../../../../types/models/warehouse-receipt";
import FormAddEditPublications from "../../PublicationsPage/ui-components/FormAddEditPublications";
import FormAddEditSupplier from './FormAddEditSupplier';
import PrintWareHouseReceipt from "./PrintWareHouseReceipt";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TWareHouseReceiptCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TWareHouseReceiptCreate;
    isEditMode?: boolean;
    wareHouseReceipt: TWareHouseReceipt

};

const schema = yup.object().shape({
    supplierId: yup
        .string()
        .required("Vui lòng chọn nhà cung cấp").notOneOf(['0'], "Vui lòng chọn nhà cung cấp"),
});

const FormAddEditWareHouseReceipt: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        note: "",
        supplierId: "0"
    },
    isFetching = false,
    isEditMode = false,
    wareHouseReceipt
}) => {
    const formik = useFormik<TWareHouseReceiptCreate>({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            const filteredPublications = publications.filter(
                (publication) => publication.publicationId !== ''
            );
            if (onSubmit) {
                const createLoanSlip: TWareHouseReceiptCreate = {
                    note: values.note,
                    supplierId: values.supplierId,
                    publications: filteredPublications,
                }
                onSubmit(createLoanSlip, resetForm);
            }
        },
    });
    const [searchBarCode, setSearchBarCode] = useState<string>('');
    const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = useMemo(
        () => formik,
        [formik]
    );
    const [selectedEdit, setSelectedEdit] = useState<TPublications | null>(null);
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const { data: categoryData } = useFetchCategory();
    const { data: materialData } = useFetchMaterial();
    const { data: authorData } = useFetchAuthor();
    const { data: publisherData } = useFetchPublisher();
    const { data, isLoading } = useFetchSupplier();
    const revalidate = useReFetchPublications();
    const revalidateSupplier = useReFetchSupplier();
    const [openAdd, setOpenAdd] = useState(false);

    const [publications, setPublications] = useState<CreatePublicationWareHouseReceipt[]>([
        {
            publicationId: '',
            quantityWareHouse: 0,
            name: '',
            barcode: ''
        },
    ]);
    const mutationAdd = useAddPublications();
    const mutationEdit = useEditPublications();
    const mutationAddSupplier = useAddSupplier();
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
                                    barcode: '' // Set name to empty string
                                };
                                newPublications = newPublications.map((pub) =>
                                    pub.publicationId === publicationData._id
                                        ? { ...pub, quantityWareHouse: pub.quantityWareHouse + 1 } // Increment the quantityLoan
                                        : pub
                                );
                                return newPublications
                            } else {
                                let newPublications = [...publications];
                                newPublications = newPublications.map((pub) =>
                                    pub.barcode === publicationData.barcode
                                        ? { name: publicationData.name, publicationId: publicationData._id, quantityWareHouse: 1, barcode: publicationData.barcode } // Increment the quantityLoan
                                        : pub
                                );
                                newPublications.push({
                                    name: '',
                                    publicationId: '',
                                    quantityWareHouse: 1,
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
        const newPublication: CreatePublicationWareHouseReceipt = {
            name: '',
            publicationId: '',
            quantityWareHouse: 1,
            barcode: '',
        };
        setPublications([...publications, newPublication]); // Thêm phần tử mới vào danh sách
    };
    const handleBarCodeChange = (index: number, newBarCode: string) => {
        const updatedPublications = [...publications];
        updatedPublications[index].barcode = newBarCode;
        setSearchBarCode(newBarCode + ' ' + index);
        setPublications(updatedPublications);
    };
    const addLoanSlip = () => {
        setOpenAddEdit(true);
    };
    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
        setOpenAdd(false);
    };
    const initialValuePublications = useMemo((): TPublicationsCreate => {
        if (selectedEdit) {
            console.log(selectedEdit);

            return {
                name: selectedEdit.name,
                barcode: selectedEdit.barcode,
                description: selectedEdit.description,
                quantity: selectedEdit.quantity,
                shelvesQuantity: selectedEdit.shelvesQuantity,
                status: selectedEdit.status,
                type: selectedEdit.type,
                isPublic: selectedEdit.isPublic,
                isLink: selectedEdit.isLink,
                file: selectedEdit.file || "",
                categoryIds: selectedEdit.categoryIds || [],
                authorIds: selectedEdit.authorIds || [],
                shelvesId: (selectedEdit.shelvesId as string) || null,
                publisherIds: selectedEdit.publisherIds || [],
                materialIds: selectedEdit.materialIds || [],
            };
        }

        return {
            name: "",
            barcode: "",
            description: "",
            quantity: 0,
            shelvesQuantity: 0,
            status: "không có sẵn",
            type: "ấn phẩm cứng",
            isPublic: false,
            isLink: false,
            file: "",
            categoryIds: [],
            authorIds: [],
            publisherIds: [],
            materialIds: [],
        };
    }, [selectedEdit]);
    const handleSubmitPublication = (values: TPublicationsCreate) => {
        const payload = {
            ...values,
            categoryIds: values.categoryIds.map((t: any) => t?._id),
            materialIds: values.materialIds.map((t: any) => t?._id),
            authorIds: values.authorIds.map((t: any) => t?._id),
            publisherIds: values.publisherIds.map((t: any) => t?._id),
        };

        if (selectedEdit) {
            console.log(selectedEdit);

            mutationEdit.mutate(
                { ...payload, _id: selectedEdit._id },
                {
                    onSuccess: () => {
                        revalidate();
                        toast.success("Chỉnh sửa thành công.");
                        handleClose();
                    },
                }
            );

            return;
        }

        mutationAdd.mutate(payload, {
            onSuccess: (data) => {
                revalidate();
                if (data.statusCode === 201) {
                    let newPublications = [...publications]
                    // alert(21)
                    newPublications.push({
                        name: data.data.name,
                        publicationId: data.data._id,
                        quantityWareHouse: 1,
                        barcode: data.data.barcode,
                    },)
                    setPublications(newPublications);
                }
                toast.success("Thêm thành công.");
                setOpenAddEdit(false);
            },
        });
    };
    useEffect(() => {
        if (wareHouseReceipt) {
            let editPublications: CreatePublicationWareHouseReceipt[] = [];
            // Giả sử loanSlip.publications là mảng chứa các đối tượng cần đẩy vào
            wareHouseReceipt.publications.forEach((publication) => {
                const newPublication: CreatePublicationWareHouseReceipt = {
                    publicationId: publication._id,
                    name: publication.name,
                    quantityWareHouse: publication.quantityWareHouse,
                    barcode: publication.barcode,
                };
                // Đẩy object vào mảng editPublications
                editPublications.push(newPublication);
            });
            setPublications(editPublications);

        }
    }, [wareHouseReceipt])
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: `
            @page {
                margin: 10mm; /* Thiết lập margin */
                size: A4; /* Thiết lập kích thước */
            }
            body {
                margin: 0; /* Đảm bảo không có margin thừa */
            }
        `,
    });

    const handleAddSupplier = () => {
        setOpenAdd(true);
    };

    const handleSubmitSupplier = (values: TSupplierCreate) => {
        mutationAddSupplier.mutate(values, {
            onSuccess: (data) => {
                revalidateSupplier();
                toast.success("Thêm thành công.");
                setOpenAdd(false);
            },
            onError: (error) => {
                toast.error("Thêm thất bại: " + error.message);
            },
        });
        return;
    };
    const initialValuesSupplier = useMemo((): TSupplierCreate => {
        return {
            name: "",
            phoneNumber: "",
            email: "",
            address: "",
            note: "",
        };
    }, []);

    return (
        <>

            {openAdd && (
                <FormAddEditSupplier
                    open={openAdd}
                    onClose={handleClose}
                    initialValues={initialValuesSupplier}
                    onSubmit={handleSubmitSupplier}
                    isEditMode={false}
                />
            )}

            <FormikProvider value={formik}>
                <Dialog
                    maxWidth="lg"
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
                        {isEditMode ? "Sửa thông tin phiếu nhập kho" : "Thêm thông tin phiếu nhập kho mới"}
                    </DialogTitle>
                    {openAddEdit && (
                        <FormAddEditPublications
                            open={openAddEdit}
                            onClose={handleClose}
                            initialValues={initialValuePublications}
                            onSubmit={handleSubmitPublication}
                            isEditMode={selectedEdit ? true : false}
                            cateOptions={categoryData?.data?.result || []}
                            authorOptions={authorData?.data?.result || []}
                            materialOptions={materialData?.data?.result || []}
                            publisherOptions={publisherData?.data?.result || []}
                            imageUrl={
                                selectedEdit?.priviewImage
                                    ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${selectedEdit.priviewImage}`
                                    : selectedEdit?.path
                                        ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${selectedEdit.path}`
                                        : ""
                            }
                        />
                    )}
                    <DialogContent sx={{ p: 8 }}>
                        <Box sx={{ display: 'none' }}>
                            {
                                wareHouseReceipt && <PrintWareHouseReceipt ref={componentRef} wareHouseReceipt={wareHouseReceipt} />
                            }
                        </Box>
                        <Form autoComplete="none" noValidate onSubmit={handleSubmit}>

                            <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <Typography sx={{ display: 'flex', alignItems: 'center', mb: 0, fontWeight: "bold" }}>
                                        <span style={{ marginRight: '8px' }}>Nhà cung cấp</span>
                                        <span className="required_text">(*)</span>
                                    </Typography>
                                    <Tooltip title="Thêm mới" arrow placement="top" >
                                        <IconCirclePlusFilled
                                            style={{ cursor: 'pointer', marginLeft: '10px', marginRight: '10px' }}
                                            onClick={handleAddSupplier}
                                            color="green"
                                            size={30}
                                            stroke={1.5}
                                        />
                                    </Tooltip>
                                </Box>
                                <FormControl fullWidth>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="supplierId"
                                        name="supplierId"
                                        type="supplierId"
                                        value={formik.values.supplierId}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={
                                            formik.touched.supplierId &&
                                            Boolean(formik.errors.supplierId)
                                        }
                                    >
                                        <MenuItem value='0' disabled>
                                            Chọn nhà cung cấp
                                        </MenuItem>
                                        {data?.data?.result?.length > 0 ? (
                                            data.data.result.map((item, index) => (
                                                <MenuItem key={index} value={item._id}>
                                                    {item.name}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem value="0" disabled>
                                                Chọn nhà cung cấp
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                                {formik.touched.supplierId &&
                                    Boolean(formik.errors.supplierId) && (
                                        <FormHelperText className="required_text">
                                            {" "}
                                            {formik.errors.supplierId
                                                ? formik.errors.supplierId.toString()
                                                : ""}
                                        </FormHelperText>
                                    )}
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
                                        <Chip
                                            color='primary'
                                            label="Thông tin sách"
                                            variant="filled"
                                            sx={{ marginRight: '10px', }}
                                        />
                                        <StyledButton
                                            color="primary"
                                            size="small"
                                            type="button"
                                            startIcon={<IconPlus stroke={2} />}
                                            variant="contained"
                                            onClick={addLoanSlip}
                                        >
                                            Thêm ấn phẩm mới
                                        </StyledButton>
                                        <IconCirclePlusFilled
                                            style={{ cursor: 'pointer', marginLeft: '10px', marginRight: '10px' }} // Khoảng cách giữa Chip và Icon
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
                                                    <StyledTableCell align="center" width='15%'>Số lượng</StyledTableCell>
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

                                                        <StyledTableCell align="center">
                                                            <Box style={{ width: "100%" }}>
                                                                <TextField
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    placeholder="Số lượng"
                                                                    value={row.quantityWareHouse}
                                                                    onChange={(e) => {
                                                                        const updatedPublications = [...publications];
                                                                        updatedPublications[index].quantityWareHouse = Number(e.target.value);
                                                                        setPublications(updatedPublications);
                                                                    }}
                                                                />
                                                            </Box>
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
                        </Form>

                    </DialogContent>

                    <DialogActions sx={{ p: 4 }}>
                        <Button disabled={isFetching} onClick={onClose} color="error">
                            Huỷ
                        </Button>
                        {

                            isEditMode && <Button onClick={() => handlePrint()} style={{ background: '#212121', color: 'white' }} variant="contained"  >
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
        </>
    );
};

export default FormAddEditWareHouseReceipt;
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