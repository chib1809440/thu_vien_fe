// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getUsb'] = {
    error: null,
    getUsb: [],   
};

const slice = createSlice({
    name: 'getUsb',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET Usb
        getUsbSuccess(state, action) {
            state.getUsb = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUsbWaiting() {
    return async () => {
        try {
            const response = await axios.get('auth/checkUSB');
            dispatch(slice.actions.getUsbSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

