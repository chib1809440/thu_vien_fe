import { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import MainCard from './MainCard';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';

// Định nghĩa giao diện Props
interface Props {
    icon?: React.ElementType; // Để nhận một component icon
    bgColor?: string; // Để nhận màu nền
    bgColorIcon?: string; // Để nhận màu nền
    count: number; // Số lượng hiển thị
    title: string; // Tiêu đề hiển thị
}

const CardWrapper = styled(MainCard)(({ theme, bgColor, bgColorIcon }: { theme: any; bgColor?: string; bgColorIcon?: string }) => ({
    backgroundColor: bgColor || '#1e88e5', // Sử dụng màu nền được truyền vào hoặc mặc định
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: bgColorIcon,
        borderRadius: '50%',
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140,
        },
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: bgColorIcon,
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70,
        },
    },
}));

const TotalCard = ({ icon: IconComponent = GroupOutlinedIcon, bgColor, count, title, bgColorIcon }: Props) => {
    const theme = useTheme();
    return (
        <CardWrapper border={false} content={false} style={{ width: '100%' }} bgColor={bgColor} bgColorIcon={bgColorIcon}>
            <Box sx={{ p: 2.25 }}>
                <Grid container direction="column">
                    <Grid item>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Avatar
                                    variant="rounded"
                                    sx={{
                                        [theme.breakpoints.down('sm')]: {
                                            display: 'none',
                                        },
                                        backgroundColor: bgColorIcon,
                                        color: 'white',
                                        mt: 0,
                                    }}
                                >
                                    <IconComponent /> {/* Sử dụng icon từ props */}
                                </Avatar>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Typography sx={{ fontSize: '2.25rem', fontWeight: 500 }}>
                                    {count} {/* Hiển thị số lượng */}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography sx={{ fontSize: '1rem', fontWeight: 500 }}>
                            {title} {/* Hiển thị tiêu đề */}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </CardWrapper>
    );
};

export default TotalCard;
