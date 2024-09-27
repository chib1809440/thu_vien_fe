import { Box, Checkbox, TableHead, TableRow, TableSortLabel, useTheme } from "@mui/material";
import { DataType, HeadCell, Order } from "./type";
import { visuallyHidden } from '@mui/utils';
import { StyledTableCell } from "./style";

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort?: (event: React.MouseEvent<unknown>, property: keyof DataType) => void;
    order: Order;
    orderBy?: string | number;
    headCells: HeadCell[]
    checkedAll?: boolean,
    onSelectAllClick?: () => void
}

export function EnhancedTableHead(props: EnhancedTableProps) {
    const theme = useTheme()
    const { order, orderBy, numSelected, headCells, onRequestSort } = props;

    const createSortHandler = (property: keyof DataType) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead  >
            <TableRow >
                <StyledTableCell padding="checkbox" align="center"  >
                    <Checkbox
                        color="primary"
                        //  indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={props?.checkedAll}
                        onChange={props?.onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                        style={{
                            color: 'white',
                        }}
                    />
                </StyledTableCell>
                <StyledTableCell sx={{ px: "12px", py: "16px" }} align="left" padding="none">
                    STT
                </StyledTableCell>
                {headCells.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={headCell.id === "action" ? "center" : (headCell.numeric ? 'center' : 'left')}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}

                    >
                        {headCell.label}

                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}