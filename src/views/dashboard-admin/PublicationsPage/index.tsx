import React from 'react';

import { dispatch, useSelector } from '../../../store';
import { getAuthorWaiting } from '../../../store/slices/author';
import { getCabinetWaiting } from '../../../store/slices/cabinet';
import { getCategoryWaiting } from '../../../store/slices/category';
import { getPrintedMatterWaiting } from '../../../store/slices/printedMaster';
import { getProducerWaiting } from '../../../store/slices/producer';
import { getSuppliesWaiting } from '../../../store/slices/supplies';
import { getTypeSuplyWaiting } from '../../../store/slices/typeSuplly';
import StickyHeadTable from './table';

export default function AccountPage() {

    const { getSupplies } = useSelector((state) => state.getSupplies);
    const { getCabinet } = useSelector((state) => state.getCabinet);
    const { getAuthor } = useSelector((state) => state.getAuthor);
    const { getProducer } = useSelector((state) => state.getProducer);
    const { getCategory } = useSelector((state) => state.getCategory);
    const { getPrintedMatter } = useSelector((state) => state.getprintedMatter);
    const { getTypeSuply } = useSelector((state) => state.getTypeSuply);

    React.useEffect(() => {
        dispatch(getSuppliesWaiting());
        dispatch(getCabinetWaiting());
        dispatch(getAuthorWaiting());
        dispatch(getProducerWaiting());
        dispatch(getCategoryWaiting());
        dispatch(getPrintedMatterWaiting());
        dispatch(getTypeSuplyWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
        <>
            <StickyHeadTable dataSupplies={getSupplies} dataCabinet={getCabinet} dataAuthor={getAuthor} dataProducer={getProducer} dataCategory={getCategory} dataPrintedMatter={getPrintedMatter} dataTypeSuply={getTypeSuply}/>
        </>
    );
}
