import React from 'react';
// assets
import { useTheme } from '@mui/material/styles';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useFormik } from "formik";
import * as yup from "yup";
import axios from '../utils/axios';
import { Box, Button, CardActions, CardContent, CardProps, Modal, Stack, TextField, Typography } from '@mui/material';
// project imports
import MainCard from '../ui-component/cards/MainCard';// assets
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { dispatch } from '../store';
import { openSnackbar } from '../store/slices/snackbar';

const validationSchema = yup.object().shape({
    note: yup.string().required("Vui lòng điền lý do từ chối"),
});
// modal position
function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`
    };
}
interface BodyProps extends CardProps {
    modalStyle: React.CSSProperties;
    handleClose: () => void;
    value?: string,
    setValue?: React.Dispatch<React.SetStateAction<string>>,
    projectDetails?: any,
    passportImage?: string
}
const fetchData = async (url: string, body?: any) => {
    try {
        if (body) {
            const res = await axios.put(url, body);
            return res;
        }
        else {
            const res = await axios.get(url);
            return res;
        }
    }
    catch (e) {
        return false;
    }
};
const alertSnackbar = (message: string, color: string) => {
    dispatch(openSnackbar({
        open: true,
        message: message,
        variant: 'alert',
        alert: {
            color: color
        },
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        close: false,
        autoHideDuration: 2000
    }))    
}
const BodyApprove = React.forwardRef(({ modalStyle, handleClose, projectDetails, passportImage }: BodyProps, ref: React.Ref<HTMLDivElement>) => {
    const id = projectDetails._id;
    const body = {
        projectType: projectDetails.projectType,
        applicationType: projectDetails.applicationType,
        passportImage: passportImage
    }
    const handleApprove = () => {
        fetchData(`application/approve/${id}`, body).then(val => {
            if (val && (val.status === 200 || val.status === 201)) {
                handleClose();
                alertSnackbar('Duyệt hồ sơ thành công', 'success');
                window.location.href = "/trang-chu";
            }
            else {
                handleClose();
                alertSnackbar('Duyệt hồ sơ thất bại. Vui lòng liên hệ để được hỗ trợ', 'error')
            }
        }).catch()

    }
    return (
        <div ref={ref} tabIndex={-1}>
            <MainCard
                style={modalStyle}
                sx={{
                    position: 'absolute',
                    width: { xs: 280, lg: 450 },
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                content={false}
            >
                <Box sx={{ padding: '24px' }}>
                    <Typography variant="body1" sx={{ fontWeight: 900 }}>Bạn có chắc chắn muốn xác nhận hồ sơ này ?</Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                        Sau khi phê duyệt, thông tin dự án sẻ được công khai tại trang DApp
                    </Typography>
                    <Box sx={{ justifyContent: "flex-end", alignItems: "center", display: 'flex', p: "18px" }}>
                        <Typography variant="body2" sx={{ color: "red", cursor: "pointer" }} onClick={handleClose}>
                            Hủy
                        </Typography>
                        <Button sx={{ ml: 3 }} variant="contained" type="button" onClick={handleApprove}>
                            Xác nhận
                        </Button>
                    </Box>
                </Box>
            </MainCard>
        </div>
    )
});
const BodyReject = React.forwardRef(({ modalStyle, handleClose, setValue, value, projectDetails }: BodyProps, ref: React.Ref<HTMLDivElement>) => {
    const id = projectDetails._id;
    const formik = useFormik({
        initialValues: {
            note: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            const body = {
                projectType: projectDetails.projectType,
                note: values.note
            }
            fetchData(`application/cancel/${id}`, body).then(val => {
                if (val && (val.status === 200 || val.status === 201)) {
                    handleClose();
                    alertSnackbar('Từ chối hồ sơ thành công', 'success')
                    window.location.href = "/trang-chu";
                }
                else {
                    handleClose();
                    alertSnackbar('Từ chối hồ sơ thất bại. Vui lòng liên hệ để được hỗ trợ', 'error')
                }
            }).catch()
        }
    });
    return (
        <div ref={ref} tabIndex={-1}>
            <MainCard
                style={modalStyle}
                sx={{
                    position: 'absolute',
                    width: { xs: 280, lg: 450 },
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                content={false}
            >
                <form onSubmit={formik.handleSubmit} id="validation-forms">
                    <CardContent>
                        <Typography variant="body1" sx={{ fontWeight: 900 }}>Xác nhận từ chối</Typography>
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            Sau khi từ chối, hồ sơ dự án sẻ không được lưu trữ, tổ chức sẻ phải thực hiện lại từ đầu.
                        </Typography>
                        <TextField sx={{ mt: 3 }}
                            id="note"
                            name="note"
                            label="Lý do từ chối..."
                            fullWidth
                            value={formik.values.note}
                            onChange={formik.handleChange}
                            multiline
                            rows={2}
                            error={formik.touched.note && Boolean(formik.errors.note)}
                            helperText={formik.touched.note && formik.errors.note}
                        />
                        <CardActions sx={{ justifyContent: "flex-end", alignItems: "center", display: 'flex' }}>
                            <Typography variant="body2" sx={{ color: "red", cursor: "pointer" }} onClick={handleClose}>
                                Xem lại
                            </Typography>
                            <Button sx={{ ml: 3 }} type="submit" variant="contained">
                                Xác nhận
                            </Button>
                        </CardActions>
                    </CardContent>
                </form>
            </MainCard>
        </div>
    )
});
// ==============================|| SIMPLE MODAL ||============================== //
export default function ModalProfile({ projectDetails, passportImage }: any) {
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const [checktype, Setchecktype] = React.useState<string>();
    const [value, setValue] = React.useState<string>('');
    const handleOpen = (e: string) => {
        setOpen(true);
        Setchecktype(e);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <Stack direction="row" justifyContent="flex-end" sx={{ px: 2 }}>
            <Modal open={open} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                {checktype === "approve" ?
                    (<BodyApprove modalStyle={modalStyle} handleClose={handleClose} projectDetails={projectDetails} passportImage={passportImage} />) :
                    (<BodyReject modalStyle={modalStyle} handleClose={handleClose} value={value} setValue={setValue} projectDetails={projectDetails} ></BodyReject>)
                }
            </Modal>
            <Box>
                <Button startIcon={<ClearOutlinedIcon />} onClick={(e) => handleOpen('reject')} variant="contained" type="submit" sx={{ background: theme.palette.error.main, '&:hover': { background: theme.palette.error.dark } }}>
                    Từ chối
                </Button>
                <Button startIcon={<CheckBoxOutlinedIcon />} onClick={e => handleOpen('approve')} variant="contained" type="submit" sx={{
                    background: theme.palette.success.dark,
                    '&:hover': { background: theme.palette.success.main },
                    ml: 2
                }}>
                    Phê duyệt hồ sơ
                </Button>
            </Box>
        </Stack>
    )
}
