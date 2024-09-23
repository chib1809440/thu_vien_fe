import React from 'react';

import { dispatch, useSelector } from '../../../store';
import { getAllAccountWaiting } from '../../../store/slices/allAccount';
import { GetAllAccount } from '../../../types/allAccount';
import StickyHeadTable from './table';
import { GetSupplies } from '../../../types/supplies';
import { getSuppliesWaiting } from '../../../store/slices/supplies';

export default function AccountPage() {
    const [data, setData] = React.useState<GetAllAccount[] | undefined>([]);
    const [dataSupplies, setDataSupplies] = React.useState<GetSupplies[] | undefined>([]);

    const { allAccount } = useSelector((state) => state.getAllAccount);
    const { getSupplies } = useSelector((state) => state.getSupplies);

    React.useEffect(() => {
        setData(allAccount);
        setDataSupplies(getSupplies);
    }, [allAccount, getSupplies]);

    React.useEffect(() => {
        dispatch(getAllAccountWaiting());
        dispatch(getSuppliesWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <div>
            <StickyHeadTable data={data} dataSupplies={dataSupplies}/>
        </div>
    );
}
