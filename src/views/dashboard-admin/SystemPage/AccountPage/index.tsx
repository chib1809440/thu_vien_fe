import React from 'react';

import { dispatch, useSelector } from '../../../../store';
import { getAllAccountWaiting } from '../../../../store/slices/allAccount';
import { GetAllAccount } from '../../../../types/allAccount';
import StickyHeadTable from './table';

export default function AccountPage() {
    const [data, setData] = React.useState<GetAllAccount[] | undefined | any>([]);

    const { allAccount } = useSelector((state) => state.getAllAccount);

    React.useEffect(() => {
        setData(allAccount);
    }, [allAccount]);

    React.useEffect(() => {
        dispatch(getAllAccountWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <div>
            <StickyHeadTable data={data?.filter((item:any)=>item.role === 2)}/>
        </div>
    );
}
