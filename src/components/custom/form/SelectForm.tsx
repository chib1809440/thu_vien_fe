import { IconButton, SxProps, Theme, Tooltip, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box } from "@mui/system";
import { IconPlus } from "@tabler/icons-react";
import { FC, ReactNode } from "react";
import { TSelectOption } from "../../../types/common/select";

type Props = {
    name?: string;
    value?: string;
    label: string;
    sx?: SxProps<Theme>;
    required?: boolean;
    error?: boolean;
    helperText?: ReactNode | string;
    onChange?: (event: SelectChangeEvent) => void;
    onBlur?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    options?: TSelectOption[];
    endAdornment?: ReactNode;
    disabled?: boolean;
    handleAdd?: () => void;
};

const SelectForm: FC<Props> = ({
    name,
    value,
    label,
    required,
    sx,
    error,
    helperText,
    options = [],
    onChange,
    onBlur,
    endAdornment,
    disabled,
    handleAdd,
}) => {
    return (
        <FormControl sx={{ my: 1, ...sx }} error={error} fullWidth>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "bold", mb: handleAdd ? 0 : 1.5 }}>
                    {label} {required && <span className="required_text">(*)</span>}
                </Typography>
                {
                    handleAdd && (
                        <Tooltip title="Thêm mới" arrow placement="top">
                            <IconButton onClick={handleAdd} sx={{ color: "#2595f1", mb: 1, ml: 1 }}>
                                <IconPlus />
                            </IconButton>
                        </Tooltip>
                    )}
            </Box>

            <Select name={name} value={value ?? ""} onChange={onChange} onBlur={onBlur} endAdornment={endAdornment} disabled={disabled} >
                <MenuItem value="">
                    <em>Chọn</em>
                </MenuItem>

                {options.length &&
                    options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
            </Select>

            {helperText && <FormHelperText sx={{ ml: 0 }}>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default SelectForm;