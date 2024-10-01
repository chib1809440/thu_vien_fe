import {
    Autocomplete,
    Box,
    Checkbox,
    FormControl,
    FormHelperText,
    SxProps,
    TextField,
    Theme,
    Typography,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { ReactNode } from "react";

const LIMIT_TAGS = 3;
const LIMIT_TEXT = 40;

type Props<Type> = {
    placeholder?: string;
    sxBox?: SxProps<Theme>;
    required?: boolean;
    label: string;
    value: Type[];
    options: Type[];
    keyLabel: keyof Type;
    error?: boolean;
    helperText?: ReactNode | string;
    onChange?: (value: Type[]) => void;
};

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AutocompleteForm = <Type extends Record<string, any>>({
    placeholder,
    sxBox,
    value,
    options,
    keyLabel,
    error = false,
    helperText,
    label,
    required,
    onChange,
}: Props<Type>) => {
    return (
        <FormControl
            sx={{
                my: 1,
                ...sxBox,
            }}
            fullWidth
            error={error}
        >
            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                {label} {required && <span className="required_text">(*)</span>}
            </Typography>

            <Autocomplete
                multiple
                limitTags={LIMIT_TAGS}
                id="multiple-limit-tags"
                options={options}
                value={value}
                onChange={(_, value) => onChange?.(value)}
                getOptionLabel={(option) => option?.[keyLabel]}
                disableCloseOnSelect
                renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
                fullWidth
                renderTags={(value, getTagProps) => {
                    const numTags = value.length;

                    return (
                        <Typography variant="body2">
                            {value
                                .slice(0, LIMIT_TAGS)
                                .map((option, _) =>
                                    option?.[keyLabel].length > LIMIT_TEXT
                                        ? option?.[keyLabel].slice(0, LIMIT_TEXT) + "..."
                                        : option?.[keyLabel]
                                )
                                .join(", ")}

                            <Typography
                                variant="body2"
                                sx={{ display: "inline" }}
                                fontWeight="bold"
                            >
                                {numTags > LIMIT_TAGS && ` +${numTags - LIMIT_TAGS} đã chọn`}
                            </Typography>
                        </Typography>
                    );
                }}
                renderOption={(props: any, option, { selected }) => {
                    const { key, ...optionProps } = props;

                    return (
                        <Box key={key} component="li" {...optionProps}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />

                            {option?.[keyLabel]}
                        </Box>
                    );
                }}
            />

            {helperText && <FormHelperText sx={{ ml: 0 }}>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default AutocompleteForm;