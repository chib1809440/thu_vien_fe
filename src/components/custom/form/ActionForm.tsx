import { Box, Grid, Menu, MenuItem, Select } from "@mui/material";
import { IconSettings } from "@tabler/icons";
import { FC, MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";
import SearchNoButtonSection from "../search/SearchNoButton";
import StyledButton from "../../default/button/StyledButton";
import { TMenuOption } from "../../../types/common/table";
import CustomInput from "../../default/input/CustomInput";
import { TLibrary } from "../../../types/models/library.type";

type Props = {
    actions?: TMenuOption[];
    barcodeSearch?: string;
    handleBarcodeSearch?: (e: any) => void;
    selectedValuePublication?: string;
    handleValuePublication?: (e: any) => void;
    barcode?: boolean;
    placeholder?: string;
    selectedLibrary?: number;
    handleLibraryFilterChange?: (event: any) => void;
    libraryData?: TLibrary[];
};

const ActionsForm: FC<Props> = ({ actions = [], barcodeSearch, handleBarcodeSearch, barcode = false, placeholder = 'Tìm kiếm theo mã ấn phẩm', selectedValuePublication, handleValuePublication, selectedLibrary,
    handleLibraryFilterChange,
    libraryData }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const querySearch = searchParams.get("q") || "";

    const [contentSearch, setContentSearch] = useState(querySearch);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = useMemo(() => Boolean(anchorEl), [anchorEl]);
    const debounceSearch = useDebounce(contentSearch, 500);

    useEffect(() => {
        if (!debounceSearch) {
            searchParams.delete("q");
            setSearchParams(searchParams);
            return;
        }

        if (searchParams.get("page")) {
            searchParams.set("page", "1");
        }

        searchParams.set("q", debounceSearch);
        setSearchParams(searchParams);
    }, [debounceSearch, searchParams]);

    const handleClickAction = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleContentSearch = useCallback((value: string) => {
        setContentSearch(value);
    }, []);

    return (
        <Grid container pl={4} pr={4} pt={2}>
            <Grid item xs={12} sm={12} md={barcode || libraryData ? 8 : 3} lg={barcode || libraryData ? 8 : 4} marginBottom={4} sx={{ display: "flex" }} gap={2} >
                <SearchNoButtonSection
                    fullwidth
                    contentSearch={contentSearch}
                    handleContentSearch={handleContentSearch}
                />
                {
                    barcode ?
                        (<SearchNoButtonSection
                            fullwidth
                            contentSearch={barcodeSearch}
                            handleContentSearch={handleBarcodeSearch}
                            placeholder={placeholder}
                        />)
                        : ""
                }
                {
                    selectedValuePublication ? (<Select
                        labelId="publications-select"
                        label="Ấn phẩm"
                        value={selectedValuePublication}
                        onChange={handleValuePublication}
                        input={<CustomInput size="small" label="Ấn phẩm" />}
                    >
                        <MenuItem value="thuvien">Ấn phẩm của thư viện</MenuItem>
                        <MenuItem value="canhan">Ấn phẩm cá nhân</MenuItem>
                    </Select>) : ""
                }
                {
                    libraryData ? (
                        <Select
                            labelId="library-select"
                            label="Thư Viện"
                            value={selectedLibrary}
                            onChange={handleLibraryFilterChange}
                            input={<CustomInput size="small" label="Thư Viện" />}
                        >
                            <MenuItem value={0}>Tất cả thư viện</MenuItem>
                            {libraryData?.map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </Select>
                    ) : ""
                }
            </Grid>

            {actions.length > 0 && (
                <Grid item xs={12} sm={6} md={barcode || libraryData ? 4 : 9} lg={barcode || libraryData ? 4 : 8} marginBottom={4}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: { xs: "space-between", sm: "flex-end" },
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <StyledButton
                            size="small"
                            variant="outlined"
                            color="default"
                            aria-controls={open ? "basic-menu" : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            onClick={handleClickAction}
                            startIcon={<IconSettings size={20} stroke={1.5} />}
                        >
                            Thao tác
                        </StyledButton>

                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                "aria-labelledby": "basic-button",
                            }}
                        >
                            {actions.map((action, idx) => (
                                <MenuItem
                                    key={idx}
                                    sx={{ fontSize: "0.875rem" }}
                                    onClick={action.onClick}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        {action.icon}
                                        <Box sx={{ ml: 1 }}>{action.label}</Box>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Grid>
            )}
        </Grid>
    );
};

export default ActionsForm;