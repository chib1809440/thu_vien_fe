import { SxProps, Theme, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
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
}) => {
    return (
        <FormControl sx={{ my: 1, ...sx }} error={error} fullWidth>
            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                {label} {required && <span className="required_text">(*)</span>}
            </Typography>

            <Select name={name} value={value ?? ""} onChange={onChange} onBlur={onBlur}>
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