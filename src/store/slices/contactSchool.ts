// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps } from '../../types';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getContactSchool'] = {
    error: null,
    getContactSchool: {
        idContact: '',
        nameContact: '',
        nameContactEN: '',
        addressContact: '',
        phoneContact: '',
        hotline: '',
        fax: '',
        zaloContact: '',
        emailContact: '',
        facebookContact: '',
        youtubeContact: '',
        urlContact: '',
        urlGoogleMap: '',
        ScriptFacebook: '',
    },
};

const slice = createSlice({
    name: 'getContactSchool',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
        // GET Author
        getContactSchoolSuccess(state, action) {
            state.getContactSchool = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getContactSchoolWaiting() {
    return async () => {
        try {
            const response = await axios.get('contact');
            dispatch(slice.actions.getContactSchoolSuccess(response.data[0]));
            return true;
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

