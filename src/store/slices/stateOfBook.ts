// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getStateOfBook'] = {
    error: null,
    getStateOfBook: [],   
};

const slice = createSlice({
    name: 'getStateOfBook',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET Producer
        getStateOfBookSuccess(state, action) {
            state.getStateOfBook = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getStateOfBookWaiting() {
    return async () => {
        try {
            const response = await axios.get('state-of-book');
            dispatch(slice.actions.getStateOfBookSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

