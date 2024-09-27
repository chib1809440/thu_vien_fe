import {
    Alert,
    Box,
    Checkbox,
    Table,
    TableBody,
    TableContainer,
    Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { TMeta } from "../../../types/api/api.type";
import { TColumn } from "../../../types/common/table";
import GradientCircularProgressLoading from "../../default/loading/GradientCircularProgressLoading/GradientCircularProgressLoading";
import { TableColumn } from "./TableHead";
import { StyledTableCell, StyledTableRow } from "./style";
import PaginationForm from "../form/PaginationForm";

type Props<T> = {
    columns: TColumn<T>[];
    rows: T[];
    pagination?: TMeta;
    isLoading?: boolean;
    checked?: any[];
    onChecked?: (row: T) => void;
    keyChecked?: Extract<keyof T, string>;
};

function TableList<T>({
    checked = [],
    keyChecked,
    rows = [],
    columns = [],
    isLoading = false,
    pagination,
    onChecked,
}: Props<T>) {
    const theme = useTheme();

    return (
        <Box p={4} pt={0}>
            {checked && checked.length > 0 && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    Có{" "}
                    <Typography component="span" sx={{ fontWeight: "bold" }}>
                        {checked.length}
                    </Typography>{" "}
                    dữ liệu đã chọn
                </Alert>
            )}

            <TableContainer>
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={"medium"}>
                    <TableColumn columns={columns} />

                    <TableBody>
                        {!isLoading ? (
                            rows.length > 0 ? (
                                rows.map((row, idxRow) => {
                                    const labelId = `enhanced-table-checkbox-${idxRow}`;

                                    return (
                                        <StyledTableRow
                                            key={idxRow}
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            sx={{ cursor: "pointer" }}
                                        >
                                            <StyledTableCell padding="checkbox" sx={{ p: "8px" }}>
                                                <Checkbox
                                                    checked={
                                                        keyChecked
                                                            ? checked.includes(row?.[keyChecked])
                                                            : false
                                                    }
                                                    onChange={() => onChecked(row)}
                                                    inputProps={{
                                                        "aria-labelledby": labelId,
                                                    }}
                                                    style={{
                                                        color: theme.palette.primary.dark,
                                                    }}
                                                />
                                            </StyledTableCell>

                                            {columns.map((column, idxColumn, old) => {
                                                const cellProps: any =
                                                    idxColumn === 0
                                                        ? {
                                                              component: "th",
                                                              scope: "row",
                                                              padding: "none",
                                                          }
                                                        : {};

                                                if (!Object.keys(row).includes(column.id)) {
                                                    return (
                                                        <StyledTableCell
                                                            key={idxColumn}
                                                            align={column.align}
                                                            sx={{
                                                                ...column.sxRow,
                                                                ...(idxColumn === 0
                                                                    ? { paddingLeft: 2 }
                                                                    : old.length === idxColumn - 1
                                                                    ? { paddingLeft: 0 }
                                                                    : {}),
                                                            }}
                                                            {...cellProps}
                                                        >
                                                            {column.render
                                                                ? column.render(row)
                                                                : "-"}
                                                        </StyledTableCell>
                                                    );
                                                }

                                                const value = row[column.id as keyof T];

                                                return (
                                                    <StyledTableCell
                                                        key={idxColumn}
                                                        align={column.align}
                                                        sx={{
                                                            ...column.sxRow,
                                                            ...(idxColumn === 0
                                                                ? { paddingLeft: 2 }
                                                                : { paddingLeft: 0 }),
                                                        }}
                                                        {...cellProps}
                                                    >
                                                        {column.render ? column.render(row) : value}
                                                    </StyledTableCell>
                                                );
                                            })}
                                        </StyledTableRow>
                                    );
                                })
                            ) : (
                                <StyledTableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    sx={{ cursor: "pointer" }}
                                >
                                    <StyledTableCell
                                        colSpan={columns.length + 1}
                                        padding="none"
                                        align="center"
                                        sx={{ p: "12px" }}
                                    >
                                        Không có dữ liệu
                                    </StyledTableCell>
                                </StyledTableRow>
                            )
                        ) : (
                            <StyledTableRow
                                hover
                                role="checkbox"
                                tabIndex={-1}
                                sx={{ cursor: "pointer" }}
                            >
                                <StyledTableCell
                                    colSpan={columns.length + 1}
                                    padding="checkbox"
                                    sx={{ p: "12px" }}
                                    align="center"
                                >
                                    <GradientCircularProgressLoading />
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {pagination && Object.keys(pagination).length > 0 && (
                <PaginationForm pagination={pagination} />
            )}
        </Box>
    );
}

export default TableList;