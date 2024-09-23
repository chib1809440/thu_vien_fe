import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from '../store/actions';
import accountReducer from '../store/accountReducer';

// project imports
import Loader from '../ui-component/Loader';
import axios from '../utils/axios';

// types
import { KeyedObject } from '../types';
import { InitialLoginContextProps, JWTContextType } from '../types/auth';
import { AUTH_API } from '../_apis/api-endpoint';

// constant
const initialState: InitialLoginContextProps = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const verifyToken: (st: string) => boolean = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded: KeyedObject = jwtDecode(serviceToken);
    /**
     * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
     */
    return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken?: string | null) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
        axios.defaults.headers.post['Content-Type'] = "*/*";
        axios.defaults.headers.post['Accept'] = "*/*";
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = "*";
        axios.defaults.headers.post['Strict-Origin-When-Cross-Origin'] = "*";

    } else {
        localStorage.removeItem('serviceToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = window.localStorage.getItem('serviceToken');
                // const dataUser = window.localStorage.getItem('dataUser');
                const userString: any = localStorage.getItem('dataUser');
                const userObject = JSON.parse(userString)

                if (serviceToken && verifyToken(serviceToken)) {
                    setSession(serviceToken);
                    dispatch({
                        type: LOGIN,
                        payload: {
                            isLoggedIn: true,
                            user: userObject
                        }
                    });
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: LOGOUT
                });
            }
        };

        init();
    }, []);

    const login = async (username: string, password: string) => {
        const response = await axios.post(AUTH_API.SignIn, { username, password });
        localStorage.setItem('userID', response?.data.userID);
        localStorage.setItem('dataUser', JSON.stringify(response?.data));
        if (response.status === 201 && response?.data?.role === 2) {
            // const user = response.data;
            // setValueUser(user)
            setSession(response?.data.access_token);
            dispatch({
                type: LOGIN,
                payload: {
                    isLoggedIn: true,
                    user: response.data
                }
            });
        } else {
            throw new Error('Lỗi hệ thống')
        }

    };

    const register = async (email: string, password: string, name: string, phoneNumber: string) => {
        // todo: this flow need to be recode as it not verified
        // const response = await axios.post(AUTH_API.SignUp, {
        //     email,
        //     password,
        //     name,
        //     phoneNumber,
        //     // securityQuestions
        // });
        // let users = response?.data?.data || {};

        // // if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
        // //     const localUsers = window.localStorage.getItem('users');
        // //     users = [
        // //         ...JSON.parse(localUsers!),
        // //         {
        // //             email,
        // //             password,
        // //             name,
        // //             phoneNumber
        // //         }
        // //     ];
        // // }

        // window.localStorage.setItem('users', JSON.stringify(users));
    };

    const logout = () => {
        setSession(null);
        dispatch({ type: LOGOUT });
        localStorage.removeItem('serviceTokenLT')
    };

    const resetPassword = (email: string) => console.log(email);

    const updateProfile = () => { };

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>
    );
};

export default JWTContext;