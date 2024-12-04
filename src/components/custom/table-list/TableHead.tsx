import { Checkbox, TableHead, TableRow, useTheme } from "@mui/material";
import { TColumn } from "../../../types/common/table";
import { StyledTableCell } from "./style";


interface Props<T> {
    columns: TColumn<T>[];
    checkedAll?: boolean;
    onSelectAllClick?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function TableColumn<T>({ columns, checkedAll, onSelectAllClick }: Props<T>) {
    const theme = useTheme();

    return (
        <TableHead>
            <TableRow>
                <StyledTableCell padding="checkbox" align="center"  >
                    <Checkbox
                        color="primary"
                        checked={checkedAll}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                        style={{
                            color: 'white',
                        }}
                    />
                </StyledTableCell>

                {columns.map((column, idx) => (
                    <StyledTableCell
                        sx={idx === 0 ? { px: "12px", py: "16px" } : {}}
                        key={column.id}
                        align={column.align || 'left'}
                        padding={column.disablePadding}

                    >
                        {column.label}
                    </StyledTableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}