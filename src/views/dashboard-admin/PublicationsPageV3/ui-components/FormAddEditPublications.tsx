import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import AutocompleteForm from "../../../../components/custom/form/AutoCompleteForm";
import InputForm from "../../../../components/custom/form/InputForm";
import SelectForm from "../../../../components/custom/form/SelectForm";
import { TPublicationsCreate } from "../../../../types/models/publications.type";
import SwitchForm from "../../../../components/custom/form/SwitchForm";
import { TCategory } from "../../../../types/models/category";
import { statusOptions, typeOptions } from "../../../../utils/constants.utils";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TPublicationsCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TPublicationsCreate;
    isEditMode?: boolean;
    // libOptions?: TLibrary[];
    cateOptions?: TCategory[];
};

const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên"),
    barcode: yup.string(),
});

const FormAddEditPublications: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    cateOptions,
    initialValues = {
        name: "",
        barcode: "",
        description: "",
        quantity: 0,
        shelvesQuantity: 0,
        status: "trên kệ",
        type: "ấn phẩm cứng",
        isPublic: false,
        isLink: false,
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

    // const handleChangedLibs = useCallback((value: TLibrary[]) => {
    //     setFieldValue?.("libraries", value);
    //     if (value.length === 0) {
    //         setFieldValue("mainLibrary", "");
    //     }
    // }, []);

    const [filteredStatusOptions, setFilteredStatusOptions] = useState(statusOptions);

    useEffect(() => {
        // Lọc các tùy chọn trạng thái dựa trên loại ấn phẩm
        if (values.type === 'ấn phẩm mềm') {
            setFilteredStatusOptions(statusOptions.filter(option => option.value === 'có sẵn' || option.value === 'không có sẵn'));
        } else {
            setFilteredStatusOptions(statusOptions);
        }
    }, [values.type]);

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
                    {isEditMode ? "Sửa thông tin ấn phẩm" : "Thêm thông tin ấn phẩm mới"}
                </DialogTitle>

                <DialogContent>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <InputForm
                                label="Tên ấn phẩm"
                                placeholder="Nhập tên ấn phẩm"
                                required
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                                {...getFieldProps("name")}
                            />

                            <InputForm
                                label="Barcode"
                                placeholder="Nhập barcode"
                                required
                                error={touched.barcode && Boolean(errors.barcode)}
                                helperText={touched.barcode && errors.barcode}
                                {...getFieldProps("barcode")}
                            />
                        </Box>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <SelectForm
                                label="Chọn loại ấn phẩm"
                                required
                                options={typeOptions}
                                {...getFieldProps("type")}
                                error={touched.type && Boolean(errors.type)}
                                helperText={touched.type && errors.type}
                            />

                            <SelectForm
                                label="Chọn trạng thái ấn phẩm"
                                required
                                options={filteredStatusOptions}
                                {...getFieldProps("status")}
                                error={touched.status && Boolean(errors.status)}
                                helperText={touched.status && errors.status}
                            />
                        </Box>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <SelectForm
                                label="Chọn dạng học liệu"
                                required
                                options={cateOptions?.map((item) => ({
                                    value: item._id,
                                    label: item.name,
                                })) || []}
                            />
                            <SelectForm
                                label="Chọn lĩnh vực"
                                required
                                options={cateOptions?.map((item) => ({
                                    value: item._id,
                                    label: item.name,
                                })) || []}
                            />
                            <SelectForm
                                label="Chọn tác giả"
                                required
                                options={cateOptions?.map((item) => ({
                                    value: item._id,
                                    label: item.name,
                                })) || []}
                            />
                            <SelectForm
                                label="Chọn nhà xuất bản"
                                required
                                options={cateOptions?.map((item) => ({
                                    value: item._id,
                                    label: item.name,
                                })) || []}
                            />
                        </Box>

                        {values.status === "trên kệ" && (
                            <SelectForm
                                label="Chọn kệ tủ"
                                options={cateOptions?.map((item) => ({
                                    value: item._id,
                                    label: item.name,
                                })) || []}
                            />
                        )}

                        <InputForm
                            label="Mô tả"
                            placeholder="Nhập mô tả"
                            error={touched.description && Boolean(errors.description)}
                            helperText={touched.description && errors.description}
                            {...getFieldProps("description")}
                        />



                        <Box sx={{ display: "flex", gap: 2 }}>
                            <InputForm
                                label="Số lượng"
                                placeholder="Nhập số lượng"
                                error={touched.quantity && Boolean(errors.quantity)}
                                helperText={touched.quantity && errors.quantity}
                                {...getFieldProps("quantity")}
                            />

                            <InputForm
                                label="Số lượng kệ"
                                placeholder="Nhập số lượng kệ"
                                {...getFieldProps("shelvesQuantity")}
                            />
                        </Box>

                        {/* <AutocompleteForm
                            label="Thư viện"
                            required
                            value={(values.libraries as unknown as TLibrary[]) || []}
                            options={libOptions}
                            keyLabel={"name"}
                            onChange={handleChangedLibs}
                            error={touched.libraries && Boolean(errors.libraries)}
                            helperText={touched.libraries && errors.libraries}
                        /> */}



                        <InputForm
                            label="Ghi chú"
                            placeholder="Nhập ghi chú"
                            error={touched.description && Boolean(errors.description)}
                            helperText={touched.description && errors.description}
                            {...getFieldProps("description")}
                        />
                        <SwitchForm
                            value={values?.isPublic ?? false}
                            onChange={(checked) => setFieldValue("isPublic", checked)}
                            label="Chia sẻ lên thư viện"
                        />
                        <SwitchForm
                            value={values?.isLink ?? false}
                            onChange={(checked) => setFieldValue("isLink", checked)}
                            label="Chia sẻ liên thông"
                        />
                    </Form>
                </DialogContent>

                <DialogActions>
                    <Button disabled={isFetching} onClick={onClose} color="error">
                        Huỷ
                    </Button>
                    <Button
                        disabled={isFetching}
                        onClick={handleSubmit as () => void}
                        variant="contained"
                        color="primary"
                    >
                        {isFetching ? "Đang thêm..." : isEditMode ? "Cập nhật" : "Thêm mới"}
                    </Button>
                </DialogActions>
            </Dialog>
        </FormikProvider>
    );
};

export default FormAddEditPublications;