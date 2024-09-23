import React from 'react';

import { dispatch, useSelector } from '../../../../store';
import { getPrintedMatterWaiting } from '../../../../store/slices/printedMaster';
import { GetPrintedMatter } from '../../../../types/printedMaster';
import StickyHeadTable from './table';
import { getAssetsLibWaiting } from '../../../../store/slices/assetsLib';

export default function AssetLib() {

    const [dataProducer, setDataProducer] = React.useState<GetPrintedMatter[] | undefined>([]);
    const { getPrintedMatter } = useSelector((state) => state.getprintedMatter);
    const { getAssetsLib } = useSelector((state) => state.getAssetsLib);
    
    React.useEffect(() => {
        setDataProducer(getPrintedMatter);
    }, [getPrintedMatter]);

    React.useEffect(() => {
        dispatch(getPrintedMatterWaiting());
        dispatch(getAssetsLibWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div>
           <StickyHeadTable projectItem={getAssetsLib} />
        </div>
    );
}
