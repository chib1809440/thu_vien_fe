import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@chatscope/chat-ui-kit-react';
import styled from 'styled-components';
import AnimateButton from '../../../../ui-component/extended/AnimateButton';
import { Grid, Typography } from '@mui/material';
// import imageVodeo from './image-video.png';
// import sachSimple from './sach.png';

export default function BasicTable(props: {
    [x: string]: any;
    dataProduct: any;
    dataLibraryConnection: any;
    dataContact: any;
    keyFind: any;
    keyFindISBN: any;
    keyStatus: any;
}) {

    const [dataProduct, setDataProduct] = React.useState<any>(props.dataProduct);
    const [dataContact, setContact] = React.useState<any>(props.dataContact);
    const [dataLibraryConnection, setLibraryConnection] = React.useState<any>(props.dataLibraryConnection);
    const [newDataLibraryConnection, setNewLibraryConnection] = React.useState<any>([]);
    const [sortDataLibraryConnection, setSortLibraryConnection] = React.useState<any>([]);

    React.useEffect(() => {
        let filteredData = props.dataLibraryConnection;

        filteredData = filteredData.map((filteredItem) => ({
            ...filteredItem,
            nameSchool: dataContact?.['nameContact'],
        }))

        setLibraryConnection(filteredData)
        setContact(props.dataContact)
        setDataProduct(props.dataProduct)
    }, [props.dataProduct, props.dataContact, props.dataLibraryConnection]);

    // Refactored filtering logic
    React.useEffect(() => {
        let filteredData = dataLibraryConnection;

        if (props.keyFind !== '' || props.keyFindISBN !== '') {
            filteredData = filteredData.filter((item) =>
                item.supplyName.toLowerCase().includes(props.keyFind.toLowerCase()) &&
                item.ISBN.toLowerCase().includes(props.keyFindISBN.toLowerCase())
            );
            setNewLibraryConnection(filteredData);
        } else {
            setNewLibraryConnection(dataLibraryConnection);
        }
    }, [dataLibraryConnection, props.keyFind, props.keyFindISBN]);

    React.useEffect(() => {
        const haveSameISBN = (obj1, obj2) => obj1.ISBN === obj2.ISBN;
        const uniqueSupplies1 = newDataLibraryConnection.filter((item1) =>
            !dataProduct.some((item2) => haveSameISBN(item1, item2))
        );

        const dataSuppliesFilter = newDataLibraryConnection.filter((item) =>
        dataProduct.some((item2: any) => {
            if (props.keyStatus === '' || props.keyStatus === '0') {
                return true; // include all items
            }
            if (props.keyStatus === '1') {
                return item?.ISBN === item2?.ISBN;
            }
            if (props.keyStatus === '2') {
                return uniqueSupplies1;
            }
    
            // Add a default return statement to satisfy the array-callback-return rule
            return false;
        })
    );
    

        if (props.keyStatus === '' || props.keyStatus === '0' || props.keyStatus === '1') {
            setSortLibraryConnection(dataSuppliesFilter);
        }
        if (props.keyStatus === '2') {
            setSortLibraryConnection(uniqueSupplies1);
        }
    }, [newDataLibraryConnection, dataProduct, props.keyStatus]);

    // Refactored sorting logic

    // Unchanged checkStatus function
    function checkStatus(dataDetails) {
        const dataSuppliesFilter = dataProduct.filter(
            (item) => item?.supplyName === dataDetails?.supplyName || item?.ISBN === dataDetails?.ISBN
        );
        return dataSuppliesFilter.length !== 0;
    }

    return (
        <>
            {props.dataLibraryConnection.length !== 0 ?
                <TableContainer component={Paper} sx={{ maxHeight: '500px' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Tên ấn phẩm</TableCell>
                                {/* <TableCell align="left">Hình ảnh</TableCell> */}
                                <TableCell align="center">Số lượng</TableCell>
                                {/* <TableCell align="center">Mã ISBN</TableCell> */}
                                <TableCell align="center">Liên kết</TableCell>
                                <TableCell align="center">Trạng thái</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortDataLibraryConnection.map((row: any) => (
                                <>
                                    <TableRow
                                        key={row?.supplyName}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align='left'>
                                            {row?.supplyName}
                                        </TableCell>
                                        {/* <TableCell align="left">{checkUrl(row)}</TableCell> */}
                                        <TableCell align="center">{row?.cabinet_quantity}</TableCell>
                                        {/* <TableCell align="center">{newDataLibraryConnection?.length}</TableCell> */}
                                        <TableCell align="center">{row?.nameSchool}</TableCell>
                                        <TableCell align="center"><Grid container justifyContent='center'>{checkStatus(row) ? <Typography textAlign='center' p={0.5} borderRadius='5px' color='#fff' width='100px' sx={{ background: '#33CC00' }}>Đã có</Typography> : <Typography textAlign='center' p={0.5} borderRadius='5px' color='#fff' width='100px' sx={{ background: '#FF9933' }}>Chưa có</Typography>}</Grid></TableCell>
                                        <TableCell align="right">
                                            <Grid container gap={2} justifyContent='flex-end'>
                                                <AnimateButton>
                                                    <CSButton disabled={checkStatus(row)}>Mượn</CSButton>
                                                </AnimateButton>
                                                <AnimateButton>
                                                    <CSButtonV2 disabled={checkStatus(row)}>Trả</CSButtonV2>
                                                </AnimateButton>
                                            </Grid>
                                        </TableCell>
                                    </TableRow>
                                </>
                            ))}
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

const CSButton = styled(Button)((props: { disabled?: boolean }) => ({
    border: 'none',
    color: '#fff',
    height: '30px',
    width: '60px',
    borderRadius: '4px',
    fontWeight: 600,
    fontSize: '14px',
    background: props.disabled ? '#C0C0C0' : '#2196F2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px',
    '&:hover': {
        background: props.disabled ? '#C0C0C0' : '#2182F1',
    }
}));

const CSButtonV2 = styled(Button)((props: { disabled?: boolean }) => ({
    border: 'none',
    color: '#fff',
    height: '30px',
    width: '60px',
    borderRadius: '4px',
    fontWeight: 600,
    fontSize: '14px',
    background: props.disabled ? '#C0C0C0' : '#EE6363',
    '&:hover': {
        background: props.disabled ? '#C0C0C0' : '#CD5C5C',
    }
}));