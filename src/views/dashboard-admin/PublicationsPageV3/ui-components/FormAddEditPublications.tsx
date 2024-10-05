import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
import AutocompleteForm from "../../../../components/custom/form/AutoCompleteForm";
import InputForm from "../../../../components/custom/form/InputForm";
import SelectForm from "../../../../components/custom/form/SelectForm";
import SwitchForm from "../../../../components/custom/form/SwitchForm";
import Uploadimage, { UploadAvatarRefProps } from "../../../../components/custom/form/UploadImage";
import { useAddAuthor } from "../../../../hooks/services/author/author-mutation";
import { useReFetchAuthor } from "../../../../hooks/services/author/author-query";
import { useAddCategory } from "../../../../hooks/services/category/category-mutation";
import { useReFetchCategory } from "../../../../hooks/services/category/category-query";
import { useAddMaterial } from "../../../../hooks/services/material/material-mutation";
import { useReFetchMaterial } from "../../../../hooks/services/material/material-query";
import { useAddPublisher } from "../../../../hooks/services/publisher/publisher-mutation";
import { useReFetchPublisher } from "../../../../hooks/services/publisher/publisher-query";
import { TAuthor } from "../../../../types/models/author";
import { TCategory } from "../../../../types/models/category";
import { TMaterial } from "../../../../types/models/material";
import { TPublicationsCreate } from "../../../../types/models/publications.type";
import { TPublisher } from "../../../../types/models/publisher";
import { TShelves } from "../../../../types/models/shelves";
import { statusOptions, typeOptions } from "../../../../utils/constants.utils";
import FormAddCommonDialog from "./FormAddCommonDialog";

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
    categoryIds: yup.array().when("type", {
        is: "ấn phẩm cứng",
        then: yup
            .array()
            .min(1, "Vui lòng chọn một lĩnh vực")
            .required("Vui lòng chọn một lĩnh vực")
            .nullable(),
        otherwise: yup.array().notRequired(),
    }),
    authorIds: yup.array().when("type", {
        is: "ấn phẩm cứng",
        then: yup
            .array()
            .min(1, "Vui lòng chọn một tác giả")
            .required("Vui lòng chọn một tác giả")
            .nullable(),
        otherwise: yup.array().notRequired(),
    }),
    publisherIds: yup.array().when("type", {
        is: "ấn phẩm cứng",
        then: yup
            .array()
            .min(1, "Vui lòng chọn một nhà xuất bản")
            .required("Vui lòng chọn một nhà xuất bản")
            .nullable(),
        otherwise: yup.array().notRequired(),
    }),
    materialIds: yup.array().when("type", {
        is: "ấn phẩm cứng",
        then: yup
            .array()
            .min(1, "Vui lòng chọn một dạng học liệu")
            .required("Vui lòng chọn một dạng học liệu")
            .nullable(),
        otherwise: yup.array().notRequired(),
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
        categoryIds: [],
        authorIds: [],
        shelvesId: "",
        publisherIds: [],
        materialIds: [],
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

    const [openAdd, setOpenAdd] = useState(false);
    const [typeToAdd, setTypeToAdd] = useState<
        "publisher" | "author" | "category" | "material" | null
    >(null);
    const imageRef = useRef<UploadAvatarRefProps>(null);
    const [defaultImage, setDefaultImage] = useState<string>("");

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
        if (values.type === "publisher") {
            mutation = mutationAddPublisher;
            revalidate = revalidatePublisher;
        } else if (values.type === "category") {
            mutation = mutationAddCategory;
            revalidate = revalidateCategory;
        } else if (values.type === "material") {
            mutation = mutationAddMaterial;
            revalidate = revalidateMaterial;
        } else if (values.type === "author") {
            mutation = mutationAddAuthor;
            revalidate = revalidateAuthor;
        }

        if (mutation) {
            mutation.mutate(values, {
                onSuccess: (data) => {
                    if (revalidate) {
                        revalidate();
                    }
                    toast.success("Thêm thành công.");
                    setOpenAdd(false);
                },
                onError: (error) => {
                    toast.error("Thêm thất bại: " + error.message);
                },
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

    const handleTypeChange = (e) => {
        console.log(e);

        setFieldValue("type", e.target.value);

        if (e.target.value === "ấn phẩm mềm") {
            setFieldValue("status", "có sẵn");
        } else {
            setFieldValue("status", "không có sẵn");
        }
    };

    const showQuantityInput =
        values.type === "ấn phẩm cứng" &&
        (values.status === "trên kệ" || values.status === "có sẵn");

    const handleChangedMaterial = useCallback((value: TMaterial[]) => {
        setFieldValue?.("materialIds", value);
    }, []);
    const handleChangedCategory = useCallback((value: TCategory[]) => {
        setFieldValue?.("categoryIds", value);
    }, []);
    const handleChangedAuthor = useCallback((value: TAuthor[]) => {
        setFieldValue?.("authorIds", value);
    }, []);
    const handleChangedPublisher = useCallback((value: TPublisher[]) => {
        setFieldValue?.("publisherIds", value);
    }, []);

    // Xét ảnh

    const handleChangeImage = (file: File) => {
        console.log("File selected:", file);

        const reader = new FileReader();
        reader.onload = (event) => {
            setDefaultImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleClearImage = () => {
        if (imageRef.current) {
            imageRef.current.clearState();
        }
        setDefaultImage("");
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
                    {isEditMode ? "Sửa thông tin ấn phẩm" : "Thêm thông tin ấn phẩm mới"}
                </DialogTitle>

                <DialogContent>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>

                        <Box sx={{ display: "flex", gap: 2, width: "100%", mt: 2 }}>
                            <Uploadimage ref={imageRef} defaultImage={defaultImage} onChange={handleChangeImage} />

                            <Box sx={{ display: "flex", flexDirection: "column", width: "100%", ml: 5 }}>
                                <Box sx={{ display: "flex", flexDirection: "row", width: "100%", gap: 2 }}>
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
                                        disabled={isEditMode}
                                    />
                                </Box>

                                <Box sx={{ display: "flex", flexDirection: "row", width: "100%", gap: 2 }}>
                                    <SelectForm
                                        label="Chọn loại ấn phẩm"
                                        required
                                        options={typeOptions}
                                        {...getFieldProps("type")}
                                        onChange={handleTypeChange}
                                        error={touched.type && Boolean(errors.type)}
                                        helperText={touched.type && errors.type}
                                        disabled={isEditMode}
                                    />

                                    <SelectForm
                                        label="Trạng thái ấn phẩm"
                                        options={statusOptions}
                                        {...getFieldProps("status")}
                                        error={touched.status && Boolean(errors.status)}
                                        helperText={touched.status && errors.status}
                                        disabled
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", gap: 2 }}>
                            <AutocompleteForm
                                label="Chọn dạng học liệu"
                                required={values.type === "ấn phẩm cứng"}
                                value={(values.materialIds as unknown as TMaterial[]) || []}
                                options={materialOptions}
                                keyLabel={"name"}
                                onChange={handleChangedMaterial}
                                error={touched.materialIds && Boolean(errors.materialIds)}
                                helperText={touched.materialIds && errors.materialIds}
                                handleAdd={handleAddMaterial}
                            />

                            <AutocompleteForm
                                label="Chọn lĩnh vực"
                                required={values.type === "ấn phẩm cứng"}
                                value={(values.categoryIds as unknown as TCategory[]) || []}
                                options={cateOptions}
                                keyLabel={"name"}
                                onChange={handleChangedCategory}
                                error={touched.categoryIds && Boolean(errors.categoryIds)}
                                helperText={touched.categoryIds && errors.categoryIds}
                                handleAdd={handleAddCategory}
                            />

                            <AutocompleteForm
                                label="Chọn tác giả"
                                required={values.type === "ấn phẩm cứng"}
                                value={(values.authorIds as unknown as TAuthor[]) || []}
                                options={authorOptions}
                                keyLabel={"name"}
                                onChange={handleChangedAuthor}
                                error={touched.authorIds && Boolean(errors.authorIds)}
                                helperText={touched.authorIds && errors.authorIds}
                                handleAdd={handleAddAuthor}
                            />

                            <AutocompleteForm
                                label="Chọn nhà xuất bản"
                                required={values.type === "ấn phẩm cứng"}
                                value={(values.publisherIds as unknown as TPublisher[]) || []}
                                options={publisherOptions}
                                keyLabel={"name"}
                                onChange={handleChangedPublisher}
                                error={touched.publisherIds && Boolean(errors.publisherIds)}
                                helperText={touched.publisherIds && errors.publisherIds}
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
                                    options={
                                        shelfOptions?.map((item) => ({
                                            value: item._id,
                                            label: item.name,
                                        })) || []
                                    }
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
                                    error={
                                        touched.shelvesQuantity && Boolean(errors.shelvesQuantity)
                                    }
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