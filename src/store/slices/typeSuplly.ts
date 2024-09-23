// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';
import axiosServicesAdditional from '../../utils/axiosV2';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getTypeSuply'] = {
    error: null,
    getTypeSuply: [],   
    getTypeSuplyLT: [],   
};

const slice = createSlice({
    name: 'getTypeSuply',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET TypeSuplly
        getTypeSuplySuccess(state, action) {
            state.getTypeSuply = action.payload;
        },
        getTypeSuplyLTSuccess(state, action) {
            state.getTypeSuplyLT = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getTypeSuplyWaiting() {
    return async () => {
        try {
            const response = await axios.get('type-of-supplies');
            dispatch(slice.actions.getTypeSuplySuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

export function getTypeOfSuppliesLTWaiting() {
    return async () => {
        try {
            const response = await axiosServicesAdditional.get('typeOfSupplies');
            dispatch(slice.actions.getTypeSuplyLTSuccess(response.data));
            return true;
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}


