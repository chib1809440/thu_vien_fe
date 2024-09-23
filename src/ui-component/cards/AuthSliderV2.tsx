// material-ui
import { Grid, Typography } from '@mui/material';

// third-party
import Slider from 'react-slick';
import { AuthSliderProps } from '../../types';

const AuthSliderV2 = ({ items }: { items: AuthSliderProps[] }) => {
    const settings = {
        autoplay: true,
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <Slider {...settings}>
            {items.map((item, i) => (
                <Grid key={i} container alignItems="center"p={2} textAlign="center" justifyContent='center'>
                    <Grid item>
                        {/* <Typography variant="h1">{item.title}</Typography> */}
                        <img style={{borderRadius:'5px'}} width='100%' src={item.title} alt='logo' />
                    </Grid>

                </Grid>
            ))}
        </Slider>
    );
};

export default AuthSliderV2;
