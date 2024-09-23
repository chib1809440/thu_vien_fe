import * as React from "react";
import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { Grid, InputAdornment, OutlinedInput } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { IconSearch } from "@tabler/icons";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
interface PropsSearchMultiple {
  datatable: any;
  onchangeSearch: any;
}
export default function SearchMultiple({
  datatable,
  onchangeSearch,
}: PropsSearchMultiple) {
  const [search, setSearch] = React.useState<string>('');   
  const handleSearch = async (event:any) => {
      const newString =  event?.target.value;
      setSearch(newString);
      const temp = [...datatable];
      const filteredRows = temp?.filter((row:any) => {                            
        return row.name?.toLowerCase().includes(newString?.toLowerCase());
      });          
    onchangeSearch(filteredRows);      
  };
 const handleClear =()=>{
  setSearch("");    
  handleSearch(search);
 }
  return (
    <Grid item>
<TextField
      placeholder="Search"
      type="text"
      variant="outlined"
      fullWidth
      size="small"
      onChange={handleSearch}
      value={search}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconSearch />
          </InputAdornment>
        ),
        endAdornment: search && (
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClear}
          ><CancelOutlinedIcon/></IconButton>
        )
      }}
    />
</Grid>
  );
}

