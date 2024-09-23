import React from 'react';

import { dispatch, useSelector } from '../../../../store';
import { getPrintedMatterWaiting } from '../../../../store/slices/printedMaster';
import { GetPrintedMatter } from '../../../../types/printedMaster';
import StickyHeadTable from './table';

export default function HomePage() {

    const [dataProducer, setDataProducer] = React.useState<GetPrintedMatter[] | undefined>([]);
    const { getPrintedMatter } = useSelector((state) => state.getprintedMatter);
    
    React.useEffect(() => {
        setDataProducer(getPrintedMatter);
    }, [getPrintedMatter]);

    React.useEffect(() => {
        dispatch(getPrintedMatterWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div>
           <StickyHeadTable projectItem={dataProducer} />
        </div>
    );
}
