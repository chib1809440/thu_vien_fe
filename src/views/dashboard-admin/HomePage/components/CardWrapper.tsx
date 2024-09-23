import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { styled, useTheme } from '@mui/material/styles';
import { Box } from "@mui/system";
import { useNavigate } from 'react-router-dom';
import MainCard from "../../../../ui-component/cards/MainCard";


// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function CardHome(props: {
    [x: string]: any;
    content: string;
    quantity: string | number;
    icon?: any;
    navigate?: string
}) {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <>
            <CardWrapper border={false} content={false}>
                <Box sx={{ p: 2 }}>
                    <List sx={{ py: 0 }}>
                        <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                            <ListItemAvatar onClick={() => navigate(`/${props.navigate}`)}>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        ...theme.typography.commonAvatar,
                                        ...theme.typography.largeAvatar,
                                        backgroundColor: theme.palette.primary[800],
                                        color: '#fff'
                                    }}
                                >
                                    {/* <TableChartOutlinedIcon fontSize="inherit" /> */}
                                    {props.icon}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{
                                    py: 0,
                                    mt: 0.45,
                                    mb: 0.45
                                }}
                                primary={
                                    <Typography variant="h4" sx={{ color: '#fff' }}>
                                        {props?.quantity}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
                                        {props?.content}
                                    </Typography>
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
    maxHeight:'80px',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.light,
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
        borderRadius: '50%',
        top: -30,
        right: -180
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
        borderRadius: '50%',
        top: -160,
        right: -130
    }
}));