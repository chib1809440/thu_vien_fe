// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import { dispatch } from '../index';

// types
import { LibRootStateProps } from '../../types';
import axiosServicesAdditional from '../../utils/axiosV2';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['isLogin'] = {
    error: null,
    isLogin: false,
};

const slice = createSlice({
    name: 'isLogin',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
        // GET ApiLT
        isLoginSuccess(state, action) {
            state.isLogin = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function isLoginWaiting() {
    const apiLT = localStorage.getItem("serviceTokenLT");

    return async () => {
        try {
            axiosServicesAdditional.defaults.headers.common.Authorization = `Bearer ${apiLT}`;
            axiosServicesAdditional.defaults.headers.post['Content-Type'] = "*/*";
            axiosServicesAdditional.defaults.headers.post['Accept'] = "*/*";
            axiosServicesAdditional.defaults.headers.post['Access-Control-Allow-Origin'] = "*";
            axiosServicesAdditional.defaults.headers.post['Strict-Origin-When-Cross-Origin'] = "*";
            if (apiLT !== undefined && apiLT !== null) {
                dispatch(slice.actions.isLoginSuccess(true));
            } else {
                dispatch(slice.actions.isLoginSuccess(false));
            }
            return true;
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

