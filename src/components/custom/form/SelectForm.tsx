import { IconButton, SxProps, Theme, Tooltip, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box } from "@mui/system";
import { IconCirclePlusFilled, IconPlus } from "@tabler/icons-react";
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
    text?: string;
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
    text = ""
}) => {
    return (
        <FormControl sx={{ my: 1, ...sx }} error={error} fullWidth>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: "bold" }}>
                    {label} {required && <span className="required_text">(*)</span>}
                </Typography>
                {
                    handleAdd && (
                        <Tooltip title="Thêm mới" arrow placement="top">
                            <IconCirclePlusFilled
                                style={{ cursor: 'pointer', marginLeft: '10px', marginRight: '10px' }}
                                onClick={handleAdd}
                                color="green"
                                size={30}
                                stroke={1.5}
                            />
                        </Tooltip>
                    )}
            </Box>

            <Select name={name} value={value ?? ""} onChange={onChange} onBlur={onBlur}
                endAdornment={endAdornment} disabled={disabled}
                renderValue={(selectedValue) => {
                    const selectedOption = options.find(option => option?.value === selectedValue);
                    return selectedOption ? `${text} ${selectedOption?.label}` : text;
                }}
            >
                <MenuItem value="">
                    <em>Chọn</em>
                </MenuItem>

                {options?.length > 0 &&
                    options?.map((option) => (
                        <MenuItem key={option?.value} value={option.value}>
                            {option?.label}
                        </MenuItem>
                    ))}
            </Select>

            {helperText && <FormHelperText sx={{ ml: 0 }}>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default SelectForm;