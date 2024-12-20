import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import SelectForm from "../../../../components/custom/form/SelectForm";
import StyledButton from "../../../../components/default/button/StyledButton";
import { capitalizeFirstLetter } from "../../../../helpers/capitalizeFirstLetter";
import { useFetchTypeAsset } from "../../../../hooks/services/type-asset/type-voice-query";
import useQueryString from "../../../../hooks/services/useQueryString";
import { CreateAssetModel } from "../../../../interfaces/asset";
import { statusAssetOptions } from "../../../../utils/constants.utils";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: CreateAssetModel, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: CreateAssetModel;
    isEditMode?: boolean;
};

const schema = (isEditMode: boolean) =>
    yup.object().shape({
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
        quantityDamage: yup
            .number()
            .typeError("Vui lòng nhập số hợp lệ cho số lượng")
            .integer("Số lượng phải là một số nguyên"),
        quantityLiquidation: yup
            .number()
            .typeError("Vui lòng nhập số hợp lệ cho số lượng")
            .integer("Số lượng phải là một số nguyên"),
        description: yup.string(),
    });

const FormAddEditAsset: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        name: "",
        description: "",
        note: "",
        quantityTotal: 0,
        quantityUsed: 0,
        quantityWarehouse: 0,
        quantityDamage: 0,
        quantityLiquidation: 0,
        typeAssetId: null,
        status: "mới"
    },
    isFetching = false,
    isEditMode = false,
}) => {
    const formik = useFormik<CreateAssetModel>({
        initialValues,
        validationSchema: schema(isEditMode),
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            if (onSubmit) {
                onSubmit(values, resetForm);
            }
        },
    });
    const queryString = useQueryString();
    const order = queryString?.order ?? "ASC";

    const { data: TypeAssetData } = useFetchTypeAsset({ order });

    const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = useMemo(
        () => formik,
        [formik]
    );



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
                <DialogTitle>
                    {isEditMode ? "Sửa thông tin tài sản" : "Thêm thông tin tài sản"}
                </DialogTitle>

                <DialogContent sx={{ px: { xs: 3, sm: 3, md: 6 } }}>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>

                        <Box sx={{ width: "100%", display: "flex" }} gap={2}
                        >
                            <InputForm
                                label="Tên tài sản"
                                placeholder="Nhập tên tài sản"
                                required
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                                {...getFieldProps("name")}
                            />

                            <SelectForm
                                label="Phân loại"
                                required
                                value={values.typeAssetId as string}
                                options={TypeAssetData?.data?.result?.map((item) => ({
                                    value: item._id,
                                    label: capitalizeFirstLetter(item.name),
                                }))}
                                onChange={(e) => setFieldValue("typeAssetId", e.target.value)}
                                error={touched.typeAssetId && Boolean(errors.typeAssetId)}
                                helperText={touched.typeAssetId && errors.typeAssetId}
                            />
                        </Box>

                        <Box sx={{ width: "100%", display: "flex" }} gap={2}
                        >
                            <Box sx={{ width: "100%" }}>
                                <SelectForm
                                    label="Trạng thái"
                                    required
                                    value={values.status as string}
                                    options={statusAssetOptions.map((item) => ({
                                        value: item.value,
                                        label: item.label,
                                    }))}
                                    onChange={(e) => setFieldValue("status", e.target.value)}
                                    error={touched.status && Boolean(errors.status)}
                                    helperText={touched.status && errors.status}
                                />
                            </Box>

                            {values.status === "có sẵn" && (
                                <>
                                    <InputForm
                                        label=" Số lượng trong kho"
                                        placeholder="Nhập số lượng"
                                        error={touched.quantityWarehouse && Boolean(errors.quantityWarehouse)}
                                        helperText={touched.quantityWarehouse && errors.quantityWarehouse}
                                        {...getFieldProps("quantityWarehouse")}
                                    />
                                    <InputForm
                                        label="Số lượng đang sử dụng"
                                        placeholder="Nhập số lượng"
                                        error={touched.quantityUsed && Boolean(errors.quantityUsed)}
                                        helperText={touched.quantityUsed && errors.quantityUsed}
                                        {...getFieldProps("quantityUsed")}
                                    />
                                </>
                            )}
                        </Box>
                        <InputForm
                            label="Mô tả"
                            placeholder="Nhập tên mô tả"
                            error={touched.description && Boolean(errors.description)}
                            helperText={touched.description && errors.description}
                            {...getFieldProps("description")}
                        />
                        <InputForm
                            label="Ghi chú"
                            placeholder="Nhập ghi chú"
                            error={touched.note && Boolean(errors.note)}
                            helperText={touched.note && errors.note}
                            {...getFieldProps("note")}
                        />


                    </Form>
                </DialogContent>

                <DialogActions sx={{ pr: { xs: 3, sm: 3, md: 6 }, pb: 2 }}>
                    <Button disabled={isFetching} onClick={onClose} color="error" style={{ fontSize: 14 }}>
                        Huỷ
                    </Button>
                    <StyledButton
                        disableHoverEffect
                        color="primary"
                        size="small"
                        variant="contained"
                        onClick={handleSubmit as () => void}
                        sx={{ paddingTop: 1.3, paddingBottom: 1.3 }}
                        disabled={isFetching}
                    >
                        {isFetching ? "Đang thực hiện..." : isEditMode ? "Cập nhật" : "Thêm mới"}
                    </StyledButton>
                </DialogActions>
            </Dialog>
        </FormikProvider >
    );
};

export default FormAddEditAsset;