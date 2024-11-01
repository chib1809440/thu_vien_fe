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
import { IconCirclePlusFilled, IconPlus } from "@tabler/icons-react";
import { capitalizeFirstLetter } from "../../../helpers/capitalizeFirstLetter";

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
    isCapitalize?: boolean;
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
    isCapitalize = false,
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
            <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
                <Typography sx={{ fontWeight: "bold" }}>
                    {label} {required && <span className="required_text">(*)</span>}
                </Typography>
                {handleAdd && (
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
                        <Typography variant="body2" textTransform={isCapitalize ? "capitalize" : "none"}>
                            {
                                value
                                    .slice(0, limitTags)
                                    .map((option, _) =>
                                        option?.[keyLabel]?.length > limitText
                                            ? capitalizeFirstLetter(option?.[keyLabel]).slice(0, limitText) + "..."
                                            : capitalizeFirstLetter(option?.[keyLabel])
                                    )
                                    .join(", ")
                            }

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

                            <Typography textTransform={isCapitalize ? "capitalize" : "none"}>{capitalizeFirstLetter(option?.[keyLabel])}</Typography>
                        </Box>
                    );
                }}
            />

            {helperText && <FormHelperText sx={{ ml: 0 }}>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default AutocompleteForm;