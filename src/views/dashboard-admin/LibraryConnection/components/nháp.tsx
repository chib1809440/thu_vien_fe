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
import imageVodeo from './image-video.png';
import sachSimple from './sach.png';

export default function BasicTable(props: {
    [x: string]: any;
    dataProduct: any;
    dataLibraryConnection: any;
    dataContact: any;
    keyFind: any;
    keyFindISBN: any;
}) {

    const [dataProduct, setDataProduct] = React.useState<any>([]);
    const [dataContact, setContact] = React.useState<any>([]);
    const [dataLibraryConnection, setLibraryConnection] = React.useState<any>([]);
    const [newDataLibraryConnection, setNewLibraryConnection] = React.useState<any>([]);

    React.useEffect(() => {
        let dataFilter = props.dataLibraryConnection;
        let dataFilterNew:any = [];

        dataFilter = dataFilter.map((innerArray, index) =>
            innerArray
                .map((filteredItem) => ({
                    ...filteredItem,
                    nameSchool: dataContact[index][0]['nameContact'], // Replace 'props.nameSchool' with the actual value you want to assign
                }))
        );

       dataFilter.map((item) => dataFilterNew = dataFilterNew.concat(item))

       setDataProduct(props.dataProduct)
       setContact(props.dataContact)
       setLibraryConnection(dataFilter)
    }, [props.dataProduct, props.dataContact, props.dataLibraryConnection]);

    React.useEffect(() => {
        let dataFilter = dataLibraryConnection;

        dataFilter = dataFilter.map((innerArray) =>
            innerArray.filter((item) =>
                item.supplyName.toLowerCase().includes(props.keyFind.toLowerCase())
            )
        );

        dataFilter = dataFilter.map((innerArray) =>
            innerArray.filter((item) =>
                item.ISBN.toLowerCase().includes(props.keyFindISBN.toLowerCase())
            )
        );

        if (props.keyFind !== '' || props.keyFindISBN !== '') {
            setNewLibraryConnection(dataFilter)
        } else {
            setNewLibraryConnection(dataLibraryConnection)
        }

    }, [dataLibraryConnection, props.keyFind, props.keyFindISBN]);

    // function checkUrl(dataDetails) {
    //     if (dataDetails?.listMedia !== null || dataDetails !== null) {
    //         let lastChar = dataDetails?.listMedia[0]['url'].slice(-4);
    //         if (lastChar === '.mp4') {
    //             return <img style={{ borderRadius: '5px' }} width='60px' height='auto' src={imageVodeo} alt="ảnh ấn phẩm" />
    //         }
    //         if (lastChar === '.png' || lastChar === '.jpg' || lastChar === '.jpeg') {
    //             return <img style={{ borderRadius: '5px' }} width='50px' height='auto' src={`${process.env.REACT_APP_BASE_API_URL}/${dataDetails?.listMedia[0]['url']}`} alt="ảnh ấn phẩm" />
    //         }
    //     } else {
    //         return <img style={{ borderRadius: '5px' }} width='50px' height='auto' src={sachSimple} alt="ảnh ấn phẩm" />
    //     }
    // }

    function checkStatus(dataDetails) {
        const dataSuppliesFilter = dataProduct.filter((item) => item?.supplyName === dataDetails?.supplyName || item?.ISBN === dataDetails?.ISBN);
        if (dataSuppliesFilter.length !== 0) {
            return true
        } else {
            return false
        }
    }

    return (
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
                    {newDataLibraryConnection.map((item, index) => (
                        <>
                            {item.map((row) => (
                                <TableRow
                                    key={row?.supplyName}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align='left'>
                                        {row?.supplyName}
                                    </TableCell>
                                    {/* <TableCell align="left">{checkUrl(row)}</TableCell> */}
                                    <TableCell align="center">{row?.cabinet_quantity}</TableCell>
                                    {/* <TableCell align="center">{row?.ISBN}</TableCell> */}
                              
                                    {dataContact[index][0]['nameContact'] !== undefined && 
                                    <TableCell align="center">{dataContact[index][0]['nameContact']}</TableCell>}
                                    <TableCell align="center">{checkStatus(row) ? <Typography textAlign='center' p={0.5} borderRadius='5px' color='#fff' width='100px' sx={{ background: '#33CC00' }}>Đã có</Typography> : <Typography textAlign='center' p={0.5} borderRadius='5px' color='#fff' width='100px' sx={{ background: '#FF9933' }}>Chưa có</Typography>}</TableCell>
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
                            ))}
                        </>
                    ))}

                </TableBody>
            </Table>
        </TableContainer>
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