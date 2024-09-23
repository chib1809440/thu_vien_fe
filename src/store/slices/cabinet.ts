// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getCabinet'] = {
    error: null,
    getCabinet: [],   
};

const slice = createSlice({
    name: 'getCabinet',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET Producer
        getCabinetSuccess(state, action) {
            state.getCabinet = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCabinetWaiting() {
    return async () => {
        try {
            const response = await axios.get('cabinet');
            dispatch(slice.actions.getCabinetSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

