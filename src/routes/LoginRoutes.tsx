import { lazy } from 'react';

// project imports
import GuestGuard from '../utils/route-guard/GuestGuard';
import MinimalLayout from '../layout/MinimalLayout';
import NavMotion from '../layout/NavMotion';
import Loadable from '../ui-component/Loadable';

const AuthLogin = Loadable(lazy(() => import('../views/pages/authentication/authentication/Login')));

const LoginRoutes = {
    path: '/',
    element: (
        <NavMotion>
            <GuestGuard>
                <MinimalLayout />
            </GuestGuard>
        </NavMotion>
    ),
    children: [
        {
            path: '/login',
            element: <AuthLogin />
        },
        // {
        //     path: '/register',
        //     element: <AuthRegister />
        // },
        // {
        //     path: '/forgot',
        //     element: <AuthForgotPassword />
        // },
        // {
        //     path: '/check-mail',
        //     element: <AuthCheckMail />
        // },
    ]
};

export default LoginRoutes;
