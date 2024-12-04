import { Link } from 'react-router-dom';
// material-ui
import { Box, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// project imports
import Slider from 'react-slick';
import { AuthSliderProps } from '../../../../types';
import Logo from '../../../../ui-component/Logo';
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

const itemsV2: any = [
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
    const matchDownXS = useMediaQuery(theme.breakpoints.down('xs'));
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

    const settings = {
        autoplay: true,
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <AuthWrapper2>
            <Grid container justifyContent="center"
                sx={{
                    alignItems: "center", flexDirection: "column",
                    display: { xs: 'none', sm: "none", md: 'flex' },
                    maxWidth: "1200px",
                    m: "auto"
                }}>
                {/* Logo phần bên ngoài Slider */}
                <Grid item>
                    <Link to="#">
                        <Logo />
                    </Link>
                </Grid>

                {/* Slider Content */}
                <Grid item xs={10} lg={8}>
                    <Slider {...settings} dots={false} className="hide-on-small">
                        {items.map((item, i) => (
                            <Grid key={i} container direction="column" alignItems="center" spacing={2} textAlign="center">
                                <Grid item>
                                    <Typography fontSize={26} fontWeight={700}>{item.title}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography fontSize={14}>{item.description}</Typography>
                                </Grid>
                            </Grid>
                        ))}
                    </Slider>
                </Grid>

                <Grid item xs={12} sx={{ position: 'relative' }} >
                    <Slider {...settings} dots={false}>
                        {itemsV2.map((item, i) => (
                            <Grid key={i} container alignItems="center" p={2} textAlign="center" justifyContent='center'>
                                <Grid item>
                                    <img style={{ borderRadius: '5px' }} width='100%' src={item.title} alt='logo' />
                                </Grid>
                            </Grid>
                        ))}
                    </Slider>

                    <Grid item container justifyContent="center" sx={{
                        position: 'absolute',
                        top: "50%",
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 10,
                        width: '80%',
                        maxWidth: '400px',
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
                        borderRadius: "8px"
                    }}>
                        <Grid item xs={12} sx={{ position: 'relative' }}>
                            <Grid item>
                                <Grid
                                    container
                                    alignItems={matchDownXS ? 'center' : 'flex-start'}
                                    justifyContent={matchDownXS ? 'center' : 'space-between'}
                                >

                                    <AuthCardWrapper border={matchDownMD} sx={{ backgroundColor: "transparent", }}>
                                        <Grid container spacing={2} justifyContent="center">
                                            <Grid item>
                                                <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography
                                                        color={"#004085"}
                                                        gutterBottom
                                                        variant={matchDownXS ? 'h3' : 'h2'}
                                                    >
                                                        GD LIB! Chào mừng bạn trở lại
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        fontSize="16px"
                                                        textAlign={matchDownXS ? 'center' : 'inherit'}
                                                        color="#616161"
                                                    >
                                                        Nhập thông tin đăng nhập của bạn để tiếp tục
                                                    </Typography>
                                                </Stack>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <AuthLogin loginProp={2} />
                                            </Grid>
                                        </Grid>
                                    </AuthCardWrapper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>


                </Grid>
            </Grid>

            <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{
                    minHeight: { xs: 'calc(100vh - 68px)', md: 'calc(100vh - 152px)' },
                    display: { xs: 'block', sm: 'block', md: 'none' }
                }}
            >
                <Stack justifyContent="center" alignItems="center" spacing={5}>
                    <Box component={Link} to="#">
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
                        </Grid>
                    </AuthCardWrapper>
                </Stack>
            </Grid>

        </AuthWrapper2 >
    );
};

export default Login;
