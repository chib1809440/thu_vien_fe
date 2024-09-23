import React from 'react';

import { dispatch, useSelector } from '../../../../store';
import { getAllAccountWaiting } from '../../../../store/slices/allAccount';
import { getLoanSlipWaiting } from '../../../../store/slices/loanSlip';
import { getSuppliesWaiting } from '../../../../store/slices/supplies';
import { GetLoanSlip } from '../../../../types/loanSlip';
import { GetSupplies } from '../../../../types/supplies';
import StickyHeadTable from './table';
import { GetAllAccount } from '../../../../types/allAccount';

export default function BorrowPage() {

    const [dataLoanSlip, setDataLoanSlip] = React.useState<GetLoanSlip[] | undefined>([]);
    const [dataSupplies, setDataSupplies] = React.useState<GetSupplies[] | undefined>([]);
    const [dataAccount, setDataAccount] = React.useState<GetAllAccount[] | undefined>([]);
    const { getLoanSlip } = useSelector((state) => state.getLoanSlip);
    const { getSupplies } = useSelector((state) => state.getSupplies);
    const { allAccount } = useSelector((state) => state.getAllAccount);
    
    React.useEffect(() => {
        setDataLoanSlip(getLoanSlip);
        setDataSupplies(getSupplies);
        setDataAccount(allAccount);
    }, [getLoanSlip, getSupplies, allAccount]);

    React.useEffect(() => {
        dispatch(getLoanSlipWaiting());
        dispatch(getSuppliesWaiting());
        dispatch(getAllAccountWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <StickyHeadTable suppliesItem={dataSupplies} projectItem={dataLoanSlip} dataUser={dataAccount}/>
        </div>
    );
}
