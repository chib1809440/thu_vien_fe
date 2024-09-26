import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Switch, TextField } from '@mui/material';
import { Form, FormikProvider, useFormik } from 'formik';
import { FC } from 'react';
import * as yup from 'yup';
import { TGroupCreate } from '../../../../types/models/group.type';

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit?: (values: TGroupCreate, resetForm: () => void) => void;
    isFetching?: boolean;
    initialValues: TGroupCreate;
    isEditMode?: boolean;
};

const schema = yup.object().shape({
    createBy: yup.string(),
    isPublic: yup.boolean(),
    name: yup.string(),
    mainLibrary: yup.string(),
});

const FormAddEditGroup: FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialValues = {
        isPublic: false,
        name: "",
        mainLibrary: "",
    },
    isFetching = false,
    isEditMode = false,
}) => {
    const formik = useFormik<TGroupCreate>({
        initialValues,
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: (values, { resetForm }) => {
            if (onSubmit) {
                console.log("submit", values);
                
                onSubmit(values, resetForm);
            }
        },
    });

    const { errors, touched, values, setFieldValue, handleSubmit, getFieldProps } = formik;

    return (
        <FormikProvider value={formik}>
            <Dialog
                maxWidth="sm"
                fullWidth
                open={open}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick') {
                        // Ngăn tắt khi bấm ra ngoài
                        onClose();
                    }
                }}
                disableEscapeKeyDown
            >
                <DialogTitle>{isEditMode ? 'Sửa thông tin nhóm' : 'Thêm thông tin nhóm mới'}</DialogTitle>

                <DialogContent>
                    <Form autoComplete="none" noValidate onSubmit={handleSubmit}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Tên nhóm"
                            fullWidth
                            {...getFieldProps('name')}
                            error={touched.name && Boolean(errors.name)}
                            helperText={touched.name && errors.name}
                        />

                        <TextField
                            margin="dense"
                            label="Thư viện"
                            fullWidth
                            {...getFieldProps('mainLibrary')}
                            error={touched.mainLibrary && Boolean(errors.mainLibrary)}
                            helperText={touched.mainLibrary && errors.mainLibrary}
                        />
                    </Form>

                    <FormControlLabel
                        control={
                            <Switch
                                value={values?.isPublic ?? false}
                                checked={values?.isPublic ?? false}
                                onChange={(e) => setFieldValue("isPublic", e.target.checked)}
                            />
                        }
                        label="Hien thi"
                    />
                </DialogContent>

                <DialogActions>
                    <Button disabled={isFetching} onClick={onClose}>
                        Huỷ
                    </Button>
                    <Button disabled={isFetching} onClick={handleSubmit as () => void} variant="contained" color="primary">
                        {isFetching ? 'Đang thêm...' : isEditMode ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </DialogActions>
            </Dialog>
        </FormikProvider>
    );
};

export default FormAddEditGroup;
