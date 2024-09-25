import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import useConfig from '../../../hooks/useConfig';

const FontFamily = () => {
    const theme = useTheme();
    const { fontFamily, onChangeFontFamily } = useConfig();

    let initialFont;
    switch (fontFamily) {
        case `'Inter', sans-serif`:
            initialFont = 'Inter';
            break;
        case `'Nunito'`:
            initialFont = 'Nunito';
            break;
        case `'Roboto', sans-serif`:
        default:
            initialFont = 'Roboto';
            break;
    }

    // state - font family
    const [font, setFont] = useState(initialFont);

    const handleFont = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFont(event.target.value);
        console.log("font", event.target.value);

        onChangeFontFamily(event.target.value);
    };

    return (
        <Box sx={{ border: 1, borderColor: theme.palette.grey[400], p: 2 }}>
            <Typography variant='h4' pb={2}>FontFamily</Typography>
            <FormControl>
                <RadioGroup aria-label="font-family" value={font} onChange={handleFont} name="row-radio-buttons-group">
                    <FormControlLabel
                        value="Roboto"
                        control={<Radio />}
                        label="Roboto"
                        sx={{
                            '& .MuiSvgIcon-root': { fontSize: 28 },
                            '& .MuiFormControlLabel-label': { color: theme.palette.grey[900] }
                        }}
                    />
                    <FormControlLabel
                        value="Nunito"
                        control={<Radio />}
                        label="Nunito"
                        sx={{
                            '& .MuiSvgIcon-root': { fontSize: 28 },
                            '& .MuiFormControlLabel-label': { color: theme.palette.grey[900] }
                        }}
                    />
                    <FormControlLabel
                        value="Inter"
                        control={<Radio />}
                        label="Inter"
                        sx={{
                            '& .MuiSvgIcon-root': { fontSize: 28 },
                            '& .MuiFormControlLabel-label': { color: theme.palette.grey[900] }
                        }}
                    />
                </RadioGroup>
            </FormControl>
        </Box>
    );
};

export default FontFamily;
