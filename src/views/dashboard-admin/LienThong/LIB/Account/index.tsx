import React, { useState } from 'react';

import StickyHeadTable from './table';
import { dispatch, useSelector } from '../../../../../store';
import { getUserLTWaiting } from '../../../../../store/slices/userLT';

export default function DistributionOfPowers() {

    const { getUserLT } = useSelector((state) => state.getUserLT);
    React.useEffect(() => {
        dispatch(getUserLTWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <StickyHeadTable projectItem={getUserLT} />
        </div>
    );
}
