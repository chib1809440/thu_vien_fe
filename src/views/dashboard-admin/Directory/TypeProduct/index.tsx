import React from 'react';

import { CircularProgress } from '@mui/material';
import { dispatch, useSelector } from '../../../../store';
import { getCategoryWaiting } from '../../../../store/slices/category';
import { GetCategory } from '../../../../types/category';
import StickyHeadTable from './table';

export default function HomePage() {

    const [dataCategory, setDataCategory] = React.useState<GetCategory[] | undefined>([]);
    const { getCategory } = useSelector((state) => state.getCategory);
    
    React.useEffect(() => {
        setDataCategory(getCategory);
    }, [getCategory]);

    React.useEffect(() => {
        dispatch(getCategoryWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div>
            {getCategory !== undefined ? <StickyHeadTable projectItem={dataCategory} /> : <CircularProgress/> }
        </div>
    );
}
