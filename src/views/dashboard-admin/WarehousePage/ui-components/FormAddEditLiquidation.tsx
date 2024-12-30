import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    Grid,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { IconTrash } from "@tabler/icons";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { getAllAssets } from "../../../../_apis/asset.api";
import publicationsService from "../../../../_apis/services/publications.service";
import SelectForm from "../../../../components/custom/form/SelectForm";
import { StyledTableCell, StyledTableRow } from "../../../../components/custom/table-list/style";
import StyledButton from "../../../../components/default/button/StyledButton";
import useDebounce from "../../../../hooks/useDebounce";
import {
    CreateLiquidation,
    TLiquidation,
    TLiquidationDefaultWithType,
    TLiquidationType,
    TPosition
} from "../../../../types/models/liquidation.type";
import { TPublications } from "../../../../types/models/publications.type";
import { typeLiquidationOptions, typeLiquidationPosition } from "../../../../utils/constants.utils";
import { capitalizeFirstLetter } from "../../../../helpers/capitalizeFirstLetter";
import { toast } from "react-toastify";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: CreateLiquidation, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: CreateLiquidation;
    isEditMode?: boolean;
    liquidationRecord?: TLiquidation;
};

type TOptions = {
    quatity: number;
    quatityUsed: number;
    name: string;
    value: string;
};

const schema = yup.object().shape({
    reason: yup.string().required("Vui lòng nhập lý do thanh lý"),
});

const FormAddEditLiquidation: FC<Props> = ({
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
    liquidationRecord
}) => {
    const [selectedData, setSelectedData] = useState<TLiquidationDefaultWithType[]>([
        {
            itemId: "",
            quantityLiquidation: 0,
            priceLiquidation: 0,
            position: "trong kho",
            type: "Asset",
            name: "",
        },
    ]);

    const formik = useFormik<CreateLiquidation>({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            const filteredData = selectedData.filter((item) => item.itemId !== "" && item.priceLiquidation > 0);

            const hasInvalidPrice = selectedData.some(
                (item) => item.priceLiquidation === 0 && item.itemId !== ""
            );

            if (hasInvalidPrice) {
                toast.error("Vui lòng nhập giá thanh lý lớn hơn 0.");
                return;
            }

            if (filteredData?.length === 0) {
                toast.error("Không có giá trị để thanh lý! Vui lòng kiểm tra thông tin.")
                return;
            }
            const errorMessages = [];
            filteredData.forEach((item) => {
                const quantityLiquidation = item.quantityLiquidation || 0;
                const quantityUsed = item.quantityUsed || 0;
                const quantityWarehouse = item.quantityWarehouse || 0;
                const shelvesQuantity = item.shelvesQuantity || 0;
                const quantity = item.quantity || 0;

                if (item.type === "Asset") {
                    if (item.position === "trưng bày" && quantityLiquidation > quantityUsed) {
                        errorMessages.push(`Số lượng thanh lý cho tài sản "<strong>${item.name}</strong>" vượt quá số lượng trưng bày <strong>(${quantityUsed})</strong>`);
                    } else if (item.position === "trong kho" && quantityLiquidation > quantityWarehouse) {
                        errorMessages.push(`Số lượng thanh lý cho tài sản "<strong>${item.name}</strong>" vượt quá số lượng trong kho <strong>(${quantityWarehouse})</strong>`);
                    }
                } else if (item.type === "Publication") {
                    if (item.position === "trưng bày" && quantityLiquidation > shelvesQuantity) {
                        errorMessages.push(`Số lượng thanh lý cho ấn phẩm "<strong>${item.name}</strong>" vượt quá số lượng trưng bày <strong>(${shelvesQuantity})</strong>`);
                    } else if (item.position === "trong kho" && quantityLiquidation > quantity) {
                        errorMessages.push(`Số lượng thanh lý cho ấn phẩm "<strong>${item.name}</strong>" vượt quá số lượng trong kho <strong>(${quantity})</strong>`);
                    }
                }
            });

            // Nếu có lỗi, hiển thị tất cả lỗi
            if (errorMessages.length > 0) {
                const errorText = errorMessages.flat().map((msg, index) => `<strong>${index + 1}.</strong> ${capitalizeFirstLetter(msg)}`).join('<br /><br />');

                toast.error(<div dangerouslySetInnerHTML={{ __html: errorText }} />, {
                    autoClose: 5000,
                });
                return;
            }

            if (onSubmit) {
                const createLiqui: CreateLiquidation = {
                    note: values.note,
                    reason: values.reason,
                    liquidations: filteredData,
                };
                onSubmit(createLiqui, resetForm);
            }


        },
    });
    const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = useMemo(() => formik, [formik]);

    const [selectedType, setSelectedType] = useState<TLiquidationType>("Asset");
    const [selectedPosition, setSelectedPosition] = useState<TPosition>("trong kho");
    const [optionsAutocomplete, setOptionsAutocomplete] = useState<TOptions[]>([]);
    const [selectedOptAutocomplete, setSelectedOptAutocomplete] = useState<TOptions | null>(null);
    const [loadingSearching, setLoadingSearching] = useState(false);
    const [valueSearch, setValueSearch] = useState<string>("");

    const valueSearchDebounce = useDebounce(valueSearch, 500);

    useEffect(() => {
        if (!valueSearchDebounce) return;

        console.log(`searching...`, valueSearchDebounce);

        const fetchSearchingData = async () => {
            try {
                setLoadingSearching(true);

                let data: TOptions[] = [];

                if (selectedType === "Asset") {
                    // call api for asset
                    const response = await getAllAssets(undefined, undefined, valueSearchDebounce);
                    data = response?.data?.result?.filter((item) => item?.quantityTotal > 0)?.map((item) => ({
                        quatityUsed: item.quantityUsed,
                        quatity: item.quantityWarehouse,
                        name: item.name,
                        value: item._id,
                    }));
                } else {
                    // call api for publication
                    const response = await publicationsService.getAll<TPublications>({
                        search: valueSearchDebounce,
                    });
                    data = response?.data?.result?.filter((item) => item?.quantity > 0)?.map((item) => ({
                        quatityUsed: item.shelvesQuantity,
                        quatity: item.quantity,
                        name: item.name,
                        value: item._id,
                    }));
                }

                setOptionsAutocomplete(data);
                setValueSearch("");
            } catch (error) {
                console.error("Error fetching publication data:", error);
            } finally {
                setLoadingSearching(false);
            }
        };

        fetchSearchingData();
    }, [valueSearchDebounce]);

    const handleRemoveAsset = (index: number) => {
        setSelectedData((prev) => prev.filter((item, i) => i !== index));
    };

    const handleAddAsset = () => {
        const newAsset: TLiquidationDefaultWithType = {
            name: "",
            itemId: "",
            position: "trong kho",
            priceLiquidation: 0,
            quantityLiquidation: 0,
            type: "Asset",
        };

        setSelectedData((prev) => [...prev, newAsset]);
    };

    useEffect(() => {
        if (liquidationRecord) {
            let editLiquiData: TLiquidationDefaultWithType[] = [];
            liquidationRecord.liquidations.forEach((item) => {
                const newData: TLiquidationDefaultWithType = {
                    itemId: item?.itemId,
                    name: item?.name,
                    quantityLiquidation: item?.quantityLiquidation,
                    priceLiquidation: item?.priceLiquidation,
                    position: item?.position,
                    type: item?.type,
                    //SL trong kho của ấn phẩm
                    quantity: item?.quantity || 0,
                    // tong SL tai san
                    quantityTotal: item?.quantityTotal || 0,
                    quantityUsed: item?.quantityUsed || 0,
                    shelvesQuantity: item?.shelvesQuantity || 0,
                    //SL trong kho ts
                    quantityWarehouse: item?.quantityWarehouse || 0,
                    barcode: item?.barcode,
                };
                // Đẩy object vào mảng editLiquiData
                editLiquiData.push(newData);
            });
            setSelectedData(editLiquiData);
        }
    }, [liquidationRecord]);

    const handleSelectAssetOption = (value: TOptions | null, index: number) => {
        const prevSelectedData = [...selectedData];

        if (!value) return;

        const existingIndex = prevSelectedData.findIndex((pub) => pub.itemId === value.value);

        if (existingIndex !== -1) {
            prevSelectedData[existingIndex].quantityLiquidation += 1;
        } else {
            const newValue: TLiquidationDefaultWithType = {
                itemId: value.value,
                name: value.name,
                position: selectedPosition,
                priceLiquidation: 0,
                quantityLiquidation: 1,
                type: selectedType,
            };

            prevSelectedData[index] = newValue;

            // Chỉ thêm một mục mới trống nếu không có mục nào khác đang chờ
            if (index === prevSelectedData.length - 1) {
                prevSelectedData.push({
                    itemId: "",
                    quantityLiquidation: 0,
                    priceLiquidation: 0,
                    position: "trong kho",
                    type: "Asset",
                    name: "",
                });
            }
        }

        setSelectedData(prevSelectedData);
        setOptionsAutocomplete([]);
        setSelectedOptAutocomplete(null);
        setSelectedType("Asset");
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
                        {isEditMode ? "Sửa thông tin biên bản thanh lý" : "Tạo biên bản thanh lý"}
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
                                        type="button"
                                    >
                                        Thêm thông tin thanh lý
                                    </StyledButton>
                                </Grid>
                                <Grid item xs={12}>
                                    <TableContainer component={Paper} sx={{ mt: { xs: 0, sm: 0, md: 1 } }}>
                                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell align="left" width="20%">
                                                        Phân loại
                                                    </StyledTableCell>
                                                    <StyledTableCell align="left" width="30%">
                                                        Thông tin thanh lý
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center" width="10%">
                                                        Vị trí
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center" width="10%">
                                                        Số lượng
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center" width="10%">
                                                        Giá
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center" width="10%">
                                                        Tổng giá
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center" width="10%">
                                                        Hành động
                                                    </StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {selectedData?.map((row, index) => (
                                                    <StyledTableRow key={index}>
                                                        <StyledTableCell align="left">
                                                            <Box style={{ width: "100%" }}>
                                                                <SelectForm
                                                                    options={typeLiquidationOptions}
                                                                    value={row.type}
                                                                    onChange={(e) => {
                                                                        const newValue = e.target
                                                                            .value as TLiquidationType;

                                                                        setSelectedType(newValue);
                                                                        const updatedAssets = [...selectedData];

                                                                        updatedAssets[index].type = newValue;
                                                                        setSelectedData(updatedAssets);
                                                                    }}
                                                                    sx={{ mt: 0, mb: "11px" }}
                                                                />
                                                            </Box>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            <Box style={{ width: "100%" }}>
                                                                {row.itemId !== "" ? (
                                                                    <Box>
                                                                        {`${capitalizeFirstLetter(row.name)}`}
                                                                    </Box>

                                                                ) : (
                                                                    <Autocomplete
                                                                        getOptionLabel={(option) => { return `${option?.name} (SL trong kho: ${option.quatity} - SL trưng bày: ${option.quatityUsed})`; }}
                                                                        loading={loadingSearching}
                                                                        onChange={(event, value) =>
                                                                            handleSelectAssetOption(value, index)
                                                                        }
                                                                        options={optionsAutocomplete}
                                                                        disablePortal
                                                                        value={selectedOptAutocomplete}
                                                                        onInputChange={(
                                                                            event,
                                                                            newInputValue,
                                                                            reason
                                                                        ) => {
                                                                            setValueSearch(newInputValue);

                                                                            if (reason === "reset") {
                                                                                setOptionsAutocomplete([]);
                                                                                return;
                                                                            }
                                                                        }}
                                                                        renderInput={(params) => (
                                                                            <TextField {...params} />
                                                                        )}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="left">
                                                            <Box>
                                                                <SelectForm
                                                                    options={typeLiquidationPosition}
                                                                    value={row.position}
                                                                    onChange={(e) => {
                                                                        const newValue = e.target
                                                                            .value as TPosition;

                                                                        setSelectedPosition(newValue);
                                                                        const updatedAssets = [...selectedData];

                                                                        updatedAssets[index].position = newValue;
                                                                        setSelectedData(updatedAssets);
                                                                    }}
                                                                    sx={{ mt: 0, mb: "11px" }}
                                                                />
                                                            </Box>
                                                        </StyledTableCell>
                                                        <StyledTableCell align="center">
                                                            <Box style={{ width: "100%" }}>
                                                                <TextField
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    placeholder="Số lượng"
                                                                    value={row.quantityLiquidation}
                                                                    onChange={(e) => {
                                                                        const updatedAssets = [...selectedData];
                                                                        updatedAssets[index].quantityLiquidation =
                                                                            Number(e.target.value);
                                                                        setSelectedData(updatedAssets);
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
                                                                    placeholder="Giá thanh lý"
                                                                    value={row.priceLiquidation}
                                                                    onChange={(e) => {
                                                                        const newValue = e.target.value;
                                                                        if (newValue === "" || Number(newValue) > 0) {
                                                                            const updatedAssets = [...selectedData];
                                                                            updatedAssets[index].priceLiquidation = Number(newValue);
                                                                            setSelectedData(updatedAssets);
                                                                        }
                                                                    }}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "Enter") {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                    error={Number(row.priceLiquidation) <= 0}
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
                                                                        row.priceLiquidation * row.quantityLiquidation
                                                                    }
                                                                    InputProps={{ readOnly: true }}
                                                                    disabled
                                                                />
                                                            </Box>
                                                        </StyledTableCell>

                                                        <StyledTableCell align="center">
                                                            <IconTrash
                                                                style={{
                                                                    cursor: "pointer",
                                                                    color: "red",
                                                                }}
                                                                onClick={() => handleRemoveAsset(index)} // Gọi hàm xóa
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
                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>Lý do thanh lý <span className="required_text">(*)</span></Typography>
                                        <TextField
                                            id="reason"
                                            name="reason"
                                            value={formik.values.reason}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={
                                                formik.touched.reason &&
                                                Boolean(formik.errors.reason)
                                            }
                                            sx={{ width: "100%" }}
                                            multiline
                                            rows={4}
                                        />
                                        {formik.touched.reason && Boolean(formik.errors.reason) && (
                                            <FormHelperText className="required_text">
                                                {" "}
                                                {formik.errors.reason ? formik.errors.reason.toString() : ""}
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
                        <StyledButton
                            disableHoverEffect
                            color="primary"
                            size="small"
                            variant="contained"
                            onClick={handleSubmit as () => void}
                            sx={{ paddingTop: 1.3, paddingBottom: 1.3 }}
                        >
                            {isFetching ? "Đang thực hiện..." : isEditMode ? "Cập nhật" : "Thêm mới"}
                        </StyledButton>
                    </DialogActions>
                </Dialog>
            </FormikProvider>
        </>
    );
};

export default FormAddEditLiquidation;
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
