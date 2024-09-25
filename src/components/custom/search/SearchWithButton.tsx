import { useEffect, useRef, useState } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Card, ClickAwayListener, FormControl, Grid, InputAdornment, InputLabel, List, ListItemButton, ListItemText, OutlinedInput, Paper, Popper, Skeleton, Typography, useMediaQuery } from '@mui/material';
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons-react';
import { shouldForwardProp } from '@mui/system';
import CustomInput from '../../default/input/CustomInput';
import StyledButton from '../../default/button/StyledButton';
import { CsFlexRowBetween } from '../../default/flex';


// ==============================|| SEARCH INPUT ||============================== //
interface PropSearch {
  contentSearch: string,
  fullwidth?: boolean,
  handleContentSearch: (e: any) => void
}
const SearchWithButton = ({ contentSearch, handleContentSearch, fullwidth }: PropSearch) => {
  const theme = useTheme();

  return (
    <>
      <Box sx={{ width: "100%" }} >
        <Box display='flex' justifyContent='space-between' alignItems='center' width="100%">
          <FormControl sx={{ minWidth: fullwidth ? 0 : 280 }} size="small" fullWidth={fullwidth}>
            <CsFlexRowBetween sx={{ gap: "6px" }}>
              <CustomInput
                size="small"
                placeholder="Tìm kiếm"
                value={contentSearch}
                onChange={(e) => handleContentSearch(e.target.value)}
              // startAdornment={
              //   <InputAdornment position="start">
              //     <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
              //   </InputAdornment>
              // }
              />
              <StyledButton size='medium'>Tìm kiếm</StyledButton>
            </CsFlexRowBetween>
          </FormControl>
        </Box>
      </Box>
    </>
  );
};

export default SearchWithButton;
