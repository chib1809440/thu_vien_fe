import { useTheme } from '@mui/material/styles';
import { Box, FormControl, InputAdornment } from '@mui/material';
import { IconSearch } from '@tabler/icons-react';
import CustomInput from '../../default/input/CustomInput';

// ==============================|| SEARCH INPUT ||============================== //
interface PropSearch {
  contentSearch: string,
  fullwidth?: boolean,
  handleContentSearch: (e: any) => void
}
const SearchNoButtonSection = ({ contentSearch, handleContentSearch, fullwidth }: PropSearch) => {
  const theme = useTheme();

  return (
    <>
      <Box sx={{ width: "100%" }} >
        <Box display='flex' justifyContent='space-between' alignItems='center' width="100%">
          <FormControl sx={{ minWidth: fullwidth ? 0 : 280 }} size="small" fullWidth={fullwidth}>
            <CustomInput
              size="small"
              placeholder='Tìm kiếm'
              value={contentSearch}
              onChange={(e) => handleContentSearch(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
      </Box>
    </>
  );
};

export default SearchNoButtonSection;
