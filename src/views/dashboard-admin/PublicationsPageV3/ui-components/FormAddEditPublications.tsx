import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import InputForm from "../../../../components/custom/form/InputForm";
import SelectForm from "../../../../components/custom/form/SelectForm";
import SwitchForm from "../../../../components/custom/form/SwitchForm";
import { TAuthor } from "../../../../types/models/author";
import { TCategory } from "../../../../types/models/category";
import { TMaterial } from "../../../../types/models/material";
import { TPublicationsCreate } from "../../../../types/models/publications.type";
import { TPublisher, TPublisherCreate } from "../../../../types/models/publisher";
import { TShelves } from "../../../../types/models/shelves";
import { statusOptions, typeOptions } from "../../../../utils/constants.utils";
import FormAddCommonDialog from "./FormAddCommonDialog";
import { useAddPublisher } from "../../../../hooks/services/publisher/publisher-mutation";
import { useAddCategory } from "../../../../hooks/services/category/category-mutation";
import { useAddMaterial } from "../../../../hooks/services/material/material-mutation";
import { useAddAuthor } from "../../../../hooks/services/author/author-mutation";
import { toast } from "react-toastify";
import { useReFetchPublisher } from "../../../../hooks/services/publisher/publisher-query";
import { useReFetchCategory } from "../../../../hooks/services/category/category-query";
import { useReFetchMaterial } from "../../../../hooks/services/material/material-query";
import { useReFetchAuthor } from "../../../../hooks/services/author/author-query";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TPublicationsCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TPublicationsCreate;
    isEditMode?: boolean;
    cateOptions?: TCategory[];
    materialOptions?: TMaterial[];
    authorOptions?: TAuthor[];
    publisherOptions?: TPublisher[];
    shelfOptions?: TShelves[];
};

const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên"),
    barcode: yup.string().required("Vui lòng mã barcode"),
    categoryId: yup.string().when('type', {
        is: 'ấn phẩm cứng',
        then: yup.string()
            .required("Vui lòng chọn dạng học liệu"),

        otherwise: yup.string().notRequired(),
    }),
    authorId: yup.string().when('type', {
        is: 'ấn phẩm cứng',
        then: yup.string()
            .required("Vui lòng chọn tác giả"),
        otherwise: yup.string().notRequired(),
    }),
    publisherId: yup.string().when('type', {
        is: 'ấn phẩm cứng',
        then: yup.string()
            .required("Vui lòng chọn nhà xuất bản"),

        otherwise: yup.string().notRequired(),
    }),
    materialId: yup.string().when('type', {
        is: 'ấn phẩm cứng',
        then: yup.string()
            .required("Vui lòng chọn dạng học liệu"),

        otherwise: yup.string().notRequired(),
    }),
});

const FormAddEditPublications: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    cateOptions,
    materialOptions,
    authorOptions,
    publisherOptions,
    shelfOptions,
    initialValues = {
        name: "",
        barcode: "",
        description: "",
        quantity: 0,
        shelvesQuantity: 0,
        status: "không có sẵn",
        type: "ấn phẩm cứng",
        isPublic: false,
        isLink: false,
        categoryId: "",
        authorId: "",
        shelvesId: "",
        publisherId: "",
        materialId: "",
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

    const [filteredStatusOptions, setFilteredStatusOptions] = useState(statusOptions);
    const [openAdd, setOpenAdd] = useState(false);
    const [typeToAdd, setTypeToAdd] = useState<"publisher" | "author" | "category" | "material" | null>(null);
    const mutationAddPublisher = useAddPublisher();
    const mutationAddCategory = useAddCategory();
    const mutationAddMaterial = useAddMaterial();
    const mutationAddAuthor = useAddAuthor();
    const revalidatePublisher = useReFetchPublisher();
    const revalidateCategory = useReFetchCategory();
    const revalidateMaterial = useReFetchMaterial();
    const revalidateAuthor = useReFetchAuthor();

    const handleAddPublisher = () => {
        setTypeToAdd("publisher");
        setOpenAdd(true);
    };

    const handleAddAuthor = () => {
        setTypeToAdd("author");
        setOpenAdd(true);
    };

    const handleAddCategory = () => {
        setTypeToAdd("category");
        setOpenAdd(true);
    };

    const handleAddMaterial = () => {
        setTypeToAdd("material");
        setOpenAdd(true);
    };

    const handleClose = () => {
        setOpenAdd(false);
    };

    const handleAddSubmit = (values) => {
        let mutation;
        let revalidate;

        // Xác định loại đối tượng dựa trên một trường trong values
        if (values.type === 'publisher') {
            mutation = mutationAddPublisher;
            revalidate = revalidatePublisher;
        } else if (values.type === 'category') {
            mutation = mutationAddCategory;
            revalidate = revalidateCategory;
        } else if (values.type === 'material') {
            mutation = mutationAddMaterial;
            revalidate = revalidateMaterial;
        } else if (values.type === 'author') {
            mutation = mutationAddAuthor;
            revalidate = revalidateAuthor;
        }

        if (mutation) {
            mutation.mutate(values, {
                onSuccess: (data) => {
                    if (revalidate) {
                        revalidate();
                    }
                    toast.success('Thêm thành công.');
                    setOpenAdd(false);
                },
                onError: (error) => {
                    toast.error('Thêm thất bại: ' + error.message);
                }
            });
        }
    };

    const initialValuesMap = {
        publisher: {
            type: "publisher",
            name: "",
            description: "",
        },
        author: {
            type: "author",
            name: "",
            description: "",
        },
        category: {
            type: "category",
            name: "",
            description: "",
        },
        material: {
            type: "material",
            name: "",
            description: "",
        },
    };

    const getInitialValuesAdd = useMemo(() => {
        return initialValuesMap[typeToAdd] || {};
    }, [typeToAdd]);

    useEffect(() => {

        if (values.type === 'ấn phẩm mềm') {
            setFilteredStatusOptions(statusOptions.filter(option =>
                option.value === 'có sẵn'
            ));
        }

        if (values.type === 'ấn phẩm cứng') {
            setFilteredStatusOptions(statusOptions.filter(option =>
                option.value === 'không có sẵn'
            ));
        }
    }, [values.type]);

    const showQuantityInput = values.type === 'ấn phẩm cứng' &&
        (values.status === 'trên kệ' || values.status === 'có sẵn');

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
                                disabled={isEditMode}
                            />

                            <SelectForm
                                label="Chọn trạng thái ấn phẩm"
                                required
                                options={filteredStatusOptions}
                                {...getFieldProps("status")}
                                error={touched.status && Boolean(errors.status)}
                                helperText={touched.status && errors.status}
                                disabled={isEditMode}
                            />
                        </Box>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <SelectForm
                                label="Chọn dạng học liệu"
                                required={values.type === "ấn phẩm cứng"}
                                options={materialOptions?.map((item) => ({
                                    value: item._id,
                                    label: item.name,
                                })) || []}
                                {...getFieldProps("materialId")}
                                error={touched.materialId && Boolean(errors.materialId)}
                                helperText={touched.materialId && errors.materialId}
                                handleAdd={handleAddMaterial}
                            />
                            <SelectForm
                                label="Chọn lĩnh vực"
                                required={values.type === "ấn phẩm cứng"}
                                options={cateOptions?.map((item) => ({
                                    value: item._id,
                                    label: item.name,
                                })) || []}
                                {...getFieldProps("categoryId")}
                                error={touched.categoryId && Boolean(errors.categoryId)}
                                helperText={touched.categoryId && errors.categoryId}
                                handleAdd={handleAddCategory}
                            />
                            <SelectForm
                                label="Chọn tác giả"
                                required={values.type === "ấn phẩm cứng"}
                                options={authorOptions?.map((item) => ({
                                    value: item._id,
                                    label: item.name,
                                })) || []}
                                {...getFieldProps("authorId")}
                                error={touched.authorId && Boolean(errors.authorId)}
                                helperText={touched.authorId && errors.authorId}
                                handleAdd={handleAddAuthor}
                            />
                            <SelectForm
                                label="Chọn nhà xuất bản"
                                required={values.type === "ấn phẩm cứng"}
                                options={publisherOptions?.map((item) => ({
                                    value: item._id,
                                    label: item.name,
                                })) || []}
                                {...getFieldProps("publisherId")}
                                error={touched.publisherId && Boolean(errors.publisherId)}
                                helperText={touched.publisherId && errors.publisherId}
                                handleAdd={handleAddPublisher}
                            />
                        </Box>


                        <Box sx={{ display: "flex", gap: 2 }}>
                            {showQuantityInput && (
                                <InputForm
                                    label="Số lượng"
                                    placeholder="Nhập số lượng"
                                    error={touched.quantity && Boolean(errors.quantity)}
                                    helperText={touched.quantity && errors.quantity}
                                    {...getFieldProps("quantity")}
                                    disabled={isEditMode}
                                />
                            )}
                            {values.status === "trên kệ" && (
                                <SelectForm
                                    label="Chọn kệ tủ"
                                    options={shelfOptions?.map((item) => ({
                                        value: item._id,
                                        label: item.name,
                                    })) || []}
                                    {...getFieldProps("shelvesId")}
                                    error={touched.shelvesId && Boolean(errors.shelvesId)}
                                    helperText={touched.shelvesId && errors.shelvesId}
                                    disabled={isEditMode}
                                />
                            )}
                            {values.shelvesId && values.status === "trên kệ" && (
                                <InputForm
                                    label="Số lượng trên kệ"
                                    placeholder="Nhập số lượng trên kệ"
                                    {...getFieldProps("shelvesQuantity")}
                                    error={touched.shelvesQuantity && Boolean(errors.shelvesQuantity)}
                                    helperText={touched.shelvesQuantity && errors.shelvesQuantity}
                                    disabled={isEditMode}
                                />
                            )}
                        </Box>

                        <InputForm
                            label="Mô tả"
                            placeholder="Nhập mô tả"
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

            {openAdd && (
                <FormAddCommonDialog
                    open={openAdd}
                    onClose={handleClose}
                    initialValues={getInitialValuesAdd}
                    onSubmit={handleAddSubmit}
                    typeToAdd={typeToAdd}
                />
            )}
        </FormikProvider>
    );
};

export default FormAddEditPublications;