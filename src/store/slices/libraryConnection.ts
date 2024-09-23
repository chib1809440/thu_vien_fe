// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from 'axios';
import { dispatch } from '../index';

// types
import { LibraryConnectionStateProps } from '../../types/libraryConnection';

// ----------------------------------------------------------------------

const initialState: LibraryConnectionStateProps['getLibraryConnection'] = {
    error: null,
    getLibraryConnection: [],
    getContact: [],
};

const slice = createSlice({
    name: 'getLibraryConnection',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
        // GET LibraryConnection
        getLibraryConnectionSuccess(state, action) {
            state.getLibraryConnection = action.payload;
        },
        getContacttionSuccess(state, action) {
            state.getContact = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

// export function getLibraryConnectionWaiting() {
//     let endpoints = [
//         'http://192.168.50.84:4000/supplies',
//         'http://192.168.50.220:4000/supplies',
//         'http://192.168.50.221:4000/supplies',
//     ];
    
//     return async () => {
//         try {
//             // const response = await axios.get('LibraryConnections');
//             let newData: any = [];

//             await Promise.all(endpoints.map((endpoint) => axios.get(endpoint)))
//                 .then((data) =>
//                     data.forEach((item: any) => {
//                         newData.push(item?.data);
//                     })
//                 )
//                 .catch((error) => {
//                     dispatch(slice.actions.hasError(error));
//                     return false;
//                 });

//             dispatch(slice.actions.getLibraryConnectionSuccess(newData));
//             return true;
//         } catch (error) {
//             dispatch(slice.actions.hasError(error));
//             return false;
//         }
//     };
// }
const endpoints = [
    'http://192.168.1.173:4000/',
    'http://192.168.1.134:4000/',
    'http://192.168.1.134:4001/',
    'http://192.168.1.134:4002/',
    'http://192.168.1.134:4003/',
    'http://192.168.1.134:4004/',
    'http://192.168.1.134:4005/',
    // 'http://192.168.50.84:4000/',
    // 'http://192.168.50.220:4000/',
    // 'http://192.168.0.102:4000/',
];

export function getLibraryConnectionWaiting() {
  

    return async () => {
        try {
            let newData: any = [];
            const responses = await Promise.allSettled(endpoints.map((endpoint) => axios.get(`${endpoint}supplies`)));

            responses.forEach((response) => {
                if (response.status === 'fulfilled') {
                    // Successfully resolved, push data to newData
                    newData.push(response.value.data);
                }
            });

            dispatch(slice.actions.getLibraryConnectionSuccess(newData));
            return true;

        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

export function getContactWaiting() {

    return async () => {
        try {
            let newData: any = [];
            const responses = await Promise.allSettled(endpoints.map((endpoint) => axios.get(`${endpoint}contact`)));

            responses.forEach((response) => {
                if (response.status === 'fulfilled') {
                    // Successfully resolved, push data to newData
                    newData.push(response.value.data);
                }
            });

            dispatch(slice.actions.getContacttionSuccess(newData));
            return true;

        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}
