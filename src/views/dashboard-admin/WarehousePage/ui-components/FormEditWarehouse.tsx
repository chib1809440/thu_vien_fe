import CloseIcon from "@mui/icons-material/Close";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Select,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo, useState } from "react";
import InputForm from "../../../../components/custom/form/InputForm";
import SelectForm from "../../../../components/custom/form/SelectForm";
import { TPublicationsCreate } from "../../../../types/models/publications.type";
import { TShelves } from "../../../../types/models/shelves";
import { stockStatusOptions } from "../../../../utils/constants.utils";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TPublicationsCreate & { operation: string }, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TPublicationsCreate;
    isEditMode?: boolean;
    shelfOptions?: TShelves[];
};

const FormEditWarehouse: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    shelfOptions,
    initialValues = {
        name: "",
        quantity: 0,
        shelvesQuantity: 0,
        shelvesId: "",
    },
    isFetching = false,
    isEditMode = false,
}) => {



    const [statusWarehouse, setStatusWarehouse] = useState("");
    const [touchedMount, setTouchedMount] = useState({ additionalQuantity: false });
    const [errorsMount, setErrorsMount] = useState({ additionalQuantity: "" });

    const [operation, setOperation] = useState("add");
    const [additionalQuantity, setAdditionalQuantity] = useState(0);

    const formik = useFormik<TPublicationsCreate>({
        initialValues,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            if (touchedMount.additionalQuantity && errorsMount.additionalQuantity) {
                return;
            }

            const changeAmount = Number(additionalQuantity) || 0;

            if (onSubmit) {
                onSubmit(
                    {
                        ...values,
                        operation,
                        shelvesQuantity: changeAmount,
                        quantity: changeAmount,
                        shelvesId: values?.shelvesId
                    },
                    resetForm
                );
            }
        },
    });

    const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = useMemo(
        () => formik,
        [formik]
    );
    console.log("values", values);

    const shelvesQuantity = parseInt(getFieldProps("shelvesQuantity").value, 10) || 0;
    const stockQuantity = parseInt(getFieldProps("quantity").value, 10) || 0;
    const totalQuantity = stockQuantity + shelvesQuantity;

    const validateAdditionalQuantity = (
        additionalQuantity,
        operation,
        shelvesQuantity,
        stockQuantity
    ) => {
        const value = Number(additionalQuantity);

        if (operation === "add") {
            if (value <= 0) return "Số lượng phải lớn hơn 0";
            if (value > stockQuantity)
                return `Số lượng muốn thêm không được lớn hơn số lượng tồn kho là ${stockQuantity}`;
        } else if (operation === "subtract") {
            if (value <= 0) return "Số lượng phải lớn hơn 0";
            if (value > shelvesQuantity)
                return `Số lượng muốn giảm không được lớn hơn số lượng trên kệ là ${shelvesQuantity}`;
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
            shelvesQuantity,
            stockQuantity
        );
        setErrorsMount({ ...errorsMount, additionalQuantity: error });
    };

    const calculateTotal = () => {
        const changeAmount = Number(additionalQuantity) || 0;

        if (operation === "subtract" && changeAmount > shelvesQuantity) {
            return shelvesQuantity;
        }
        if (operation === "add" && changeAmount > stockQuantity) {
            return shelvesQuantity;
        }

        return operation === "add"
            ? shelvesQuantity + changeAmount
            : shelvesQuantity - changeAmount;
    };

    return (
        <FormikProvider value={formik}>
            <Dialog
                maxWidth="sm"
                fullWidth
                open={open}
                onClose={(event, reason) => {
                    if (reason !== "backdropClick") {
                        onClose();
                    }
                }}
                disableEscapeKeyDown
            >
                <DialogTitle>
                    Cập nhật thông tin kho
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        color="error"
                        sx={{ position: "absolute", right: 8, top: 2 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <InputForm
                                label="Tên ấn phẩm"
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                                {...getFieldProps("name")}
                                disabled
                            />
                            <SelectForm
                                label="Trạng thái ấn phẩm"
                                text="Trạng thái:"
                                options={stockStatusOptions}
                                value={statusWarehouse}
                                onChange={(event) => {
                                    setStatusWarehouse(event.target.value);
                                }}
                            />
                        </Box>

                        {statusWarehouse === "trên kệ" && (
                            <>
                                <InputForm
                                    label="Tổng số lượng ấn phẩm sách"
                                    type="number"
                                    value={totalQuantity}
                                    disabled
                                />
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <SelectForm
                                        label="Chọn kệ tủ"
                                        text="Kệ - tủ:"
                                        options={
                                            shelfOptions?.map((item) => ({
                                                value: item._id,
                                                label: item.name,
                                            })) || []
                                        }
                                        {...getFieldProps("shelvesId")}
                                        error={touched.shelvesId && Boolean(errors.shelvesId)}
                                        helperText={touched.shelvesId && errors.shelvesId}
                                        disabled={Boolean(getFieldProps("shelvesId").value)}
                                    />

                                    <InputForm
                                        label="Số lượng trên kệ"
                                        type="number"
                                        placeholder="Nhập số lượng lên kệ"
                                        {...getFieldProps("shelvesQuantity")}
                                        error={
                                            touched.shelvesQuantity &&
                                            Boolean(errors.shelvesQuantity)
                                        }
                                        helperText={
                                            touched.shelvesQuantity && errors.shelvesQuantity
                                        }
                                        disabled
                                    />
                                </Box>

                                <Box display={"flex"} my={1}>
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
                                                    shelvesQuantity,
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
                                        Thêm
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
                                                    shelvesQuantity,
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
                                        Giảm
                                    </Typography>
                                </Box>
                                <InputForm
                                    label={
                                        operation === "add"
                                            ? "Số lượng muốn thêm lên kệ"
                                            : "Số lượng muốn giảm từ kệ"
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
                                    } // Truyền helperText
                                />

                                <Typography>
                                    <strong>
                                        Tổng số lượng trên kệ còn:{" "}
                                        <span style={{ color: "blue" }}>{calculateTotal()}</span> ấn
                                        phẩm sách
                                    </strong>
                                </Typography>
                            </>
                        )}

                        {statusWarehouse === "thanh lý" && (
                            <>
                                <InputForm
                                    label="Tổng số lượng ấn phẩm"
                                    type="number"
                                    value={totalQuantity}
                                    disabled
                                />
                                <InputForm
                                    label="Số lượng thanh lý"
                                    type="number"
                                    placeholder="Nhập số lượng thanh lý"
                                    value={0}
                                />
                            </>
                        )}

                        {statusWarehouse === "hư hỏng" && (
                            <>
                                <InputForm
                                    label="Tổng số lượng ấn phẩm"
                                    type="number"
                                    value={totalQuantity}
                                    disabled
                                />
                                <InputForm
                                    label="Số lượng hư hỏng"
                                    type="number"
                                    placeholder="Nhập số lượng hư hỏng"
                                    value={0}
                                />
                            </>
                        )}
                    </Form>
                </DialogContent>

                <DialogActions>
                    <Button
                        disabled={isFetching}
                        onClick={handleSubmit as () => void}
                        variant="contained"
                        color="primary"
                    >
                        {isFetching ? "Đang cập nhật..." : "Cập nhật"}
                    </Button>
                </DialogActions>
            </Dialog>
        </FormikProvider>
    );
};

export default FormEditWarehouse;
