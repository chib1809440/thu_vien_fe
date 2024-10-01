import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
    Alert,
    Button,
    Checkbox,
    Chip,
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
    capitalize,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

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
import { usePermissionList, useResourceList } from "../../../hooks/react-query/authData";
import { Role } from "../../../interfaces/role";

interface DialogProps {
    id?: string,
    open: boolean,
    handleOpen: (e) => void,
    fullScreen?: boolean,
    content?: React.ReactNode,
    action?: React.ReactNode,
    title: string,
    role?: Role,
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"
}
export default function RoleDecentralizeDialog({ title, maxWidth, id, content, action, fullScreen, open, role, handleOpen }: DialogProps) {
    const [checkedPermissions, setCheckedPermissions] = useState<{ resource: string, permission: string }[]>([]);
    const { data: resources, isPending: isPendingResources } = useResourceList();
    const { data: permissions, isPending: isPendingPermissions } = usePermissionList();

    const onHandleClose = () => {
        handleOpen(false);
        setCheckedPermissions([]); // Reset the checked permissions when closing the dialog
    };

    const handleCheckboxChange = (resource: string, permission: string) => {
        const currentIndex = checkedPermissions.findIndex(
            (item) => item.resource === resource && item.permission === permission
        );

        const newCheckedPermissions = [...checkedPermissions];

        if (currentIndex === -1) {
            // Nếu checkbox chưa được chọn, thêm permission vào
            const permissions = checkedPermissions.filter(x => x.resource === resource)
            if (permissions.length === 3) {
                newCheckedPermissions.push({ resource, permission: 'manage' });
            }
            newCheckedPermissions.push({ resource, permission });
        } else {
            // Nếu checkbox đã được chọn, bỏ permission đó ra

            newCheckedPermissions.splice(currentIndex, 1);
            // Nếu có 4 permission, bỏ chọn 'manage'
            const permissions = checkedPermissions.filter(x => x.resource === resource)
            if (permissions.length === 4) {
                newCheckedPermissions.push({ resource, permission: 'manage' });
            }
            const manageIndex = newCheckedPermissions.findIndex(item => item.resource === resource && item.permission === 'manage');
            if (manageIndex !== -1) {
                newCheckedPermissions.splice(manageIndex, 1); // Bỏ chọn 'manage'
            }
        }
        // Nếu 'manage' được chọn, chọn tất cả permissions cho resource đó
        if (permission === 'manage' && currentIndex === -1) {
            // Nếu chọn 'manage', thêm tất cả permissions khác cho resource này
            permissions?.data?.result.forEach((perm) => {
                if (perm !== 'manage') {
                    const existingIndex = checkedPermissions.findIndex(item => item.resource === resource && item.permission === perm);
                    if (existingIndex === -1) {
                        newCheckedPermissions.push({ resource, permission: perm }); // Chỉ thêm nếu chưa có permission này
                    }
                }
            });
        }

        // Nếu 'manage' bị bỏ chọn, bỏ tất cả permissions khác cho resource đó
        if (permission === 'manage' && currentIndex !== -1) {
            // Lọc bỏ tất cả permissions liên quan đến resource này
            const filteredPermissions = newCheckedPermissions.filter(item => item.resource !== resource);
            setCheckedPermissions(filteredPermissions);
            return; // Dừng lại ở đây sau khi bỏ tất cả permissions
        }

        setCheckedPermissions(newCheckedPermissions);
    };

    console.log(checkedPermissions);
    const isChecked = (resource: string, permission: string) => {
        return checkedPermissions.some(item => item.resource === resource && item.permission === permission);
    };

    if (isPendingResources || isPendingPermissions) {
        return <>Loading.....</>
    }
    return (
        <>
            <Dialog
                maxWidth="lg"
                fullWidth
                open={open}
                // onClose={() => handleOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <DialogTitle sx={{ m: 0, pt: 3, pb: 5 }} id="customized-dialog-title">
                    <Typography variant="h4">{title + ' ' + role.name}</Typography>
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
                    <Grid container spacing={2}>
                        {
                            resources?.data?.result.map((resource, index) => (
                                <Grid item xs={12} sm={3} key={index}>
                                    <Box sx={{ px: 3, py: 3, border: '2px solid rgba(0, 0, 0, 0.2)', borderRadius: '10px' }}>
                                        <Typography sx={{ mb: 1 }}>
                                            <Chip label={capitalize(resource)} color="primary" />
                                        </Typography>
                                        {
                                            permissions?.data?.result.map((permission, index) => (
                                                <Box sx={{ ml: permission !== 'manage' ? 8 : 4 }} key={index}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={isChecked(resource, permission)}
                                                                onChange={() => handleCheckboxChange(resource, permission)}
                                                            />
                                                        }
                                                        label={capitalize(permission)}
                                                    />
                                                </Box>
                                            ))
                                        }
                                    </Box>
                                </Grid>
                            ))
                        }
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <LoadingButton
                        sx={{ p: "12px 24px" }}
                        type="submit"
                        loading={false}
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
