import React from 'react';

import { CircularProgress } from '@mui/material';
import { dispatch, useSelector } from '../../../../store';
import { getSuppliesWaiting } from '../../../../store/slices/supplies';
import { GetSupplies } from '../../../../types/supplies';
import StickyHeadTable from './table';
import { GetCabinet } from '../../../../types/cabinet';
import { getCabinetWaiting } from '../../../../store/slices/cabinet';

export default function HomePage() {

    const [dataSupplies, setDataSupplies] = React.useState<GetSupplies[] | undefined>([]);
    const [dataCabinet, setDataCabinet] = React.useState<GetCabinet[] | undefined>([]);

    const { getSupplies } = useSelector((state) => state.getSupplies);
    const { getCabinet } = useSelector((state) => state.getCabinet);
    const { getLoanSlip } = useSelector((state) => state.getLoanSlip);


    React.useEffect(() => {
        const filteredData = getSupplies?.filter((item: any) => item.cabinet_quantity !== 0);
        setDataSupplies(filteredData);
        setDataCabinet(getCabinet);
    }, [getSupplies, getCabinet]);

    React.useEffect(() => {
        dispatch(getSuppliesWaiting());
        dispatch(getCabinetWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <StickyHeadTable projectItem={dataSupplies} dataCabinet={dataCabinet} dataLoanSlip={getLoanSlip}/>
        </div>
    );
}
