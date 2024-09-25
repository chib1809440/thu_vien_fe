import { useTheme } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';
import { IconChecks } from '@tabler/icons-react';
import theme1 from '../../../themes/colors/_theme1.module.scss';
import theme2 from '../../../themes/colors/_theme2.module.scss';
import theme3 from '../../../themes/colors/_theme3.module.scss';
import useConfig from '../../../hooks/useConfig';

export interface StringColorProps {
    id?: string;
    label?: string;
    color?: string;
    primary?: string;
    secondary?: string;
}

interface Props {
    color: StringColorProps;
    presetColor: string;
    borderRadius: number,
    setPresetColor: (s: string) => void;
}

const PresetColorBox = ({ color, presetColor, borderRadius, setPresetColor }: Props) => (
    <Grid item>
        <Box

            sx={{
                background: `linear-gradient(135deg, ${color.primary} 50%, ${color.secondary} 50%)`,
                // opacity: presetColor === color.id ? 0.6 : 1,
                cursor: 'pointer',
                width: "48px",
                height: "48px",
                borderRadius: `${borderRadius}px`,
                border: 1,
                borderColor: color.primary,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
            onClick={() => setPresetColor(color?.id!)}
        >
            {presetColor === color.id && <IconChecks color={"#fff"} />}
        </Box>
    </Grid>
);

const PresetColor = () => {
    const theme = useTheme();
    const { presetColor, borderRadius, onChangePresetColor } = useConfig();

    const colorOptions = [
        {
            id: 'theme1',
            primary: theme.palette.mode === 'dark' ? theme1.darkPrimaryMain : theme1.lightPrimaryMain,
            secondary: theme.palette.mode === 'dark' ? theme1.darkSecondaryMain : theme1.lightPrimaryDark
        },
        {
            id: 'theme2',
            primary: theme.palette.mode === 'dark' ? theme2.darkPrimaryMain : theme2.lightPrimaryMain,
            secondary: theme.palette.mode === 'dark' ? theme2.darkSecondaryMain : theme2.lightPrimaryDark
        },
        {
            id: 'theme3',
            primary: theme.palette.mode === 'dark' ? theme3.darkPrimaryMain : theme3.lightPrimaryMain,
            secondary: theme.palette.mode === 'dark' ? theme3.darkSecondaryMain : theme3.lightPrimaryDark
        },

    ];

    return (
        <Box sx={{ border: 1, borderColor: theme.palette.grey[400], p: 2 }}>
            <Typography variant='h4' pb={2}>PresetColor</Typography>
            <Grid container spacing={1}>
                {colorOptions.map((color, index) => (
                    <Grid item xs={3}>
                        <PresetColorBox borderRadius={borderRadius} key={index} color={color} presetColor={presetColor} setPresetColor={onChangePresetColor} />
                    </Grid>
                ))}

            </Grid>


        </Box>
    );
};

export default PresetColor;
