import { Grid, Typography } from "@mui/material";
import React from "react";
import MainCardDetail from "../../../ui-component/cards/MainCardDetail";
import MainCardV2 from "../../../ui-component/cards/MainCardV2";
import MainCardV3 from "../../../ui-component/cards/MainCardV3";
import AccessibleTable from "./components/tableProduct";
import AccessibleTableDetail from "./components/tableProductDetail";
import TableSchool from "./components/tableSchool";

export default function StickyHeadTable(props: {
    [x: string]: any;
    dataSupplies: any;
    dataLibraryConnection: any;
    dataContact: any;
}) {

    const [dataSupplies, setDataSupplies] = React.useState([]);
    const [dataLibraryConnection, setLibraryConnection] = React.useState<any>([]);
    const [dataLibraryConnectionDetail, setLibraryConnectionDetail] = React.useState<any>([]);
    const [dataContact, setContact] = React.useState([]);
    const [dataContactDetail, setContactDetail] = React.useState<any>([]);

    const [keyFind, setKeyFind] = React.useState('');
    const [keyFindISBN, setKeyFindISBN] = React.useState('');
    const [keyFindSchool, setKeyFindSchool] = React.useState('');
    const [keyStatus, setKeyStatus] = React.useState('2');

    const [keyFindDetail, setKeyFindDetail] = React.useState('');
    const [keyFindISBNDetail, setKeyFindISBNDetail] = React.useState('');
    // const [keyFindSchoolDetail, setKeyFindSchoolDetail] = React.useState('');
    const [keyStatusDetail, setKeyStatusDetail] = React.useState('0');

    React.useEffect(() => {
        let newDataProduct: any[] = [];
        props.dataLibraryConnection.forEach((item: any, index) => {
            if (dataContact[index]?.[0]?.['nameContact'] !== undefined && dataContact[index]?.[0]?.['nameContact'] !== null)
                newDataProduct.push({ ...item, nameSchool: dataContact[index][0]['nameContact'] })
        })

        setDataSupplies(props.dataSupplies);
        setLibraryConnection(props.dataLibraryConnection);
        setContact(props.dataContact);
    }, [props.dataLibraryConnection, props.dataSupplies, props.dataContact]);

    return (
        <>
            {/* <IBreadcrumsCustom profile="TRANG CHỦ" mainProfile="LIÊN KẾT THƯ VIỆN" link="/trang-chu" /> */}
            {/* <MainCard title="DANH SÁCH DẠNG ẤN PHẨM">a</MainCard> */}
            <Grid container justifyContent='space-between' p={2}>
                <MainCardV2 width='65%' title='LIÊN THÔNG ẤN PHẨM' keyStatus={(e) => setKeyStatus(e)} keyFind={(e) => setKeyFind(e)} keyFindISBN={(e) => setKeyFindISBN(e)}>
                    {dataSupplies !== undefined && dataContact !== undefined && dataLibraryConnection !== undefined ?
                        <AccessibleTable keyStatus={keyStatus} keyFindISBN={keyFindISBN} keyFind={keyFind} dataProduct={dataSupplies} dataContact={dataContact} dataLibraryConnection={dataLibraryConnection} />
                        :
                        <Grid container justifyContent='center'>
                            <span className="loaderLibraryConnection"></span>
                            <Typography width='100%' textAlign='center'>Đang tải dữ liệu...</Typography>
                        </Grid>
                    }
                </MainCardV2>
                <MainCardV3 width='33%' title='LIÊN THÔNG' keyFind={(e) => setKeyFindSchool(e)}>
                    {props.dataLibraryConnection !== undefined ?
                        < TableSchool dataLibraryConnectionDetail={(e: any) => setLibraryConnectionDetail(e)} dataContactDetail={(e: any) => setContactDetail(e)} keyFind={keyFindSchool} dataContact={dataContact} dataLibraryConnection={dataLibraryConnection} />
                        :
                        <Grid container justifyContent='center'>
                            <span className="loaderLibraryConnection"></span>
                            <Typography width='100%' textAlign='center'>Đang tải dữ liệu...</Typography>
                        </Grid>
                    }
                </MainCardV3>
                <Grid md={12} mt={2} />

                {dataLibraryConnectionDetail.length !== 0 &&
                    <MainCardDetail width='100%' title={`${dataContactDetail?.nameContact}`} keyStatus={(e) => setKeyStatusDetail(e)} keyFind={(e) => setKeyFindDetail(e)} keyFindISBN={(e) => setKeyFindISBNDetail(e)}>
                        {dataSupplies !== undefined && dataContact !== undefined && dataLibraryConnection !== undefined ?
                            <AccessibleTableDetail keyStatus={keyStatusDetail} keyFindISBN={keyFindISBNDetail} keyFind={keyFindDetail} dataProduct={dataSupplies} dataContact={dataContactDetail} dataLibraryConnection={dataLibraryConnectionDetail} />
                            :
                            <Grid container justifyContent='center'>
                                <span className="loaderLibraryConnection"></span>
                                <Typography width='100%' textAlign='center'>Đang tải dữ liệu...</Typography>
                            </Grid>
                        }
                    </MainCardDetail>
                }
            </Grid>
        </>
    )
}