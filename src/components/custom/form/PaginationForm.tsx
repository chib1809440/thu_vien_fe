import {
    Box,
    FormControl,
    MenuItem,
    Pagination,
    PaginationItem,
    Select,
    SelectChangeEvent,
    Typography,
} from "@mui/material";
import {
    IconChevronLeft,
    IconChevronRight,
    IconChevronsLeft,
    IconChevronsRight,
} from "@tabler/icons";
import { FC, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { TMeta } from "../../../types/api/api.type";
import useQueryString from "../../../hooks/services/useQueryString";
import CustomInput from "../../default/input/CustomInput";

type Props = {
    pagination: TMeta;
};

const PaginationForm: FC<Props> = ({ pagination }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryString = useQueryString();

    const handleChangeRowsPerPage = useCallback(
        (event: SelectChangeEvent) => {
            if (searchParams.get("page")) {
                searchParams.set("page", "1");
            }
            
            searchParams.set("limit", event.target.value);
            setSearchParams(searchParams);
        },
        [searchParams]
    );

    const handleChangePage = useCallback(
        (_: any, page: number) => {
            searchParams.set("page", page.toString());
            setSearchParams(searchParams);
        },
        [searchParams]
    );

    const limitOption = useMemo(() => {
        // @ts-ignore
        return [...new Set([1, 5, 10, 20, +queryString?.limit || 5])].sort((a, b) => a - b);
    }, [queryString?.limit]);

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                flexDirection: "row",
                flexWrap: "wrap"
            }}
        >
            <Box
                sx={{
                    pt: { xs: 3, sm: 3, md: 2 },
                    pb: { xs: 1, sm: 1, md: 2 },
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <FormControl sx={{ minWidth: 64 }}>
                    <Select
                        value={queryString?.limit ?? 5}
                        size="small"
                        onChange={handleChangeRowsPerPage}
                        input={<CustomInput size="small" />}
                    >
                        {limitOption.map((item) => (
                            <MenuItem key={item} value={item}>
                                {item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Typography variant="body2">Dòng trên trang</Typography>
            </Box>
            <Pagination
                count={pagination.pageCount}
                page={pagination.page}
                onChange={handleChangePage}
                variant="outlined"
                renderItem={(item) => (
                    <PaginationItem
                        sx={{
                            "&.Mui-selected": {
                                backgroundColor: "primary.dark", // Màu nền khi được chọn
                                color: "white", // Màu chữ khi được chọn
                                "&:hover": {
                                    backgroundColor: "primary.dark", // Màu nền khi hover trên nút đã chọn
                                },
                            },
                        }}
                        components={{
                            last: (props) => <IconChevronsRight {...props} stroke={1.5} />,
                            next: (props) => <IconChevronRight {...props} stroke={1.5} />,
                            first: (props) => <IconChevronsLeft {...props} stroke={1.5} />,
                            previous: (props) => <IconChevronLeft {...props} stroke={1.5} />,
                        }}
                        {...item}
                    />
                )}
                showFirstButton
                showLastButton
            />
        </Box>
    );
};

export default PaginationForm;