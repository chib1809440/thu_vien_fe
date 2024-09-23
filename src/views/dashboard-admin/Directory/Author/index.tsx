import React from 'react';

import { dispatch, useSelector } from '../../../../store';
import { getAuthorWaiting } from '../../../../store/slices/author';
import { GetAuthor } from '../../../../types/author';
import StickyHeadTable from './table';

export default function HomePage() {

    const [dataAuthor, setDataAuthor] = React.useState<GetAuthor[] | undefined>([]);
    const { getAuthor } = useSelector((state) => state.getAuthor);
    
    React.useEffect(() => {
        setDataAuthor(getAuthor);
    }, [getAuthor]);

    React.useEffect(() => {
        dispatch(getAuthorWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <div>
            <StickyHeadTable projectItem={dataAuthor} />
        </div>
    );
}
