import React from 'react';

import { dispatch, useSelector } from '../../../../../store';
import StickyHeadTable from './table';
import { getAuthorLTWaiting, getAuthorWaiting } from '../../../../../store/slices/author';
import { getUserLTWaiting } from '../../../../../store/slices/userLT';

export default function OriginalPage() {

    const { getAuthor, getAuthorLT } = useSelector((state) => state.getAuthor);
    const { getUserLT } = useSelector((state) => state.getUserLT);

    const [filterDataSync, setfilterDataSync] = React.useState([])

    React.useEffect(() => {
        dispatch(getAuthorWaiting());
        dispatch(getAuthorLTWaiting());
        dispatch(getUserLTWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const filterRole: any = getUserLT?.filter((item: any) => item.role === 1)
        const filterDataSync: any = getAuthorLT?.filter((item: any) => item.user?.userID === filterRole[0]?.userID)
        setfilterDataSync(filterDataSync)
    }, [getAuthorLT, getUserLT]);

    return (
        <>
            <StickyHeadTable dataAuthor={getAuthor} dataAuthorLT={getAuthorLT} dataSync={filterDataSync}/>
        </>
    );
}
