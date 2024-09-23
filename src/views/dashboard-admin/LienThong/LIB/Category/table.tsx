import { Grid } from "@mui/material";
import MainCard from "../../../../../ui-component/cards/MainCard";
import Connected from "./components/Connected";
import Local from "./components/Local";
import { chuanHoaChuoi } from "../../../../../constant/mainContant";

export default function StickyHeadTable(props: {
    dataCategory: any;
    dataCategoryLT: any;
    dataSync:any;
}) {

    function mergeArraysAndAddIsLocal(arr1: any, arr2: any) {
        return arr1.map(book1 => {
            let matchingBook2 = arr2.find(book2 => book2.id === book1.categoryId);
            // let matchingBook2 = arr2.find(book2 => chuanHoaChuoi(book2.categoryName) === chuanHoaChuoi(book1.categoryName));
            let isLT = matchingBook2 ? true : false;
            return { ...book1, ...matchingBook2, isLT };
        });
    }

    function mergeArraysAndAddIsConnected(arr1: any, arr2: any) {
        return arr1.map(book1 => {
            // let matchingBook2 = arr2.find(book2 => book2.categoryId === book1.id);
            let matchingBook2 = arr2.find(book2 => chuanHoaChuoi(book2.categoryName) === chuanHoaChuoi(book1.categoryName));
            let isLT = matchingBook2 ? true : false;
            return { ...book1, ...matchingBook2, isLT };
        });
    }

    let newArrayLocal = mergeArraysAndAddIsLocal(props.dataCategory, props.dataCategoryLT);
    let newArrayConnected = mergeArraysAndAddIsConnected(props.dataCategoryLT, props.dataCategory);

    return (
        <>
            <Grid md={12} container justifyContent='space-between' gap={{ lg: 0, xs: 3 }}>
                <Grid lg={5} xs={12}>
                    <MainCard title='DẠNG HỌC LIỆU THƯ VIỆN' >
                        <Local data={newArrayLocal} />
                    </MainCard>
                </Grid>
                <Grid lg={6.8} xs={12}>
                    <MainCard title=' DẠNG HỌC LIỆU LIÊN THÔNG' >
                        <Connected data={newArrayConnected} dataSync={props.dataSync} dataCategory={props.dataCategory}/>
                    </MainCard>
                </Grid>
            </Grid>
        </>
    )
}