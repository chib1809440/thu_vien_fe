import { Button, Grid, Menu, MenuItem, Select, Typography } from "@mui/material";
import { GridFilterListIcon } from "@mui/x-data-grid";
import { FC, useState } from "react";
import CustomInput from "../../../../components/default/input/CustomInput";
import { capitalizeFirstLetter } from "../../../../helpers/capitalizeFirstLetter";
import { TAsset } from "../../../../interfaces/asset";
import { TApiMultipleRecords } from "../../../../types/api/api.type";
import { TAuthor } from "../../../../types/models/author";
import { TCategory } from "../../../../types/models/category";
import { TMaterial } from "../../../../types/models/material";
import { TPublisher } from "../../../../types/models/publisher";
import { TTopic } from "../../../../types/models/topic";
import { TTypeVoice } from "../../../../types/models/type-voice";

type Props = {
    selectedPublications?: number;
    handlePublicationsFilterChange?: (event: any) => void;
    typeOptions?: { value: string; label: string }[];
    selectedMaterial?: number;
    handleMaterialFilterChange?: (event: any) => void;
    materialData?: TApiMultipleRecords<TMaterial>;
    selectedCategory?: number;
    handleCategoryFilterChange?: (event: any) => void;
    categoryData?: TApiMultipleRecords<TCategory>;
    selectedAuthor?: number;
    handleAuthorFilterChange?: (event: any) => void;
    authorData?: TApiMultipleRecords<TAuthor>;
    selectedPublisher?: number;
    handlePublisherFilterChange?: (event: any) => void;
    publisherData?: TApiMultipleRecords<TPublisher>;
    selectedTypeVoice?: number;
    handleTypeVoiceFilterChange?: (event: any) => void;
    typeVoiceData?: TApiMultipleRecords<TTypeVoice>;
    selectedBelongAsset?: number;
    handleBelongAssetFilterChange?: (event: any) => void;
    assetData?: TAsset[];
    selectedTopic?: number;
    handleTopicFilterChange?: (event: any) => void;
    filteredTopics?: TTopic[];
};

const FilterByItems: FC<Props> = ({
    selectedPublications,
    handlePublicationsFilterChange,
    selectedMaterial,
    handleMaterialFilterChange,
    materialData,
    selectedCategory,
    handleCategoryFilterChange,
    categoryData,
    selectedAuthor,
    handleAuthorFilterChange,
    authorData,
    selectedPublisher,
    handlePublisherFilterChange,
    publisherData,
    selectedTypeVoice,
    handleTypeVoiceFilterChange,
    typeOptions,
    typeVoiceData,
    selectedBelongAsset,
    handleBelongAssetFilterChange,
    assetData,
    selectedTopic,
    handleTopicFilterChange,
    filteredTopics,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    
    // Mở menu lọc
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Đóng menu lọc
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    return (
        <Grid
            container
            xs={12}
            sm={12}
            md={12}
            lg={12}
            gap={2}
            sx={{
                display: "flex",
                mb: 1,
                flexWrap: "wrap",
                pl: { xs: 0, sm: 0, md: 4 },
                pr: { xs: 0, sm: 0, md: 4 },
            }}
        >
            {typeOptions?.length > 0 && (
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={2}
                    lg={2}
                    sx={{
                        marginBottom: { xs: 0, sm: 0, md: 2, lg: 2 },
                        display: { xs: "none", sm: "none", md: "flex" },
                    }}
                >
                    <Select
                        labelId="publications-select"
                        label="Loại ấn phẩm"
                        value={selectedPublications}
                        onChange={handlePublicationsFilterChange}
                        input={<CustomInput size="small" label="Loại ấn phẩm" />}
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
                        <MenuItem value={0}>Tất cả loại ấn phẩm</MenuItem>
                        {typeOptions?.map((item, index) => (
                            <MenuItem key={index} value={item.value}>
                                {capitalizeFirstLetter(item.label)}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            )}
            {materialData?.data?.result?.length > 0 && (
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={2}
                    lg={2}
                    sx={{
                        marginBottom: { xs: 0, sm: 0, md: 2, lg: 2 },
                        display: { xs: "none", sm: "none", md: "flex" },
                    }}
                >
                    <Select
                        labelId="material-select"
                        label="Dạng học liệu"
                        value={selectedMaterial}
                        onChange={handleMaterialFilterChange}
                        input={<CustomInput size="small" label="Dạng học liệu" />}
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
                        <MenuItem value={0}>Tất cả dạng học liệu</MenuItem>
                        {materialData?.data?.result?.map((item, index) => (
                            <MenuItem key={index} value={item._id}>
                                {capitalizeFirstLetter(item.name)}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            )}
            {categoryData?.data?.result?.length > 0 && (
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={2}
                    lg={2}
                    sx={{
                        marginBottom: { xs: 0, sm: 0, md: 2, lg: 2 },
                        display: { xs: "none", sm: "none", md: "flex" },
                    }}
                >
                    <Select
                        labelId="category-select"
                        label="Lĩnh vực"
                        value={selectedCategory}
                        onChange={handleCategoryFilterChange}
                        input={<CustomInput size="small" label="Lĩnh vực" />}
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
                        <MenuItem value={0}>Tất cả lĩnh vực</MenuItem>
                        {categoryData?.data?.result?.map((item, index) => (
                            <MenuItem key={index} value={item._id}>
                                {capitalizeFirstLetter(item.name)}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            )}
            {selectedCategory != 0 && (
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={2}
                    lg={2}
                    sx={{
                        marginBottom: { xs: 0, sm: 0, md: 2, lg: 2 },
                        display: { xs: "none", sm: "none", md: "flex" },
                    }}
                >
                    <Select
                        labelId="topic-select"
                        label="Chủ đề"
                        value={selectedTopic}
                        onChange={handleTopicFilterChange}
                        input={<CustomInput size="small" label="Lĩnh vực" />}
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
                        <MenuItem value={0}>Tất cả chủ đề</MenuItem>
                        {filteredTopics?.length > 0 ? (
                            filteredTopics.map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    {capitalizeFirstLetter(item.name)}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>Chưa có chủ đề</MenuItem>
                        )}
                    </Select>
                </Grid>
            )}
            {authorData?.data?.result?.length > 0 && (
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={2}
                    lg={2}
                    sx={{
                        marginBottom: { xs: 0, sm: 0, md: 2, lg: 2 },
                        display: { xs: "none", sm: "none", md: "flex" },
                    }}
                >
                    <Select
                        labelId="author-select"
                        label="Tác giả"
                        value={selectedAuthor}
                        onChange={handleAuthorFilterChange}
                        input={<CustomInput size="small" label="Tác giả" />}
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
                        <MenuItem value={0}>Tất cả tác giả</MenuItem>
                        {authorData?.data?.result?.map((item, index) => (
                            <MenuItem key={index} value={item._id}>
                                <Typography textTransform={"capitalize"}>{item.name}</Typography>
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            )}
            {publisherData?.data?.result?.length > 0 && (
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={2.5}
                    lg={2.5}
                    sx={{
                        marginBottom: { xs: 0, sm: 0, md: 2, lg: 2 },
                        display: { xs: "none", sm: "none", md: "flex" },
                    }}
                >
                    <Select
                        labelId="publisher-select"
                        label="Nhà xuất bản"
                        value={selectedPublisher}
                        onChange={handlePublisherFilterChange}
                        input={<CustomInput size="small" label="Nhà xuất bản" />}
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
                        <MenuItem value={0}>Tất cả nhà xuất bản</MenuItem>
                        {publisherData?.data?.result?.map((item, index) => (
                            <MenuItem key={index} value={item._id}>
                                <Typography textTransform={"capitalize"}>{item.name}</Typography>
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            )}
            {typeVoiceData?.data?.result?.length > 0 && (
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={2}
                    lg={2}
                    sx={{
                        marginBottom: { xs: 0, sm: 0, md: 2, lg: 2 },
                        display: { xs: "none", sm: "none", md: "flex" },
                    }}
                >
                    <Select
                        labelId="typeVoice-select"
                        label="Loại voice"
                        value={selectedTypeVoice}
                        onChange={handleTypeVoiceFilterChange}
                        input={<CustomInput size="small" label="Loại voice" />}
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
                        <MenuItem value={0}>Tất cả loại voice</MenuItem>
                        {typeVoiceData?.data?.result?.map((item, index) => (
                            <MenuItem key={index} value={item._id}>
                                {capitalizeFirstLetter(item.name)}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            )}
            {assetData?.length > 0 && (
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    lg={4}
                    sx={{
                        marginBottom: { xs: 0, sm: 0, md: 2, lg: 2 },
                        display: { xs: "none", sm: "none", md: "flex" },
                    }}
                >
                    <Select
                        labelId="belong-select"
                        label="Thuộc tài sản"
                        value={selectedBelongAsset}
                        onChange={handleBelongAssetFilterChange}
                        input={<CustomInput size="small" label="Thuộc tài sản" />}
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
                        <MenuItem value={0}>Tất cả tủ kệ</MenuItem>
                        {assetData?.map((item, index) => (
                            <MenuItem key={index} value={item._id}>
                                {capitalizeFirstLetter(item.name)}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>
            )}

            <Grid
                item
                xs={12}
                sm={12}
                md={2}
                lg={2}
                sx={{
                    display: { xs: "flex", md: "none" },
                    justifyContent: "flex-start",
                    padding: { xs: 0, sm: 0 },
                }}
            >
                <Button onClick={handleMenuOpen} size="large" sx={{ pl: 0, pr: 0, py: 0, mb: 1, textTransform: "inherit" }}>
                    <GridFilterListIcon />
                    <Typography ml={1}>Lọc theo danh mục</Typography>
                </Button>
            </Grid>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                    sx: {
                        width: "250px",
                    },
                }}
            >
                {typeOptions?.length > 0 && (
                    <MenuItem>
                        <Select
                            labelId="publications-select"
                            label="Loại ấn phẩm"
                            value={selectedPublications}
                            onChange={handlePublicationsFilterChange}
                            fullWidth
                            size="small"
                        >
                            <MenuItem value={0}>Tất cả loại ấn phẩm</MenuItem>
                            {typeOptions?.map((item, index) => (
                                <MenuItem key={index} value={item.value}>
                                    {capitalizeFirstLetter(item.label)}
                                </MenuItem>
                            ))}
                        </Select>
                    </MenuItem>
                )}
                {materialData?.data?.result?.length > 0 && (
                    <MenuItem>
                        <Select
                            labelId="material-select"
                            label="Dạng học liệu"
                            value={selectedMaterial}
                            onChange={handleMaterialFilterChange}
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
                            <MenuItem value={0}>Tất cả dạng học liệu</MenuItem>
                            {materialData?.data?.result?.map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    {capitalizeFirstLetter(item.name)}
                                </MenuItem>
                            ))}
                        </Select>
                    </MenuItem>
                )}
                {categoryData?.data?.result?.length > 0 && (
                    <MenuItem>
                        <Select
                            labelId="category-select"
                            label="Lĩnh vực"
                            value={selectedCategory}
                            onChange={handleCategoryFilterChange}
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
                            <MenuItem value={0}>Tất cả lĩnh vực</MenuItem>
                            {categoryData?.data?.result?.map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    {capitalizeFirstLetter(item.name)}
                                </MenuItem>
                            ))}
                        </Select>
                    </MenuItem>
                )}
                {selectedCategory != 0 && (
                    <MenuItem>
                        <Select
                            labelId="topic-select"
                            label="Chủ đề"
                            value={selectedTopic}
                            onChange={handleTopicFilterChange}
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
                            <MenuItem value={0}>Tất cả chủ đề</MenuItem>
                            {filteredTopics?.length > 0 ? (
                                filteredTopics.map((item, index) => (
                                    <MenuItem key={index} value={item._id}>
                                        {capitalizeFirstLetter(item.name)}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>Chưa có chủ đề</MenuItem>
                            )}
                        </Select>
                    </MenuItem>
                )}
                {authorData?.data?.result?.length > 0 && (
                    <MenuItem>
                        <Select
                            labelId="author-select"
                            label="Tác giả"
                            value={selectedAuthor}
                            onChange={handleAuthorFilterChange}
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
                            <MenuItem value={0}>Tất cả tác giả</MenuItem>
                            {authorData?.data?.result?.map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    <Typography textTransform={"capitalize"}>
                                        {item.name}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Select>
                    </MenuItem>
                )}
                {publisherData?.data?.result?.length > 0 && (
                    <MenuItem>
                        <Select
                            labelId="publisher-select"
                            label="Nhà xuất bản"
                            value={selectedPublisher}
                            onChange={handlePublisherFilterChange}
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
                            <MenuItem value={0}>Tất cả nhà xuất bản</MenuItem>
                            {publisherData?.data?.result?.map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    <Typography textTransform={"capitalize"}>
                                        {item.name}
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Select>
                    </MenuItem>
                )}
                {typeVoiceData?.data?.result?.length > 0 && (
                    <MenuItem>
                        <Select
                            labelId="typeVoice-select"
                            label="Loại voice"
                            value={selectedTypeVoice}
                            onChange={handleTypeVoiceFilterChange}
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
                            <MenuItem value={0}>Tất cả loại voice</MenuItem>
                            {typeVoiceData?.data?.result?.map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    {capitalizeFirstLetter(item.name)}
                                </MenuItem>
                            ))}
                        </Select>
                    </MenuItem>
                )}
            </Menu>
        </Grid>
    );
};

export default FilterByItems;