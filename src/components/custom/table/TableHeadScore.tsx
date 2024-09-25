import { Box, Checkbox, IconButton, TableHead, TableRow, useTheme } from "@mui/material";
import { DataType, HeadCell, Order } from "./type";
import { StyledTableCell } from "./style";
import EditIcon from '@mui/icons-material/Edit';

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof DataType) => void;
    numSelected: number;
    order: Order;
    orderBy: string | number;
    headCells: readonly HeadCell[];
    isShowAddIcon?: boolean;
    selectedHeadName?: string;
    showInput?: boolean;
    isCheckBox?: boolean;
    setSelectedHeadName?: (headName: string) => void;
    checkedAll?: boolean,
    onSelectAllClick?: () => void
}

export function EnhancedTableHeadScore(props: EnhancedTableProps) {
    const theme = useTheme();
    const { order, orderBy, headCells, onRequestSort } = props;

    const createSortHandler = (property: keyof DataType) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>{
                props.isCheckBox === true && <StyledTableCell padding="checkbox" align="center">
                    <Checkbox
                        color="primary"
                        //  indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={props?.checkedAll}
                        onChange={props?.onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                        style={{
                            color: theme.palette.grey[400],
                        }}
                    />
                </StyledTableCell>
            }

                <StyledTableCell sx={{ px: "12px", py: "16px" }} align="left" padding="none">
                    STT
                </StyledTableCell>
                {headCells.map((headCell) => (
                    <StyledTableCell
                        key={headCell.id}
                        align={(headCell.numeric ? 'center' : 'left')}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <Box alignItems="center">
                            <Box
                                component="span"
                                sx={{ textAlign: headCell.numeric ? 'center' : 'left' }}
                                dangerouslySetInnerHTML={{ __html: headCell.label }} // Hiển thị HTML trong label
                            />
                            {headCell.isShowAddIcon && props.showInput && (
                                <IconButton
                                    aria-label="edit"
                                    title="Sửa cột điểm"
                                    sx={{
                                        color: headCell.id === props.selectedHeadName ? theme.palette.success.dark : theme.palette.primary.light,
                                        fontSize: "25px",
                                        ml: 1 // Khoảng cách giữa label và icon
                                    }}
                                    onClick={() => props.setSelectedHeadName?.(headCell.id.toString())}
                                >
                                    <EditIcon />
                                </IconButton>
                            )}
                        </Box>
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
