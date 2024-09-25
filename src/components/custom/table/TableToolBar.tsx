import { Box, IconButton, Tooltip, Typography, alpha } from "@mui/material";
import { EnhancedTableToolbarProps } from "./type";
import { IconTrash } from "@tabler/icons-react";

export function EnhancedTableToolbar({ numSelected,title }: EnhancedTableToolbarProps) {

    return (
        <Box
            sx={{
                px: 2,
                pb: numSelected > 0 ? "12px" : "0px",
                pt: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    // color="inherit"
                    variant="subtitle2"
                // component="div"
                >
                    {numSelected} được chọn
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="subtitle1"
                // id="tableTitle"
                // component="div"
                >
                    {title}
                </Typography>
            )}
            {numSelected > 0 && (
                <Tooltip title="Delete">
                    <IconButton >
                        <IconTrash size={20} stroke={2} />
                    </IconButton>
                </Tooltip>
            )}
        </Box>
    );
}