// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import { dispatch } from '../index';

// types
import { LibRootStateProps } from '../../types';
import axiosServicesAdditional from '../../utils/axiosV2';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getUserLT'] = {
    error: null,
    getUserLT: [],   
};

const slice = createSlice({
    name: 'getUserLT',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET ApiLT
        getUserLTSuccess(state, action) {
            state.getUserLT = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUserLTWaiting() {
    return async () => {
        try {
            const response = await axiosServicesAdditional.get('users');
            dispatch(slice.actions.getUserLTSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

