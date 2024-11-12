import {
    Box,
    Divider,
    Grid,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Typography,
    useTheme
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';

import { IconLogout, IconUser } from '@tabler/icons';
import { IconBrandSamsungpass, IconChevronDown, IconHomeBitcoin, IconShoppingCartFilled } from '@tabler/icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CsFlexRowBetween } from '../../../../components/default/flex';
import ImageComponent from '../../../../components/default/image';
import { useChangeInfo, useChangePasswordUser, useUser } from '../../../../hooks/react-query/userData';
import { useAddLoanSlip } from '../../../../hooks/services/loanSlip/loanSlip-mutation';
import { useReFetchLoanSlipLink } from '../../../../hooks/services/loanSlip/loanSlip-query';
import useAuth from '../../../../hooks/useAuth';
import { Role } from '../../../../interfaces/role';
import { ChangePasswordUserModel, CreateUserModel, User } from '../../../../interfaces/user';
import { clearCart } from '../../../../store/slices/cartLoanSlip';
import { TLibrary } from '../../../../types/models/library.type';
import { CreatePublication } from '../../../../types/models/loanSlip.type';
import { statusRole } from '../../../../utils/constants.utils';
import { getLabelFromOptions } from '../../../../utils/object';
import FormAddEditLibLoanSlip from '../../../../views/dashboard-admin/LienThong/LIB/LibLoanSlipPage/ui-components/FormAddEditLibLoanSlip';
import FormProfile from './FormProfile';
import { LOGIN, LOGOUT } from '../../../../store/actions';
import FormChangePassword from './FormChangePassword';
import FormAddEditLoanSlip from '../../../../views/dashboard-admin/LoanSlipPage/ui-components/FormAddEditLoanSlip';
import { clearInternalCart } from '../../../../store/slices/cartInternalLoanSlip';
// ==============================|| PROFILE MENU ||============================== //
const settings = [
    { name: "Thông tin cá nhân", icon: <IconUser /> },
    { name: "Đổi mật khẩu", icon: <IconBrandSamsungpass /> },
    { name: "Đăng xuất", icon: <IconLogout /> },
];

const ProfileSection = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [open] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
    const theme = useTheme();
    const anchorRef = useRef<any>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const items = useSelector((state: { cartLoanSlip: { items: CreatePublication[] } }) => state.cartLoanSlip.items);
    const internalItems = useSelector((state: { cartInternalLoanSlip: { items: CreatePublication[] } }) => state.cartInternalLoanSlip.items);

    const [selectedEdit, setSelectedEdit] = useState<User | null>(null);
    const mutationChangeInfo = useChangeInfo();
    const [openCart, setOpenCart] = useState(false);
    const [openInternalCart, setOpenInternalCart] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation(); // Lấy thông tin URL


    // Lấy đường dẫn từ location.pathname
    const currentPath = location.pathname; // Ví dụ: "/len-thong/"
    const roleId = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?.roleId;
    }, [user]);
    const roleName = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?.roleId.name;
    }, [user]);
    const userID = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?._id;
    }, [user]);

    const avatar = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;
        console.log("new user", _user);

        return _user?.data?.avatar;
    }, [user]);

    console.log("avatar", avatar);

    const libraryDetail = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?.libraryDetail;
    }, [user]);
    const { data: userData } = useUser(userID);


    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleProfileClick = (userId: string) => {
        handleCloseUserMenu();
        if (userId) {
            const selectedUser = userData?.data?.result;
            setSelectedEdit(selectedUser);
        }
        setOpenDialog(true);
    };
    const handleChangePasswordClick = () => {
        handleCloseUserMenu();
        setOpenChangePasswordDialog(true);
    };


    const handleLogoutClick = async () => {
        handleCloseUserMenu();
        try {
            await logout();
            localStorage.removeItem('serviceTokenLT');
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const handleDialogClose = () => {
        setOpenDialog(false);
    };
    const handleChangePasswordDialogClose = () => {
        setOpenChangePasswordDialog(false);
    };
    const handleClose = () => {
        setOpenCart(false);
    };
    const handleInternalClose = () => {
        setOpenInternalCart(false);
    };
    const initialValues = useMemo((): CreateUserModel => {
        if (userData) {
            const user = userData?.data?.result;
            return {
                email: user?.email,
                fullname: user.fullname,
                phoneNumber: user.phoneNumber,
                address: user.address,
                birthday: user.birthday,
                gender: user.gender,
                class: user.class,
                school: user.school,
                avatar: user.avatar,
                roleId: (user.roleId as Role)?._id,
                libraryId: (user.libraryId as TLibrary)?._id,
            };
        }
    }, [userData]);
    const initialValueChangePassword = useMemo((): ChangePasswordUserModel => {
        if (userID) {
            return {
                userId: userID,
                password: '',
                newPassword: '',
                confirmPassword: ''
            };
        }
    }, [userData]);
    const mutationAdd = useAddLoanSlip();
    const mutationChangePassword = useChangePasswordUser();

    const revalidate = useReFetchLoanSlipLink();
    const handleSetOpenCart = () => {
        setOpenCart(true);
    };
    const handleSetOpenInternalCart = () => {
        setOpenInternalCart(true);
    };
    const handleSubmit = (values: any) => {
        mutationAdd.mutate(values, {
            onSuccess: (data) => {
                revalidate();
                toast.success('Thêm thành công.');
                dispatch(clearCart())
                setOpenCart(false);
            },
        });
    };
    const handleInternalSubmit = (values: any) => {
        mutationAdd.mutate(values, {
            onSuccess: (data) => {
                revalidate();
                toast.success('Thêm thành công.');
                dispatch(clearInternalCart())
                setOpenInternalCart(false);
            },
        });
    };
    const { updateProfile } = useAuth();

    const handleSubmitChangeInfo = async (values: CreateUserModel) => {
        console.log(values, 'kkkjasdkjaskjdas');

        if (selectedEdit) {
            mutationChangeInfo.mutate(
                { ...values, _id: selectedEdit._id },
                {
                    onSuccess: (data) => {
                        toast.success("Chỉnh sửa thành công.");
                        const loca = localStorage.getItem('dataUser');
                        const user = JSON.parse(loca)
                        const userUpdated = data.data.result

                        const chageLocalStorage = {
                            ...user,
                            data: {
                                ...user.data, avatar: userUpdated.avatar,
                                address: userUpdated.address,
                                birthday: userUpdated.birthday,
                                class: userUpdated.class,
                                school: userUpdated.school,
                                email: userUpdated.email,
                                fullname: userUpdated.fullname,
                                gender: userUpdated.gender,
                                phoneNumber: userUpdated.phoneNumber,
                            }
                        }
                        console.log(chageLocalStorage, 'kkkkkkk')
                        localStorage.setItem("dataUser", JSON.stringify(chageLocalStorage));
                        updateProfile(chageLocalStorage);
                    },
                }
            );
            return;
        }
    }
    console.log('dsds', user);

    const handleChangePasswordSubmit = (values: any) => {
        mutationChangePassword.mutate(values, {
            onSuccess: (data) => {
                revalidate();
                toast.success('Đổi mật khẩu thành công.');
            },
            onError: (data) => {
                revalidate();
                toast.error(data.message);
            },
        });
    };
    return (
        <Grid item>
            <Box sx={{ display: "flex", gap: 1 }}>
                {openCart && (
                    <FormAddEditLibLoanSlip
                        open={openCart}
                        onClose={handleClose}
                        onSubmit={handleSubmit}
                        isEditMode={false}
                        isCart={true}
                    />
                )}
                {openInternalCart && (
                    <FormAddEditLoanSlip
                        roleName={roleName}
                        open={openInternalCart}
                        onClose={handleInternalClose}
                        onSubmit={handleInternalSubmit}
                        isEditMode={false}
                        isCart={true}
                    />
                )}
                {location.pathname.includes("/lien-thong") ? (
                    <Box
                        sx={{
                            mt: 1,
                            position: 'relative',
                            display: 'inline-flex',
                            alignItems: 'center',
                            mr: 2
                        }}
                        onClick={handleSetOpenCart}
                    >
                        <IconShoppingCartFilled size={32} />
                        {items?.length > 0 && ( // Show badge only if item count is greater than 0
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: -8,
                                    right: -12,
                                    bgcolor: 'black', // Badge background color
                                    color: 'white', // Badge text color
                                    borderRadius: '50%',
                                    width: '20px', // Badge diameter
                                    height: '20px', // Badge diameter
                                    display: 'flex',
                                    padding: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px', // Font size
                                }}
                            >
                                <Typography variant="h5" sx={{ color: "white" }}>
                                    {items.length}
                                </Typography> {/* Display item count */}
                            </Box>
                        )}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            mt: 1,
                            position: 'relative',
                            display: 'inline-flex',
                            alignItems: 'center',
                            mr: 2
                        }}
                        onClick={handleSetOpenInternalCart}
                    >
                        <IconShoppingCartFilled size={32} />
                        {internalItems?.length > 0 && ( // Show badge only if item count is greater than 0
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: -8,
                                    right: -12,
                                    bgcolor: 'black', // Badge background color
                                    color: 'white', // Badge text color
                                    borderRadius: '50%',
                                    width: '20px', // Badge diameter
                                    height: '20px', // Badge diameter
                                    display: 'flex',
                                    padding: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px', // Font size
                                }}
                            >
                                <Typography variant="h5" sx={{ color: "white" }}>
                                    {internalItems.length}
                                </Typography> {/* Display item count */}
                            </Box>
                        )}
                    </Box>
                )}
                <CsFlexRowBetween onClick={handleOpenUserMenu} gap={1}
                    sx={{
                        bgcolor: theme.palette.background.paper,
                        border: `2px solid ${theme.palette.grey[300]}`,
                        px: "4px",
                        pr: "8px",
                        py: "4px",
                        borderRadius: "20px",
                        cursor: "pointer"
                    }} >
                    <IconButton sx={{ p: 0, }}>
                        <img style={{ borderRadius: "50%" }} width="32px" height="32px" alt="Remy Sharp" src={avatar !== '' ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${avatar}` : "/image/boy.png"} />
                    </IconButton>
                    <Typography variant="body2">{getLabelFromOptions(statusRole, roleId?.name)}</Typography>
                    <IconChevronDown size={"18px"} stroke={1.5} />
                </CsFlexRowBetween>

                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    {settings.map((setting) => (
                        <MenuItem
                            onClick={
                                setting.name === "Đăng xuất"
                                    ? handleLogoutClick
                                    : setting.name === "Đổi mật khẩu"
                                        ? handleChangePasswordClick
                                        : () => handleProfileClick(userID)
                            }
                            key={setting.name}
                        >
                            <ListItemIcon>
                                {setting.icon}
                            </ListItemIcon>
                            {setting.name}
                        </MenuItem>
                    ))}
                    {libraryDetail && (
                        <>
                            <Divider sx={{ margin: 0 }} />
                            <Box sx={{ display: "flex", pl: 2, pr: 2, py: 1, alignItems: "center" }}>
                                <ListItemIcon sx={{ color: "#102e9e" }}>
                                    <IconHomeBitcoin stroke={2} />
                                </ListItemIcon>
                                <Typography sx={{ color: "#102e9e" }} variant="body2" textTransform={"capitalize"} >{libraryDetail.name}</Typography>
                            </Box>
                        </>

                    )}
                </Menu>
            </Box>

            {openDialog && (
                <FormProfile
                    open={openDialog}
                    onClose={handleDialogClose}
                    initialValues={initialValues}
                    isEditMode={selectedEdit ? true : false}
                    onSubmit={handleSubmitChangeInfo}
                    imageUrl={`${process.env.REACT_APP_BASE_API_FILE_URL}/${selectedEdit.avatar}`}
                />
            )}
            {openChangePasswordDialog && (
                <FormChangePassword
                    open={openChangePasswordDialog}
                    onClose={handleChangePasswordDialogClose}
                    onSubmit={handleChangePasswordSubmit}
                    initialValues={initialValueChangePassword}
                    isEditMode={true}
                />
            )}
        </Grid>
    );
};

export default ProfileSection;
