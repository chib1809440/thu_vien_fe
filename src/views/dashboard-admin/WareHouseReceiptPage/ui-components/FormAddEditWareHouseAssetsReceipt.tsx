import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { IconPlus, IconTrash } from "@tabler/icons";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import * as yup from "yup";
import { StyledTableCell, StyledTableRow } from "../../../../components/custom/table-list/style";
import StyledButton from "../../../../components/default/button/StyledButton";
import { useAddAsset, useEditAsset, useReFetchAsset } from "../../../../hooks/react-query/assetData";
import { useAddSupplier } from "../../../../hooks/services/supplier/supplier-mutation";
import {
    useFetchSupplier,
    useReFetchSupplier,
} from "../../../../hooks/services/supplier/supplier-query";
import { Asset, CreateAssetModel, UpdateAssetModel } from "../../../../interfaces/asset";
import { TSupplierCreate } from "../../../../types/models/supplier.type";
import { CreateAssetsWareHouseReceipt, TWareHouseAssetsReceipt, TWareHouseAssetsReceiptCreate } from "../../../../types/models/warehouse-assets-receipt";
import usePermission from "../../../../utils/hasPermission";
import FormAddEditAsset from "../../AssetPage/ui-components/FormAddEditAsset";
import FormAddEditSupplier from "./FormAddEditSupplier";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TWareHouseAssetsReceiptCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TWareHouseAssetsReceiptCreate;
    isEditMode?: boolean;
    wareHouseAssetsReceipt: TWareHouseAssetsReceipt;
};

const schema = yup.object().shape({
    supplierId: yup
        .string()
        .required("Vui lòng chọn nhà cung cấp")
        .notOneOf(["0"], "Vui lòng chọn nhà cung cấp"),
});

const FormAddEditWareHouseAssetsReceipt: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        note: "",
        supplierId: "0",
    },
    isFetching = false,
    isEditMode = false,
    wareHouseAssetsReceipt,
}) => {
    const formik = useFormik<TWareHouseAssetsReceiptCreate>({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            const filteredAssets = assets.filter(
                (asset) => asset.assetId !== ""
            );
            if (onSubmit) {
                const createLoanSlip: TWareHouseAssetsReceiptCreate = {
                    note: values.note,
                    supplierId: values.supplierId,
                    assets: filteredAssets,
                };
                onSubmit(createLoanSlip, resetForm);
            }
        },
    });
    const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = useMemo(
        () => formik,
        [formik]
    );
    const [selectedEdit, setSelectedEdit] = useState<Asset | null>(null);
    const { data } = useFetchSupplier();
    const revalidate = useReFetchAsset();
    const revalidateSupplier = useReFetchSupplier();
    const [openAdd, setOpenAdd] = useState(false);
    const [openAddAsset, setOpenAddAsset] = useState(false);
    const { hasPermission } = usePermission();

    const [AssetsOptions, setAssetsOptions] = useState<CreateAssetModel[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<UpdateAssetModel | null>(null);
    const [loadingSearching, setLoadingSearching] = useState(false);
    const [valueSearch, setValueSearch] = useState<string>("");

    const handleAdd = () => {
        setOpenAddAsset(true);
    };

    const [assets, setAssets] = useState<CreateAssetsWareHouseReceipt[]>([
        {
            assetId: "",
            quantityWareHouse: 0,
            name: "",
        },
    ]);
    const mutationAdd = useAddAsset();
    const mutationEdit = useEditAsset();
    const mutationAddSupplier = useAddSupplier();

    const handleRemoveAsset = (index: number) => {
        const updatedAssets = [...assets];
        updatedAssets.splice(index, 1);
        setAssets(updatedAssets);
    };

    // Hàm để thêm một phần tử mới vào danh sách publications
    const handleAddAsset = () => {
        const newAsset: CreateAssetsWareHouseReceipt = {
            name: "",
            assetId: "",
            quantityWareHouse: 1,
        };
        setAssets([...assets, newAsset]);
    };

    const handleClose = () => {
        setSelectedEdit(null);
        setOpenAdd(false);
        setOpenAddAsset(false);
    };

    const initialValueAssets = useMemo((): CreateAssetModel => {
        if (selectedEdit) {
            console.log(selectedEdit);

            return {
                name: selectedEdit.name,
                description: selectedEdit.description,
                note: selectedEdit.note,
                quantityTotal: selectedEdit.quantityTotal,
                quantityUsed: selectedEdit.quantityUsed,
                status: selectedEdit.status,
                quantityWarehouse: selectedEdit.quantityWarehouse,
                quantityDamage: selectedEdit.quantityDamage,
                quantityLiquidation: selectedEdit.quantityLiquidation,
                typeAssetId: (selectedEdit.typeAssetId as string) || null,
            };
        }

        return {
            name: "",
            note: "",
            description: "",
            quantityUsed: 0,
            quantityWarehouse: 0,
            quantityTotal: 0,
            quantityDamage: 0,
            quantityLiquidation: 0,
            status: "mới",
            typeAssetId: null
        };
    }, [selectedEdit]);

    const handleSubmitAsset = (values: UpdateAssetModel) => {

        if (selectedEdit) {
            console.log(selectedEdit);

            mutationEdit.mutate(
                { ...values, _id: selectedEdit._id },
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

        console.log(values);
        mutationAdd.mutate(values, {
            onSuccess: () => {
                revalidate();
                toast.success("Thêm thành công.");
                handleClose();
            },
        });
    };

    useEffect(() => {
        if (wareHouseAssetsReceipt) {
            let editAssets: CreateAssetsWareHouseReceipt[] = [];
            // Giả sử loanSlip.publications là mảng chứa các đối tượng cần đẩy vào
            wareHouseAssetsReceipt.assets.forEach((asset) => {
                const newAsset: CreateAssetsWareHouseReceipt = {
                    assetId: asset._id,
                    name: asset.name,
                    quantityWareHouse: asset.quantityWareHouse,
                };
                // Đẩy object vào mảng editAssets
                editAssets.push(newAsset);
            });
            setAssets(editAssets);
        }
    }, [wareHouseAssetsReceipt]);
    const componentRef = useRef();

    const handleSelectAssetOption = (value: UpdateAssetModel | null, index: number) => {
        const updatedAssets = [...assets];
        if (!value) return;

        const existingIndex = updatedAssets.findIndex(
            (pub) => pub.assetId === value._id
        );

        if (existingIndex !== -1) {
            updatedAssets[existingIndex].quantityWareHouse += 1;
        } else {
            const newValue: CreateAssetsWareHouseReceipt = {
                name: value.name,
                assetId: value._id,
                quantityWareHouse: 1,
            };

            updatedAssets[index] = newValue;

            // Chỉ thêm một mục mới trống nếu không có mục nào khác đang chờ
            if (index === updatedAssets.length - 1) {
                updatedAssets.push({
                    name: "",
                    assetId: "",
                    quantityWareHouse: 1,
                });
            }
        }

        setAssets(updatedAssets);
        setAssetsOptions([]);
        setSelectedAsset(null);
    };

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
                    <DialogTitle sx={{ p: { xs: 2, sm: 2, md: 4 } }}>
                        {isEditMode
                            ? "Sửa thông tin phiếu nhập tài sản"
                            : "Thêm thông tin phiếu nhập tài sản mới"}
                    </DialogTitle>
                    {openAddAsset && (
                        <FormAddEditAsset
                            open={openAddAsset}
                            onClose={handleClose}
                            initialValues={initialValueAssets}
                            onSubmit={handleSubmitAsset}
                        />
                    )}
                    <DialogContent sx={{ p: { xs: 3, sm: 3, md: 8 } }}>
                        {/* <Box sx={{ display: "none" }}>
                            {wareHouseAssetsReceipt && (
                                <PrintWareHouseAssetReceipt
                                    ref={componentRef}
                                    wareHouseAssetReceipt={wareHouseAssetsReceipt}
                                />
                            )}
                        </Box> */}
                        <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                            <Box style={{ width: "100%" }} sx={{ mb: 1.5 }}>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                    <Typography
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            mb: 0,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <span style={{ marginRight: "8px" }}>Nhà cung cấp</span>
                                        <span className="required_text">(*)</span>
                                    </Typography>
                                    {/* {hasPermission([
                                        { resource: "stockassets", action: "manage" },
                                        { resource: "stockassets", action: "create" },
                                    ]) && ( */}
                                    <Tooltip title="Thêm mới" arrow placement="top">
                                        <IconCirclePlusFilled
                                            style={{
                                                cursor: "pointer",
                                                marginLeft: "10px",
                                                marginRight: "10px",
                                            }}
                                            onClick={handleAddSupplier}
                                            color="green"
                                            size={30}
                                            stroke={1.5}
                                        />
                                    </Tooltip>
                                    {/* )} */}
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
                                        <MenuItem value="0" disabled>
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
                                {formik.touched.supplierId && Boolean(formik.errors.supplierId) && (
                                    <FormHelperText className="required_text">
                                        {" "}
                                        {formik.errors.supplierId
                                            ? formik.errors.supplierId.toString()
                                            : ""}
                                    </FormHelperText>
                                )}
                            </Box>
                            <Grid container spacing={2} sx={{ mt: { xs: 0, sm: 0, md: 0.5 } }}>
                                {/* <Grid item xs={12}> */}
                                {/* <Box sx={{ mt: { xs: 2, sm: 2, md: 4 }, display: 'flex', alignItems: 'center' }}> */}
                                <Grid item xs={12} md={2}>
                                    <StyledButton
                                        color="primary"
                                        size="small"
                                        variant="contained"
                                        disableHoverEffect
                                        sx={{ paddingTop: 1.3, paddingBottom: 1.3, marginRight: 2 }}
                                    >
                                        Thông tin tài sản
                                    </StyledButton>
                                </Grid>
                                <Grid item xs={8} md={2}>
                                    {hasPermission([
                                        { resource: "assets", action: "manage" },
                                        { resource: "assets", action: "create" },
                                    ]) && (
                                            <StyledButton
                                                color="primary"
                                                size="small"
                                                variant="contained"
                                                type="button"
                                                startIcon={<IconPlus stroke={2} size={20} />}
                                                onClick={handleAdd}
                                            >
                                                Thêm tài sản
                                            </StyledButton>
                                        )}
                                </Grid>
                                <Grid item xs={4} md={2}>
                                    <IconCirclePlusFilled
                                        style={{
                                            cursor: "pointer",
                                            marginLeft: "10px",
                                            marginRight: "10px",
                                        }} // Khoảng cách giữa Chip và Icon
                                        onClick={() => handleAddAsset()} // Gọi hàm thêm
                                        color="green"
                                        size={30}
                                        stroke={1.5}
                                    />
                                </Grid>
                                {/* </Box> */}
                                <Grid item xs={12}>
                                    <TableContainer
                                        component={Paper}
                                        sx={{ mt: { xs: 0, sm: 0, md: 1 } }}
                                    >
                                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell align="left" width="20%">
                                                        Mã tài sản
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left" width="40%">
                                                        Tên tài sản
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center" width="15%">
                                                        Số lượng
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center" width="15%">
                                                        Hành động
                                                    </StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {assets?.map((row, index) => (
                                                    <StyledTableRow key={index}>
                                                        <StyledTableCell align="left">
                                                            <Box style={{ width: "100%" }}>
                                                                {row.assetId !== "" ? (
                                                                    <>{row.assetId}</>
                                                                ) : "Chưa có dữ liệu"}
                                                            </Box>
                                                        </StyledTableCell>

                                                        <StyledTableCell align="left">
                                                            <Box style={{ width: "100%" }}>
                                                                {row.assetId !== "" ? (
                                                                    <>{row.name}</>
                                                                ) : (
                                                                    <Autocomplete
                                                                        getOptionLabel={(option) => option?.name}
                                                                        loading={loadingSearching}
                                                                        // onChange={(event, value) =>
                                                                        //     handleSelectAssetOption(value, index)
                                                                        // }
                                                                        options={AssetsOptions}
                                                                        disablePortal
                                                                        value={selectedAsset}
                                                                        onInputChange={(event, newInputValue, reason
                                                                        ) => {
                                                                            setValueSearch(newInputValue);

                                                                            if (
                                                                                reason === "reset"
                                                                            ) {
                                                                                setAssetsOptions([]);
                                                                                return;
                                                                            }
                                                                        }}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                            />
                                                                        )}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </StyledTableCell>

                                                        <StyledTableCell align="center">
                                                            <Box style={{ width: "100%" }}>
                                                                <TextField
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    placeholder="Số lượng"
                                                                    value={row.quantityWareHouse}
                                                                    onChange={(e) => {
                                                                        const updatedAssets =
                                                                            [...assets];
                                                                        updatedAssets[
                                                                            index
                                                                        ].quantityWareHouse =
                                                                            Number(e.target.value);
                                                                        setAssets(
                                                                            updatedAssets
                                                                        );
                                                                    }}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "Enter") {
                                                                            e.preventDefault(); // Ngăn hành động mặc định khi nhấn Enter
                                                                        }
                                                                    }}
                                                                />
                                                            </Box>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center">
                                                            <IconTrash
                                                                style={{
                                                                    cursor: "pointer",
                                                                    color: "red",
                                                                }}
                                                                onClick={() =>
                                                                    handleRemoveAsset(index)
                                                                } // Gọi hàm xóa
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
                                        {formik.touched.note && Boolean(formik.errors.note) && (
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
                            {/* </Grid> */}
                        </Form>
                    </DialogContent>

                    <DialogActions sx={{ p: 4 }}>
                        <Button disabled={isFetching} onClick={onClose} color="error">
                            Huỷ
                        </Button>
                        {isEditMode && (
                            <Button
                                onClick={() => handlePrint()}
                                style={{ background: "#212121", color: "white" }}
                                variant="contained"
                            >
                                In
                            </Button>
                        )}
                        <StyledButton
                            disableHoverEffect
                            color="primary"
                            size="small"
                            variant="contained"
                            onClick={handleSubmit as () => void}
                            sx={{ paddingTop: 1.3, paddingBottom: 1.3 }}
                        >
                            {isFetching
                                ? "Đang thực hiện..."
                                : isEditMode
                                    ? "Cập nhật"
                                    : "Thêm mới"}
                        </StyledButton>
                    </DialogActions>
                </Dialog>
            </FormikProvider>
        </>
    );
};

export default FormAddEditWareHouseAssetsReceipt;
const blue = {
    100: "#DAECFF",
    200: "#b6daff",
    400: "#3399FF",
    500: "#007FFF",
    600: "#0072E5",
    900: "#003A75",
};

const grey = {
    50: "#F3F6F9",
    100: "#E5EAF2",
    200: "#DAE2ED",
    300: "#C7D0DD",
    400: "#B0B8C4",
    500: "#9DA8B7",
    600: "#6B7A90",
    700: "#434D5B",
    800: "#303740",
    900: "#1C2025",
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
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === "dark" ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === "dark" ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);