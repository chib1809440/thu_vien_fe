import React from 'react';

import { dispatch, useSelector } from '../../../../../store';
import StickyHeadTable from './table';
import { getProducerLTWaiting, getProducerWaiting } from '../../../../../store/slices/producer';

export default function OriginalPage() {

    const { getProducer, getProducerLT } = useSelector((state) => state.getProducer);
    const { getUserLT } = useSelector((state) => state.getUserLT);

    const [filterDataSync, setfilterDataSync] = React.useState([])

    React.useEffect(() => {
        dispatch(getProducerWaiting());
        dispatch(getProducerLTWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const filterRole:any = getUserLT?.filter((item:any)=> item.role === 1)
        const filterDataSync:any = getProducerLT?.filter((item:any)=> item.user?.userID === filterRole[0]?.userID)
        setfilterDataSync(filterDataSync)
    }, [getUserLT, getProducerLT]);

    return (
        <>
            <StickyHeadTable dataProducer={getProducer} dataProducerLT={getProducerLT} dataSync={filterDataSync}/>
            {/* {dataLibraryConnection && dataSupplies !== undefined ?
                <StickyHeadTable dataContact={dataContact} dataLibraryConnection={dataLibraryConnection} dataSupplies={dataSupplies}/>
                :
                // <CircularProgress />
                <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
            } */}
        </>
    );
}
