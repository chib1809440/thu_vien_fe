import React from 'react';

import { Box, Grid, Skeleton } from '@mui/material';
import { dispatch, useSelector } from '../../../store';
import { getLoanSlipWaiting } from '../../../store/slices/loanSlip';
import { getRegisterSlipWaiting } from '../../../store/slices/registerSlip';
import { getStateOfBookWaiting } from '../../../store/slices/stateOfBook';
import { getSuppliesWaiting } from '../../../store/slices/supplies';
import { getTopStandingWaiting } from '../../../store/slices/topStanding';
import { GetLoanSlip } from '../../../types/loanSlip';
import { GetSupplies } from '../../../types/supplies';
import { GetTopStanding } from '../../../types/topStanding';
import StickyHeadTable from './table';

export default function HomePage() {
    // const [dataStanding, setDataStanding] = React.useState<GetTopStanding[] | undefined>([]);
    // const [dataLoanSlip, setDataLoanSlip] = React.useState<GetLoanSlip[] | undefined>([]);
    // const [dataSupplies, setDataSupplies] = React.useState<GetSupplies[] | undefined>([]);

    // const { getTopStanding } = useSelector((state) => state.getTopStanding);
    // const { getSupplies } = useSelector((state) => state.getSupplies);
    // const { getLoanSlip } = useSelector((state) => state.getLoanSlip);
    // const { getStateOfBook } = useSelector((state) => state.getStateOfBook);
    // const { getRegisterSlip } = useSelector((state) => state.getRegisterSlip);

    // React.useEffect(() => {
    //     setDataSupplies(getSupplies);
    //     setDataStanding(getTopStanding);
    //     setDataLoanSlip(getLoanSlip);
    // }, [getTopStanding, getSupplies, getLoanSlip]);

    // React.useEffect(() => {
    //     dispatch(getTopStandingWaiting());
    //     dispatch(getSuppliesWaiting());
    //     dispatch(getLoanSlipWaiting());
    //     dispatch(getStateOfBookWaiting());
    //     dispatch(getRegisterSlipWaiting());
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <div>
            Hello

        </div>
    );
}
