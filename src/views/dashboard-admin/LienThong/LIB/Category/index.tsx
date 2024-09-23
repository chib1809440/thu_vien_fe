import React from 'react';

import { dispatch, useSelector } from '../../../../../store';
import StickyHeadTable from './table';
import { getCategoryLTWaiting, getCategoryWaiting } from '../../../../../store/slices/category';
import { getUserLTWaiting } from '../../../../../store/slices/userLT';

export default function OriginalPage() {

    const { getCategory, getCategoryLT } = useSelector((state) => state.getCategory);
    const { getUserLT } = useSelector((state) => state.getUserLT);
    const [filterDataSync, setfilterDataSync] = React.useState([])

    React.useEffect(() => {
        dispatch(getCategoryWaiting());
        dispatch(getCategoryLTWaiting());
        dispatch(getUserLTWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const filterRole:any = getUserLT?.filter((item:any)=> item.role === 1)
        const filterDataSync:any = getCategoryLT?.filter((item:any)=> item.user?.userID === filterRole[0]?.userID)
        setfilterDataSync(filterDataSync)
    }, [getUserLT, getCategoryLT]);

    return (
        <>
            <StickyHeadTable dataCategory={getCategory} dataCategoryLT={getCategoryLT} dataSync={filterDataSync}/>
            {/* {dataLibraryConnection && dataSupplies !== undefined ?
                <StickyHeadTable dataContact={dataContact} dataLibraryConnection={dataLibraryConnection} dataSupplies={dataSupplies}/>
                :
                // <CircularProgress />
                <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
            } */}
        </>
    );
}
