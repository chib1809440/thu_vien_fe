import { useNavigate } from 'react-router-dom';

// project imports
import React, { useEffect } from 'react';
import { GuardProps } from '../../types';
import { dispatch, useSelector } from '../../store';
import { isLoginWaiting } from '../../store/slices/isLoginLT';
import useAuth from '../../hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuardV2 = ({ children }: GuardProps) => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const apiLT = localStorage.getItem("serviceTokenLT");
    const { isLogin } = useSelector((state) => state.isLogin);

    React.useEffect(() => {
        dispatch(isLoginWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('login', { replace: true });
        }
        const delayTimeout = setTimeout(() => {
            if (!isLogin) {
                navigate('lien-thong');
            }
        }, 300);
    
        return () => clearTimeout(delayTimeout);
    }, [navigate, isLoggedIn, isLogin]);

    return children;
};

export default AuthGuardV2;
