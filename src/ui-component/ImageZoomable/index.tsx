import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Dialog, DialogContent, Grid, useMediaQuery } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import styled from 'styled-components';

interface ImageZoomableProps {
    imageUrl: string;
    width: any;
}
export default function ImageZoomable({ imageUrl, width }: ImageZoomableProps) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <img style={{ cursor: 'pointer' }} alt="No" src={imageUrl} width={width} onClick={handleClickOpen} />
            <Dialog sx={{
                '& div': {
                    padding: 0,
                    margin: 0,
                    borderRadius: 0,
                }
            }} fullScreen={fullScreen} open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
                {open && (
                    <DialogContent sx={{ padding: 0, maxWidth: '500px', maxHeight: '600px' }}>
                        <img src={imageUrl} alt="No" width='100%' style={{ display: 'block' }}/>
                        <Grid sx={{ position: 'absolute', top: '0', right: '0', margin: '10px 10px', color: 'white' }} >
                            <CustomCancelIcon sx={{ cursor: 'pointer', color: '#2196f3' }} onClick={handleClose} />
                        </Grid>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}

const CustomCancelIcon = styled(CancelIcon)`
    font-size: 30px;
    &:hover {
        transition: all 0.3s ease;
        /* color: #e7372a; */
    }
`
