// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getGroupPower'] = {
    error: null,
    getGroupPower: [],   
};

const slice = createSlice({
    name: 'getGroupPower',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET project waiting
        getGroupPowerSuccess(state, action) {
            state.getGroupPower = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getGroupPowerWaiting() {
    return async () => {
        try {
            const response = await axios.get('group');
            dispatch(slice.actions.getGroupPowerSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

