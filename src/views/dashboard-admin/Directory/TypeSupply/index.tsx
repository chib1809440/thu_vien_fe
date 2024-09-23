import React from 'react';

import { CircularProgress } from '@mui/material';
import { dispatch, useSelector } from '../../../../store';
import { getTypeSuplyWaiting } from '../../../../store/slices/typeSuplly';
import StickyHeadTable from './table';

export default function HomePage() {

    const { getTypeSuply } = useSelector((state) => state.getTypeSuply);

    React.useEffect(() => {
        dispatch(getTypeSuplyWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div>
            {getTypeSuply !== undefined ? <StickyHeadTable projectItem={getTypeSuply} /> : <CircularProgress/> }
        </div>
    );
}
