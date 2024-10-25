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
import { IconChevronDown, IconHomeBitcoin } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { CsFlexRowBetween } from '../../../../components/default/flex';
import ImageComponent from '../../../../components/default/image';
import { useRoleList } from '../../../../hooks/react-query/roleData';
import { useUser } from '../../../../hooks/react-query/userData';
import { useFetchLibrary } from '../../../../hooks/services/library/library-query';
import useAuth from '../../../../hooks/useAuth';
import { CreateUserModel } from '../../../../interfaces/user';
import { statusRole } from '../../../../utils/constants.utils';
import { getLabelFromOptions } from '../../../../utils/object';
import FormProfile from './FormProfile';

// ==============================|| PROFILE MENU ||============================== //
const settings = [
    { name: "Thông tin cá nhân", icon: <IconUser /> },
    { name: "Đăng xuất", icon: <IconLogout /> },
];

const ProfileSection = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [open] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const theme = useTheme();
    const anchorRef = useRef<any>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const roleId = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?.roleId;
    }, [user]);

    const userID = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?._id;
    }, [user]);

    const libraryId = useMemo(() => {
        if (!user) return null;

        const _user = { ...user } as any;

        return _user?.data?.libraryId;
    }, [user]);
    const { data: userData } = useUser(userID);
    const { data: roleOptions } = useRoleList();
    const { data: libraryOptions } = useFetchLibrary();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleProfileClick = () => {
        handleCloseUserMenu();
        setOpenDialog(true);
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
    
    const initialValues = useMemo((): CreateUserModel => {
        if (userData) {
            const user = userData?.data?.result;

            return {
                email: user.email,
                fullname: user.fullname,
                phoneNumber: user.phoneNumber,
                address: user.address,
                birthday: user.birthday,
                gender: user.gender,
                roleId: user.roleId  as string,
                libraryId: user.libraryId as string,
            };
        }
    }, [userData]);

    return (
        <Grid item>
            <Box sx={{ display: "flex", gap: 1 }}>
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
                        <ImageComponent width="32px" height="32px" alt="Remy Sharp" src="/images/boy.png" />
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
                            onClick={setting.name === "Đăng xuất" ? handleLogoutClick : handleProfileClick}
                            key={setting.name}
                        >
                            <ListItemIcon>
                                {setting.icon}
                            </ListItemIcon>
                            {setting.name}
                        </MenuItem>
                    ))}
                    {libraryId && (
                        <>
                            <Divider sx={{ margin: 0 }} />
                            <Box sx={{ display: "flex", pl: 2, pr: 2, py: 1, alignItems: "center" }}>
                                <ListItemIcon sx={{ color: "#102e9e" }}>
                                    <IconHomeBitcoin stroke={2} />
                                </ListItemIcon>
                                <Typography sx={{ color: "#102e9e" }} variant="body2" textTransform={"capitalize"} >{libraryId.name}</Typography>
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
                    isEditMode={true}
                    roleOptions={roleOptions?.data?.result}
                    libraryOptions={libraryOptions?.data?.result}
                />
            )}
        </Grid>
    );
};

export default ProfileSection;
