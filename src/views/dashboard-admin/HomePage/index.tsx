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


    return (
        <></>
    );
}
