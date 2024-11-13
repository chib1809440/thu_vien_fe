import { useNavigate } from 'react-router-dom';

// project imports
import useAuth from '../../hooks/useAuth';
import { DEFAULT_PAGE_PATH } from '../../config';
import { GuardProps } from '../../types';
import { useEffect, useMemo } from 'react';

// ==============================|| GUEST GUARD ||============================== //

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const GuestGuard = ({ children }: GuardProps) => {
    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();
    const userRole = useMemo(() => {
        if (!user) return null;
        const _user = { ...user } as any;
        return _user?.data?.roleId?.name;
    }, [user]);
    
    useEffect(() => {
        if (isLoggedIn) {
            if (userRole === 'Teacher' || userRole === "Student") {
                navigate('thu-vien/an-pham', { replace: true })
                return;
            }
            navigate(DEFAULT_PAGE_PATH, { replace: true });
        }
    }, [isLoggedIn, navigate]);

    return children;
};

export default GuestGuard;
