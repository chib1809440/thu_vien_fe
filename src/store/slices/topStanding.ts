// third-party
import { createSlice } from '@reduxjs/toolkit';
// project imports
import axios from '../../utils/axios';
import { dispatch } from '../index';

// types
import { LibRootStateProps } from '../../types';
import axiosServicesLT from '../../utils/axiosV2';

// ----------------------------------------------------------------------

const initialState: LibRootStateProps['getTopStanding'] = {
    error: null,
    getTopStanding: [],
};

const slice = createSlice({
    name: 'getTopStanding',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
        // GET Author
        getTopStandingSuccess(state, action) {
            state.getTopStanding = action.payload;
        },
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getTopStandingWaiting() {

    // function getFormattedDate(month) {
    //     const namHienTai = new Date();
    //     const getYear = namHienTai.getFullYear();
    //     const soNgayTrongThang = new Date(getYear, month, 0).getDate();
    //     const path = `loan-slip/date?from=${month}/01/${getYear}&to=${month}/${soNgayTrongThang}/${getYear}`
    //     return path;
    // }
    const namHienTai = new Date();
    const getMonth = namHienTai.getMonth();
    let getYear = namHienTai.getFullYear();
    
    if (getMonth <= 7) {
        getYear = getYear -1;
    } else {
        getYear = getYear
    }

    function getFormattedDate(month, year) {
        const soNgayTrongThang = new Date(year, month, 0).getDate();
        const path = `loan-slip/date?from=${month}/01/${year}&to=${month}/${soNgayTrongThang}/${year}`
        return path;
    }
    return async () => {
        let data: any = []
        try {

            const response1 = await axios.get(`${getFormattedDate('08', getYear)}`);
            const response2 = await axios.get(`${getFormattedDate('09', getYear)}`);
            const response3 = await axios.get(`${getFormattedDate('10', getYear)}`);
            const response4 = await axios.get(`${getFormattedDate('11', getYear)}`);
            const response5 = await axios.get(`${getFormattedDate('12', getYear)}`);
            const response6 = await axios.get(`${getFormattedDate('01', getYear + 1)}`);
            const response7 = await axios.get(`${getFormattedDate('02', getYear + 1)}`);
            const response8 = await axios.get(`${getFormattedDate('03', getYear + 1)}`);
            const response9 = await axios.get(`${getFormattedDate('04', getYear + 1)}`);
            const response10 = await axios.get(`${getFormattedDate('05', getYear + 1)}`);
            const response11 = await axios.get(`${getFormattedDate('06', getYear + 1)}`);
            const response12 = await axios.get(`${getFormattedDate('07', getYear + 1)}`);
            
            data.push(response1.data, response2.data, response3.data, response4.data, response5.data, response6.data, response7.data, response8.data, response9.data, response10.data, response11.data, response12.data)

            dispatch(slice.actions.getTopStandingSuccess(data));
            return true;
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return false;
        }
    };
}

