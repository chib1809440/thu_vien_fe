import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo, useState } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import SelectForm from "../../../../components/custom/form/SelectForm";
import { TPublicationsCreate } from "../../../../types/models/publications.type";
import { TShelves } from '../../../../types/models/shelves';
import { stockStatusOptions } from "../../../../utils/constants.utils";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TPublicationsCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TPublicationsCreate;
    isEditMode?: boolean;
    shelfOptions?: TShelves[];

};

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Vui lòng nhập tên"),
    shelvesQuantity: yup
        .number()
        .required("Vui lòng nhập số lượng trên kệ")
        .min(1, "Số lượng trên kệ phải lớn hơn 0")
        .max(yup.ref('quantity'), "Số lượng trên kệ không được lớn hơn số lượng tồn kho")

});

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
    const formik = useFormik<TPublicationsCreate>({
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

    const [statusWarehouse, setStatusWarehouse] = useState("");

    const quantity = values.quantity || 0;
    const shelvesQuantity = values.shelvesQuantity || 0;
    const totalQuantity = quantity + shelvesQuantity;

    const [operation, setOperation] = useState('add'); // Mặc định chọn "Thêm"
    const [additionalQuantity, setAdditionalQuantity] = useState(0);

    const handleQuantityChange = (e) => {
        setAdditionalQuantity(e.target.value);
    };

    const calculateTotal = () => {
        const currentQuantity = parseInt(getFieldProps("shelvesQuantity").value, 10) || 0;
        const changeAmount = Number(additionalQuantity) || 0;

        if (operation === 'subtract' && changeAmount > currentQuantity) {
            alert("Số lượng giảm không được lớn hơn số lượng hiện có.");
            return currentQuantity; // Không thay đổi số lượng
        }

        return operation === 'add' ? currentQuantity + changeAmount : currentQuantity - changeAmount;
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
                        color='error'
                        sx={{ position: 'absolute', right: 8, top: 2 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <InputForm
                            label="Tên ấn phẩm"
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                            {...getFieldProps("name")}
                            disabled
                        />
                        <SelectForm
                            label="Trạng thái ấn phẩm"
                            options={stockStatusOptions}
                            value={statusWarehouse}
                            onChange={(event) => {
                                setStatusWarehouse(event.target.value);
                            }}
                        />
                        {statusWarehouse === "trên kệ" && (
                            <>
                                <InputForm
                                    label="Tổng số lượng ấn phẩm"
                                    type="number"
                                    value={totalQuantity}
                                    disabled
                                />
                                <SelectForm
                                    label="Chọn kệ tủ"
                                    options={shelfOptions?.map((item) => ({
                                        value: item._id,
                                        label: item.name,
                                    })) || []}
                                    {...getFieldProps("shelvesId")}
                                    error={touched.shelvesId && Boolean(errors.shelvesId)}
                                    helperText={touched.shelvesId && errors.shelvesId}
                                />
                                <div>
                                    <label>
                                        <input
                                            type="radio"
                                            value="add"
                                            checked={operation === 'add'}
                                            onChange={() => setOperation('add')}
                                        />
                                        Thêm
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            value="subtract"
                                            checked={operation === 'subtract'}
                                            onChange={() => setOperation('subtract')}
                                        />
                                        Giảm
                                    </label>

                                    <InputForm
                                        label="Số lượng trên kệ"
                                        type="number"
                                        placeholder="Nhập số lượng lên kệ"
                                        {...getFieldProps("shelvesQuantity")}
                                        error={touched.shelvesQuantity && Boolean(errors.shelvesQuantity)}
                                        helperText={touched.shelvesQuantity && errors.shelvesQuantity}
                                    />

                                    <InputForm
                                        label="Số lượng thêm hoặc giảm"
                                        type="number"
                                        placeholder="Nhập số lượng"
                                        value={additionalQuantity}
                                        onChange={handleQuantityChange}
                                    />

                                    <div>
                                        <strong>Tổng số lượng trên kệ: {calculateTotal()}</strong>
                                    </div>
                                </div>
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