import { Box, IconButton, styled, useMediaQuery, useTheme } from "@mui/material";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { FC, ReactNode } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import './react-slick.css'

interface SliderArrowArrow {
  onClick?: () => void
  type: 'next' | 'prev'
  className?: 'string'
}

const SliderArrow: FC<SliderArrowArrow> = (props) => {
  const { onClick, type, className } = props
  const theme=useTheme()
  return (
    <IconButton
      sx={{
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.text.secondary,
        '&:hover': { backgroundColor: theme.palette.primary.main, color: theme.palette.text.secondary},
        bottom: '-28px !important',
        left: 'unset !important',
        right: type === 'prev' ? '60px !important' : '0 !important',
        zIndex: 10,
        boxShadow: 1,
      }}
      disableRipple
      color="inherit"
      onClick={onClick}
      className={className}
    >
      {type === 'next' ? <IconArrowRight /> : <IconArrowLeft/>}
    </IconButton>
  )
}
const StyledDots = styled('ul')(({ theme }) => ({
  '&.slick-dots': {
    position: 'absolute',
    left: 0,
    bottom: -20,
    paddingLeft: theme.spacing(1),
    textAlign: 'left',
    '& li': {
      marginRight: theme.spacing(2),
      '&.slick-active>div': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}))
interface Props{
    children:ReactNode
}
export default function SlickCarousel({children}:Props) {
  const theme = useTheme()
  const matchMobileView = useMediaQuery(theme.breakpoints.down('md'))

  const settings = {
    infinite: true,
    autoplay: true,
    speed: 200,
    slidesToShow: matchMobileView ? 1 : 4,
    slidesToScroll: 1,
    prevArrow: <SliderArrow type="prev" />,
    nextArrow: <SliderArrow type="next" />,
    dots: true,
    appendDots: (dots: any) => <StyledDots>{dots}</StyledDots>,
    customPaging: () => (
      <Box sx={{ height: 8, width: 30, backgroundColor: theme.palette.grey[400], display: 'inline-block', borderRadius: 4 }} />
    ),
  };
  
  return (
    <Slider {...settings}>
      {children}
    </Slider>
  );
}