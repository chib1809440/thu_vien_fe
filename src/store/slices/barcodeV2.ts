import { createSlice } from '@reduxjs/toolkit';

// types
import { BarcodeProps } from '../../types/barcodeV2';

const initialState: BarcodeProps = {
    openBC: false,
    closeBC: true,
    userID: '',
};

// ==============================|| SLICE - SNACKBAR ||============================== //

const barcode = createSlice({
    name: 'barcode',
    initialState,
    reducers: {
        openBarcode(state, action) {
            const { openBC, closeBC, userID} = action.payload;

            state.openBC = openBC || initialState.openBC;
            state.userID = userID || initialState.userID;
            state.closeBC = closeBC === false ? closeBC : initialState.closeBC;
        },

        closeBarcode(state) {
            state.openBC = false;
        }
    }
});

export default barcode.reducer;

export const { closeBarcode, openBarcode } = barcode.actions;
