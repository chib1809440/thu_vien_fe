import React from "react";
import { dispatch, useSelector } from "../../../store";
import { getContactSchoolWaiting } from "../../../store/slices/contactSchool";
import StickyHeadTable from "./table";
import { CircularProgress } from "@mui/material";


export default function ContactPage() {

    const { getContactSchool } = useSelector((state) => state.getContactSchool);

    React.useEffect(() => {
        dispatch(getContactSchoolWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <StickyHeadTable dataContact={getContactSchool} />
        </>
    );
}
