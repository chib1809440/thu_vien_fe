import { Grid, TableCell, Typography } from '@mui/material';
import { styled } from "@mui/material/styles";
import React from 'react';
import useScanDetection from 'use-scan-detection';

const BarcodeScan = () => {
    const [barcodeScan, setBarcodeScan] = React.useState<string>('No barcode')

    useScanDetection({
        onComplete: (code) => { setBarcodeScan(code.toString()) }
    });

    return (
        <>
        <Grid>
            Barcode: {barcodeScan}
        </Grid>
        </>
    );
};

export default BarcodeScan;

const CsTypographyTT = styled(Typography)(({ theme }) => ({
    fontSize: '10px',
    fontWeight: '700'
}));
const CsTypographyBD = styled(Typography)(({ theme }) => ({
    fontSize: '10px',
}));
const CsTableCell = styled(TableCell)(({ theme }) => ({
    border: 'none'
}));
const CsTableCell3 = styled(TableCell)(({ theme }) => ({

}));