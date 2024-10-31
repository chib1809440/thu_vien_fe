import { Grid, Typography } from "@mui/material";

const ForbiddenPage = () => {
    return (
        <>
           <Grid xs={12} mt={5} container justifyContent='center' alignItems='center'>
                <Typography fontWeight={900} fontSize={28}>Không có quyền truy cập!</Typography>
            </Grid>
        </>
    );
};
export default ForbiddenPage;