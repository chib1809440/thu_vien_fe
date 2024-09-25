import MainCard, { MainCardProps } from "../../../components/default/card/MainCard";
import { Box, Grid } from "@mui/material";
import  ImageCard  from "./ImageCard";

const AuthCardWrapper = ({ children, ...other }: MainCardProps) => (
    <MainCard
        sx={{
            p: 2
        }}
        content={false}
        {...other}
    >
        <Grid container>
            <Grid item sm={6}>
                <ImageCard photo={"./images/illustration/grade.jpg"} aspectRatio={"3/4"} objectFit="fill" id={0} />
            </Grid>
            <Grid item sm={6}>
                {children}
            </Grid>
        </Grid>



    </MainCard>
);
export default AuthCardWrapper