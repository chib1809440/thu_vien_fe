// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getAssetsLib'] = {
    error: null,
    getAssetsLib: [],   
};

const slice = createSlice({
    name: 'getAssetsLib',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET AssetsLib
        getAssetsLibSuccess(state, action) {
            state.getAssetsLib = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getAssetsLibWaiting() {
    return async () => {
        try {
            const response = await axios.get('properties');
            dispatch(slice.actions.getAssetsLibSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

