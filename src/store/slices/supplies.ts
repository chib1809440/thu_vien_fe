// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';
import axiosServicesAdditional from '../../utils/axiosV2';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getSupplies'] = {
    error: null,
    getSupplies: [],   
    getSuppliesLT: [],   
};

const slice = createSlice({
    name: 'getSupplies',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET Supplies
        getSuppliesSuccess(state, action) {
            state.getSupplies = action.payload;
        },
        getSuppliesLTSuccess(state, action) {
            state.getSuppliesLT = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getSuppliesWaiting() {
    return async () => {
        try {
            const response = await axios.get('supplies');
            dispatch(slice.actions.getSuppliesSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

export function getSuppliesLTWaiting() {
    return async () => {
        try {
            const response = await axiosServicesAdditional.get('supplies/user');
            dispatch(slice.actions.getSuppliesLTSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

