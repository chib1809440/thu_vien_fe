import { LoadingButton } from "@mui/lab";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormHelperText,
    Grid,
    IconButton,
    TextField
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import { useCreateAsset, useUpdateAsset } from "../../../hooks/react-query/assetData";
import { useFetchTypeAsset } from "../../../hooks/services/type-asset/type-voice-query";
import useQueryString from "../../../hooks/services/useQueryString";
import { Asset, CreateAssetModel } from "../../../interfaces/asset";
import { EntityResponse } from "../../../interfaces/entityResponse";
import { ErrorResponse } from "../../../interfaces/errorResponse";
import { TTypeAsset } from "../../../types/models/type-asset";
import SelectForm from "../../custom/form/SelectForm";
import { statusAssetOptions } from "../../../utils/constants.utils";
export const validationUtilizedObjectSchema = yup.object({
    name: yup.string().required("Vui lòng nhập tên tài sản"),
    status: yup.string().required("Vui lòng chọn trạng thái"),
    typeAssetId: yup.string().required("Vui lòng chọn loại tài sản"),
    note: yup.string(), // Không yêu cầu nhập
    quantityTotal: yup
        .number()
        .typeError("Vui lòng nhập số hợp lệ cho số lượng")
        // .positive("Số lượng phải lớn hơn 0")
        .integer("Số lượng phải là một số nguyên"),
    quantityUsed: yup
        .number()
        .typeError("Vui lòng nhập số hợp lệ cho số lượng")
        .integer("Số lượng phải là một số nguyên"),
    quantityWarehouse: yup
        .number()
        .typeError("Vui lòng nhập số hợp lệ cho số lượng")
        .integer("Số lượng phải là một số nguyên"),
    description: yup.string(),
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
    const queryString = useQueryString();
    const order = queryString?.order ?? "ASC";

    const { data: TypeAssetData } = useFetchTypeAsset({ order });

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
            typeAssetId: asset?.typeAssetId as TTypeAsset ?? "",
            status: ""
        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);
            try {
                setLoading(true);
                if (!asset) {
                    const data: CreateAssetModel = {
                        ...values,
                        quantityTotal: +(values.quantityUsed + values.quantityWarehouse),
                        quantityUsed: +values.quantityUsed,
                        quantityWarehouse: +values.quantityWarehouse,
                        quantityDamage: 0,
                        quantityLiquidation: 0,
                        typeAssetId: values.typeAssetId,
                        status: values.status
                    };
                    createAsset(data);

                } else {
                    const data: Asset = {
                        note: values.note,
                        name: values.name,
                        _id: asset._id,
                        description: values.description,
                        quantityTotal: +(values.quantityUsed + values.quantityWarehouse),
                        quantityUsed: +values.quantityUsed,
                        quantityWarehouse: +values.quantityWarehouse,
                        quantityDamage: +values.quantityDamage,
                        quantityLiquidation: +values.quantityLiquidation,
                        typeAssetId: values.typeAssetId,
                        status: values.status
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
                typeAssetId: asset?.typeAssetId,
                status: asset.status ?? ""
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
                <DialogTitle sx={{ m: 0, pb: 2 }} id="customized-dialog-title">
                    <Typography variant="h3">{title}</Typography>
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
                                        <Grid item xs={12} sm={12} md={6}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, mt: 1, fontWeight: "bold" }}>
                                                    Tên tài sản <span className="required_text">(*)</span>
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="name"
                                                    name="name"
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.name && Boolean(formik.errors.name)}
                                                />
                                                {formik.touched.name && Boolean(formik.errors.name) && (
                                                    <FormHelperText className="required_text">
                                                        {formik.errors.name ? formik.errors.name.toString() : ""}
                                                    </FormHelperText>
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6}>
                                            <Box sx={{ width: "100%" }}>
                                                <SelectForm
                                                    label="Phân loại"
                                                    required
                                                    value={(formik.values.typeAssetId as TTypeAsset)?._id}
                                                    options={TypeAssetData?.data?.result?.map((item) => ({
                                                        value: item._id,
                                                        label: capitalizeFirstLetter(item.name),
                                                    }))}
                                                    onChange={(e) => formik.setFieldValue("typeAssetId", e.target.value)}
                                                    error={formik.touched.typeAssetId && Boolean(formik.errors.typeAssetId)}
                                                    helperText={formik.touched.typeAssetId && formik.errors.typeAssetId}
                                                />
                                            </Box>
                                        </Grid>

                                    </Grid>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item xs={12} sm={12} md={formik.values.status === "có sẵn" ? 4 : 12}>
                                            <Box sx={{ width: "100%" }}>
                                                <SelectForm
                                                    label="Trạng thái"
                                                    required
                                                    value={formik.values.status as string}
                                                    options={statusAssetOptions.map((item) => ({
                                                        value: item.value,
                                                        label: item.label,
                                                    }))}
                                                    onChange={(e) => formik.setFieldValue("status", e.target.value)}
                                                    error={formik.touched.status && Boolean(formik.errors.status)}
                                                    helperText={formik.touched.status && formik.errors.status}
                                                />
                                            </Box>
                                        </Grid>

                                        {/* Chỉ hiển thị trường số lượng khi trạng thái là "cũ" */}
                                        {formik.values.status === "có sẵn" && (
                                            <Grid item xs={12} sm={12} md={8} display={"flex"} gap={2}>
                                                <Box sx={{ width: "100%" }}>
                                                    <Typography sx={{ mb: 1.5, mt: 1, fontWeight: "bold" }}>
                                                        Số lượng trong kho
                                                    </Typography>
                                                    <TextField
                                                        variant="outlined"
                                                        type="number"
                                                        fullWidth
                                                        id="quantityWarehouse"
                                                        name="quantityWarehouse"
                                                        value={formik.values.quantityWarehouse}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={formik.touched.quantityWarehouse && Boolean(formik.errors.quantityWarehouse)}
                                                    />
                                                    {formik.touched.quantityWarehouse && Boolean(formik.errors.quantityWarehouse) && (
                                                        <FormHelperText className="required_text">
                                                            {formik.errors.quantityWarehouse ? formik.errors.quantityWarehouse.toString() : ""}
                                                        </FormHelperText>
                                                    )}
                                                </Box>
                                                <Box sx={{ width: "100%" }}>
                                                    <Typography sx={{ mb: 1.5, mt: 1, fontWeight: "bold" }}>
                                                        Số lượng đang sử dụng
                                                    </Typography>
                                                    <TextField
                                                        variant="outlined"
                                                        type="number"
                                                        fullWidth
                                                        id="quantityUsed"
                                                        name="quantityUsed"
                                                        value={formik.values.quantityUsed}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        error={formik.touched.quantityUsed && Boolean(formik.errors.quantityUsed)}
                                                    />
                                                    {formik.touched.quantityUsed && Boolean(formik.errors.quantityUsed) && (
                                                        <FormHelperText className="required_text">
                                                            {formik.errors.quantityUsed ? formik.errors.quantityUsed.toString() : ""}
                                                        </FormHelperText>
                                                    )}
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>

                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item xs={12} sm={12} md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Mô tả
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
                                        <Grid item xs={12} sm={12} md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Ghi chú
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
