import { FormControl, MenuItem, Select } from "@mui/material";
import { useEffect } from "react";
interface SelectProps {
    data?:any,
    value?: number,
    handleChangeValue?: (id: number | null) => void;
}
function CustomSelect({ data,value, handleChangeValue }: SelectProps) {
    useEffect(() => {
        if (value === null && data?.length > 0) {
          handleChangeValue(data[0]?.id);
        }
      }, [value,data,handleChangeValue]);
    return (
        <FormControl sx={{ width: { xs: "100%", md: 200 } }}>
            <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={value}
                onChange={(e:any)=>handleChangeValue(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ borderRadius: "8px" }}
            >
                {data?.map(item=>(
                    <MenuItem value={item.id}>{item.key}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default CustomSelect;