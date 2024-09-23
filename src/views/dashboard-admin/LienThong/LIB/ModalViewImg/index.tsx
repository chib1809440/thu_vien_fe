import React from 'react';

// material-ui
import { CardActions, CardContent, Divider, Grid, IconButton, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

// project imports
// assets
import CloseIcon from '@mui/icons-material/Close';
import imageVodeo from '../../../../../assets/images/books/book-dientu.jpg';
import sachSimple from '../../../../../assets/images/books/book-truyenthong.jpg';
import MainCard from '../../../../../ui-component/cards/MainCard';

const ModalWrapper = styled('div')({
    marginBottom: 16,
    height: 500,
    flexGrow: 1,
    minWidth: 300,
    zIndex: -1,
    transform: 'translateZ(0)',
    '@media all and (-ms-high-contrast: none)': {
        display: 'none'
    }
});

// ==============================|| SERVER MODAL ||============================== //

export default function ModalViewImg(props: {
    isOpen?: any;
    isClose?: any;
    data?: any;
}) {
    const rootRef = React.useRef(null);
    const apiLT = window.localStorage.getItem('apiLT')

    const [isOpen, setOpen] = React.useState(false);

    React.useEffect(() => {
        setOpen(props.isOpen)
    }, [props.isOpen])

    function checkUrl(dataDetails) {
        if (dataDetails?.length !== 0) {
            let abc: string = `${apiLT}/media/${dataDetails?.medias[dataDetails?.medias?.length - 1]?.['url']}`
            let lastChar = dataDetails?.medias[dataDetails?.medias?.length - 1]?.['url'].slice(-4);

            if (dataDetails?.medias !== null && dataDetails.medias?.length !== 0) {
                if (lastChar === '.mp4' || lastChar === '.pdf') {
                    return <video style={{ borderRadius: '5px' }} width='70px' height='auto' src={imageVodeo} />
                }
                if (lastChar === '.png' || lastChar === '.jpg' || lastChar === '.jpeg') {
                    return <img style={{ borderRadius: '5px' }} width='400px' height='auto' src={abc} alt="ảnh ấn phẩm" />
                }
            } else {
                return <img style={{ borderRadius: '5px' }} width='60px' height='auto' src={sachSimple} alt="ảnh ấn phẩm" />
            }
        }
    }

    function handleClose() {
        setOpen(false)
        props.isClose(false)
    }

    return (
        <Modal
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            open={isOpen}
            aria-labelledby="server-modal-title"
            aria-describedby="server-modal-description"
            sx={{
                display: 'flex',
                p: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}
            container={() => rootRef.current}
        >
            <MainCard
                sx={{
                    width: 'auto',
                    zIndex: 1
                }}
                title={`Chi tiết ảnh ấn phẩm`}
                content={false}
                secondary={
                    <IconButton size="large">
                        <CloseIcon fontSize="small" onClick={handleClose} />
                    </IconButton>
                }
            >
                <CardContent>
                    {props.data?.length !== 0 &&
                        <Grid container justifyContent='center'>
                            {checkUrl(props.data)}
                        </Grid>
                    }
                </CardContent>
                <Divider />
                <CardActions>

                </CardActions>
            </MainCard>
        </Modal>
    );
}
