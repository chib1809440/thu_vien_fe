// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';
import axiosServicesAdditional from '../../utils/axiosV2';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getSuppliesLT'] = {
    error: null,
    getSuppliesLT: [],   
};

const slice = createSlice({
    name: 'getSuppliesLT',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET Supplies
     getSuppliesLTSuccess(state, action) {
            state.getSuppliesLT = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getSuppliesLTWaiting() {
    return async () => {
        try {
            const response = await axiosServicesAdditional.get('supplies');
            dispatch(slice.actions.getSuppliesLTSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

