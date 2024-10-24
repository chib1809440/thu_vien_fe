import React, { useMemo } from "react";
import { Outlet } from "react-router-dom";

// material-ui
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { Theme, styled, useTheme } from "@mui/material/styles";

// project imports
import useConfig from "../../hooks/useConfig";
import navigation from "../../menu-items";
import { useDispatch, useSelector } from "../../store";
import { drawerWidth } from "../../store/constant";
import { openDrawer } from "../../store/slices/menu";
import Breadcrumbs from "../../ui-component/extended/Breadcrumbs";
import Header from "./Header";
import Sidebar, { SidebarV2 } from "./Sidebar";

// assets
import { IconChevronRight } from "@tabler/icons";
interface MainStyleProps {
  theme: Theme;
  open: boolean;
}

// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<MainStyleProps>(
  ({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shorter,
      }),
      [theme.breakpoints.up('md')]: {
        marginLeft: -(drawerWidth - 20),
        width: `calc(100% - ${drawerWidth}px)`,
      },
      [theme.breakpoints.down('md')]: {
        marginLeft: '20px',
        width: `calc(100% - ${drawerWidth}px)`,
        padding: '16px',
      },
      [theme.breakpoints.down('sm')]: {
        marginLeft: '10px',
        width: `calc(100% - ${drawerWidth}px)`,
        padding: '16px',
        marginRight: '10px',
      },
    }),
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.shorter,
      }),
      marginLeft: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      width: `calc(100% - ${drawerWidth}px)`,
      [theme.breakpoints.down('md')]: {
        marginLeft: '20px',
      },
      [theme.breakpoints.down('sm')]: {
        marginLeft: '10px',
      },
    }),
  })
);

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("lg"));

  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state) => state.menu);
  const barcode = useSelector((state) => state.barcode);
  const { userID, openBC } = barcode;
  const { container } = useConfig();

  React.useEffect(() => {
    dispatch(openDrawer(!matchDownMd));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownMd]);

  const header = useMemo(
    () => (
      <Toolbar
      >
        <Header />
      </Toolbar>
    ),
    []
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: drawerOpen ? theme.transitions.create('width') : 'none'
        }}
      >
        {header}
      </AppBar>

      {/* drawer */}
      <Sidebar />
      {/* main content */}
      <>
        <Main theme={theme} open={drawerOpen} sx={{ pt: 5, marginTop: '80px' }}>
          {/* breadcrumb */}
          {container && (
            <Container maxWidth="lg">
              <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
              <Outlet />
            </Container>
          )}
          {!container && (
            <>
              <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
              <Outlet />
            </>
          )}
        </Main>
        {/* {openBC && <ModalUser isOpen={openBC} userID={userID}/>} */}
      </>
      {/* <Customization /> */}
      {/* <ModalTraSach isOpen={isOpenV2} userID={props.userID} isClose={(newIs) => setOpenV2(newIs)} /> */}
    </Box>
  );
};

export const MainLayoutV2 = () => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down("lg"));

  const dispatch = useDispatch();
  const { drawerOpen } = useSelector((state) => state.menu);
  const { container } = useConfig();


  React.useEffect(() => {
    dispatch(openDrawer(!matchDownMd));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownMd]);

  const header = useMemo(
    () => (
      <Toolbar
      >
        <Header />
      </Toolbar>
    ),
    []
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: drawerOpen ? theme.transitions.create('width') : 'none'
        }}
      >
        {header}
      </AppBar>

      {/* drawer */}
      <SidebarV2 />
      {/* <ProviderLoader> */}
      {/* main content */}
      <>
        <Main theme={theme} open={drawerOpen} sx={{ pt: 5, marginTop: '80px' }}>
          {/* breadcrumb */}
          {container && (
            <Container maxWidth="lg">
              <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
              <Outlet />
            </Container>
          )}
          {!container && (
            <>
              <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
              <Outlet />
            </>
          )}
        </Main>
      </>
      {/* </ProviderLoader> */}

      {/* <Customization /> */}
      {/* <ModalTraSach isOpen={isOpenV2} userID={props.userID} isClose={(newIs) => setOpenV2(newIs)} /> */}
    </Box>
  );
};

export default MainLayout;
