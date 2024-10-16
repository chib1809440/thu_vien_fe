import {
    Autocomplete,
    Box,
    Checkbox,
    FormControl,
    FormHelperText,
    IconButton,
    SxProps,
    TextField,
    Theme,
    Tooltip,
    Typography,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { ReactNode } from "react";
import { IconPlus } from "@tabler/icons-react";

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
    handleAdd?: () => void;
    limitTags?: number;
    limitText?: number;
    noOptionsText?: string;
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
    handleAdd,
    limitTags = LIMIT_TAGS,
    limitText = LIMIT_TEXT,
    noOptionsText = "Không có dữ liệu",
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "bold", mb: handleAdd ? 0 : 1.5 }}>
                    {label} {required && <span className="required_text">(*)</span>}
                </Typography>
                {handleAdd && (
                    <Tooltip title="Thêm mới" arrow placement="top">
                        <IconButton
                            size="small"
                            onClick={handleAdd}
                            sx={{ color: "#2595f1", ml: 1, p: 1.5 }}
                        >
                            <IconPlus size="18" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            <Autocomplete
                multiple
                limitTags={limitTags}
                id="multiple-limit-tags"
                options={options}
                noOptionsText={noOptionsText}
                value={value}
                onChange={(_, value) => onChange?.(value)}
                getOptionLabel={(option) => option?.[keyLabel]}
                isOptionEqualToValue={(option, value) => option?.[keyLabel] === value?.[keyLabel]}
                disableCloseOnSelect
                renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
                fullWidth
                renderTags={(value, getTagProps) => {
                    const numTags = value.length;

                    return (
                        <Typography variant="body2">
                            {value
                                .slice(0, limitTags)
                                .map((option, _) =>
                                    option?.[keyLabel]?.length > limitText
                                        ? option?.[keyLabel].slice(0, limitText) + "..."
                                        : option?.[keyLabel]
                                )
                                .join(", ")}

                            <Typography
                                variant="body2"
                                sx={{ display: "inline" }}
                                fontWeight="bold"
                            >
                                {numTags > limitTags && ` +${numTags - limitTags} đã chọn`}
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