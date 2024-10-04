import { FormControl, SxProps, TextField, Theme, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

type Props = {
    name?: string;
    label: string;
    required?: boolean;
    error?: boolean;
    helperText?: ReactNode | string;
    placeholder?: string;
    value: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    sxBox?: SxProps<Theme>;
};

const InputForm: FC<Props> = ({
    label,
    value,
    required,
    error,
    helperText,
    placeholder,
    sxBox,
    name,
    onChange,
    onBlur,
}) => {
    return (
        <FormControl
            sx={{
                my: 1,
                ...sxBox,
            }}
            fullWidth
        >
            <Typography sx={{ mb: 1.5, fontWeight: "bold" }}>
                {label} {required && <span className="required_text">(*)</span>}
            </Typography>

            <TextField
                variant="outlined"
                fullWidth
                error={error}
                name={name}
                helperText={helperText}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                sx={{
                    "& > .MuiFormHelperText-root": {
                        ml: 0,
                    },
                }}
            />
        </FormControl>
    );
};

export default InputForm;