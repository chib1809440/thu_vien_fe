import { memo, useMemo } from "react";

// material-ui
import { Avatar, Box, Drawer, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import { useDispatch, useSelector } from "../../../store";
import { drawerWidth } from "../../../store/constant";
import { openDrawer } from "../../../store/slices/menu";
import LogoSection from "../LogoSection";
import MenuList, { MenuListV2 } from "./MenuList";
import { useAuth } from "../../../contexts/JWTContext";
import Logo from "../../../ui-component/Logo";
import { IconMenu2 } from "@tabler/icons";

// ==============================|| SIDEBAR DRAWER ||============================== //

interface SidebarProps {
  window?: Window;
}

const Sidebar = ({ window }: SidebarProps) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state) => state.menu);
  console.log('ds', drawerOpen);

  const drawer = useMemo(
    () => (
      <PerfectScrollbar
        component="div"
        style={{
          // height: !matchUpMd ? "calc(100vh - 56px)" : "calc(100vh - 88px)",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingTop: "16px",
          paddingBottom: "16px",
        }}
      >

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between', // Space between Logo and Avatar
            alignItems: 'center', // Center vertically
            position: 'relative', // To use absolute centering for Logo
            padding: "16px"
          }}
        >
          {/* Spacer to push Logo to the center */}
          <Box sx={{ flex: 1 }} />

          {/* Logo at the center */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)', // Center horizontally
            }}
          >
            <Logo />
          </Box>

          {/* Avatar at the end */}
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
                color: theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.light,
              },
            }}
            onClick={() => {
              dispatch(openDrawer(false));
            }}
          >
            <IconMenu2 stroke={1.5} size="20px" />
          </Avatar>
        </Box>
        <MenuList />
      </PerfectScrollbar>
    ),
    []
  );

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <>
      <Box
        component="nav"
        sx={{
          flexShrink: { md: 0 },
          width: matchUpMd ? 280 : 'auto',
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant={matchUpMd ? 'persistent' : 'temporary'}
          anchor="left"
          open={drawerOpen}
          onClose={() => dispatch(openDrawer(!drawerOpen))}
          sx={{

            '& .MuiDrawer-paper': {
              width: 280,
              background: "linear-gradient(0deg, rgba(81, 116, 255, 1) 0%, rgba(255, 82, 207, 1) 100%)",
              color: theme.palette.text.primary,
              borderRight: 0,
              m: 0,
              padding: 0,
              height: "100vh",
              boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 12px",

            }
          }}
          ModalProps={{ keepMounted: true }}
          color="inherit"
        >
          {/* {drawerOpen && logo} */}
          {drawerOpen && drawer}
        </Drawer>

      </Box>

    </>
  );
};

export const SidebarV2 = ({ window }: SidebarProps) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));

  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state) => state.menu);
  const { user } = useAuth();
  const userPermissions = useMemo(() => {
    if (!user) return null;

    const _user = { ...user } as any;

    return _user.data.roleId.permissions;
  }, [user]);
  const logo = useMemo(
    () => (
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Box sx={{ display: "flex", p: 2, mx: "auto" }}>
          <LogoSection />

        </Box>
      </Box>
    ),
    []
  );

  const drawer = useMemo(
    () => (
      <PerfectScrollbar
        component="div"
        style={{
          height: !matchUpMd ? "calc(100vh - 56px)" : "calc(100vh - 88px)",
          paddingLeft: "16px",
          paddingRight: "16px",
          paddingTop: "16px",
          // background: "#F7F9FA",

        }}
      >
        <MenuListV2 />
        {/* <MenuCard /> */}
        <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
          {/* <Chip
            label={process.env.REACT_APP_VERSION}
            disabled
            chipcolor="secondary"
            size="small"
            sx={{ cursor: "pointer" }}
          /> */}
        </Stack>
      </PerfectScrollbar>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matchUpMd]
  );

  const container =
    window !== undefined ? () => window.document.body : undefined;
  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto' }} aria-label="mailbox folders">
      <Drawer
        container={container}
        variant={matchUpMd ? 'persistent' : 'temporary'}
        anchor="left"
        open={drawerOpen}
        onClose={() => dispatch(openDrawer(!drawerOpen))}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRight: 'none',
            [theme.breakpoints.up('md')]: {
              top: '88px'
            }
          }
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawerOpen && logo}
        {drawerOpen && drawer}
      </Drawer>
    </Box>
  );
};

export default memo(Sidebar);
