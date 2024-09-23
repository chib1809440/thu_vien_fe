// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getApiLT'] = {
    error: null,
    getApiLT: [],   
};

const slice = createSlice({
    name: 'getApiLT',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET ApiLT
        getApiLTSuccess(state, action) {
            state.getApiLT = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getApiLTWaiting() {
    return async () => {
        try {
            const response = await axios.get('apiConnection');
            dispatch(slice.actions.getApiLTSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

