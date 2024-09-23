// material-ui
import { Avatar, Box, Button, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// project imports
import { IconLogout, IconMenu2 } from "@tabler/icons";
import { useDispatch, useSelector } from "../../../store";
import { openDrawer } from "../../../store/slices/menu";
import Customization from "../../Customization";
import LogoSection from "../LogoSection";
import ProfileSection from "./ProfileSection";
import { useNavigate } from "react-router-dom";
import React from "react";
import { isLoginWaiting } from "../../../store/slices/isLoginLT";


// ==============================|| MAIN NAVBAR / HEADER ||============================== //


const Header = () => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { drawerOpen } = useSelector((state) => state.menu);

  const { isLogin } = useSelector((state) => state.isLogin);
  React.useEffect(() => {
      dispatch(isLoginWaiting());
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('serviceTokenLT');
    navigate('trang-chu', { replace: true });
  };

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: "flex",
          [theme.breakpoints.down("md")]: {
            width: "auto",
          },
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>

        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
            color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
            '&:hover': {
              background: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark,
              color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.light
            }
          }}
          onClick={() => dispatch(openDrawer(!drawerOpen))}
          color="inherit"
        >
          <IconMenu2 stroke={1.5} size="20px" />
        </Avatar>
      </Box>

      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* mega-menu */}
      {/* <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <MegaMenuSection />
      </Box> */}

      {/* live customization & localization */}
      {/* <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <LocalizationSection />
      </Box> */}

      {/* notification & profile */}
      {/* <NotificationSection /> */}
      {/* <h4 style={{ marginRight: '10px', fontWeight: '500' }}>Xin chào <strong>{user?.fullName}</strong></h4> */}
      <ProfileSection />
      <Box sx={{ flexGrow: 0.01 }} />
      {isLogin &&
      <Grid item>
        <Button variant="outlined" onClick={handleLogout} startIcon={<IconLogout />}>
          Đăng xuất Liên thông
        </Button>
      </Grid>
      }
      <Customization />

      {/* mobile header */}
      {/* <Box sx={{ display: { xs: "block", sm: "none" } }}>
        <MobileSection />
      </Box> */}
    </>
  );
};

export default Header;
