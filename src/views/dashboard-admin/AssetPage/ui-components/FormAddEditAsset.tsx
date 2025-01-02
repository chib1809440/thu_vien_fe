import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo, useState } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import SelectForm from "../../../../components/custom/form/SelectForm";
import StyledButton from "../../../../components/default/button/StyledButton";
import { capitalizeFirstLetter } from "../../../../helpers/capitalizeFirstLetter";
import { useFetchTypeAsset } from "../../../../hooks/services/type-asset/type-voice-query";
import useQueryString from "../../../../hooks/services/useQueryString";
import { CreateAssetModel } from "../../../../interfaces/asset";
import { statusAssetOptions } from "../../../../utils/constants.utils";
import { TTypeAsset } from "../../../../types/models/type-asset";

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
        note: yup.string(),
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
    const queryString = useQueryString();
    const order = queryString?.order ?? "ASC";
    const { data: typeAssetData } = useFetchTypeAsset({ order });
    const [operation, setOperation] = useState("add");
    const [additionalQuantity, setAdditionalQuantity] = useState(0);
    const [touchedMount, setTouchedMount] = useState({ additionalQuantity: false });
    const [errorsMount, setErrorsMount] = useState({ additionalQuantity: "" });

    const formik = useFormik<CreateAssetModel>({
        initialValues,
        validationSchema: schema(isEditMode),
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            if (onSubmit) {
                if (isEditMode) {
                    if (touchedMount.additionalQuantity && errorsMount.additionalQuantity) {
                        return;
                    }

                    const changeAmount = Number(additionalQuantity) || 0;
                    let updatedQuantityUsed = values.quantityUsed;
                    let updatedQuantityWarehouse = values.quantityWarehouse;

                    if (operation === 'add') {
                        updatedQuantityUsed += changeAmount;
                        updatedQuantityWarehouse -= changeAmount;
                    } else if (operation === 'subtract') {
                        updatedQuantityUsed -= changeAmount;
                        updatedQuantityWarehouse += changeAmount;
                    }

                    onSubmit({
                        ...values,
                        quantityUsed: updatedQuantityUsed,
                        quantityWarehouse: updatedQuantityWarehouse,
                        typeAssetId: (values?.typeAssetId as TTypeAsset)?._id,
                    }, resetForm);
                }
                else {
                    onSubmit(values, resetForm);
                }
            }
        },
    });

    const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = useMemo(
        () => formik,
        [formik]
    );

    const quantityUsed = parseInt(getFieldProps("quantityUsed").value, 10) || 0;
    const stockQuantity = parseInt(getFieldProps("quantityWarehouse").value, 10) || 0;

    const validateAdditionalQuantity = (
        additionalQuantity,
        operation,
        quantityUsed,
        stockQuantity
    ) => {
        const value = Number(additionalQuantity);

        if (operation === "add") {
            if (value <= 0) return "Số lượng phải lớn hơn 0";
            if (value > stockQuantity)
                return `Số lượng muốn thêm không được lớn hơn số lượng tồn kho là ${stockQuantity}`;
        } else if (operation === "subtract") {
            if (value <= 0) return "Số lượng phải lớn hơn 0";
            if (value > quantityUsed)
                return `Số lượng muốn giảm không được lớn hơn số lượng sử dụng là ${quantityUsed}`;
        }
        return null;
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        const numericValue = Number(value);

        if (numericValue < 0) {
            setAdditionalQuantity(0);
            setErrorsMount({ ...errorsMount, additionalQuantity: "Số lượng không được âm" });
            return;
        }

        setAdditionalQuantity(numericValue);
        setTouchedMount({ ...touchedMount, additionalQuantity: true });

        const error = validateAdditionalQuantity(
            numericValue,
            operation,
            quantityUsed,
            stockQuantity
        );
        setErrorsMount({ ...errorsMount, additionalQuantity: error });
    };

    const calculateTotal = () => {
        const changeAmount = Number(additionalQuantity) || 0;

        if (operation === "subtract" && changeAmount > quantityUsed) {
            return quantityUsed;
        }
        if (operation === "add" && changeAmount > stockQuantity) {
            return quantityUsed;
        }

        return operation === "add"
            ? quantityUsed + changeAmount
            : quantityUsed - changeAmount;
    };

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
                    {isEditMode ? "Chuyển tài sản lên sử dụng" : "Thêm thông tin tài sản"}
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
                                required={!isEditMode}
                                value={isEditMode ? (values.typeAssetId as TTypeAsset)?._id : (values.typeAssetId as string)}
                                options={typeAssetData?.data?.result?.map((item) => ({
                                    value: item._id,
                                    label: capitalizeFirstLetter(item.name),
                                }))}
                                onChange={(e) => setFieldValue("typeAssetId", e.target.value)}
                                error={touched.typeAssetId && Boolean(errors.typeAssetId)}
                                helperText={touched.typeAssetId && errors.typeAssetId}
                                disabled={isEditMode}
                            />
                        </Box>

                        <Box sx={{ width: "100%", display: "flex" }} gap={2}
                        >
                            <Box sx={{ width: "100%" }}>
                                <SelectForm
                                    label="Trạng thái"
                                    required={!isEditMode}
                                    value={values.status as string}
                                    options={statusAssetOptions.map((item) => ({
                                        value: item.value,
                                        label: item.label,
                                    }))}
                                    onChange={(e) => setFieldValue("status", e.target.value)}
                                    error={touched.status && Boolean(errors.status)}
                                    helperText={touched.status && errors.status}
                                    disabled={isEditMode}
                                />
                            </Box>

                            {(values.status === "có sẵn" || (values.status === "mới" && isEditMode)) && (
                                <>
                                    <InputForm
                                        label="Số lượng trong kho"
                                        placeholder="Nhập số lượng"
                                        type="number"
                                        error={touched.quantityWarehouse && Boolean(errors.quantityWarehouse)}
                                        helperText={touched.quantityWarehouse && errors.quantityWarehouse}
                                        {...getFieldProps("quantityWarehouse")}
                                        disabled={isEditMode}
                                    />
                                    <InputForm
                                        label="Số lượng đang sử dụng"
                                        type="number"
                                        placeholder="Nhập số lượng"
                                        error={touched.quantityUsed && Boolean(errors.quantityUsed)}
                                        helperText={touched.quantityUsed && errors.quantityUsed}
                                        {...getFieldProps("quantityUsed")}
                                        disabled={isEditMode}
                                    />


                                </>
                            )}
                        </Box>

                        {
                            isEditMode &&
                            <Box>
                                <Box display={"flex"} my={1}>
                                    {/* Lựa chọn Thêm lên kệ hoặc Giảm từ kệ xuống kho */}
                                    <Typography>
                                        <input
                                            type="radio"
                                            value="add"
                                            checked={operation === "add"}
                                            onChange={() => {
                                                setOperation("add");
                                                const error = validateAdditionalQuantity(
                                                    additionalQuantity,
                                                    "add",
                                                    quantityUsed,
                                                    stockQuantity
                                                );
                                                setErrorsMount({
                                                    ...errorsMount,
                                                    additionalQuantity: error,
                                                });
                                                setTouchedMount({
                                                    ...touchedMount,
                                                    additionalQuantity: true,
                                                });
                                            }}
                                        />
                                        Đem lên sử dụng
                                    </Typography>
                                    <Typography ml={2}>
                                        <input
                                            type="radio"
                                            value="subtract"
                                            checked={operation === "subtract"}
                                            onChange={() => {
                                                setOperation("subtract");
                                                const error = validateAdditionalQuantity(
                                                    additionalQuantity,
                                                    "subtract",
                                                    quantityUsed,
                                                    stockQuantity
                                                );
                                                setErrorsMount({
                                                    ...errorsMount,
                                                    additionalQuantity: error,
                                                });
                                                setTouchedMount({
                                                    ...touchedMount,
                                                    additionalQuantity: true,
                                                });
                                            }}
                                        />
                                        Đem xuống kho
                                    </Typography>
                                </Box>

                                <InputForm
                                    label={
                                        operation === "add"
                                            ? "Số lượng muốn đem sử dụng"
                                            : "Số lượng muốn giảm xuống kho"
                                    }
                                    type="number"
                                    placeholder="Nhập số lượng"
                                    value={additionalQuantity}
                                    onChange={handleQuantityChange}
                                    error={
                                        touchedMount.additionalQuantity &&
                                        Boolean(errorsMount.additionalQuantity)
                                    }
                                    helperText={
                                        touchedMount.additionalQuantity &&
                                            errorsMount.additionalQuantity
                                            ? errorsMount.additionalQuantity
                                            : undefined
                                    }
                                />
                                <Typography>
                                    <strong>
                                        Tổng số lượng sử dụng còn:{" "}
                                        <span style={{ color: "blue" }}>{calculateTotal()}</span>
                                    </strong>
                                </Typography>
                            </Box>
                        }
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