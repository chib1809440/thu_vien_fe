// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['allAccount'] = {
    error: null,
    allAccount: [],   
    userAccount: {},   
};

const slice = createSlice({
    name: 'allAccount',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET project waiting
        getAllAccountSuccess(state, action) {
            state.allAccount = action.payload;
        },
         // GET project waiting
         getUserAccountSuccess(state, action) {
            state.userAccount = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getAllAccountWaiting() {
    return async () => {
        try {
            const response = await axios.get('users');
            dispatch(slice.actions.getAllAccountSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

export function getUserAccountWaiting(response) {
    return async () => {
        try {
            dispatch(slice.actions.getUserAccountSuccess(response));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}
