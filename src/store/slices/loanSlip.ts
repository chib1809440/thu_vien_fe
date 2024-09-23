// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';
import axiosServicesAdditional from '../../utils/axiosV2';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getLoanSlip'] = {
    error: null,
    getLoanSlip: [],   
    getLoanSlipLT: [],   
    getAllLoanSlipLT: [],   
};

const slice = createSlice({
    name: 'getLoanSlip',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET LOAN SHIP
        getLoanSlipSuccess(state, action) {
            state.getLoanSlip = action.payload;
        },
        getLoanSlipLTSuccess(state, action) {
            state.getLoanSlipLT = action.payload;
        },
        getAllLoanSlipLTSuccess(state, action) {
            state.getAllLoanSlipLT = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getLoanSlipWaiting() {
    return async () => {
        try {
            const response = await axios.get('loan-slip');
            dispatch(slice.actions.getLoanSlipSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

export function getLoanSlipLTWaiting() {
    return async () => {
        try {
            const response = await axiosServicesAdditional.get('loan-slip/user');
            dispatch(slice.actions.getLoanSlipLTSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

export function getAllLoanSlipLTWaiting() {
    return async () => {
        try {
            const response = await axiosServicesAdditional.get('loan-slip');
            dispatch(slice.actions.getAllLoanSlipLTSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

