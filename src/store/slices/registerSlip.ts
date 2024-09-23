// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';
import axiosServicesAdditional from '../../utils/axiosV2';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getRegisterSlip'] = {
    error: null,
    getRegisterSlip: [],   
    getRegisterSlipLT: [],   
    getAllRegisterSlipLT: [],   
};

const slice = createSlice({
    name: 'getRegisterSlip',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET Producer
        getRegisterSlipSuccess(state, action) {
            state.getRegisterSlip = action.payload;
        },
        getRegisterSlipLTSuccess(state, action) {
            state.getRegisterSlipLT = action.payload;
        },
        getAllRegisterSlipLTSuccess(state, action) {
            state.getAllRegisterSlipLT = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getRegisterSlipWaiting() {
    return async () => {
        try {
            const response = await axios.get('register-slip');
            dispatch(slice.actions.getRegisterSlipSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

export function getRegisterSlipLTWaiting() {
    return async () => {
        try {
            const response = await axiosServicesAdditional.get('registerSlip/user');
            dispatch(slice.actions.getRegisterSlipLTSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

export function getAllRegisterSlipLTWaiting() {
    return async () => {
        try {
            const response = await axiosServicesAdditional.get('registerSlip');
            dispatch(slice.actions.getAllRegisterSlipLTSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

