import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FilledInput,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    InputBase,
    LinearProgress,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Rating,
    Select,
    Snackbar,
    Step,
    StepLabel,
    Stepper,
    TextField,
    TextareaAutosize,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import { stringify } from "querystring";
import { toast } from "react-toastify";
import { CreateAssetModel, Asset } from "../../../interfaces/asset";
import CloseIcon from "@mui/icons-material/Close";
import { ErrorResponse } from "../../../interfaces/errorResponse";
import { useCreateAsset, useAssetList, useUpdateAsset } from "../../../hooks/react-query/assetData";
import { Entity } from "draft-js";
import { EntityResponse } from "../../../interfaces/entityResponse";
export const validationUtilizedObjectSchema = yup.object({
    name: yup.string().required("Vui lòng nhập tên tài sản"),
    note: yup.string(), // Không yêu cầu nhập
    quantityTotal: yup
        .number()
        .typeError("Vui lòng nhập số hợp lệ cho số lượng")
        .required("Vui lòng nhập số lượng tài sản")
        .positive("Số lượng phải lớn hơn 0")
        .integer("Số lượng phải là một số nguyên"),
    quantityUsed: yup
        .number()
        .typeError("Vui lòng nhập số hợp lệ cho số lượng")
        .integer("Số lượng phải là một số nguyên"),
    quantityWarehouse: yup
        .number()
        .typeError("Vui lòng nhập số hợp lệ cho số lượng")
        .integer("Số lượng phải là một số nguyên"),
    quantityDamage: yup
        .number()
        .typeError("Vui lòng nhập số hợp lệ cho số lượng")
        .integer("Số lượng phải là một số nguyên"),
    quantityLiquidation: yup
        .number()
        .typeError("Vui lòng nhập số hợp lệ cho số lượng")
        .integer("Số lượng phải là một số nguyên"),
    description: yup.string().required("Vui lòng nhập miêu tả"),
});
interface DialogProps {
    id?: string,
    open: boolean,
    handleOpen: (e) => void,
    fullScreen?: boolean,
    content?: React.ReactNode,
    action?: React.ReactNode,
    title: string,
    asset?: Asset,
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"
}
export default function AssetDialog({ title, maxWidth, id, content, action, fullScreen, open, asset, handleOpen }: DialogProps) {
    const [formData, setFormData] = useState<Asset>();
    const [loading, setLoading] = useState<boolean>(false);
    const [entityError, setEntityError] = useState<string | string[]>(null);
    const onSuccess = (data: EntityResponse<Asset>) => {
        if (data.statusCode) {
            const { statusCode, message } = data;
            console.log('dsds', data);
            if (statusCode === 200 || statusCode === 201) {
                handleOpen(false);
                if (!id) {
                    formik.resetForm();
                    toast.success("Thêm dữ liệu thành công", {});
                    return;
                }
                toast.success("Cập nhật dữ liệu thành công", {});
            } else {
                console.log('dsds', message);

                setEntityError(message);
            }
        } else {
            toast.error("Lỗi hệ thống vui lòng thử lại trong giây lát", {});

        }
    };
    const OnError = (data: ErrorResponse) => {
        console.log('toi day', data);
        if (data.statusCode) {
            const { statusCode, message } = data;

            setEntityError(message);
        } else {
            toast.error("Lỗi hệ thống vui lòng thử lại trong giây lát", {});

        }
    };
    const { mutate: createAsset, isPending: isPendingInsert, isSuccess } = useCreateAsset(onSuccess, OnError);
    const { mutate: updateAsset, isPending: isPendingUpdate } = useUpdateAsset(onSuccess, OnError);

    const formik = useFormik({
        initialValues: {
            name: asset?.name ?? "",
            description: asset?.description ?? "",
            note: asset?.note ?? "",
            quantityTotal: asset?.quantityTotal ?? 0,
            quantityUsed: asset?.quantityUsed ?? 0,
            quantityWarehouse: asset?.quantityWarehouse ?? 0,
            quantityDamage: asset?.quantityDamage ?? 0,
            quantityLiquidation: asset?.quantityLiquidation ?? 0,
        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);
            try {
                setLoading(true);
                if (!asset) {
                    const data: CreateAssetModel = {
                        ...values,
                        quantityTotal: +values.quantityTotal,
                        quantityUsed: 0,
                        quantityWarehouse: 0,
                        quantityDamage: 0,
                        quantityLiquidation: 0,

                    };
                    createAsset(data);

                } else {
                    const data: Asset = {
                        note: values.note,
                        name: values.name,
                        _id: asset._id,
                        description: values.description,
                        quantityTotal: +values.quantityTotal,
                        quantityUsed: +values.quantityUsed,
                        quantityWarehouse: +values.quantityWarehouse,
                        quantityDamage: +values.quantityDamage,
                        quantityLiquidation: +values.quantityLiquidation,
                    };
                    updateAsset(data)
                }
            } catch (error: any) {
                setLoading(false);
                let errorResponse: ErrorResponse = error.response.data;
                setEntityError(errorResponse.message);
            }
        },
    });

    useEffect(() => {
        // Kiểm tra xem defaulValue có tồn tại hay không trước khi cập nhật giá trị mặc định của formik
        if (asset) {
            formik.setValues({
                name: asset?.name ?? "",
                description: asset?.description ?? "",
                note: asset?.note ?? "",
                quantityTotal: asset?.quantityTotal ?? 0,
                quantityUsed: asset?.quantityUsed ?? 0,
                quantityWarehouse: asset?.quantityWarehouse ?? 0,
                quantityDamage: asset?.quantityDamage ?? 0,
                quantityLiquidation: asset?.quantityLiquidation ?? 0,
            });
        }
    }, [asset]);

    const onHandleClose = () => {
        handleOpen(false);
        if (id) {
            formik.resetForm();
            setEntityError(null);
        }
    };

    return (
        <>
            <Dialog
                maxWidth="md"
                fullWidth
                open={open}
                // onClose={() => handleOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle sx={{ m: 0, pt: 3, pb: 0 }} id="customized-dialog-title">
                    <Typography variant="h4">{title}</Typography>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => onHandleClose()}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ px: 4, py: 0 }}>
                    <form onSubmit={formik.handleSubmit}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            alignItems="center"
                            gap="12px"
                        >
                            {Array.isArray(entityError) ? (
                                entityError.map((error, index) => (
                                    <Typography
                                        key={index}
                                        sx={{ mb: 1.5, fontWeight: "bold" }}
                                        className="required_text"
                                    >
                                        {error}
                                    </Typography>
                                ))
                            ) : (
                                <Typography
                                    sx={{ mb: 1.5, fontWeight: "bold" }}
                                    className="required_text"
                                >
                                    {entityError}
                                </Typography>
                            )}
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Tên tài sản <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="name"
                                                    name="name"
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.name &&
                                                        Boolean(formik.errors.name)
                                                    }
                                                />
                                                {formik.touched.name &&
                                                    Boolean(formik.errors.name) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.name
                                                                ? formik.errors.name.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Số lượng tổng <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="quantityTotal"
                                                    name="quantityTotal"
                                                    value={formik.values.quantityTotal}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.quantityTotal &&
                                                        Boolean(formik.errors.quantityTotal)
                                                    }
                                                />
                                                {formik.touched.quantityTotal &&
                                                    Boolean(formik.errors.quantityTotal) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.quantityTotal
                                                                ? formik.errors.quantityTotal.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    {
                                        id ? <>
                                            <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                                <Grid item md={12}>
                                                    <Box style={{ width: "100%" }}>
                                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                            Số lượng sử dụng <span className="required_text">(*)</span>{" "}
                                                        </Typography>
                                                        <TextField
                                                            variant="outlined"
                                                            fullWidth
                                                            id="quantityUsed"
                                                            name="quantityUsed"
                                                            value={formik.values.quantityUsed}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            error={
                                                                formik.touched.quantityUsed &&
                                                                Boolean(formik.errors.quantityUsed)
                                                            }
                                                        />
                                                        {formik.touched.quantityUsed &&
                                                            Boolean(formik.errors.quantityUsed) && (
                                                                <FormHelperText className="required_text">
                                                                    {" "}
                                                                    {formik.errors.quantityUsed
                                                                        ? formik.errors.quantityUsed.toString()
                                                                        : ""}
                                                                </FormHelperText>
                                                            )}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                                <Grid item md={12}>
                                                    <Box style={{ width: "100%" }}>
                                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                            Số lượng trong kho <span className="required_text">(*)</span>{" "}
                                                        </Typography>
                                                        <TextField
                                                            variant="outlined"
                                                            fullWidth
                                                            id="quantityWarehouse"
                                                            name="quantityWarehouse"
                                                            value={formik.values.quantityWarehouse}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            error={
                                                                formik.touched.quantityWarehouse &&
                                                                Boolean(formik.errors.quantityWarehouse)
                                                            }
                                                        />
                                                        {formik.touched.quantityWarehouse &&
                                                            Boolean(formik.errors.quantityWarehouse) && (
                                                                <FormHelperText className="required_text">
                                                                    {" "}
                                                                    {formik.errors.quantityWarehouse
                                                                        ? formik.errors.quantityWarehouse.toString()
                                                                        : ""}
                                                                </FormHelperText>
                                                            )}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                                <Grid item md={12}>
                                                    <Box style={{ width: "100%" }}>
                                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                            Số lượng thanh lý <span className="required_text">(*)</span>{" "}
                                                        </Typography>
                                                        <TextField
                                                            variant="outlined"
                                                            fullWidth
                                                            id="quantityLiquidation"
                                                            name="quantityLiquidation"
                                                            value={formik.values.quantityLiquidation}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            error={
                                                                formik.touched.quantityLiquidation &&
                                                                Boolean(formik.errors.quantityLiquidation)
                                                            }
                                                        />
                                                        {formik.touched.quantityLiquidation &&
                                                            Boolean(formik.errors.quantityLiquidation) && (
                                                                <FormHelperText className="required_text">
                                                                    {" "}
                                                                    {formik.errors.quantityLiquidation
                                                                        ? formik.errors.quantityLiquidation.toString()
                                                                        : ""}
                                                                </FormHelperText>
                                                            )}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                                <Grid item md={12}>
                                                    <Box style={{ width: "100%" }}>
                                                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                            Số lượng hư hỏng <span className="required_text">(*)</span>{" "}
                                                        </Typography>
                                                        <TextField
                                                            variant="outlined"
                                                            fullWidth
                                                            id="quantityDamage"
                                                            name="quantityDamage"
                                                            value={formik.values.quantityDamage}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            error={
                                                                formik.touched.quantityDamage &&
                                                                Boolean(formik.errors.quantityDamage)
                                                            }
                                                        />
                                                        {formik.touched.quantityDamage &&
                                                            Boolean(formik.errors.quantityDamage) && (
                                                                <FormHelperText className="required_text">
                                                                    {" "}
                                                                    {formik.errors.quantityDamage
                                                                        ? formik.errors.quantityDamage.toString()
                                                                        : ""}
                                                                </FormHelperText>
                                                            )}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </> : <></>
                                    }

                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Mô tả <span className="required_text">(*)</span>{""}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="description"
                                                    name="description"
                                                    value={formik.values.description}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.description &&
                                                        Boolean(formik.errors.description)
                                                    }
                                                />
                                                {formik.touched.description &&
                                                    Boolean(formik.errors.description) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.description
                                                                ? formik.errors.description.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Ghi chú <span className="required_text">(*)</span>{""}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="note"
                                                    name="note"
                                                    value={formik.values.note}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.note &&
                                                        Boolean(formik.errors.note)
                                                    }
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
                                </Grid>
                            </Grid>
                        </Box>
                    </form>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <LoadingButton
                        sx={{ p: "12px 24px" }}
                        onClick={() => formik.handleSubmit()}
                        type="submit"
                        loading={id ? isPendingUpdate : isPendingInsert}
                        variant="contained"
                        size="large"
                    >
                        Lưu
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}
