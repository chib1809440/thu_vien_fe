// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getPrintedMatter'] = {
    error: null,
    getPrintedMatter: [],   
};

const slice = createSlice({
    name: 'getPrintedMatter',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET Producer
        getPrintedMatterSuccess(state, action) {
            state.getPrintedMatter = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getPrintedMatterWaiting() {
    return async () => {
        try {
            const response = await axios.get('printed-matter');
            dispatch(slice.actions.getPrintedMatterSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

