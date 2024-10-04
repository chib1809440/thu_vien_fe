import { FormControlLabel, Switch, SxProps, Theme } from "@mui/material";
import { FC } from "react";

type Props = {
    label?: string;
    value: boolean;
    onChange?: (checked: boolean) => void;
    sx?: SxProps<Theme>;
};

const SwitchForm: FC<Props> = ({ value, label, sx, onChange }) => {
    return (
        <FormControlLabel
            sx={{ my: 1, ...sx }}
            control={
                <Switch
                    value={value}
                    checked={value}
                    onChange={(e) => onChange?.(e.target.checked)}
                />
            }
            label={label}
        />
    );
};

export default SwitchForm;