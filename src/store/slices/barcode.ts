// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getBarcode'] = {
    error: null,
    getBarcode: [],   
};

const slice = createSlice({
    name: 'getBarcode',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET Usb
        getBarcodeSuccess(state, action) {
            state.getBarcode = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getBarcodeWaiting() {
    return async () => {
        try {
            const response = await axios.get('auth/checkUSB');
            dispatch(slice.actions.getBarcodeSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

