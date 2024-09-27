import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FilledInput,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    Input,
    InputAdornment,
    InputBase,
    LinearProgress,
    MenuItem,
    OutlinedInput,
    Radio,
    RadioGroup,
    Rating,
    Select,
    Snackbar,
    Step,
    StepLabel,
    Stepper,
    TextField,
    TextareaAutosize,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

import { useFormik } from "formik";
import * as yup from "yup";
import { stringify } from "querystring";
import { toast } from "react-toastify";
import { CreateExampleModel, Example } from "../../../interfaces/example";
import CloseIcon from "@mui/icons-material/Close";
import { ErrorResponse } from "../../../interfaces/errorResponse";
import { useCreateExample, useExampleList, useUpdateExample } from "../../../hooks/react-query/exampleData";
import { Entity } from "draft-js";
import { EntityResponse } from "../../../interfaces/entityResponse";
export const validationUtilizedObjectSchema = yup.object({
    name: yup.string().required("Vui lòng nhập tên ví dụ"),
    description: yup.string().required("Vui lòng nhập miêu tả"),
});
interface DialogProps {
    id?: string,
    open: boolean,
    handleOpen: (e) => void,
    fullScreen?: boolean,
    content?: React.ReactNode,
    action?: React.ReactNode,
    title: string,
    example?: Example,
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"
}
export default function ExampleDialog({ title, maxWidth, id, content, action, fullScreen, open, example, handleOpen }: DialogProps) {
    const [formData, setFormData] = useState<Example>();
    const [loading, setLoading] = useState<boolean>(false);
    const [entityError, setEntityError] = useState<string | string[]>(null);
    const onSuccess = (data: EntityResponse<Example>) => {
        if (data.statusCode) {
            const { statusCode, message } = data;
            console.log('dsds', data);
            if (statusCode === 200 || statusCode === 201) {
                handleOpen(false);
                if (!id) {
                    formik.resetForm();
                    toast.success("Thêm dữ liệu thành công", {});
                    return;
                }
                toast.success("Cập nhật dữ liệu thành công", {});
            } else {
                console.log('dsds', message);

                setEntityError(message);
            }
        } else {
            toast.error("Lỗi hệ thống vui lòng thử lại trong giây lát", {});

        }
    };
    const OnError = (data: ErrorResponse) => {
        console.log('toi day', data);
        if (data.statusCode) {
            const { statusCode, message } = data;

            setEntityError(message);
        } else {
            toast.error("Lỗi hệ thống vui lòng thử lại trong giây lát", {});

        }
    };
    const { mutate: createExample, isPending: isPendingInsert, isSuccess } = useCreateExample(onSuccess, OnError);
    const { mutate: updateExample, isPending: isPendingUpdate } = useUpdateExample(onSuccess, OnError);

    const formik = useFormik({
        initialValues: {
            name: example?.name ?? "",
            description: example?.description ?? "",
        },
        validationSchema: validationUtilizedObjectSchema,
        onSubmit: async (values) => {
            setEntityError(null);
            try {
                setLoading(true);
                if (!example) {
                    const data: CreateExampleModel = {
                        ...values,

                    };
                    createExample(data);

                } else {
                    const data: Example = {
                        ...example,
                        ...values,
                    };
                    updateExample(data)
                }
            } catch (error: any) {
                setLoading(false);
                let errorResponse: ErrorResponse = error.response.data;
                setEntityError(errorResponse.message);
            }
        },
    });

    useEffect(() => {
        // Kiểm tra xem defaulValue có tồn tại hay không trước khi cập nhật giá trị mặc định của formik
        if (example) {
            formik.setValues({
                name: example?.name ?? "",
                description: example?.description ?? "",
            });
        }
    }, [example]);

    const onHandleClose = () => {
        handleOpen(false);
        if (id) {
            formik.resetForm();
            setEntityError(null);
        }
    };

    return (
        <>
            <Dialog
                maxWidth="md"
                fullWidth
                open={open}
                // onClose={() => handleOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle sx={{ m: 0, pt: 3, pb: 0 }} id="customized-dialog-title">
                    <Typography variant="h4">{title}</Typography>
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => onHandleClose()}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent sx={{ px: 4, py: 0 }}>
                    <form onSubmit={formik.handleSubmit}>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            alignItems="center"
                            gap="12px"
                        >
                            {Array.isArray(entityError) ? (
                                entityError.map((error, index) => (
                                    <Typography
                                        key={index}
                                        sx={{ mb: 1.5, fontWeight: "bold" }}
                                        className="required_text"
                                    >
                                        {error}
                                    </Typography>
                                ))
                            ) : (
                                <Typography
                                    sx={{ mb: 1.5, fontWeight: "bold" }}
                                    className="required_text"
                                >
                                    {entityError}
                                </Typography>
                            )}
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Tên Ví dụ <span className="required_text">(*)</span>{" "}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="name"
                                                    name="name"
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.name &&
                                                        Boolean(formik.errors.name)
                                                    }
                                                />
                                                {formik.touched.name &&
                                                    Boolean(formik.errors.name) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.name
                                                                ? formik.errors.name.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} sx={{ mb: 1.5 }}>
                                        <Grid item md={12}>
                                            <Box style={{ width: "100%" }}>
                                                <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                                                    Mô tả <span className="required_text">(*)</span>{""}
                                                </Typography>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    id="description"
                                                    name="description"
                                                    value={formik.values.description}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    error={
                                                        formik.touched.name &&
                                                        Boolean(formik.errors.name)
                                                    }
                                                />
                                                {formik.touched.description &&
                                                    Boolean(formik.errors.description) && (
                                                        <FormHelperText className="required_text">
                                                            {" "}
                                                            {formik.errors.description
                                                                ? formik.errors.description.toString()
                                                                : ""}
                                                        </FormHelperText>
                                                    )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </form>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <LoadingButton
                        sx={{ p: "12px 24px" }}
                        onClick={() => formik.handleSubmit()}
                        type="submit"
                        loading={id ? isPendingUpdate : isPendingInsert}
                        variant="contained"
                        size="large"
                    >
                        Lưu
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    );
}
