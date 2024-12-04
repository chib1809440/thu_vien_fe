// material-ui
import { styled } from '@mui/material/styles';

// ==============================|| AUTHENTICATION 1 WRAPPER ||============================== //

const AuthWrapper2 = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.dark : theme.palette.primary.light,
    minHeight: '100vh',
    // [theme.breakpoints.down('lg')]: {
    //     backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
    // }
}));

export default AuthWrapper2;
