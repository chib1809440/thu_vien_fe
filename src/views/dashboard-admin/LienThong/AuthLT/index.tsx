import { Grid } from "@mui/material";
import React from "react";
import { dispatch, useSelector } from "../../../../store";
import { getApiLTWaiting } from "../../../../store/slices/apiLT";
import { getAuthorWaiting } from "../../../../store/slices/author";
import { getCategoryWaiting } from "../../../../store/slices/category";
import { isLoginWaiting } from "../../../../store/slices/isLoginLT";
import { getProducerWaiting } from "../../../../store/slices/producer";
import { getSuppliesLTWaiting, getSuppliesWaiting } from "../../../../store/slices/supplies";
import { getTypeSuplyWaiting } from "../../../../store/slices/typeSuplly";
import { getUserLTWaiting } from "../../../../store/slices/userLT";
import Dashboard from "../Dashboard";
import LoginLienThong from "./components/login";

export default function DashboardLienThong() {
    const { isLogin } = useSelector((state) => state.isLogin);
    const { getApiLT } = useSelector((state) => state.getApiLT);
    const { getSupplies, getSuppliesLT } = useSelector((state) => state.getSupplies);
    const { getProducer } = useSelector((state) => state.getProducer);
    const { getCategory } = useSelector((state) => state.getCategory);
    const { getAuthor } = useSelector((state) => state.getAuthor);
    const { getTypeSuply } = useSelector((state) => state.getTypeSuply);

    React.useEffect(() => {
        dispatch(getApiLTWaiting());
        dispatch(isLoginWaiting());
        dispatch(getUserLTWaiting());
        dispatch(getSuppliesWaiting());
        dispatch(getSuppliesLTWaiting());
        dispatch(getProducerWaiting());
        dispatch(getCategoryWaiting());
        dispatch(getAuthorWaiting());
        dispatch(getTypeSuplyWaiting());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Grid md={12} container justifyContent='center' alignItems='center'>
                {isLogin ?
                    <Grid md={12}>
                       <Dashboard dataAuthor={getAuthor} dataCategoryLT={getCategory} dataProducer={getProducer} dataSchool={getApiLT} dataSupplies={getSupplies} dataSuppliesLT={getSuppliesLT} dataTypeSuplyLT={getTypeSuply} />
                    </Grid>
                    :
                    <LoginLienThong apiConnection={getApiLT} />
                }
            </Grid>
        </>
    );
}
