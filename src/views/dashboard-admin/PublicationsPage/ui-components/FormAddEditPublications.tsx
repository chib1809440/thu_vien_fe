import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    imageUrl?: string;
};

const schema = (isEditMode: boolean) =>
    yup.object().shape({
        name: yup.string().required("Vui lòng nhập tên"),
        barcode: yup.string().when("type", {
            is: "ấn phẩm cứng",
            then: yup
                .string()
                .required("Vui lòng nhập barcode"),
            otherwise: yup.string().notRequired(),
        }),
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
        ...(!isEditMode
            ? {
                file: yup.mixed().when("type", {
                    is: "ấn phẩm mềm",
                    then: yup.mixed().required("Vui lòng upload file").nullable(),
                    otherwise: yup.mixed().notRequired(),
                }),
            }
            : { file: yup.mixed() }),
    });

const FormAddEditPublications: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    cateOptions,
    materialOptions,
    authorOptions,
    publisherOptions,
    imageUrl,
    initialValues = {
        name: "",
        barcode: "",
        description: "",
        quantity: 0,
        shelvesQuantity: 0,
        status: "không có sẵn",
        type: "ấn phẩm cứng",
        isPublic: true,
        isLink: false,
        categoryIds: [],
        authorIds: [],
        publisherIds: [],
        materialIds: [],
    },
    isFetching = false,
    isEditMode = false,
}) => {
    const formik = useFormik<TPublicationsCreate>({
        initialValues,
        validationSchema: schema(isEditMode),
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
    const [typeHardPublications, setTypeHardPublications] = useState(true);
    const [fileName, setFileName] = useState("");

    const mutationAddPublisher = useAddPublisher();
    const mutationAddCategory = useAddCategory();
    const mutationAddMaterial = useAddMaterial();
    const mutationAddAuthor = useAddAuthor();
    const revalidatePublisher = useReFetchPublisher();
    const revalidateCategory = useReFetchCategory();
    const revalidateMaterial = useReFetchMaterial();
    const revalidateAuthor = useReFetchAuthor();

    const isMounted = useRef(true);

    useEffect(() => {
        if (!isMounted.current || initialValues?.type === null) {
            return;
        }

        if (initialValues?.type === "ấn phẩm cứng") {
            setTypeHardPublications(true);
        } else {
            setTypeHardPublications(false);
        }

        isMounted.current = true;

        return () => {
            isMounted.current = false;
        };
    }, [isMounted.current, initialValues?.type]);

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
        const selectedType = e.target.value;
        setFieldValue("type", selectedType);
        setFieldValue("status", selectedType === "ấn phẩm mềm" ? "có sẵn" : "không có sẵn");

        setFileName("");
        setDefaultImage("");
        setFieldValue("file", null);

        if (imageRef.current) {
            imageRef.current.clearState();
        }

        // Truyền giá trị typeHardPublications vào Uploadimage
        setTypeHardPublications(selectedType === "ấn phẩm cứng");
    };

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

    const VALID_MIME_TYPES = {
        pdf: ["application/pdf"],
        word: [
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ],
        powerpoint: [
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ],
        image: [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/bmp",
            "image/webp"
        ],
        video: [
            "video/mp4",
            "video/x-msvideo",
            "video/x-matroska",
            "video/webm"
        ]
    };

    // Xét ảnh
    const handleChangeImage = useCallback(async (file: File) => {

        const mimetype = initialValues?.mimetype;
        console.log(mimetype);


        // Kiểm tra loại file
        const isValidType = Object.values(VALID_MIME_TYPES).some(mimeArray =>
            mimeArray.includes(file.type)
        );
        if (!mimetype) {
            if (!isValidType) {
                toast.error("Vui lòng chọn file có đúng định dạng: " + mimetype);
                console.log("aaa");

                imageRef.current.clearState();
                return;
            }
        } else {
            if (!isValidType || file.type !== mimetype) {
                toast.error("Vui lòng chọn file có đúng định dạng: " + mimetype);
                console.log("bbbb");

                imageRef.current.clearState();
                return;
            }
        }

        if (!typeHardPublications) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setDefaultImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setFileName(file.name);
        }

        setFieldValue("file", file);
    }, [initialValues, setFieldValue]);


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

                <DialogContent sx={{ px: 6 }}>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                gap: 2,
                                width: "100%",
                                mt: 2,
                            }}
                        >
                            <Uploadimage
                                typeHardPublications={typeHardPublications}
                                ref={imageRef}
                                defaultImage={imageUrl || defaultImage}
                                onChange={handleChangeImage}
                                fileName={fileName}
                                error={touched.file && errors.file}
                            />

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "100%",
                                    ml: { xs: 0, md: 2, xl: 5 },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: { xs: "column", md: "row" },
                                        width: "100%",
                                        gap: { xs: 0, md: 2, xl: 2 },
                                    }}
                                >
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
                                        required={values.type === "ấn phẩm cứng"}
                                        error={touched.barcode && Boolean(errors.barcode)}
                                        helperText={touched.barcode && errors.barcode}
                                        {...getFieldProps("barcode")}
                                        disabled={isEditMode}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: { xs: "column", md: "row" },
                                        width: "100%",
                                        gap: { xs: 0, md: 2, xl: 2 },
                                    }}
                                >
                                    <SelectForm
                                        label="Chọn loại ấn phẩm"
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

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", md: "row" },
                                gap: { xs: 0, md: 2, xl: 2 },
                            }}
                        >
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
                                limitTags={1}
                                limitText={10}
                                noOptionsText="Vui lòng thêm dạng học liệu mới"
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
                                limitTags={1}
                                limitText={10}
                                noOptionsText="Vui lòng thêm lĩnh vực mới"
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
                                limitTags={1}
                                limitText={10}
                                noOptionsText="Vui lòng thêm tác giả mới"
                                isCapitalize={true}
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
                                limitTags={1}
                                limitText={10}
                                noOptionsText="Vui lòng thêm nhà xuất bản mới"
                                isCapitalize={true}
                            />
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
                            value={values.type === "ấn phẩm cứng" ? true : values?.isPublic ?? false}
                            onChange={(checked) => {
                                if (values.type === "ấn phẩm cứng") {
                                    setFieldValue("isPublic", true);
                                } else {
                                    setFieldValue("isPublic", checked);
                                }
                            }}
                            label="Chia sẻ lên thư viện"
                            disable={values.type === "ấn phẩm cứng"}
                        />

                        <SwitchForm
                            value={values?.isLink ?? false}
                            onChange={(checked) => {
                                if (!values?.isPublic) {
                                    toast.warn(
                                        "Không thể thay đổi trạng thái liên thông vì chưa chia sẻ lên thư viện."
                                    );
                                    return;
                                }
                                setFieldValue("isLink", checked);
                            }}
                            label="Chia sẻ liên thông"
                        />
                    </Form>
                </DialogContent>

                <DialogActions sx={{ pr: 6, pb:2 }}>
                    <Button disabled={isFetching} onClick={onClose} color="error">
                        Huỷ
                    </Button>
                    <Button
                        disabled={isFetching}
                        onClick={handleSubmit as () => void}
                        variant="contained"
                        color="primary"
                    >
                        {isFetching ? "Đang thực hiện..." : isEditMode ? "Cập nhật" : "Thêm mới"}
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
