import { Grid, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';

export default function TableSchool(props: {
    [x: string]: any;
    dataContact: any;
    keyFind: any;
    dataLibraryConnection: any;
    dataLibraryConnectionDetail?: any;
    dataContactDetail?: any;
}) {
    const [dataContact, setContact] = React.useState<any>([]);
    const [dataLibraryConnection, setLibraryConnection] = React.useState<any>([]);

    React.useEffect(() => {
        if (props.dataContact !== undefined && props.dataContact.length !== 0) {
            const filteredRows = props.dataContact?.filter((item: any) => item[0]?.nameContact.toLowerCase().includes(props.keyFind.toLowerCase()));
            setContact(filteredRows)
        } else {
            setContact(props.dataContact)
        }
        setLibraryConnection(props.dataLibraryConnection)

    }, [props.dataContact, props.keyFind, props.dataLibraryConnection]);

    function handleClick(dataLibraryConnection, dataContact) {
        props.dataLibraryConnectionDetail(dataLibraryConnection)
        props.dataContactDetail(dataContact)
    }
    function plusProduct(row) {
        let ab = 0;
        row.map((item)=>(
            ab += item?.cabinet_quantity
        ))
        return ab
    }

    return (
        <>
            {dataContact.length !== 0 ?
                <TableContainer component={Paper} sx={{ maxHeight: '500px' }}>
                    <Table sx={{ minWidth: 300 }} aria-label="simple table">
                        <TableHead >
                            <TableRow>
                                <TableCell align="left">Tên trường liên kết</TableCell>
                                <TableCell align="center">Tổng sách</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataContact !== undefined && dataContact.length !== 0 &&
                                <>
                                    {dataContact.map((row, index) => (
                                        <TableRow
                                            key={row[0]?.nameContact}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
                                            onClick={() => handleClick(dataLibraryConnection[index], row[0])}
                                        >
                                            <TableCell align='left'>
                                                {row[0]?.nameContact}
                                            </TableCell>
                                            <TableCell align='center'>
                                                {/* {row[0]?.nameContact} */}
                                                {plusProduct(dataLibraryConnection[index])}
                                            </TableCell>
                                            {/* <TableCell align="left"><img style={{ borderRadius: '5px' }} width='50px' height='auto' src={`${import.meta.env.REACT_APP_BASE_API_URL}/${row[0]?.imageLogo}`} alt="Logo" /></TableCell> */}
                                            {/* <TableCell component="th" scope="row">{row[0]?.phoneContact}</TableCell> */}
                                            {/* <TableCell component="th" scope="row">{row[0]?.emailContact}</TableCell> */}
                                            {/* <TableCell component="th" scope="row">{row[0]?.urlContact}</TableCell> */}
                                        </TableRow>
                                    ))}
                                </>
                            }

                        </TableBody>
                    </Table>
                </TableContainer>
                :
                <Grid container justifyContent='center'>
                    <span className="loaderLibraryConnection"></span>
                    <Typography width='100%' textAlign='center'>Không có dữ liệu...</Typography>
                </Grid>
            }
        </>

    );
}
