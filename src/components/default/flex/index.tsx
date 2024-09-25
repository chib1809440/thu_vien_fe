import { Box, styled } from "@mui/material";

export const CsFlexRowBetween = styled(Box)(({ theme }) => ({
    width: '100%',
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap:2,
    flexDirection:"row",
    
}))