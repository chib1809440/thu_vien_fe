import { Grid } from "@mui/material";
import MainCard from "../../../../../../ui-component/cards/MainCard";
import Connected from "./components/Connected";
import Local from "./components/Local";

interface Book {
    id: number;
    ISBN: string;
    // ... thêm các trường khác
}

export default function StickyHeadTable(props: {
    dataSupplies: any;
    dataSuppliesLT: any;
}) {

    function mergeArraysAndAddIsLocal(arr1: any, arr2: any) {
        return arr1.map(book1 => {
            let matchingBook2 = arr2.find(book2 => book2.id === book1.supplyId);
            let isLT = matchingBook2 ? true : false;
            return { ...book1, ...matchingBook2, isLT };
        });
    }

    function mergeArraysAndAddIsConnected(arr1: any, arr2: any) {
        return arr1.map(book1 => {
            let matchingBook2 = arr2.find(book2 => book2.supplyId === book1.id);
            let isLT = matchingBook2 ? true : false;
            return { ...book1, ...matchingBook2, isLT };
        });
    }

    let newArrayLocal = mergeArraysAndAddIsLocal(props.dataSupplies, props.dataSuppliesLT);
    let newArrayConnected = mergeArraysAndAddIsConnected(props.dataSuppliesLT, props.dataSupplies);

    return (
        <>
            <Grid md={12} container justifyContent='space-between' gap={{ lg: 0, xs: 3 }}>
                <Grid lg={5} xs={12}>
                    <MainCard title='HỌC LIỆU THƯ VIỆN' >
                        <Local data={newArrayLocal} />
                    </MainCard>
                </Grid>
                <Grid lg={6.8} xs={12}>
                    <MainCard title=' HỌC LIỆU LIÊN THÔNG' >
                        <Connected data={newArrayConnected} />
                    </MainCard>
                </Grid>
            </Grid>
        </>
    )
}