import React, { Ref } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Typography, CardProps, CardHeaderProps, CardContentProps, Grid, FormControl, TextField, InputLabel, Select, MenuItem } from '@mui/material';

// project imports
import { KeyedObject } from '../../types';

// constant
const headerSX = {
    '& .MuiCardHeader-action': { mr: 0 }
};

// ==============================|| CUSTOM MAIN CARD ||============================== //

export interface MainCardProps extends KeyedObject {
    border?: boolean;
    boxShadow?: boolean;
    children: React.ReactNode | string;
    style?: React.CSSProperties;
    content?: boolean;
    className?: string;
    contentClass?: string;
    contentSX?: CardContentProps['sx'];
    darkTitle?: boolean;
    sx?: CardProps['sx'];
    secondary?: CardHeaderProps['action'];
    shadow?: string;
    elevation?: number;
    title?: React.ReactNode | string;
    keyFind: any;
    keyFindISBN: any;
    keyStatus: any;
    width: string;
}

const MainCardV2 = React.forwardRef(
    (
        {
            border = true,
            boxShadow,
            children,
            content = true,
            contentClass = '',
            contentSX = {},
            darkTitle,
            secondary,
            shadow,
            sx = {},
            title,
            keyFind,
            keyFindISBN,
            keyStatus,
            width,
            ...others
        }: MainCardProps,
        ref: Ref<HTMLDivElement>
    ) => {
        const theme = useTheme();
        const [isStatusProduct, setStatusProduct] = React.useState<string>('2');
        
        function handleChange(value: string) {
            setStatusProduct(value);
            if (keyStatus) {
                keyStatus(value);
            }
        }

        return (
            <Card
                ref={ref}
                {...others}
                sx={{
                    width: width,
                    border: border ? '1px solid' : 'none',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.primary[200] + 75,
                    ':hover': {
                        boxShadow: boxShadow
                            ? shadow ||
                            (theme.palette.mode === 'dark' ? '0 2px 14px 0 rgb(33 150 243 / 10%)' : '0 2px 14px 0 rgb(32 40 45 / 8%)')
                            : 'inherit'
                    },
                    ...sx
                }}
            >
                {/* card header and action */}
                <Grid container justifyContent='space-between' alignItems='center'>
                    <Grid container md={6}>
                        <Grid md={8}>
                            {!darkTitle && title && <CardHeader sx={headerSX} title={title} action={secondary} />}
                        </Grid>
                        <Grid md={4} container alignItems='center'>
                            <FormControl fullWidth>
                                <InputLabel id="statusProduct-simple-select-label">Trạng thái</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="statusProduct-simple-select"
                                    value={isStatusProduct}
                                    label="Trạng thái"
                                    inputProps={{}}
                                    onChange={(e) => handleChange(e.target.value)}
                                >
                                    <MenuItem value='0'>Tất cả</MenuItem>
                                    <MenuItem value='1'>Đã có</MenuItem>
                                    <MenuItem value='2'>Chưa có</MenuItem>
                                </Select>
                                {/* <TextField label="Tìm kiếm tên ấn phẩm" variant="outlined" onChange={(e) => keyFind(e.target.value)} /> */}
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid md={6} container justifyContent='flex-end'>
                        <Grid sx={{ width: '180px' }} container justifyContent='center' pr={2}>
                            <FormControl fullWidth>
                                <TextField label="Tìm kiếm tên ấn phẩm" variant="outlined" onChange={(e) => keyFind(e.target.value)} />
                            </FormControl>
                        </Grid>
                        <Grid sx={{ width: '180px' }} container justifyContent='center' pr={2}>
                            <FormControl fullWidth>
                                <TextField label="Tìm kiếm ISBN" variant="outlined" onChange={(e) => keyFindISBN(e.target.value)} />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
                {darkTitle && title && (
                    <CardHeader sx={headerSX} title={<Typography variant="h3">{title}</Typography>} action={secondary} />
                )}

                {/* content & header divider */}
                {title && <Divider />}

                {/* card content */}
                {content && (
                    <CardContent sx={contentSX} className={contentClass}>
                        {children}
                    </CardContent>
                )}
                {!content && children}
            </Card>
        );
    }
);

export default MainCardV2;
