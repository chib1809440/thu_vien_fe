import { Grid } from "@mui/material";
import MainCard from "../../../../../ui-component/cards/MainCard";
import Connected from "./components/Connected";
import Local from "./components/Local";
import { chuanHoaChuoi } from "../../../../../constant/mainContant";

export default function StickyHeadTable(props: {
    dataTypeOfSupplies: any;
    dataTypeOfSuppliesLT: any;
    dataSync: any;
}) {

    function mergeArraysAndAddIsLocal(arr1: any, arr2: any) {
        return arr1.map(book1 => {
            let matchingBook2 = arr2.find(book2 => book2.id === book1.id);
            let isLT = matchingBook2 ? true : false;
            return { ...book1, ...matchingBook2, isLT };
        });
    }

    function mergeArraysAndAddIsConnected(arr1: any, arr2: any) {
        return arr1.map(book1 => {
            // let matchingBook2 = arr2.find(book2 => book2.id === book1.id);
            let matchingBook2 = arr2.find(book2 => chuanHoaChuoi(book2.name) === chuanHoaChuoi(book1.name));

            let isLT = matchingBook2 ? true : false;
            return { ...book1, ...matchingBook2, isLT };
        });
    }

    let newArrayLocal = mergeArraysAndAddIsLocal(props.dataTypeOfSupplies, props.dataTypeOfSuppliesLT);
    let newArrayConnected = mergeArraysAndAddIsConnected(props.dataTypeOfSuppliesLT, props.dataTypeOfSupplies);

    return (
        <>
            <Grid md={12} container justifyContent='space-between' gap={{ lg: 0, xs: 3 }}>
                <Grid lg={5} xs={12}>
                    <MainCard title='LĨNH VỰC THƯ VIỆN' >
                        <Local data={newArrayLocal} />
                    </MainCard>
                </Grid>
                <Grid lg={6.8} xs={12}>
                    <MainCard title=' LĨNH VỰC LIÊN THÔNG' >
                        <Connected data={newArrayConnected} dataSync={props.dataSync} dataTypeOfSupplies={props.dataTypeOfSupplies}/>
                    </MainCard>
                </Grid>
            </Grid>
        </>
    )
}