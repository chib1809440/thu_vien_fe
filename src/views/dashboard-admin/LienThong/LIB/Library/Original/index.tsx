import React from 'react';

import { dispatch, useSelector } from '../../../../../../store';
import { getSuppliesLTWaiting, getSuppliesWaiting } from '../../../../../../store/slices/supplies';
import StickyHeadTable from './table';
import { getRegisterSlipLTWaiting } from '../../../../../../store/slices/registerSlip';
import { getAllLoanSlipLTWaiting, getLoanSlipLTWaiting } from '../../../../../../store/slices/loanSlip';

export default function OriginalPage() {

    const { getSupplies, getSuppliesLT } = useSelector((state) => state.getSupplies);
    const { getRegisterSlipLT } = useSelector((state) => state.getRegisterSlip);
    const { getAllLoanSlipLT, getLoanSlipLT } = useSelector((state) => state.getLoanSlip);

    React.useEffect(() => {
        dispatch(getSuppliesWaiting());
        dispatch(getSuppliesLTWaiting());
        dispatch(getRegisterSlipLTWaiting());
        dispatch(getAllLoanSlipLTWaiting());
        dispatch(getLoanSlipLTWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <StickyHeadTable dataSupplies={getSupplies} dataSuppliesLT={getSuppliesLT} dataRegisterSlipLT={getRegisterSlipLT} dataAllLoanSlipLT={getLoanSlipLT}/>
            {/* {dataLibraryConnection && dataSupplies !== undefined ?
                <StickyHeadTable dataContact={dataContact} dataLibraryConnection={dataLibraryConnection} dataSupplies={dataSupplies}/>
                :
                // <CircularProgress />
                <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
            } */}
        </>
    );
}
