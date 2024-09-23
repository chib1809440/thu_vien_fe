import React, { Ref } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Typography, CardProps, CardHeaderProps, CardContentProps, Grid, FormControl, TextField } from '@mui/material';

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
    width:string;
}

const MainCardV3 = React.forwardRef(
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
            width,
            ...others
        }: MainCardProps,
        ref: Ref<HTMLDivElement>
    ) => {
        const theme = useTheme();

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
                    <Grid md={6}>
                        {!darkTitle && title && <CardHeader sx={headerSX} title={title} action={secondary} />}
                    </Grid>
                    <Grid md={6} container justifyContent='flex-end'>
                        <Grid sx={{ width: '200px' }} container justifyContent='center' pr={2}>
                            <FormControl fullWidth>
                                <TextField label="Tìm kiếm tên trường" variant="outlined" onChange={(e) => keyFind(e.target.value)} />
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

export default MainCardV3;
