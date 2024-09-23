import React from 'react';

import { CircularProgress } from '@mui/material';
import { dispatch, useSelector } from '../../../../store';
import { getCabinetWaiting } from '../../../../store/slices/cabinet';
import { GetCabinet } from '../../../../types/cabinet';
import StickyHeadTable from './table';

export default function HomePage() {

    const [dataCabinet, setDataCabinet] = React.useState<GetCabinet[] | undefined>([]);
    const { getCabinet } = useSelector((state) => state.getCabinet);
    
    React.useEffect(() => {
        setDataCabinet(getCabinet);
    }, [getCabinet]);

    React.useEffect(() => {
        dispatch(getCabinetWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {getCabinet !== undefined ? <StickyHeadTable projectItem={dataCabinet} /> : <CircularProgress/> }
        </div>
    );
}
