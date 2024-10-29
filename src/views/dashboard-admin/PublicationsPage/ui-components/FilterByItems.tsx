import { Grid, MenuItem, Select } from '@mui/material';
import { FC } from 'react';
import CustomInput from '../../../../components/default/input/CustomInput';
import { TApiMultipleRecords } from '../../../../types/api/api.type';
import { TAuthor } from '../../../../types/models/author';
import { TCategory } from '../../../../types/models/category';
import { TMaterial } from '../../../../types/models/material';
import { TPublisher } from '../../../../types/models/publisher';
import { TTypeVoice } from '../../../../types/models/type-voice';
import { capitalizeFirstLetter } from '../../../../helpers/capitalizeFirstLetter';

type Props = {
    selectedPublications?: number;
    handlePublicationsFilterChange?: (event: any) => void;
    typeOptions?: { value: string; label: string; }[];
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
}

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
    typeVoiceData
}) => {
    return (
        <Grid container pl={4} pr={4} xs={12} sm={12} md={12} lg={12} gap={2} sx={{ display: "flex", mb: 1, flexWrap: "wrap", mt: 1 }}>
            {
                typeOptions?.length > 0 && (
                    <Grid item xs={12} sm={12} md={2} lg={2}>
                        <Select
                            labelId="publications-select"
                            label="Loại ấn phẩm"
                            value={selectedPublications}
                            onChange={handlePublicationsFilterChange}
                            input={<CustomInput size="small" label="Loại ấn phẩm" />}
                        >
                            <MenuItem value={0}>Tất cả loại ấn phẩm</MenuItem>
                            {typeOptions?.map((item, index) => (
                                <MenuItem key={index} value={item.value}>
                                    {capitalizeFirstLetter(item.label)}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                )
            }
            {
                materialData?.data?.result?.length > 0 && (
                    <Grid item xs={12} sm={12} md={2} lg={2}>
                        <Select
                            labelId="material-select"
                            label="Dạng học liệu"
                            value={selectedMaterial}
                            onChange={handleMaterialFilterChange}
                            input={<CustomInput size="small" label="Dạng học liệu" />}
                        >
                            <MenuItem value={0}>Tất cả dạng học liệu</MenuItem>
                            {materialData?.data?.result?.map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    {capitalizeFirstLetter(item.name)}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                )
            }
            {
                categoryData?.data?.result?.length > 0 && (
                    <Grid item xs={12} sm={12} md={2} lg={2}
                        sx={{
                            marginBottom: { xs: 0, sm: 0, md: 2, lg: 2 }
                        }}
                    >
                        <Select
                            labelId="category-select"
                            label="Lĩnh vực"
                            value={selectedCategory}
                            onChange={handleCategoryFilterChange}
                            input={<CustomInput size="small" label="Lĩnh vực" />}
                        >
                            <MenuItem value={0}>Tất cả lĩnh vực</MenuItem>
                            {categoryData?.data?.result?.map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    {capitalizeFirstLetter(item.name)}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                )
            }
            {
                authorData?.data?.result?.length > 0 && (
                    <Grid item xs={12} sm={12} md={2} lg={2}
                        sx={{
                            marginBottom: { xs: 0, sm: 0, md: 2, lg: 2 }
                        }}
                    >
                        <Select
                            labelId="author-select"
                            label="Tác giả"
                            value={selectedAuthor}
                            onChange={handleAuthorFilterChange}
                            input={<CustomInput size="small" label="Tác giả" />}
                        >
                            <MenuItem value={0}>Tất cả tác giả</MenuItem>
                            {authorData?.data?.result?.map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    {capitalizeFirstLetter(item.name)}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                )
            }
            {
                publisherData?.data?.result?.length > 0 && (
                    <Grid item xs={12} sm={12} md={2.5} lg={2.5}
                        sx={{
                            marginBottom: { xs: 0, sm: 0, md: 2, lg: 2 }
                        }}
                    >
                        <Select
                            labelId="publisher-select"
                            label="Nhà xuất bản"
                            value={selectedPublisher}
                            onChange={handlePublisherFilterChange}
                            input={<CustomInput size="small" label="Nhà xuất bản" />}
                        >
                            <MenuItem value={0}>Tất cả nhà xuất bản</MenuItem>
                            {publisherData?.data?.result?.map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    {capitalizeFirstLetter(item.name)}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                )
            }
            {
                typeVoiceData?.data?.result?.length > 0 && (
                    <Grid item xs={12} sm={12} md={2} lg={2}
                        sx={{
                            marginBottom: { xs: 0, sm: 0, md: 2, lg: 2 }
                        }}
                    >
                        <Select
                            labelId="typeVoice-select"
                            label="Loại voice"
                            value={selectedTypeVoice}
                            onChange={handleTypeVoiceFilterChange}
                            input={<CustomInput size="small" label="Loại voice" />}
                        >
                            <MenuItem value={0}>Tất cả loại voice</MenuItem>
                            {typeVoiceData?.data?.result?.map((item, index) => (
                                <MenuItem key={index} value={item._id}>
                                    {capitalizeFirstLetter(item.name)}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                )
            }
        </Grid>
    );
};

export default FilterByItems;
