import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import AutocompleteForm from "../../../../components/custom/form/AutoCompleteForm";
import InputForm from "../../../../components/custom/form/InputForm";
import SelectForm from "../../../../components/custom/form/SelectForm";
import { TGroupCreate } from "../../../../types/models/group.type";
import { TLibrary, TLibraryCreate } from "../../../../types/models/library.type";
import { useAddLibrary } from "../../../../hooks/services/library/library-mutation";
import { useReFetchLibrary } from "../../../../hooks/services/library/library-query";
import { toast } from "react-toastify";
import FormAddEditLibrary from "../../LibraryPage/ui-components/FormAddEditLibrary";
import { capitalizeFirstLetter } from "../../../../helpers/capitalizeFirstLetter";
import usePermission from "../../../../utils/hasPermission";
import StyledButton from "../../../../components/default/button/StyledButton";
import AdminAccountDialog from "../../../../components/default/dialog/AdminAccountDialog";
import { useRoleBySuperAdminList } from "../../../../hooks/react-query/roleData";

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TGroupCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TGroupCreate;
    isEditMode?: boolean;
    libOptions?: TLibrary[];
    userRole?: string;
};

const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên"),
    mainLibrary: yup.string().required("Vui lòng chọn trưởng nhóm thư viện").nullable(),
    libraries: yup
        .array()
        .min(1, "Vui lòng chọn một thư viện")
        .required("Vui lòng chọn một thư viện")
        .nullable(),
});

const FormAddEditGroup: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    libOptions,
    userRole,
    initialValues = {
        mainLibrary: "",
        name: "",
        libraries: [],
    },
    isFetching = false,
    isEditMode = false,
}) => {
    const [openAdd, setOpenAdd] = useState(false);
    const [openAddAccount, setOpenAddAccount] = useState<boolean>(false);
    const mutationAdd = useAddLibrary();
    const revalidate = useReFetchLibrary();
    const { hasPermission } = usePermission();
    const { data: roles } = useRoleBySuperAdminList();
    const [filterRoleId, setFilterRoleId] = useState<string | number>(null);

    useEffect(() => {
        if (roles?.data?.result.length > 0) {
            // Tìm đối tượng có item.name là "Admin"
            const adminRole = roles.data.result.find((item) => item.name.trim() === "Admin");
            if (adminRole) {
                setFilterRoleId(adminRole._id);
            } else {
            }
        }
    }, [roles]);

    const formik = useFormik<TGroupCreate>({
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

    const handleChangedLibs = useCallback((value: TLibrary[]) => {
        setFieldValue?.("libraries", value);
        if (value.length === 0) {
            setFieldValue("mainLibrary", "");
        }
    }, []);
    const handleAddLibrary = () => {
        setOpenAdd(true);
    };

    const handleClose = () => {
        setOpenAdd(false);
    };

    const handleSubmitLibrary = (values: TLibraryCreate) => {
        mutationAdd.mutate(values, {
            onSuccess: (data) => {
                revalidate();
                toast.success("Thêm thành công.");
                setOpenAdd(false);
            },
        });
        return;
    };

    const initialValuesLibrary = useMemo((): TLibraryCreate => {
        return {
            name: "",
            address: "",
            managementAgency: "",
            phoneNumber: "",
            email: "",
            facebook: "",
        };
    }, []);

    return (
        <>
            {openAddAccount === true && (
                <AdminAccountDialog
                    title={"Thêm tài khoản Admin"}
                    open={openAddAccount}
                    roleId={filterRoleId as string}
                    handleOpen={setOpenAddAccount}
                />
            )}

            {openAdd && (
                <FormAddEditLibrary
                    open={openAdd}
                    onClose={handleClose}
                    initialValues={initialValuesLibrary}
                    onSubmit={handleSubmitLibrary}
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
                            // Ngăn tắt khi bấm ra ngoài
                            onClose();
                        }
                    }}
                    disableEscapeKeyDown
                >
                    <DialogTitle>
                        {isEditMode ? "Sửa thông tin nhóm" : "Thêm thông tin nhóm mới"}
                    </DialogTitle>

                    <DialogContent>
                        <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                            <InputForm
                                label="Tên nhóm"
                                placeholder="Nhập tên nhóm"
                                required
                                error={touched.name && Boolean(errors.name)}
                                helperText={touched.name && errors.name}
                                {...getFieldProps("name")}
                            />

                            <AutocompleteForm
                                label="Thư viện"
                                required
                                value={(values.libraries as unknown as TLibrary[]) || []}
                                options={libOptions}
                                keyLabel={"name"}
                                onChange={handleChangedLibs}
                                error={touched.libraries && Boolean(errors.libraries)}
                                helperText={touched.libraries && errors.libraries}
                                noOptionsText="Vui lòng thêm thư viện mới"
                                {...(hasPermission([{ resource: "all", action: "manage" }])
                                    ? {
                                          handleAddAccount: () => setOpenAddAccount(true),
                                          handleAddLibAndAccount: handleAddLibrary,
                                      }
                                    : {})}
                            />

                            <SelectForm
                                label="Trưởng nhóm thư viện"
                                options={((values.libraries as unknown as TLibrary[]) || [])?.map(
                                    (item) => ({
                                        value: item._id,
                                        label: capitalizeFirstLetter(item.name),
                                    })
                                )}
                                {...getFieldProps("mainLibrary")}
                                error={touched.mainLibrary && Boolean(errors.mainLibrary)}
                                helperText={touched.mainLibrary && errors.mainLibrary}
                                disabled={userRole !== "Super Admin"}
                            />
                        </Form>
                    </DialogContent>

                    <DialogActions>
                        <Button
                            disabled={isFetching}
                            onClick={onClose}
                            color="error"
                            style={{ fontSize: 14 }}
                        >
                            Huỷ
                        </Button>
                        <StyledButton
                            color="primary"
                            size="small"
                            variant="contained"
                            onClick={handleSubmit as () => void}
                            sx={{ paddingTop: 1.3, paddingBottom: 1.3 }}
                        >
                            {isFetching
                                ? "Đang thực hiện..."
                                : isEditMode
                                ? "Cập nhật"
                                : "Thêm mới"}
                        </StyledButton>
                    </DialogActions>
                </Dialog>
            </FormikProvider>
        </>
    );
};

export default FormAddEditGroup;
