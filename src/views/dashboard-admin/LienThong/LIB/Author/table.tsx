import { Grid } from "@mui/material";
import MainCard from "../../../../../ui-component/cards/MainCard";
import Connected from "./components/Connected";
import Local from "./components/Local";
import { chuanHoaChuoi } from "../../../../../constant/mainContant";

export default function StickyHeadTable(props: {
    dataAuthor: any;
    dataAuthorLT: any;
    dataSync: any;
}) {

    function mergeArraysAndAddIsLocal(arr1: any, arr2: any) {
        return arr1.map(book1 => {
            let matchingBook2 = arr2.find(book2 => book2.id === book1.authorId);
            let isLT = matchingBook2 ? true : false;
            return { ...book1, ...matchingBook2, isLT };
        });
    }

    function mergeArraysAndAddIsConnected(arr1: any, arr2: any) {
        return arr1.map(book1 => {
            // let matchingBook2 = arr2.find(book2 => book2.authorId === book1.id);
            let matchingBook2 = arr2.find(book2 => chuanHoaChuoi(book2.authorName) === chuanHoaChuoi(book1.authorName));
            let isLT = matchingBook2 ? true : false;
            return { ...book1, ...matchingBook2, isLT };
        });
    }

    let newArrayLocal = mergeArraysAndAddIsLocal(props.dataAuthor, props.dataAuthorLT);
    let newArrayConnected = mergeArraysAndAddIsConnected(props.dataAuthorLT, props.dataAuthor);

    return (
        <>
            <Grid md={12} container justifyContent='space-between' gap={{ lg: 0, xs: 3 }}>
                <Grid lg={5} xs={12}>
                    <MainCard title='TÁC GIẢ THƯ VIỆN' >
                        <Local data={newArrayLocal} />
                    </MainCard>
                </Grid>
                <Grid lg={6.8} xs={12}>
                    <MainCard title=' TÁC GIẢ LIÊN THÔNG' >
                        <Connected data={newArrayConnected} dataSync={props.dataSync} dataAuthor={props.dataAuthor}/>
                    </MainCard>
                </Grid>
            </Grid>
        </>
    )
}