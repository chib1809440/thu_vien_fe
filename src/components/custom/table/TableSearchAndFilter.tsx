import { Box, Grid, Menu, MenuItem } from "@mui/material";
import { IconBookUpload, IconDownload, IconFileImport, IconPrinter, IconRestore, IconSettings, IconTransformFilled, IconTrashXFilled } from "@tabler/icons-react";
import { useState } from "react";
import StyledButton from "../../default/button/StyledButton";
import SearchNoButtonSection from "../search/SearchNoButton";
interface PropSearch {
    contentSearch: string,
    placeholderText?: string,
    actionDownLoadFile?: boolean,
    pathFileActionDownLoadFile?: string,
    actionImportFile?: boolean,
    actionExportFile?: boolean,
    actionImportQuestionFile?: boolean,
    actionPrintFile?: boolean,
    actionDeleteSelectedItem?: boolean,
    actionChangeClass?: boolean,
    actionPromotedClass?: boolean,
    actionRestoreSelectedItem?: boolean,
    actionLibCardSelectedItem?: boolean,
    handleContentSearch: (e: any) => void
    onHandleDownloadFile?: () => void
    onHandleImportFile?: () => void
    onHandleImportQuestionFile?: () => void
    onHandleExportFile?: () => void
    onHandlePrintFile?: () => void
    onHandleDeleteSelectedItem?: () => void
    onHandleChangeClass?: () => void
    onHandlePromotedClass?: () => void,
    onHandleRestoreSelectedItem?: () => void,
    onHandleLibCardSeletedItem?: () => void,

}
export function SearchAndFilter({ contentSearch, actionPromotedClass, actionRestoreSelectedItem, onHandleRestoreSelectedItem, onHandleImportQuestionFile, actionImportQuestionFile, onHandlePromotedClass, actionChangeClass, onHandleChangeClass, onHandleDeleteSelectedItem, actionDeleteSelectedItem, handleContentSearch, onHandleImportFile, onHandleDownloadFile, onHandlePrintFile, placeholderText, actionDownLoadFile, actionImportFile, pathFileActionDownLoadFile, actionPrintFile, actionExportFile, onHandleExportFile, actionLibCardSelectedItem, onHandleLibCardSeletedItem }: PropSearch) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDownloadFile = () => {
        onHandleDownloadFile();
        setAnchorEl(null);
    };
    const handleImportFile = () => {
        onHandleImportFile();
        setAnchorEl(null);
    };
    const handleImportQuestionFile = () => {
        onHandleImportQuestionFile();
        setAnchorEl(null);
    };
    const handleExportFile = () => {
        onHandleExportFile();
        setAnchorEl(null);
    };
    const handlePrintFile = () => {
        onHandlePrintFile();
        setAnchorEl(null);
    };
    const handleDeleteSeletedItem = () => {
        onHandleDeleteSelectedItem();
        setAnchorEl(null);
    };
    const handleRestoreSeletedItem = () => {
        onHandleRestoreSelectedItem();
        setAnchorEl(null);
    };
    const handleLibCardSeletedItem = () => {
        onHandleLibCardSeletedItem();
        setAnchorEl(null);
    };
    const handleChangeClass = () => {
        onHandleChangeClass();
        setAnchorEl(null);
    };
    const handlePromotedClass = () => {
        onHandlePromotedClass();
        setAnchorEl(null);
    };
    return (
        <Grid container pl={4} pr={4} pt={2} >
            <Grid item xs={12} sm={12} md={3} lg={4} marginBottom={2}>
                <SearchNoButtonSection fullwidth contentSearch={contentSearch} handleContentSearch={handleContentSearch} />
            </Grid>
            <Grid item xs={12} sm={6} md={9} lg={8} marginBottom={2}>
                <Box sx={{
                    display: "flex",
                    justifyContent: { xs: "space-between", sm: "flex-end" },
                    alignItems: "center",
                    gap: 1
                }}>
                    {/* <Tooltip title={t("Lọc")}>
                        <StyledButton
                            size="small"
                            variant="outlined"
                            color="default"
                            startIcon={<IconFilter size={20} stroke={1.5} />}
                        >
                            {t("Lọc")}
                        </StyledButton>
                    </Tooltip> */}
                    <StyledButton
                        size="small"
                        variant="outlined"
                        color="default"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
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
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {
                            actionDownLoadFile && <MenuItem onClick={handleDownloadFile} sx={{ fontSize: '0.875rem' }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <IconDownload size={20} stroke={1.5} />
                                    <Box sx={{ ml: 1 }} >Tải file mẫu</Box>
                                </Box>
                            </MenuItem>
                        }
                        {
                            actionImportFile && <MenuItem onClick={handleImportFile} sx={{ fontSize: '0.875rem' }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <IconFileImport size={20} stroke={1.5} />
                                    <Box sx={{ ml: 1 }}>Nhập file</Box>
                                </Box>
                            </MenuItem>
                        }
                        {
                            actionImportQuestionFile && <MenuItem onClick={handleImportQuestionFile} sx={{ fontSize: '0.875rem' }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <IconFileImport size={20} stroke={1.5} />
                                    <Box sx={{ ml: 1 }}>Nhập file excel câu hỏi </Box>
                                </Box>
                            </MenuItem>
                        }
                        {
                            actionExportFile && <MenuItem onClick={handleExportFile} sx={{ fontSize: '0.875rem' }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <IconFileImport size={20} stroke={1.5} />
                                    <Box sx={{ ml: 1 }}>Xuất Excel</Box>
                                </Box>
                            </MenuItem>
                        }
                        {
                            actionPrintFile && <MenuItem onClick={handlePrintFile} sx={{ fontSize: '0.875rem', }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <IconPrinter size={20} stroke={1.5} />
                                    <Box sx={{ ml: 1 }}>In</Box>
                                </Box>
                            </MenuItem>
                        }
                        {
                            actionChangeClass && <MenuItem onClick={handleChangeClass} sx={{ fontSize: '0.875rem', }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <IconTransformFilled size={20} stroke={1.5} />
                                    <Box sx={{ ml: 1 }}>Chuyển lớp</Box>
                                </Box>
                            </MenuItem>
                        }
                        {
                            actionPromotedClass && <MenuItem onClick={handlePromotedClass} sx={{ fontSize: '0.875rem', }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <IconBookUpload size={20} stroke={1.5} />
                                    <Box sx={{ ml: 1 }}>Lên lớp</Box>
                                </Box>
                            </MenuItem>
                        }
                        {
                            actionDeleteSelectedItem && <MenuItem onClick={handleDeleteSeletedItem} sx={{ fontSize: '0.875rem' }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <IconTrashXFilled size={20} stroke={1.5} />
                                    <Box sx={{ ml: 1 }}>Xóa các dữ liệu đã chọn</Box>
                                </Box>
                            </MenuItem>
                        }
                        {
                            actionRestoreSelectedItem && <MenuItem onClick={handleRestoreSeletedItem} sx={{ fontSize: '0.875rem' }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <IconRestore size={20} stroke={1.5} />
                                    <Box sx={{ ml: 1 }}>Khối phục dữ liệu đã chọn</Box>
                                </Box>
                            </MenuItem>
                        }
                        {
                            actionLibCardSelectedItem && <MenuItem onClick={handleLibCardSeletedItem} sx={{ fontSize: '0.875rem' }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <IconPrinter size={20} stroke={1.5} />
                                    <Box sx={{ ml: 1 }}>In thẻ thư viện</Box>
                                </Box>
                            </MenuItem>
                        }
                    </Menu>
                </Box>
            </Grid>
        </Grid>
    )
}