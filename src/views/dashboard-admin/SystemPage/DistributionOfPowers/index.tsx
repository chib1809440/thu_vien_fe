import React from 'react';

import { dispatch, useSelector } from '../../../../store';
import { getGroupPowerWaiting } from '../../../../store/slices/groupPower';
import { GetGroupPower } from '../../../../types/groupPower';
import StickyHeadTable from './table';

export default function DistributionOfPowersPage() {

    const [data, setData] = React.useState<GetGroupPower[] | undefined>([]);
    const { getGroupPower } = useSelector((state) => state.getGroupPower);

    React.useEffect(() => {
        setData(getGroupPower);
    }, [getGroupPower]);

    React.useEffect(() => {
        dispatch(getGroupPowerWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <StickyHeadTable projectItem={data} />
        </div>
    );
}
