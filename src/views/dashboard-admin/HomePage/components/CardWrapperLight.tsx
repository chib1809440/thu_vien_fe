import { Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { styled, useTheme } from '@mui/material/styles';
import { Box } from "@mui/system";
import { useNavigate } from 'react-router-dom';
import MainCard from "../../../../ui-component/cards/MainCard";
import imageVodeo from './image-video.png';
import sachSimple from './sach.png';

export default function CardHomeLight(props: {
    [x: string]: any;
    dataDetails?: any;
    content?: any;
    dataLoanSlip?: any;
}) {
    const theme = useTheme();
    const navigate = useNavigate();
    const namHienTai = new Date();
    const getMonth = namHienTai.getMonth();

    function checkUrl(dataDetails) {
        if (dataDetails?.listMedia !== null || dataDetails !== null) {
            let lastChar = dataDetails?.listMedia[0]?.['url'].slice(-4);
            if (lastChar === '.mp4') {
                return <img style={{ borderRadius: '5px' }} width='70px' height='auto' src={imageVodeo} alt="" />
            }
            if (lastChar === '.png' || lastChar === '.jpg' || lastChar === '.jpeg') {
                return <img style={{ borderRadius: '5px' }} width='60px' height='auto' src={`${process.env.REACT_APP_BASE_API_URL}/${dataDetails?.listMedia[0]?.['url']}`} alt="" />
            }
        } else {
            return <img style={{ borderRadius: '5px' }} width='60px' height='auto' src={sachSimple} alt="" />
        }
    }

    function renderColoredText(text) {
        if (text.length < 2) {
            return text;
        }

        const firstTwoChars = text.substring(0, 5);
        const restOfText = text.substring(5);

        return (
            <>
                <span style={{ color: '#00CC00', fontWeight:900 }}>{firstTwoChars}</span>
                {restOfText}
            </>
        );
    };

    return (
        <>
            <CardWrapper border={false} content={false} sx={{height:'115px'}}>
                <Box sx={{ p: 2 }}>
                    <List sx={{ py: 0 }}>
                        <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                            <ListItemAvatar sx={{ cursor: 'pointer' }} onClick={() => navigate('/chi-tiet-hoc-lieu', { state: props.dataDetails })}>
                                {checkUrl(props.dataDetails)}
                            </ListItemAvatar>
                            <ListItemText
                                sx={{
                                    py: 0,
                                    mt: 0.45,
                                    mb: 0.45,
                                    ml: 1.5,
                                }}
                                primary={
                                    <Typography variant="h4" sx={{ color: '#000' }}>
                                        {props?.dataDetails?.supplyName}
                                    </Typography>
                                }
                                secondary={
                                    <Grid>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: theme.palette.grey[500],
                                                mt: 0.5
                                            }}
                                        >
                                            Lượt mượn: {props?.dataDetails?.total_borrowed_supplies}
                                        </Typography>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: theme.palette.grey[500],
                                                mt: 0.5,
                                            }}
                                        >
                                            {props.content === 0 ? renderColoredText(`Top 1 sách mượn nhiều nhất tháng ${getMonth+1}`) : props.content === 1 ? renderColoredText(`Top 2 sách mượn nhiều nhất tháng ${getMonth+1}`) : props.content === 2 ? renderColoredText(`Top 3 sách mượn nhiều nhất tháng ${getMonth+1}`) : ''}
                                        </Typography>
                                    </Grid>
                                }
                            />
                        </ListItem>
                    </List>
                </Box>
            </CardWrapper>
        </>


    );
}

const CardWrapper = styled(MainCard)(({ theme }) => ({
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));