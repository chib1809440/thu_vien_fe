import React from 'react';

import { dispatch, useSelector } from '../../../../../store';
import StickyHeadTable from './table';
import { getTypeOfSuppliesLTWaiting, getTypeSuplyWaiting } from '../../../../../store/slices/typeSuplly';
import { getUserLTWaiting } from '../../../../../store/slices/userLT';

export default function OriginalPage() {

    const { getTypeSuply, getTypeSuplyLT } = useSelector((state) => state.getTypeSuply);
    const { getUserLT } = useSelector((state) => state.getUserLT);
    const [filterDataSync, setfilterDataSync] = React.useState([])

    React.useEffect(() => {
        dispatch(getTypeOfSuppliesLTWaiting());
        dispatch(getTypeSuplyWaiting());
        dispatch(getUserLTWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const filterRole:any = getUserLT?.filter((item:any)=> item.role === 1)
        const filterDataSync:any = getTypeSuplyLT?.filter((item:any)=> item.user?.userID === filterRole[0]?.userID)
        setfilterDataSync(filterDataSync)
    }, [getUserLT, getTypeSuplyLT]);

    return (
        <>
            <StickyHeadTable dataTypeOfSupplies={getTypeSuply} dataTypeOfSuppliesLT={getTypeSuplyLT}  dataSync={filterDataSync}/>
            {/* {dataLibraryConnection && dataSupplies !== undefined ?
                <StickyHeadTable dataContact={dataContact} dataLibraryConnection={dataLibraryConnection} dataSupplies={dataSupplies}/>
                :
                // <CircularProgress />
                <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
            } */}
        </>
    );
}
