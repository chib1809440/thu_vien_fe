import { Box, Grid, Modal, TableCell } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import styled from 'styled-components';
import { useState } from 'react';
export interface ModalImagesProps {
    url?: string;
    // children: any;
}

export default function ModalImages({ url, ...props }: ModalImagesProps) {

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    return (
        <>
            <TableCell>{url && <CustomImg onClick={handleOpen} alt='' src={url} width='100px'/>}</TableCell>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <CustomBox sx={style}>
                    <Grid>
                        <img alt='' src={url} />
                    </Grid>
                    <Grid sx={{ position: 'absolute', top: '0', right: '0', margin: '10px 10px', color: 'white' }} >
                        <CustomCancelIcon sx={{ cursor: 'pointer', color: '#fff' }} onClick={handleClose} />
                    </Grid>
                </CustomBox>
            </Modal>
        </>
    );
}


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: 'auto',
    // border: 'none !important'
};

const CustomBox = styled(Box)`
    .css-vj1n65-MuiGrid-root {
        width: 100%;
        /* height: calc( 100% + 100px ); */
    }

    img {
        width: 100%;
        height: 100%;
    }
`

const CustomCancelIcon = styled(CancelIcon)`
    font-size: 30px;
    &:hover {
        transition: all 0.3s ease;
        color: #e7372a;
    }
`

const CustomImg = styled.img`
    cursor: pointer;
`