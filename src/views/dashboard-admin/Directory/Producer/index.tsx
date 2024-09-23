import React from 'react';

import { dispatch, useSelector } from '../../../../store';
import { getProducerWaiting } from '../../../../store/slices/producer';
import { GetProducer } from '../../../../types/producer';
import StickyHeadTable from './table';

export default function HomePage() {

    const [dataProducer, setDataProducer] = React.useState<GetProducer[] | undefined>([]);
    const { getProducer } = useSelector((state) => state.getProducer);
    
    React.useEffect(() => {
        setDataProducer(getProducer);
    }, [getProducer]);

    React.useEffect(() => {
        dispatch(getProducerWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div>
            <StickyHeadTable projectItem={dataProducer} />
        </div>
    );
}
