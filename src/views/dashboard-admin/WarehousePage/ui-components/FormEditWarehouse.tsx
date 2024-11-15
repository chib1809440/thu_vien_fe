import CloseIcon from "@mui/icons-material/Close";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo, useState } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import SelectForm from "../../../../components/custom/form/SelectForm";
import { TPublicationsCreate } from "../../../../types/models/publications.type";
import { TShelves, TShelvesCreate } from "../../../../types/models/shelves";
import { positionLiquidationDamaged, stockStatusOptions } from "../../../../utils/constants.utils";
import { useAddShelf } from "../../../../hooks/services/shelf/shelf-mutation";
import { useReFetchShelf } from "../../../../hooks/services/shelf/shelf-query";
import { toast } from "react-toastify";
import FormAddEditShelf from "../../ShelfPage/ui-components/FormAddEditShelf";

const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên"),
    quantity: yup.number().required("Vui lòng nhập số lượng"),
    shelvesQuantity: yup.number().required("Vui lòng nhập số lượng trên kệ"),
    shelvesId: yup.string().required("Vui lòng chọn kệ").nullable(),
});

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TPublicationsCreate & { operation: string, statusWarehouse: string, position?: string, reason?: string }, resetForm: () => void) => void;
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
    const [openAdd, setOpenAdd] = useState(false);
    const [statusWarehouse, setStatusWarehouse] = useState("");
    const [positionLD, setPositionLD] = useState("trong kho");
    const [reasonLD, setReasonLD] = useState("");
    const [touchedMount, setTouchedMount] = useState({ additionalQuantity: false });
    const [errorsMount, setErrorsMount] = useState({ additionalQuantity: "" });
    const mutationAdd = useAddShelf();
    const revalidate = useReFetchShelf();

    const [operation, setOperation] = useState("add");
    const [additionalQuantity, setAdditionalQuantity] = useState(0);
    const [liquidationQuantity, setLiquidationQuantity] = useState(0);
    const [liquidationTouched, setLiquidationTouched] = useState({ liquidationQuantity: false });
    const [liquidationErrors, setLiquidationErrors] = useState({ liquidationQuantity: "" });

    const formik = useFormik<TPublicationsCreate>({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            if (touchedMount.additionalQuantity && errorsMount.additionalQuantity) {
                return;
            }

            const changeAmount = Number(additionalQuantity) || 0;
            const changeLiquidation = Number(liquidationQuantity) || 0;

            if (onSubmit) {
                onSubmit(
                    {
                        ...values,
                        operation,
                        statusWarehouse: statusWarehouse,
                        shelvesQuantity: changeAmount,
                        quantity: changeAmount,
                        quantityLiquidation: changeLiquidation,
                        position: positionLD,
                        reason: reasonLD
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

    const shelvesQuantity = parseInt(getFieldProps("shelvesQuantity").value, 10) || 0;
    const stockQuantity = parseInt(getFieldProps("quantity").value, 10) || 0;

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

    const validateLiquidationQuantity = (liquidationQuantity, stockQuantity) => {
        if (liquidationQuantity <= 0) {
            return "Số lượng phải lớn hơn 0";
        }

        if (positionLD === "trong kho" && liquidationQuantity > stockQuantity) {
            return `Số lượng không thể lớn hơn số lượng tồn kho là ${stockQuantity}`;
        }

        if (positionLD === "trên kệ" && liquidationQuantity > shelvesQuantity) {
            return `Số lượng không thể lớn hơn số lượng trên kệ là ${shelvesQuantity}`;
        }

        return null;
    };

    const handleLiqidation = (e) => {
        const value = Number(e.target.value);
        setLiquidationQuantity(value);
        setLiquidationTouched({ liquidationQuantity: true });
        let error = null;

        if (positionLD === "trong kho") {
            error = validateLiquidationQuantity(value, stockQuantity);
        } else if (positionLD === "trên kệ") {
            error = validateLiquidationQuantity(value, shelvesQuantity);
        }

        setLiquidationErrors({ liquidationQuantity: error });
    };

    const handleReasonChange = (event) => {
        setReasonLD(event.target.value);
    };

    const handleAddShelves = () => {
        setOpenAdd(true);
    };

    const handleClose = () => {
        setOpenAdd(false);
    };

    const handleSubmitShelves = (values: TShelvesCreate) => {
        mutationAdd.mutate(values, {
            onSuccess: (data) => {
                revalidate();
                toast.success("Thêm thành công.");
                setOpenAdd(false);
            },
            onError: (error) => {
                toast.error("Thêm thất bại: " + error.message);
            },
        });
        return;
    };
    const initialValuesShelves = useMemo((): TShelvesCreate => {
        return {
            name: "",
            description: "",
        };
    }, []);

    console.log(initialValues);


    return (
        <>
            {openAdd && (
                <FormAddEditShelf
                    open={openAdd}
                    onClose={handleClose}
                    initialValues={initialValuesShelves}
                    onSubmit={handleSubmitShelves}
                    isEditMode={false}
                />
            )}
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
                                        setStatusWarehouse(event?.target?.value);
                                        console.log(event?.target?.value);

                                    }}
                                />
                            </Box>

                            {statusWarehouse === "trên kệ" && (
                                <>
                                    <InputForm
                                        label="Tổng số lượng ấn phẩm sách"
                                        type="number"
                                        {...getFieldProps("totalQuantity")}
                                        error={touched.totalQuantity && Boolean(errors.totalQuantity)}
                                        helperText={touched.totalQuantity && errors.totalQuantity}
                                        disabled
                                    />
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <SelectForm
                                            label="Chọn kệ tủ"
                                            text="Kệ - tủ:"
                                            options={
                                                shelfOptions?.map((item) => ({
                                                    value: item?._id,
                                                    label: item?.name,
                                                })) || []
                                            }
                                            {...getFieldProps("shelvesId")}
                                            error={touched.shelvesId && Boolean(errors.shelvesId)}
                                            helperText={touched.shelvesId && errors.shelvesId}
                                            handleAdd={handleAddShelves}
                                        />

                                        <InputForm
                                            label="Số lượng trên kệ"
                                            type="number"
                                            placeholder="Nhập số lượng lên kệ"
                                            {...getFieldProps("shelvesQuantity")}
                                            sxBox={{ mt: 2.3 }}
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
                                            Thêm lên kệ
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
                                            Giảm từ kệ xuống kho
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
                                        }
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
                                        label="Tổng số lượng ấn phẩm sách"
                                        type="number"
                                        {...getFieldProps("totalQuantity")}
                                        error={touched.totalQuantity && Boolean(errors.totalQuantity)}
                                        helperText={touched.totalQuantity && errors.totalQuantity}
                                        disabled
                                    />
                                    <InputForm
                                        label="Số lượng thanh lý"
                                        type="number"
                                        placeholder="Nhập số lượng thanh lý"
                                        value={liquidationQuantity}
                                        onChange={handleLiqidation}
                                        error={liquidationTouched.liquidationQuantity && Boolean(liquidationErrors.liquidationQuantity)}
                                        helperText={liquidationTouched.liquidationQuantity ? liquidationErrors.liquidationQuantity : undefined}
                                    />
                                    <InputForm
                                        label="Lý do thanh lý"
                                        placeholder="Nhập lý do thanh lý"
                                        value={reasonLD}
                                        onChange={handleReasonChange}
                                    />

                                    <SelectForm
                                        label="Vị trí thanh lý"
                                        options={positionLiquidationDamaged}
                                        value={positionLD}
                                        onChange={(event) => {
                                            const newPosition = event.target.value;
                                            setPositionLD(newPosition);

                                            const error = validateLiquidationQuantity(liquidationQuantity,
                                                newPosition === "trong kho" ? stockQuantity : shelvesQuantity);

                                            setLiquidationErrors({ liquidationQuantity: error });
                                        }}
                                    />
                                </>
                            )}

                            {statusWarehouse === "hư hỏng" && (
                                <>
                                    <InputForm
                                        label="Tổng số lượng ấn phẩm sách"
                                        type="number"
                                        {...getFieldProps("totalQuantity")}
                                        error={touched.totalQuantity && Boolean(errors.totalQuantity)}
                                        helperText={touched.totalQuantity && errors.totalQuantity}
                                        disabled
                                    />
                                    <InputForm
                                        label="Số lượng hư hỏng"
                                        type="number"
                                        placeholder="Nhập số lượng hư hỏng"
                                        value={liquidationQuantity}
                                        onChange={handleLiqidation}
                                        error={liquidationTouched.liquidationQuantity && Boolean(liquidationErrors.liquidationQuantity)}
                                        helperText={liquidationTouched.liquidationQuantity ? liquidationErrors.liquidationQuantity : undefined}
                                    />
                                    <InputForm
                                        label="Lý do hư hỏng"
                                        placeholder="Nhập lý do hư hỏng"
                                        value={reasonLD}
                                        onChange={handleReasonChange}
                                    />

                                    <SelectForm
                                        label="Vị trí hư hỏng"
                                        options={positionLiquidationDamaged}
                                        value={positionLD}
                                        onChange={(event) => {
                                            const newPosition = event.target.value;
                                            setPositionLD(newPosition);

                                            const error = validateLiquidationQuantity(liquidationQuantity,
                                                newPosition === "trong kho" ? stockQuantity : shelvesQuantity);

                                            setLiquidationErrors({ liquidationQuantity: error });
                                        }}
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
        </>
    );
};

export default FormEditWarehouse;
