// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';
import axiosServicesAdditional from '../../utils/axiosV2';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getAuthor'] = {
    error: null,
    getAuthor: [],   
    getAuthorLT: [],   
};

const slice = createSlice({
    name: 'getAuthor',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET Author
        getAuthorSuccess(state, action) {
            state.getAuthor = action.payload;
        },
        getAuthorLTSuccess(state, action) {
            state.getAuthorLT = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getAuthorWaiting() {
    return async () => {
        try {
            const response = await axios.get('authors');
            dispatch(slice.actions.getAuthorSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

export function getAuthorLTWaiting() {
    return async () => {
        try {
            const response = await axiosServicesAdditional.get('authors');
            dispatch(slice.actions.getAuthorLTSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

