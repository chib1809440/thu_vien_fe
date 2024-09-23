import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { Box } from "@mui/system";
import { ListItemIcon, Typography } from "@mui/material";
import { ContentCut } from "@mui/icons-material";
const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",  
];

function getStyles(name: string, valueSelectMui: readonly string[], theme: Theme) {
  return {
    fontWeight:
      valueSelectMui.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface PropsSelectWaiting {
  typed: string;
}

export default function SelectWaiting({ typed }: PropsSelectWaiting) {
  const theme = useTheme();
  const [valueSelectMui, setvalueSelectMui] = React.useState<string[]>([]);
  const handleChange = (event: SelectChangeEvent<typeof valueSelectMui>) => {
    const {
      target: { value },
    } = event;
    setvalueSelectMui(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  
  return (
    <div>
      <FormControl sx={{ width: typed === "datetype" ? "240px" : "195px" }}>
        <Select
          displayEmpty
          value={valueSelectMui}          
          input={<OutlinedInput />}               
      renderValue={(selected) => {
      if (selected?.length === 0) {
             return (
          <Box sx={{ display: "flex", gap: 1 }}>
           <ListItemIcon>
            <ContentCut fontSize="small" />
          </ListItemIcon>
            <em>All</em>
          </Box>
      )
    }
        return selected.join(', ');
      }}
        >       
          <MenuItem value="All">
          <ListItemIcon>
            <ContentCut fontSize="small" />
          </ListItemIcon>
            <em>All</em>
          </MenuItem>   
            
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, valueSelectMui, theme)}
            >       
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
