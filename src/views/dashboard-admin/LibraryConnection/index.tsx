import React from 'react';

import { CircularProgress } from '@mui/material';
import { dispatch, useSelector } from '../../../store';
import { getContactWaiting, getLibraryConnectionWaiting } from '../../../store/slices/libraryConnection';
import { getSuppliesWaiting } from '../../../store/slices/supplies';
import { GetContact } from '../../../types/libraryConnection';
import { GetSupplies } from '../../../types/supplies';
import StickyHeadTable from './table';
import Grid from '@mui/material/Grid';

export default function HomePage() {
    const [dataLibraryConnection, setDataLibraryConnection] = React.useState<GetSupplies[] | undefined>([]);
    const [dataSupplies, setDataSupplies] = React.useState<GetSupplies[] | undefined>([]);
    const [dataContact, setDataContact] = React.useState<GetContact[] | undefined>([]);

    const { getSupplies } = useSelector((state) => state.getSupplies);
    const { getLibraryConnection, getContact } = useSelector((state) => state.getLibraryConnection);

    React.useEffect(() => {
        setDataSupplies(getSupplies);
        setDataLibraryConnection(getLibraryConnection);
        setDataContact(getContact);
    }, [getLibraryConnection, getSupplies, getContact]);

    React.useEffect(() => {
        dispatch(getSuppliesWaiting());
        dispatch(getLibraryConnectionWaiting());
        dispatch(getContactWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {dataLibraryConnection && dataSupplies !== undefined ?
                <StickyHeadTable dataContact={dataContact} dataLibraryConnection={dataLibraryConnection} dataSupplies={dataSupplies}/>
                :
                // <CircularProgress />
                <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
            }
        </>
    );
}
