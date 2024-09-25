import { Paper, Typography } from "@mui/material";

function NodataCard() {
    return (
        <Paper sx={{ p: 4, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <img
                src={"images/nodata/document-blank.png"}
                alt=""
                height={"160px"}
            />
            <Typography variant="h6" textAlign={"center"} >Không có dữ liệu</Typography>
        </Paper>

    );
}

export default NodataCard;