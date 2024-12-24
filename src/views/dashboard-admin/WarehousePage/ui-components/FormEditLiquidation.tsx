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
import { getAllAssets } from "../../../../_apis/asset.api";
import { StyledTableCell, StyledTableRow } from "../../../../components/custom/table-list/style";
import StyledButton from "../../../../components/default/button/StyledButton";
import {
    useAddAsset,
    useEditAsset,
    useReFetchAsset,
} from "../../../../hooks/react-query/assetData";
import { useAddSupplier } from "../../../../hooks/services/supplier/supplier-mutation";
import {
    useFetchSupplier,
    useReFetchSupplier,
} from "../../../../hooks/services/supplier/supplier-query";
import useDebounce from "../../../../hooks/useDebounce";
import { Asset, CreateAssetModel, UpdateAssetModel } from "../../../../interfaces/asset";
import { TSupplierCreate } from "../../../../types/models/supplier.type";
import {
    CreateAssetsWareHouseReceipt,
    TWareHouseAssetsReceipt,
    TWareHouseAssetsReceiptCreate,
} from "../../../../types/models/warehouse-assets-receipt";
import usePermission from "../../../../utils/hasPermission";
import FormAddEditAsset from "../../AssetPage/ui-components/FormAddEditAsset";
import { TLiquidationCreate } from "../../../../types/models/liquidation.type";
import SelectForm from "../../../../components/custom/form/SelectForm";
import { typeLiquidationOptions } from "../../../../utils/constants.utils";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TLiquidationCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TLiquidationCreate;
    isEditMode?: boolean;
};

const schema = yup.object().shape({
    supplierId: yup
        .string()
});

const FormEditLiquidation: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        note: "",
        reason: "",
        status: "",

    },
    isFetching = false,
    isEditMode = false,
}) => {
    const [assets, setAssets] = useState<CreateAssetsWareHouseReceipt[]>([
        {
            assetId: "",
            quantity: 0,
            name: "",
            price: 0,
        },
    ]);

    const formik = useFormik<TLiquidationCreate>({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            if (onSubmit) {
                onSubmit(values, resetForm);
            }
        },
    });
    const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = useMemo(
        () => formik,
        [formik]
    );

    const [assetsOptions, setAssetsOptions] = useState<Asset[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [loadingSearching, setLoadingSearching] = useState(false);
    const [valueSearch, setValueSearch] = useState<string>("");

    const valueSearchDebounce = useDebounce(valueSearch, 500);

    useEffect(() => {
        if (!valueSearchDebounce) return;

        console.log(`searching...`, valueSearchDebounce);

        const fetchSearchingData = async () => {
            try {
                setLoadingSearching(true);

                const response = await getAllAssets(undefined, undefined, valueSearchDebounce);

                if (!response.data || response?.data?.result?.length === 0) {
                    setAssetsOptions([]);
                    return;
                }

                setAssetsOptions(response.data.result);
            } catch (error) {
                console.error("Error fetching publication data:", error);
            } finally {
                setLoadingSearching(false);
            }
        };

        fetchSearchingData();
    }, [valueSearchDebounce]);

    const handleRemoveAsset = (index: number) => {
        const updatedAssets = [...assets];
        updatedAssets.splice(index, 1);
        setAssets(updatedAssets);
    };

    const handleAddAsset = () => {
        const newAsset: CreateAssetsWareHouseReceipt = {
            name: "",
            assetId: "",
            quantity: 1,
            price: 0,
        };
        setAssets([...assets, newAsset]);
    };

    const componentRef = useRef();

    const handleSelectAssetOption = (value: Asset | null, index: number) => {
        // clone assets => prevAssets
        const prevAssets = [...assets];
        if (!value) return;

        const existingIndex = prevAssets.findIndex((pub) => pub.assetId === value._id);

        if (existingIndex !== -1) {
            prevAssets[existingIndex].quantity += 1;
        } else {
            const newValue: CreateAssetsWareHouseReceipt = {
                name: value.name,
                assetId: value._id,
                quantity: 1,
                price: 0,
            };

            prevAssets[index] = newValue;

            // Chỉ thêm một mục mới trống nếu không có mục nào khác đang chờ
            if (index === prevAssets.length - 1) {
                prevAssets.push({
                    name: "",
                    assetId: "",
                    quantity: 1,
                    price: 0,
                });
            }
        }

        setAssets(prevAssets);
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

    const handleTypeLiquidationChange = (e) => {
        const selectedTypeLiquidation = e.target.value;
        setFieldValue("type", selectedTypeLiquidation);
    };


    return (
        <>

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
                    <DialogContent sx={{ p: { xs: 3, sm: 3, md: 8 } }}>

                        <Form autoComplete="none" noValidate onSubmit={handleSubmit}>

                            <Grid container spacing={2} sx={{ mt: { xs: 0, sm: 0, md: 0.5 } }}>
                                <Grid item xs={12} md={2}>
                                    <StyledButton
                                        size="small"
                                        startIcon={<IconCirclePlusFilled stroke={2} />}
                                        variant="contained"
                                        onClick={() => handleAddAsset()}
                                        sx={{ background: "green", color: "white" }}
                                    >
                                        Thêm thông tin thanh lý
                                    </StyledButton>
                                </Grid>
                                <Grid item xs={12}>
                                    <TableContainer
                                        component={Paper}
                                        sx={{ mt: { xs: 0, sm: 0, md: 1 } }}
                                    >
                                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell align="left" width="20%">
                                                        Phân loại
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left" width="40%">
                                                        Thông tin thanh lý
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center" width="15%">
                                                        Số lượng
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center" width="15%">
                                                        Giá thanh lý
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center" width="15%">
                                                        Tổng giá
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
                                                                <SelectForm
                                                                    options={typeLiquidationOptions}
                                                                    {...getFieldProps("type")}
                                                                    onChange={handleTypeLiquidationChange}
                                                                    sx={{ mt: 0, mb: "11px" }}
                                                                // error={touched.type && Boolean(errors.type)}
                                                                //     helperText={touched.type && errors.type}
                                                                />
                                                            </Box>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            <Box style={{ width: "100%" }}>
                                                                {row.assetId !== "" ? (
                                                                    <>{row.name}</>
                                                                ) : (
                                                                    <Autocomplete
                                                                        getOptionLabel={(option) =>
                                                                            option?.name
                                                                        }
                                                                        loading={loadingSearching}
                                                                        onChange={(event, value) =>
                                                                            handleSelectAssetOption(
                                                                                value,
                                                                                index
                                                                            )
                                                                        }
                                                                        options={assetsOptions}
                                                                        disablePortal
                                                                        value={selectedAsset}
                                                                        onInputChange={(
                                                                            event,
                                                                            newInputValue,
                                                                            reason
                                                                        ) => {
                                                                            setValueSearch(
                                                                                newInputValue
                                                                            );

                                                                            if (
                                                                                reason === "reset"
                                                                            ) {
                                                                                setAssetsOptions(
                                                                                    []
                                                                                );
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
                                                                    value={row.quantity}
                                                                    onChange={(e) => {
                                                                        const updatedAssets = [
                                                                            ...assets,
                                                                        ];
                                                                        updatedAssets[
                                                                            index
                                                                        ].quantity =
                                                                            Number(e.target.value);
                                                                        setAssets(updatedAssets);
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
                                                            <Box style={{ width: "100%" }}>
                                                                <TextField
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    placeholder="Giá nhập"
                                                                    value={row.price}
                                                                    onChange={(e) => {
                                                                        const updatedAssets = [
                                                                            ...assets,
                                                                        ];
                                                                        updatedAssets[
                                                                            index
                                                                        ].price = Number(
                                                                            e.target.value
                                                                        );
                                                                        setAssets(updatedAssets);
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
                                                            <Box style={{ width: "100%" }}>
                                                                <TextField
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    placeholder="Tổng giá"
                                                                    value={
                                                                        row.price *
                                                                        row.quantity
                                                                    }
                                                                    InputProps={{ readOnly: true }}
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
                                            Lý do thanh lý
                                        </Typography>
                                        <TextareaAutosize
                                            id="reason"
                                            name="reason"
                                            value={formik.values.reason}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            minRows={4}
                                        />
                                        {formik.touched.reason && Boolean(formik.errors.reason) && (
                                            <FormHelperText className="required_text">
                                                {" "}
                                                {formik.errors.reason
                                                    ? formik.errors.reason.toString()
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

export default FormEditLiquidation;
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