import { Grid } from "@mui/material";
import MainCard from "../../../../../ui-component/cards/MainCard";
import Connected from "./components/Connected";
import Local from "./components/Local";
import { chuanHoaChuoi } from "../../../../../constant/mainContant";

export default function StickyHeadTable(props: {
    dataProducer: any;
    dataProducerLT: any;
    dataSync: any;
}) {

    function mergeArraysAndAddIsLocal(arr1: any, arr2: any) {
        return arr1.map(book1 => {
            let matchingBook2 = arr2.find(book2 => book2.id === book1.publisherId);
            let isLT = matchingBook2 ? true : false;
            return { ...book1, ...matchingBook2, isLT };
        });
    }

    function mergeArraysAndAddIsConnected(arr1: any, arr2: any) {
        return arr1.map(book1 => {
            // let matchingBook2 = arr2.find(book2 => book2.publisherId === book1.id);
            let matchingBook2 = arr2.find(book2 => chuanHoaChuoi(book2.publisherName) === chuanHoaChuoi(book1.publisherName));
            let isLT = matchingBook2 ? true : false;
            return { ...book1, ...matchingBook2, isLT };
        });
    }

    let newArrayLocal = mergeArraysAndAddIsLocal(props.dataProducer, props.dataProducerLT);
    let newArrayConnected = mergeArraysAndAddIsConnected(props.dataProducerLT, props.dataProducer);

    return (
        <>
            <Grid md={12} container justifyContent='space-between' gap={{ lg: 0, xs: 3 }}>
                <Grid lg={5} xs={12}>
                    <MainCard title='NHÀ XUẨT BẢN THƯ VIỆN' >
                        <Local data={newArrayLocal} />
                    </MainCard>
                </Grid>
                <Grid lg={6.8} xs={12}>
                    <MainCard title=' NHÀ XUẨT BẢN LIÊN THÔNG' >
                        <Connected data={newArrayConnected} dataSync={props.dataSync} dataProducer={props.dataProducer}/>
                    </MainCard>
                </Grid>
            </Grid>
        </>
    )
}