import { LoadingButton } from "@mui/lab";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Switch
} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FC, useCallback, useMemo, useRef, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { Form, FormikProvider, useFormik } from "formik";
import { toast } from "react-toastify";

import { IconTrash } from "@tabler/icons";
import { IconPencil, IconPlus, IconTrashXFilled } from "@tabler/icons-react";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import * as yup from "yup";
import ActionsForm from "../../../../components/custom/form/ActionForm";
import InputForm from "../../../../components/custom/form/InputForm";
import TableList from "../../../../components/custom/table-list/TableList";
import StyledButton from "../../../../components/default/button/StyledButton";
import ConfirmDeleteDialog from "../../../../components/default/dialog/ConfirmDeleteDialog";
import { useFetchTypeVoice } from "../../../../hooks/services/type-voice/type-voice-query";
import useQueryString from "../../../../hooks/services/useQueryString";
import { useDeleteSoftManyVoice, useDeleteSoftVoice, useEditVoice } from "../../../../hooks/services/voice/voice-mutation";
import { useFetchVoice, useReFetchVoice } from "../../../../hooks/services/voice/voice-query";
import { TColumn, TMenuOption } from "../../../../types/common/table";
import { TPublications } from "../../../../types/models/publications.type";
import { TTypeVoice } from "../../../../types/models/type-voice";
import { TVoice, TVoiceCreate } from "../../../../types/models/voice";
import MainCard from "../../../../ui-component/cards/MainCard";
import { getLabelFromOptions, parserParams } from "../../../../utils/object";
import FilterByItems from "./FilterByItems";
import SelectForm from "../../../../components/custom/form/SelectForm";
import Uploadimage, { UploadAvatarRefProps } from "../../../../components/custom/form/UploadImage";
import { statusVoiceImage } from "../../../../utils/constants.utils";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TVoiceCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TVoiceCreate;
    isEditMode?: boolean;
    publicationsData?: TPublications
};

const schema = yup.object().shape({
    typeVoiceId: yup.string().required("Vui lòng chọn loại voice"),
    file: yup.mixed().required("Vui lòng upload file").nullable(),

});

const DialogAddEditVoice: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    publicationsData,
    initialValues = {
        note: "",
        isPublic: true,
        isLink: false,
        file: "",
    },
    isFetching = false,
    isEditMode = false, }) => {

    const queryString = useQueryString();
    const page = queryString?.page ?? 1;
    const limit = queryString?.limit ?? 5;
    const search = queryString?.q ?? "";
    const isPublic = true;

    const [barcodeSearch, setBarcodeSearch] = useState("");
    const [selectedTypeVoice, setSelectedTypeVoice] = useState(0);
    const imageRef = useRef<UploadAvatarRefProps>(null);
    const [defaultImage, setDefaultImage] = useState<string>("");
    const [fileName, setFileName] = useState("");

    const filter = useMemo(
        () =>
            parserParams([
                { compare: "", target: { search } },
                { compare: false, target: { isPublic } },
            ]),
        [search, isPublic]
    );

    const { data, isLoading } = useFetchVoice({
        limit,
        page,
        ...filter,
    });
    const { data: typeVoiceData } = useFetchTypeVoice();
    const mutationEdit = useEditVoice();
    const mutationSoftDelete = useDeleteSoftVoice();
    const mutationSoftDeleteMany = useDeleteSoftManyVoice();
    const revalidate = useReFetchVoice();

    const [openAddEdit, setOpenAddEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState<TVoice | null>(null);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [voiceToDelete, setVoiceToDelete] = useState<TVoice | null>(null);

    const [checkedDelete, setCheckedDelete] = useState<string[]>([]);
    const [openConfirmSoftDeleteMultiple, setOpenConfirmSoftDeleteMultiple] = useState(false);

    const handleEditVoice = (row: TVoice) => {
        setSelectedEdit(row);
        setOpenAddEdit(true);
    };


    const handleOpenConfirmDialog = (row: TVoice) => {
        setVoiceToDelete(row);
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (voiceToDelete) {
            mutationSoftDelete.mutate(voiceToDelete._id, {
                onSuccess: () => {
                    revalidate();
                    toast.success('Xóa voice thành công.');
                    setOpenConfirmDialog(false);
                },
            });
        }
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
    };

    const handleBarcodeSearch = (value) => {
        setBarcodeSearch(value);
    };

    const handleTypeVoicelFilterChange = (event) => {
        setSelectedTypeVoice(event.target.value);
    };

    const handleChangeShareConnect = (row: TVoice, checked: boolean) => {
        if (!row.isPublic) {
            toast.warn("Không thể thay đổi trạng thái liên thông vì chưa chia sẻ lên thư viện.");
            return;
        }

        // TODO: update
        mutationEdit.mutate(
            { isLink: checked, _id: row._id },
            {
                onSuccess: (data) => {
                    revalidate();
                    toast.success("Cập nhật trạng thái thành công.");
                },
            }
        );
        return;
    };

    const handleChangePublic = (row: TVoice, checked: boolean) => {
        // TODO: update
        mutationEdit.mutate(
            { isPublic: checked, _id: row._id },
            {
                onSuccess: (data) => {
                    revalidate();
                    toast.success("Cập nhật trạng thái thành công.");
                },
            }
        );
        return;
    };

    const columns: TColumn<TVoice>[] = useMemo(
        () => [
            {
                id: "name",
                disablePadding: "none",
                label: "Tên voice",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 150 },
                render: (row)=> row?.name?.replace(/\.mp3$/, "") || "",
            },
            {
                id: "typeVoiceId",
                disablePadding: "none",
                label: "Loại giọng",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => (row.typeVoiceId as TTypeVoice)?.name
            },
            {
                id: "isPrivate",
                disablePadding: "none",
                label: "Loại hội thoại",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
                render: (row) => getLabelFromOptions(statusVoiceImage, row?.isPrivate)
            },
            {
                id: "order",
                disablePadding: "none",
                label: "STT",
                align: "left",
                sxRow: { paddingRight: 3, maxWidth: 200 },
            },

            {
                id: "action",
                disablePadding: "none",
                align: "center",
                label: "Hành động",
                render: (row) => {
                    return (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <IconPencil
                                onClick={() => handleEditVoice(row)}
                                size={20}
                                stroke={1.5}
                            />
                            <IconTrash
                                size={20}
                                stroke={1.5}
                                onClick={() => handleOpenConfirmDialog(row)}
                            />

                        </Box>
                    );
                },
            },
        ],
        [handleEditVoice, handleOpenConfirmDialog, handleChangePublic, handleChangeShareConnect]
    );

    const handleCheckedDelete = useCallback((row: TVoice, checked: boolean) => {
        setCheckedDelete((prev) => {
            if (prev.includes(row._id)) {
                return prev.filter((t) => t !== row._id);
            }
            return [...prev, row._id];
        });
    }, []);

    const handleCheckedDeleteAll = useCallback(
        (checked: boolean) => {
            if (data?.data?.result?.length === 0) return;
            setCheckedDelete((prev) => (checked ? data?.data?.result.map((t) => t._id) : []));
        },
        [data]
    );

    const checkedAll = useMemo(() => {
        if (data?.data?.result?.length === 0 || checkedDelete.length === 0) return false;
        return data?.data?.result?.every((t) => checkedDelete.includes(t._id));
    }, [checkedDelete, data]);

    const handleConfirmSoftDeleteMultiple = useCallback(() => {
        if (checkedDelete.length === 0) return;
        mutationSoftDeleteMany.mutate(checkedDelete, {
            onSuccess: () => {
                revalidate();
                toast.success("Xóa các mục đã chọn thành công.");
                setOpenConfirmSoftDeleteMultiple(false);
                setCheckedDelete([]);
            },
        });
    }, [checkedDelete]);

    const formik = useFormik<TVoiceCreate>({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            if (onSubmit) {
                onSubmit({
                    ...values,
                    publicationId: (publicationsData as TPublications)?._id,
                }, resetForm);
            }
        },
    });

    const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = useMemo(
        () => formik,
        [formik]
    );

    const handleChangeImage = useCallback(async (file: File) => {

        const reader = new FileReader();
        reader.onload = (event) => {
            setDefaultImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);

        setFileName(file.name);

        setFieldValue("file", file);
    }, [initialValues, setFieldValue]);

    return (

        <FormikProvider value={formik}>
            <Dialog
                maxWidth="lg"
                fullWidth
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle sx={{ m: 0, pt: 3, pb: 0 }} id="customized-dialog-title">
                    <Box sx={{ display: "flex", alignItems: "center" }}>Thêm voice cho ấn phẩm tranh:  <Typography color={"primary"} ml={1} variant="h3" fontWeight={500}>{publicationsData?.name}</Typography> </Box>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        color='error'
                        sx={{ position: 'absolute', right: 8, top: 2 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ px: 4, py: 0, mt: 5 }}>
                    <StyledButton
                        color="primary"
                        size="small"
                        startIcon={<IconPlus stroke={2} />}
                        variant="contained"
                    >
                        Thêm mới
                    </StyledButton>

                    <Box sx={{ mt: 2 }}>
                        <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                            <Box sx={{ display: "flex", gap: 2 }}>
                                <SelectForm
                                    label="Chọn loại voice"
                                    text="Loại voice:"
                                    required
                                    options={
                                        typeVoiceData?.data?.result?.map((item) => ({
                                            value: item._id,
                                            label: item.name,
                                        })) || []
                                    }
                                    {...getFieldProps("typeVoiceId")}
                                    error={touched.typeVoiceId && Boolean(errors.typeVoiceId)}
                                    helperText={touched.typeVoiceId && errors.typeVoiceId}
                                />
                                <SelectForm
                                    label="Chọn loại hội thoại"
                                    options={statusVoiceImage?.map(item => ({
                                        value: item.value ? 'true' : 'false',
                                        label: item.label,
                                    })) || []}
                                    {...getFieldProps("isPrivate")}
                                    error={touched.isPrivate && Boolean(errors.isPrivate)}
                                    helperText={touched.isPrivate && errors.isPrivate}

                                />

                                <InputForm
                                    label="Số thứ tự"
                                    placeholder="Nhập số thứ tự"
                                    required
                                    error={touched.order && Boolean(errors.order)}
                                    helperText={touched.order && errors.order}
                                    {...getFieldProps("order")}
                                />

                            </Box>

                            <InputForm
                                label="Ghi chú"
                                placeholder="Nhập ghi chú"
                                error={touched.note && Boolean(errors.note)}
                                helperText={touched.note && errors.note}
                                {...getFieldProps("note")}
                                sxBox={{ mb: 2 }}
                            />

                            <Uploadimage
                                ref={imageRef}
                                defaultImage={defaultImage}
                                onChange={handleChangeImage}
                                fileName={fileName}
                                error={touched.file && errors.file}
                            />
                        </Form>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <LoadingButton
                            sx={{ p: "12px 24px", mt: 2 }}
                            type="submit"
                            variant="contained"
                            size="large"
                            onClick={handleSubmit as () => void}
                        >
                            Lưu
                        </LoadingButton>
                    </Box>

                    <Box >
                        <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                            Danh sách voice
                        </Typography>
                    </Box>
                    <MainCard>

                        <TableList
                            checked={checkedDelete}
                            columns={columns}
                            rows={data?.data?.result || []}
                            onChecked={handleCheckedDelete}
                            onToggleCheckedAll={handleCheckedDeleteAll}
                            checkedAll={checkedAll}
                            isLoading={isLoading}
                            keyChecked="_id"
                        />

                        <ConfirmDeleteDialog
                            key={"delete"}
                            open={openConfirmDialog}
                            onClose={handleCloseConfirmDialog}
                            onConfirm={handleConfirmDelete}
                            title="Xác nhận xóa?"
                            description={`Bạn có chắc chắn muốn xóa voice giọng"${(voiceToDelete?.typeVoiceId as TTypeVoice)?.name}" ?`}
                        />
                        <ConfirmDeleteDialog
                            key={"deleteMultiple"}
                            open={openConfirmSoftDeleteMultiple}
                            onClose={() => setOpenConfirmSoftDeleteMultiple(false)}
                            onConfirm={handleConfirmSoftDeleteMultiple}
                            title="Xác nhận xóa các mục đã chọn?"
                            description={`Bạn có chắc chắn muốn xóa?`}
                        />
                    </MainCard>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>

                </DialogActions>
            </Dialog>
        </FormikProvider>

    );
}

export default DialogAddEditVoice;
