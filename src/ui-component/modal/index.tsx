import React from 'react';

// material-ui
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    useTheme
} from '@mui/material';

// project imports
// assets

// generate random
// function rand() {
//     return Math.round(Math.random() * 20) - 10;
// }

// // modal position
// function getModalStyle() {
//     return {}
//     // const top = 50 + rand();
//     // const left = 50 + rand();

//     // return {
//     //     top: `${top}%`,
//     //     left: `${left}%`,
//     //     transform: `translate(-${top}%, -${left}%)`
//     // };
// }

// interface BodyProps extends CardProps {
//     modalStyle: React.CSSProperties;
//     bodyContent: any;
//     handleClose: () => void;
//     title: string;
// }

// const Body = React.forwardRef(({ modalStyle, bodyContent, handleClose, title }: BodyProps, ref: React.Ref<HTMLDivElement>) => (
//     <div ref={ref} tabIndex={-1}>
//         <MainCard
//             style={modalStyle}
//             sx={{
//                 position: 'absolute',
//                 width: { xs: 280, lg: 450 },
//                 top: '50%',
//                 left: '50%',
//                 transform: 'translate(-50%, -50%)'
//             }}
//             title={title}
//             content={false}
//             secondary={
//                 <IconButton onClick={handleClose} size="large">
//                     <CloseIcon fontSize="small" />
//                 </IconButton>
//             }
//         >
//             <CardContent>
//                 {bodyContent}
//             </CardContent>
//             <Divider />
//             {/* <CardActions>
//                 <ModalCustom />
//             </CardActions> */}
//         </MainCard>
//     </div>
// ));

interface ModalProps {
    title: string;
    openBtnTitle: string;
    bodyComponent: any;
}

type scrollType = 'body' | 'paper' | undefined;

export default function ScrollDialog({title, openBtnTitle, bodyComponent}: ModalProps) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [scroll, setScroll] = React.useState<scrollType>('body');

    const handleClickOpen = (scrollType: scrollType) => () => {
        setOpen(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const descriptionElementRef: React.Ref<HTMLSelectElement> = React.useRef(null);
    React.useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement?.focus();
            }
        }
    }, [open]);

    return (
        <div>
            <Button variant='contained' onClick={handleClickOpen('body')}>{openBtnTitle}</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll={scroll}
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                {open && (
                    <>
                        <DialogTitle id="scroll-dialog-title">{title}</DialogTitle>
                        <DialogContent dividers={scroll === 'paper'}>
                            {bodyComponent}
                        </DialogContent>
                        <DialogActions sx={{ pr: 2.5, pt: 2.5 }}>
                            <Button variant="contained" size="small" onClick={handleClose}>
                                Đóng
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
}

