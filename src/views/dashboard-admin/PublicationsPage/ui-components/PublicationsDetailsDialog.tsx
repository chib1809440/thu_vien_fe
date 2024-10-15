import CloseIcon from '@mui/icons-material/Close';
import { Grid, IconButton, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import CoverCard from '../../../../components/custom/card/CoverCard';
import { TPublications } from '../../../../types/models/publications.type';
import BookViewDialog from './BookViewDialog';
import { TShelves } from '../../../../types/models/shelves';

const PublicationsDetailsDialog = ({ open, onClose, publications }: { open: boolean; onClose: () => void; publications: TPublications | null }) => {
    const [showBook, setShowBook] = useState(false);

    const handleOpenView = () => {
        setShowBook(true);
    };

    const handleClose = () => {
        setShowBook(false);
    };

    const numberPage = publications?.images?.length;     
    
    return (
        <>
            {
                showBook && publications.images.length > 0 && (
                    <BookViewDialog onClose={handleClose} open={showBook} publications={publications} />
                )
            }
            <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
                <DialogContent>
                    <IconButton
                        aria-label="cl ose"
                        onClick={onClose}
                        color='error'
                        sx={{ position: 'absolute', right: 8, top: 2 }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {publications ? (
                        <Grid container spacing={2} >
                            <Grid item xs={12}>
                                <CoverCard
                                    title={publications?.name}
                                    subtitle={publications?.type}
                                    barcode={publications?.barcode}
                                    status={publications?.status}
                                    materialNames={publications.materialIds.length > 0 ? publications.materialIds.map(material => material.name) : []}
                                    categoryNames={publications.categoryIds.length > 0 ? publications.categoryIds.map(category => category.name) : []}
                                    authorNames={publications.authorIds.length > 0 ? publications.authorIds.map(author => author.name) : []}
                                    publisherNames={publications.publisherIds.length > 0 ? publications.publisherIds.map(publisher => publisher.name) : []}
                                    photo={publications?.priviewImage ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.priviewImage}` : `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`}
                                    handleOpenView={handleOpenView}
                                    numberPage={numberPage}
                                    nameShelves={(publications?.shelvesId as TShelves)?.name}
                                    quantityShelves={publications?.shelvesQuantity > 0 ? publications?.shelvesQuantity : 0}
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
