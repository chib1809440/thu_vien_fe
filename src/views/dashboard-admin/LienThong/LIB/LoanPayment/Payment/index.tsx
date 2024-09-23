import React from 'react';

import { dispatch, useSelector } from '../../../../../../store';
import { getAllLoanSlipLTWaiting, getLoanSlipLTWaiting } from '../../../../../../store/slices/loanSlip';
import { getAllRegisterSlipLTWaiting, getRegisterSlipLTWaiting } from '../../../../../../store/slices/registerSlip';
import { getSuppliesLTWaiting, getSuppliesWaiting } from '../../../../../../store/slices/supplies';
import StickyHeadTable from './table';

export default function OriginalPage() {

    const { getSupplies, getSuppliesLT } = useSelector((state) => state.getSupplies);
    const { getRegisterSlipLT, getAllRegisterSlipLT } = useSelector((state) => state.getRegisterSlip);
    const { getAllLoanSlipLT, getLoanSlipLT } = useSelector((state) => state.getLoanSlip);

    React.useEffect(() => {
        dispatch(getSuppliesWaiting());
        dispatch(getSuppliesLTWaiting());
        dispatch(getRegisterSlipLTWaiting());
        dispatch(getAllRegisterSlipLTWaiting());
        dispatch(getAllLoanSlipLTWaiting());
        dispatch(getLoanSlipLTWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <StickyHeadTable dataSupplies={getSupplies} dataSuppliesLT={getSuppliesLT} dataRegisterSlipLT={getLoanSlipLT} dataAllRegisterSlipLT={getAllLoanSlipLT} />
        </>
    );
}
