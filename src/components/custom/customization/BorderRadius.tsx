// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Card, Grid, Slider, Typography } from '@mui/material';
import useConfig from '../../../hooks/useConfig';

// project imports

// concat 'px'
function valueText(value: number) {
    return `${value}px`;
}

const BorderRadius = () => {
    const theme = useTheme();
    const { borderRadius, onChangeBorderRadius } = useConfig();

    return (

        <Box sx={{border:1, borderColor:theme.palette.grey[400],p:2}}>
            <Typography variant='h4' pb={2}>BorderRadius</Typography>
            <Grid item xs={12} container spacing={2} alignItems="center">
                <Grid item>
                    <Typography variant="body1">
                        4px
                    </Typography>
                </Grid>
                <Grid item xs>
                    <Slider
                        size="small"
                        value={borderRadius}
                        onChange={onChangeBorderRadius}
                        getAriaValueText={valueText}
                        valueLabelDisplay="on"
                        aria-labelledby="discrete-slider-small-steps"
                        marks
                        step={2}
                        min={4}
                        max={24}
                        sx={{
                            color:theme.palette.text.primary,
                            '& .MuiSlider-valueLabel': {
                                color: theme.palette.text.secondary
                            }
                        }}
                    />
                </Grid>
                <Grid item>
                    <Typography variant="body1">
                        24px
                    </Typography>
                </Grid>
            </Grid>
        </Box>

    );
};

export default BorderRadius;
