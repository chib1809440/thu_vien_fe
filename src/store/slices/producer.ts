// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps }  from '../../types';
import axiosServicesAdditional from '../../utils/axiosV2';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getProducer'] = {
    error: null,
    getProducer: [],   
    getProducerLT: [],   
};

const slice = createSlice({
    name: 'getProducer',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
     // GET Producer
        getProducerSuccess(state, action) {
            state.getProducer = action.payload;
        },
        getProducerLTSuccess(state, action) {
            state.getProducerLT = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getProducerWaiting() {
    return async () => {
        try {
            const response = await axios.get('publisher');
            dispatch(slice.actions.getProducerSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

export function getProducerLTWaiting() {
    return async () => {
        try {
            const response = await axiosServicesAdditional.get('publisher');
            dispatch(slice.actions.getProducerLTSuccess(response.data));
            return true;
        } catch (error) {
            
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

