import React from 'react';

import { dispatch, useSelector } from '../../../../../../store';
import { getSuppliesLTWaiting, getSuppliesWaiting } from '../../../../../../store/slices/supplies';
import StickyHeadTable from './table';

export default function ElectronicPage() {

    const { getSupplies, getSuppliesLT } = useSelector((state) => state.getSupplies);
    const { getApiLT } = useSelector((state) => state.getApiLT);


    React.useEffect(() => {
        dispatch(getSuppliesWaiting());
        dispatch(getSuppliesLTWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <StickyHeadTable dataSupplies={getSupplies} dataSuppliesLT={getSuppliesLT} />
            {/* {dataLibraryConnection && dataSupplies !== undefined ?
                <StickyHeadTable dataContact={dataContact} dataLibraryConnection={dataLibraryConnection} dataSupplies={dataSupplies}/>
                :
                // <CircularProgress />
                <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
            } */}
        </>
    );
}
