// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';
import axiosServicesAdditional from '../../utils/axiosV2';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getCategory'] = {
    error: null,
    getCategory: [],   
    getCategoryLT: [],   
};

const slice = createSlice({
    name: 'getCategory',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET Category
        getCategorySuccess(state, action) {
            state.getCategory = action.payload;
        },
        getCategoryLTSuccess(state, action) {
            state.getCategoryLT = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCategoryWaiting() {
    return async () => {
        try {
            const response = await axios.get('category');
            dispatch(slice.actions.getCategorySuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

export function getCategoryLTWaiting() {
    return async () => {
        try {
            const response = await axiosServicesAdditional.get('category');
            dispatch(slice.actions.getCategoryLTSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

