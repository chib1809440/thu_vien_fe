import CloseIcon from "@mui/icons-material/Close";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton
} from "@mui/material";
import { Box } from "@mui/system";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useMemo, useState } from "react";
import InputForm from "../../../../components/custom/form/InputForm";
import SelectForm from "../../../../components/custom/form/SelectForm";
import { TPublicationsCreate } from "../../../../types/models/publications.type";
import { TShelves, TShelvesCreate } from "../../../../types/models/shelves";
import * as yup from "yup";
import { capitalizeFirstLetter } from "../../../../helpers/capitalizeFirstLetter";
import { useAddShelf } from "../../../../hooks/services/shelf/shelf-mutation";
import { useReFetchShelf } from "../../../../hooks/services/shelf/shelf-query";
import { toast } from "react-toastify";
import FormAddEditShelf from "../../ShelfPage/ui-components/FormAddEditShelf";

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
    name: yup.string().required("Vui lòng nhập tên"),
    quantity: yup.number().required("Vui lòng nhập số lượng"),
    shelvesQuantity: yup.number().required("Vui lòng nhập số lượng trên kệ"),
    shelvesId: yup.string().required("Vui lòng chọn kệ"),
});


const FormEditShelves: FC<Props> = ({
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
    const mutationAdd = useAddShelf();
    const revalidate = useReFetchShelf();

    const formik = useFormik<TPublicationsCreate>({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {


            if (onSubmit) {
                onSubmit(
                    {
                        ...values,
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
                        Cập nhật thông tin tủ - kệ
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
                                    sxBox={{ mt: 2.5 }}
                                />
                                <SelectForm
                                    label="Chọn kệ tủ"
                                    text="Kệ - tủ:"
                                    options={
                                        shelfOptions?.map((item) => ({
                                            value: item._id,
                                            label: capitalizeFirstLetter(item.name),
                                        })) || []
                                    }
                                    {...getFieldProps("shelvesId")}
                                    error={touched.shelvesId && Boolean(errors.shelvesId)}
                                    helperText={touched.shelvesId && errors.shelvesId}
                                    handleAdd={handleAddShelves}
                                />

                            </Box>
                            <InputForm
                                label="Số lượng trên kệ"
                                error={touched.shelvesQuantity && Boolean(errors.shelvesQuantity)}
                                helperText={touched.shelvesQuantity && errors.shelvesQuantity}
                                {...getFieldProps("shelvesQuantity")}
                                disabled
                            />
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

export default FormEditShelves;
