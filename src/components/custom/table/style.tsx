import { Box, Paper, TableCell, TableRow, styled, tableCellClasses } from "@mui/material";

export const ContainerTable = styled(Paper)(({ theme }) => ({
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    border: "1px",
    borderStyle: "solid",
    borderColor: theme.palette.grey[300],
    padding: 2
}))

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
        fontWeight: 600,
        p: 0

    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        fontWeight: 300,

    },

}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    // '&:nth-of-type(odd)': {
    //     backgroundColor: theme.palette.grey[200],
    // },
    // hide last border

    '&:last-child td,&:last-child th': {
        border: 0,
    },
   
}));