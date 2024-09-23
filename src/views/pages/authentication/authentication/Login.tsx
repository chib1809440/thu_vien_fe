import { Link } from 'react-router-dom';
// material-ui
import { Box, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// project imports
import { AuthSliderProps } from '../../../../types';
import Logo from '../../../../ui-component/Logo';
import AuthFooter from '../../../../ui-component/cards/AuthFooter';
import AuthSlider from '../../../../ui-component/cards/AuthSlider';
import AuthSliderV2 from '../../../../ui-component/cards/AuthSliderV2';
import BackgroundPattern2 from '../../../../ui-component/cards/BackgroundPattern2';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthWrapper2 from '../AuthWrapper2';
import AuthLogin from '../auth-forms/AuthLogin';

// assets

// carousel items
const items: AuthSliderProps[] = [
    {
        title: 'Số hóa và chuyển đổi số',
        description: 'Cung cấp các giải pháp công nghệ toàn diện'
    },
    {
        title: 'Số hóa và chuyển đổi số trong Giáo dục',
        description: 'Chuyên hỗ trợ cung cấp thiết bị công nghệ, phần mềm hình thành giải pháp đáp ứng số hóa và chuyển đối số trong Giáo dục theo Thông tư 37/2021/TT-BGDĐT, 38/2021/TT-BGDĐT, 39/2021/TT-BGDĐT'
    },
    {
        title: 'Giải pháp toàn diện',
        description: 'Cung cấp giải pháp, phần mềm, thiết bị toàn diện cho khách hàng'
    }
];

const itemsV2:any = [
    {
        title: '/model/Render1.png',
        description: ''
    },
    {
        title: '/model/Render2.png',
        description: ''
    },
    {
        title: '/model/Render3.png',
        description: ''
    },
    {
        title: '/model/Render4.png',
        description: ''
    },
    {
        title: '/model/Render5.png',
        description: ''
    },
    {
        title: '/model/Render6.png',
        description: ''
    },
];

// ================================|| AUTH2 - LOGIN ||================================ //

const Login = () => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

    return (
        <AuthWrapper2>
            <Grid container justifyContent={matchDownSM ? 'center' : 'space-between'} alignItems="center">
                <Grid item md={6} lg={5} sx={{ position: 'relative', alignSelf: 'stretch', display: { xs: 'none', md: 'block' } }}>
                    <BackgroundPattern2>
                        <Grid item container justifyContent="center">
                            <Grid item xs={12}>
                                <Grid item container justifyContent="center" sx={{ pb: 2 }}>
                                    <Grid item xs={10} lg={8} sx={{ '& .slick-list': { pb: 2 } }}>
                                        <AuthSlider items={items} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ position: 'relative' }}>
                                <AuthSliderV2 items={itemsV2} />
                            </Grid>
                        </Grid>
                    </BackgroundPattern2>
                </Grid>
                <Grid item md={6} lg={7} xs={12} sx={{ minHeight: '100vh'}}>
                    <Grid
                        sx={{ minHeight: '100vh' }}
                        container
                        alignItems={matchDownSM ? 'center' : 'flex-start'}
                        justifyContent={matchDownSM ? 'center' : 'space-between'}
                    >
                        <Grid item sx={{ display: { xs: 'none', md: 'block' }, m: 3 }}>
                            <Link to="#">
                                <Logo />
                            </Link>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            container
                            justifyContent="center"
                            alignItems="center"
                            sx={{ minHeight: { xs: 'calc(100vh - 68px)', md: 'calc(100vh - 152px)' } }}
                        >
                            <Stack justifyContent="center" alignItems="center" spacing={5} m={2}>
                                <Box component={Link} to="#" sx={{ display: { xs: 'block', md: 'none' } }}>
                                    <Logo />
                                </Box>
                                <AuthCardWrapper border={matchDownMD}>
                                    <Grid container spacing={2} justifyContent="center">
                                        <Grid item>
                                            <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                <Typography
                                                    color={theme.palette.secondary.main}
                                                    gutterBottom
                                                    variant={matchDownSM ? 'h3' : 'h2'}
                                                >
                                                    GD LIB! Chào mừng bạn trở lại
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    fontSize="16px"
                                                    textAlign={matchDownSM ? 'center' : 'inherit'}
                                                >
                                                    Nhập thông tin đăng nhập của bạn để tiếp tục
                                                </Typography>
                                            </Stack>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <AuthLogin loginProp={2} />
                                        </Grid>
                                        {/* <Grid item xs={12}>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid item container direction="column" alignItems="center" xs={12}>
                                                <Typography
                                                    component={Link}
                                                    to="/register"
                                                    variant="subtitle1"
                                                    sx={{ textDecoration: 'none' }}
                                                >
                                                    Don&apos;t have an account?
                                                </Typography>
                                            </Grid>
                                        </Grid> */}
                                    </Grid>
                                </AuthCardWrapper>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sx={{ m: 1 }}>
                            <AuthFooter />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper2>
    );
};

export default Login;
