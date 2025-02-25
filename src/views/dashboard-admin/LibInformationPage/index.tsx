import { Box, CardMedia, Grid, LinearProgress, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import IconEmail from "../../../assets/images/contact/email.svg";
import IconFacebook from "../../../assets/images/contact/facebook.svg";
import { useAuth } from "../../../contexts/JWTContext";
import { useEditLibrary } from "../../../hooks/services/library/library-mutation";
import {
    useFetchLibraryById,
    useReFetchLibrary,
    useReFetchLibraryById,
} from "../../../hooks/services/library/library-query";
import { TLibraryCreate } from "../../../types/models/library.type";
import ButtonGD from "../../../ui-component/ButtonGD";
import MainCard from "../../../ui-component/cards/MainCard";
import FormAddEditLibrary from "../LibraryPage/ui-components/FormAddEditLibrary";

const LibInformationPage = () => {
    const { user } = useAuth();
    const mutationUpdate = useEditLibrary();
    const revalidate = useReFetchLibrary();
    const revalidateById = useReFetchLibraryById();
    const [openAddEdit, setOpenAddEdit] = useState(false);

    const libraryId = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?.libraryId;
    }, [user]);

    const { data: libraryInfo } = useFetchLibraryById(libraryId);

    const handleClose = () => {
        setOpenAddEdit(false);
    };
    const handleSubmit = (values: TLibraryCreate) => {
        if (libraryInfo) {
            mutationUpdate.mutate(
                { ...values, _id: libraryInfo._id },
                {
                    onSuccess: () => {
                        revalidateById(libraryInfo._id);
                        revalidate();
                        toast.success("Chỉnh sửa thành công.");
                        handleClose();
                    },
                }
            );
            return;
        }
    };

    const handleClickUpdate = () => {
        setOpenAddEdit(true);
    };

    const initialValues = useMemo((): TLibraryCreate => {
        if (libraryInfo) {
            return {
                name: libraryInfo.name,
                address: libraryInfo.address,
                managementAgency: libraryInfo.managementAgency,
                phoneNumber: libraryInfo.phoneNumber,
                email: libraryInfo.email,
                facebook: libraryInfo.facebook,
                maxStorageLimit: libraryInfo.maxStorageLimit,
            };
        }

        return {
            name: "",
            address: "",
            managementAgency: "",
            phoneNumber: "",
            email: "",
            facebook: "",
            maxStorageLimit: 0,
        };
    }, [libraryInfo]);

    const usedStoragePercentage = libraryInfo?.maxStorageLimit
        ? (libraryInfo.totalStorageUsed / libraryInfo.maxStorageLimit) * 100
        : 0;

    return (
        <>
            {openAddEdit && (
                <FormAddEditLibrary
                    open={openAddEdit}
                    onClose={handleClose}
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    isEditMode={true}
                />
            )}

            <MainCard>
                {/* <Grid md={12} container justifyContent="flex-end">
                    <ButtonGD title="Cập nhật" onClick={handleClickUpdate} />
                </Grid> */}
                <Grid container md={12} justifyContent="space-around">
                    <Grid md={3} container>
                        <Grid lg={12}>
                            <img
                                style={{ borderRadius: "5px" }}
                                width="256px"
                                height="256px"
                                src={`${process.env.REACT_APP_BASE_API_FILE_URL}/default/logo_tong_gdvn_2024.jpg`}
                            />
                            {/* {preview === '' ? <img style={{ borderRadius: '5px' }} width='256px' height='256px' src="../../logo.png" /> : <img style={{ borderRadius: '5px' }} width='256px' height='auto' src={preview} />} */}
                        </Grid>
                        {/* <Grid lg={12} container gap={2}>
                            <InputLabel
                                sx={{ fontWeight: "700", fontSize: "16px" }}
                                id="upload-photo"
                            >
                                {" "}
                                Chọn hình ảnh
                                <Input
                                    type="file"
                                    name="photo"
                                    id="upload-photo"
                                    sx={{ display: "none" }}
                                    inputProps={{ accept: "image/*" }}
                                // onChange={handleImageInput}
                                />
                            </InputLabel>
                             {preview !== '' &&  onClick={handlClickUpLogo} 
                             <ButtonGD title="Xác nhận"></ButtonGD> 
                             } 
                        </Grid> */}
                    </Grid>
                    <Grid md={8} container justifyContent="flex-start" alignItems="flex-start">
                        <Grid container justifyContent="space-between">
                            <Grid md={8}>
                                {
                                    libraryInfo?.managementAgency &&
                                    <Typography mt={2} textAlign="left" variant="h4">
                                        Cơ quan quản lý:
                                        <Typography component="span" textTransform={"capitalize"}>
                                            {` ${libraryInfo?.managementAgency || ""}`}
                                        </Typography>
                                    </Typography>
                                }


                                <Typography mt={2} textAlign="left" variant="h4">
                                    Tên trường:
                                    <Typography component="span" textTransform={"capitalize"}>
                                        {` ${libraryInfo?.name || ""}`}
                                    </Typography>
                                </Typography>

                                {
                                    libraryInfo?.address &&
                                    <Typography mt={2} textAlign="left" variant="h4">
                                        Địa chỉ:
                                        <Typography component="span" textTransform={"capitalize"}>
                                            {` ${libraryInfo?.address || ""}`}
                                        </Typography>
                                    </Typography>
                                }

                                {
                                    libraryInfo?.phoneNumber &&
                                    <Typography mt={2} textAlign="left" variant="h4">

                                        Điện thoại:
                                        <Typography component="span" textTransform={"capitalize"}>
                                            {` ${libraryInfo?.phoneNumber || ""}`}
                                        </Typography>
                                    </Typography>
                                }


                                <Box>
                                    <Typography mt={2} textAlign="left" variant="h4">
                                        Bộ nhớ đã dùng ({usedStoragePercentage.toFixed(2)}%)
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={usedStoragePercentage}
                                        sx={{
                                            marginTop: 2,
                                            backgroundColor: '#e0e0e0',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: usedStoragePercentage > 80 ? '#f44336' : '#3f51b5',
                                            },
                                        }}
                                    />
                                    <Box sx={{ mt: 1 }}>
                                        Đã sử dụng
                                        <Typography component="span" textTransform={"capitalize"}>
                                            {` ${(libraryInfo?.totalStorageUsed / 1024).toFixed(2) || ""}`} GB
                                        </Typography>

                                        <Typography component="span" ml={1}>
                                            trong tổng số
                                            {` ${(libraryInfo?.maxStorageLimit / 1024).toFixed(2) || ""}`} GB
                                        </Typography>
                                    </Box>

                                </Box>
                            </Grid>
                            <Grid md={4} mt={3}>
                                <Grid container alignItems="center" justifyContent="flex-end">
                                    {libraryInfo?.facebook && (
                                        <a
                                            href={libraryInfo?.facebook}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <CardMedia
                                                component="img"
                                                image={IconFacebook}
                                                sx={{ width: 40, height: 40 }}
                                            />
                                        </a>
                                    )}
                                </Grid>
                                <Grid container alignItems="center" justifyContent="flex-end">
                                    {libraryInfo?.email && (
                                        <a
                                            href={libraryInfo?.email}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            {libraryInfo?.email}
                                            <CardMedia
                                                component="img"
                                                image={IconEmail}
                                                sx={{ width: 40, height: 40, ml: 1 }}
                                            />
                                        </a>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default LibInformationPage;
