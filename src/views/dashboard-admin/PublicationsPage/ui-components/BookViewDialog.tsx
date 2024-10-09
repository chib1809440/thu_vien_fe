import CloseIcon from '@mui/icons-material/Close';
import { Grid, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CoverCard from '../../../../components/custom/card/CoverCard';
import TypographyBorderLeft from '../../../../components/custom/typography/TypographyBorderLeft';
import { TPublications } from '../../../../types/models/publications.type';
import BookViewPage from '../BookViewPage';

const BookViewDialog = ({ open, onClose, publications }: { open: boolean; onClose: () => void; publications: TPublications | null }) => {

    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (reason === 'backdropClick') {
                    return;
                }
                onClose();
            }}
            maxWidth="xl"
            fullWidth
        >
            <IconButton
                aria-label="close"
                onClick={onClose}
                color='error'
                sx={{ position: 'absolute', right: 8, top: 2 }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <Grid item xs={12}>
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

                            />
                        </Grid>
                        <Grid item xs={12} >
                            <TypographyBorderLeft title="Đọc sách" />
                        </Grid>
                        <Grid item xs={12}>
                            <BookViewPage pages={publications?.images} />
                        </Grid>
                    </Grid>
                </Grid>

            </DialogContent>
        </Dialog>
    );
};

export default BookViewDialog;
