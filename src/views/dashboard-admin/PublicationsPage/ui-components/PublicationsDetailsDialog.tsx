import CloseIcon from '@mui/icons-material/Close';
import { Grid, IconButton, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import CoverCard from '../../../../components/custom/card/CoverCard';
import { TPublications } from '../../../../types/models/publications.type';
import { TShelves } from '../../../../types/models/shelves';
import ImageDetailPage from '../ImageDetailPage';
import VideoDetailPage from '../VideoDetailPage';
import BookViewDialog from './BookViewDialog';
import WordDetailPage from '../WordDetailPage';

const PublicationsDetailsDialog = ({ open, onClose, publications, openLT }: { open: boolean; onClose: () => void; publications: TPublications | null, openLT?: boolean }) => {
    const [showBook, setShowBook] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [showWord, setShowWord] = useState(false);
    const numberPage = publications?.images?.length;

    const handleOpenView = () => {
        setShowBook(true);
    };

    const handleClose = () => {
        setShowBook(false);
        setShowVideo(false);
        setShowImage(false);
        setShowWord(false);
    };

    const handleOpenVideo = () => {
        setShowVideo(true)
    }
    const handleOpenImage = () => {
        setShowImage(true)
    }
    const handleOpenWord = () => {
        setShowWord(true)
    }
    return (
        <>
            {
                showBook && numberPage > 0 && (
                    <BookViewDialog onClose={handleClose} open={showBook} publications={publications} />
                )
            }
            {
                showVideo && (
                    <VideoDetailPage onClose={handleClose} open={showVideo} publications={publications} />
                )
            }
            {
                showImage && (
                    <ImageDetailPage onClose={handleClose} open={showImage} publications={publications} />
                )
            }
            {
                showWord && (
                    <WordDetailPage onClose={handleClose} open={showWord} publications={publications} />
                )
            }
            <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
                <DialogContent>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        color='error'
                        sx={{ position: 'absolute', right: 8, top: 2 }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {publications ? (
                        <Grid container >
                            <Grid item xs={12}>
                                <CoverCard
                                    mimetype={publications?.mimetype}
                                    title={publications?.name}
                                    subtitle={publications?.type}
                                    barcode={publications?.barcode}
                                    status={publications?.status}
                                    materialNames={publications?.materialIds?.length > 0 ? publications?.materialIds.map(material => material?.name) : []}
                                    categoryNames={publications?.categoryIds?.length > 0 ? publications?.categoryIds.map(category => category?.name) : []}
                                    authorNames={publications?.authorIds?.length > 0 ? publications?.authorIds.map(author => author?.name) : []}
                                    publisherNames={publications?.publisherIds?.length > 0 ? publications?.publisherIds.map(publisher => publisher?.name) : []}
                                    photo={publications?.priviewImage ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.priviewImage}` : `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`}
                                    handleOpenView={handleOpenView}
                                    nameShelves={(publications?.shelvesId as TShelves)?.name}
                                    quantityShelves={publications?.shelvesQuantity > 0 ? publications?.shelvesQuantity : 0}
                                    handleOpenVideo={handleOpenVideo}
                                    handleOpenImage={handleOpenImage}
                                    handleOpenWord={handleOpenWord}
                                    path={`${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`}
                                    openLT={openLT}
                                />

                            </Grid>
                        </Grid>

                    ) : (
                        <Typography variant="body1">Không có thông tin chi tiết để hiển thị</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default PublicationsDetailsDialog;
