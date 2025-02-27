import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, Grid, Menu, MenuItem, Select, Typography } from "@mui/material";
import { IconSettings } from "@tabler/icons";
import { FC, MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";
import useDebounce from "../../../hooks/useDebounce";
import { TMenuOption } from "../../../types/common/table";
import { TLibrary } from "../../../types/models/library.type";
import StyledButton from "../../default/button/StyledButton";
import CustomInput from "../../default/input/CustomInput";
import SearchNoButtonSection from "../search/SearchNoButton";

type Props = {
    actions?: TMenuOption[];
    barcodeSearch?: string;
    handleBarcodeSearch?: (e: any) => void;
    selectedValuePublication?: string;
    handleValuePublication?: (e: any) => void;
    barcode?: boolean;
    placeholder?: string;
    placeholderSearch?: string;
    selectedLibrary?: number;
    handleLibraryFilterChange?: (event: any) => void;
    libraryData?: TLibrary[];
    isActive?: boolean;
};

const ActionsForm: FC<Props> = ({
    actions = [],
    barcodeSearch,
    handleBarcodeSearch,
    barcode = false,
    placeholder = "Tìm kiếm theo barcode",
    selectedValuePublication,
    handleValuePublication,
    selectedLibrary,
    placeholderSearch = "Tìm kiếm theo tên",
    handleLibraryFilterChange,
    libraryData,
    isActive = true
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const querySearch = searchParams.get("q") || "";

    const [contentSearch, setContentSearch] = useState(querySearch);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = useMemo(() => Boolean(anchorEl), [anchorEl]);
    const debounceSearch = useDebounce(contentSearch, 500);
    const [searchMenuAnchorEl, setSearchMenuAnchorEl] = useState<null | HTMLElement>(null); // Anchor for search menu
    const [actionsMenuAnchorEl, setActionsMenuAnchorEl] = useState<null | HTMLElement>(null); // Anchor for actions menu
    const searchMenuOpen = useMemo(() => Boolean(searchMenuAnchorEl), [searchMenuAnchorEl]);
    const actionsMenuOpen = useMemo(() => Boolean(actionsMenuAnchorEl), [actionsMenuAnchorEl]);

    useEffect(() => {
        if (!debounceSearch) {
            searchParams.delete("q");
            setSearchParams(searchParams);
            return;
        }

        // if (searchParams.get("page")) {
        //     searchParams.set("page", "1");
        // }

        searchParams.set("q", debounceSearch);
        setSearchParams(searchParams);
    }, [debounceSearch, searchParams]);

    const handleClickAction = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleSearchMenuOpen = useCallback((event: MouseEvent<HTMLElement>) => {
        setSearchMenuAnchorEl(event.currentTarget);
        setActionsMenuAnchorEl(null); // Close actions menu if it's open
    }, []);

    const handleActionsMenuOpen = useCallback((event: MouseEvent<HTMLElement>) => {
        setActionsMenuAnchorEl(event.currentTarget);
        setSearchMenuAnchorEl(null); // Close search menu if it's open
    }, []);

    const handleMenuClose = useCallback(() => {
        setSearchMenuAnchorEl(null);
        setActionsMenuAnchorEl(null);
    }, []);

    const handleContentSearch = useCallback((value: string) => {
        if (searchParams.get("page")) {
            searchParams.set("page", "1");
        }

        searchParams.set("q", debounceSearch);
        setSearchParams(searchParams);
        setContentSearch(value);
    }, []);

    return (
        <>
            <Grid
                container
                spacing={2}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pl: { xs: 0, sm: 0, md: 4 },
                    pr: { xs: 0, sm: 0, md: 4 },
                    pt: { xs: 2, sm: 2, md: 2 },
                    pb: { xs: 0, sm: 0, md: 2 },
                }}
            >
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={barcode || libraryData ? 9 : 3}
                    lg={barcode || libraryData ? 9 : 4}
                    sx={{
                        flexWrap: { xs: "wrap", sm: "wrap", md: "nowrap" },
                        gap: 2,
                        display: { xs: "none", sm: "none", md: "flex" },
                        mb: 1
                    }}
                >
                    {
                        isActive && <SearchNoButtonSection
                            fullwidth
                            contentSearch={contentSearch}
                            handleContentSearch={handleContentSearch}
                            placeholder={placeholderSearch}
                        />
                    }

                    {barcode && (
                        <SearchNoButtonSection
                            fullwidth
                            contentSearch={barcodeSearch}
                            handleContentSearch={handleBarcodeSearch}
                            placeholder={placeholder}
                        />
                    )}

                    {selectedValuePublication && (
                        <Select
                            labelId="publications-select"
                            label="Ấn phẩm"
                            value={selectedValuePublication}
                            onChange={handleValuePublication}
                            input={<CustomInput size="small" label="Ấn phẩm" />}
                        >
                            <MenuItem value="thuvien">Ấn phẩm của thư viện</MenuItem>
                            <MenuItem value="canhan">Ấn phẩm cá nhân</MenuItem>
                        </Select>
                    )}

                    {libraryData && (
                        <Select
                            labelId="library-select"
                            label="Thư Viện"
                            value={selectedLibrary}
                            onChange={handleLibraryFilterChange}
                            input={<CustomInput size="small" label="Thư Viện" />}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        maxHeight: 200,
                                        overflowY: 'auto',
                                        '&::-webkit-scrollbar': {
                                            width: '3px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: '#888',
                                            borderRadius: '10px',
                                        },
                                        '&::-webkit-scrollbar-thumb:hover': {
                                            backgroundColor: '#555',
                                        },
                                        '&::-webkit-scrollbar-track': {
                                            backgroundColor: '#f1f1f1',
                                        },
                                    },
                                },
                            }}
                        >
                            <MenuItem value={0}>Tất cả thư viện</MenuItem>
                            {libraryData?.map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    {capitalizeFirstLetter(item.name)}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                </Grid>

                {actions?.length > 0 && (
                    <Grid
                        item
                        xs={12}
                        sm={6}
                        md={barcode || libraryData ? 3 : 9}
                        lg={barcode || libraryData ? 3 : 8}
                        sx={{
                            display: { xs: "none", sm: "none", md: "flex" },
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
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
                                {actions.map((action, idx) =>
                                    action.component ? (
                                        <Box key={idx} sx={{ ml: 2 }}>
                                            {action.component}
                                        </Box>
                                    ) : (
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
                                    )
                                )}
                            </Menu>
                        </Box>
                    </Grid>
                )}
            </Grid>

            {/* Menu Button for mobile */}
            <Grid
                item
                xs={12}
                sm={12}
                md={barcode || libraryData ? 4 : 9}
                lg={barcode || libraryData ? 4 : 8}
                sx={{
                    marginBottom: { xs: 0, sm: 0, md: 4 },
                    display: { xs: "block", md: "none" },
                }}
            >
                <Button
                    onClick={handleSearchMenuOpen}
                    size="large"
                    sx={{ display: { xs: "flex", md: "none" }, pl: 0, pr: 0, py: 0, mb: 1, textTransform: "inherit" }}
                >
                    <MenuIcon />
                    <Typography ml={1}>Tìm kiếm hoặc thao tác</Typography>
                </Button>

                <Menu
                    anchorEl={searchMenuAnchorEl}
                    open={searchMenuOpen}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: { width: "250px" }, // Set width for the mobile menu
                    }}
                >
                    {isActive && <MenuItem>
                        <SearchNoButtonSection
                            fullwidth
                            contentSearch={contentSearch}
                            handleContentSearch={handleContentSearch}
                            placeholder={placeholderSearch}
                        />
                    </MenuItem>
                    }

                    {barcode && (
                        <MenuItem>
                            <SearchNoButtonSection
                                fullwidth
                                contentSearch={barcodeSearch}
                                handleContentSearch={handleBarcodeSearch}
                                placeholder={placeholder}
                            />
                        </MenuItem>
                    )}

                    {selectedValuePublication && (
                        <MenuItem>
                            <Select
                                labelId="publications-select"
                                label="Ấn phẩm"
                                value={selectedValuePublication}
                                onChange={handleValuePublication}
                                fullWidth
                                size="small"
                            >
                                <MenuItem value="thuvien">Ấn phẩm của thư viện</MenuItem>
                                <MenuItem value="canhan">Ấn phẩm cá nhân</MenuItem>
                            </Select>
                        </MenuItem>
                    )}

                    {libraryData && (
                        <MenuItem>
                            <Select
                                labelId="library-select"
                                label="Thư Viện"
                                value={selectedLibrary}
                                onChange={handleLibraryFilterChange}
                                fullWidth
                                size="small"
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            maxHeight: 200,
                                            overflowY: 'auto',
                                            '&::-webkit-scrollbar': {
                                                width: '3px',
                                            },
                                            '&::-webkit-scrollbar-thumb': {
                                                backgroundColor: '#888',
                                                borderRadius: '10px',
                                            },
                                            '&::-webkit-scrollbar-thumb:hover': {
                                                backgroundColor: '#555',
                                            },
                                            '&::-webkit-scrollbar-track': {
                                                backgroundColor: '#f1f1f1',
                                            },
                                        },
                                    },
                                }}
                            >
                                <MenuItem value={0}>Tất cả thư viện</MenuItem>
                                {libraryData?.map((item, index) => (
                                    <MenuItem key={index} value={item._id}>
                                        {capitalizeFirstLetter(item.name)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </MenuItem>
                    )}
                    {actions.length > 0 && (
                        <MenuItem>
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
                                {actions.map((action, idx) =>
                                    action.component ? (
                                        <Box key={idx} sx={{ ml: 2 }}>
                                            {action.component}
                                        </Box>
                                    ) : (
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
                                    )
                                )}
                            </Menu>
                        </MenuItem>
                    )}
                </Menu>
            </Grid>
        </>
    );
};

export default ActionsForm;