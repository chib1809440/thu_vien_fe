import React from 'react';

import { dispatch, useSelector } from '../../../../../../store';
import { getAllRegisterSlipLTWaiting, getRegisterSlipLTWaiting } from '../../../../../../store/slices/registerSlip';
import { getSuppliesLTWaiting, getSuppliesWaiting } from '../../../../../../store/slices/supplies';
import StickyHeadTable from './table';

export default function OriginalPage() {

    const { getSupplies, getSuppliesLT } = useSelector((state) => state.getSupplies);
    const { getRegisterSlipLT, getAllRegisterSlipLT } = useSelector((state) => state.getRegisterSlip);

    React.useEffect(() => {
        dispatch(getSuppliesWaiting());
        dispatch(getSuppliesLTWaiting());
        dispatch(getRegisterSlipLTWaiting());
        dispatch(getAllRegisterSlipLTWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <StickyHeadTable dataSupplies={getSupplies} dataSuppliesLT={getSuppliesLT} dataRegisterSlipLT={getRegisterSlipLT} dataAllRegisterSlipLT={getAllRegisterSlipLT} />
        </>
    );
}
