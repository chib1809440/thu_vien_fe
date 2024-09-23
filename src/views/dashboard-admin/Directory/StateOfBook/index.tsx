import React from 'react';

import { dispatch, useSelector } from '../../../../store';
import { getCabinetWaiting } from '../../../../store/slices/cabinet';
import { getSuppliesWaiting } from '../../../../store/slices/supplies';
import { GetCabinet } from '../../../../types/cabinet';
import { GetSupplies } from '../../../../types/supplies';
import StickyHeadTable from './table';
import { getStateOfBookWaiting } from '../../../../store/slices/stateOfBook';

export default function HomePage() {

    const [dataSupplies, setDataSupplies] = React.useState<GetSupplies[] | undefined>([]);
    const [dataCabinet, setDataCabinet] = React.useState<GetCabinet[] | undefined>([]);
    const { getSupplies } = useSelector((state) => state.getSupplies);
    const { getCabinet } = useSelector((state) => state.getCabinet);
    const { getStateOfBook } = useSelector((state) => state.getStateOfBook);
    
    React.useEffect(() => {
        const filteredData = getSupplies?.filter((item: any) => item.warehouse_quantity !== 0);
        setDataSupplies(filteredData);
        setDataCabinet(getCabinet);
    }, [getSupplies, getCabinet]);

    React.useEffect(() => {
        dispatch(getSuppliesWaiting());
        dispatch(getCabinetWaiting());
        dispatch(getStateOfBookWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <div>
            <StickyHeadTable projectItem={dataSupplies} dataCabinet={dataCabinet} dataStateOfBook={getStateOfBook}/>
        </div>
    );
}
