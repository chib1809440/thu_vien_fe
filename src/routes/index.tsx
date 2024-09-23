import { Navigate, useRoutes } from 'react-router-dom';

// routes
import MainRoutes, { MainRoutesV2 } from './MainRoutes';
import LoginRoutes from './LoginRoutes';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    return useRoutes([
        { 
            path: '/', 
            element: (
                <Navigate to="/login"/>
            )
        },
        { 
            path: '/*', 
            element: (
                <Navigate to="/"/>
            )
        },
        { 
            path: '/*', 
            element: (
                <Navigate to="/"/>
            )
        },
        LoginRoutes,
        MainRoutes,
        MainRoutesV2
    ]);
}
