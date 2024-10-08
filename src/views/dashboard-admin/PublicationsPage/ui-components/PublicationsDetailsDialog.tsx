import CloseIcon from '@mui/icons-material/Close';
import { Box, Chip, Grid, IconButton, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { TPublications } from '../../../../types/models/publications.type';
import { statusOptions, typeOptions } from '../../../../utils/constants.utils';
import { getLabelFromOptions } from '../../../../utils/object';

const PublicationsDetailsDialog = ({ open, onClose, publications }: { open: boolean; onClose: () => void; publications: TPublications | null }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
            <DialogTitle>
                Chi tiết ấn phẩm
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    color='error'
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {publications ? (
                    <Grid container pl={4} pr={4} pt={2}>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <Box>
                                {publications.path && (
                                    <Box mb={2}>
                                        <input
                                            accept="image/*"
                                            multiple={false}
                                            type="file"
                                            tabIndex={-1}
                                            style={{ display: "none" }}
                                        />
                                        <img
                                            src={`${process.env.REACT_APP_BASE_API_FILE_URL}/${publications.path}`}
                                            alt="Uploaded"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: "12px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Box>
                                )}
                                {/* {publications.priviewImage && (
                                    <Box mb={2}>
                                        <input
                                            accept="image/*"
                                            multiple={false}
                                            type="file"
                                            tabIndex={-1}
                                            style={{ display: "none" }}
                                        />
                                        <img
                                            src={`${process.env.REACT_APP_BASE_API_FILE_URL}/${publications.priviewImage}`}
                                            alt="Uploaded"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                borderRadius: "12px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Box>
                                )} */}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} paddingLeft={4}>
                            <Typography mb={1} variant="body1"><strong>Tên ấn phẩm:</strong> {publications.name}</Typography>
                            <Typography mb={1} variant="body1"><strong>Mã barcode:</strong> {publications.barcode}</Typography>
                            <Typography mb={1} variant="body1"><strong>Loại:</strong> {getLabelFromOptions(typeOptions, publications.type)}</Typography>
                            <Typography mb={1} variant="body1"><strong>Trạng thái:</strong> {getLabelFromOptions(statusOptions, publications.status)}</Typography>

                            {publications.materialIds.length > 0 && (
                                <Box mt={1} display="flex" alignItems="center">
                                    <Typography variant="body1"><strong>Dạng học liệu:</strong></Typography>
                                    <Box mt={0.5}>
                                        {publications.materialIds.map(material => (
                                            <Chip key={material._id} label={material.name} variant="outlined"
                                                color="primary" sx={{ ml: 1 }} />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {publications.categoryIds.length > 0 && (
                                <Box mt={1} display="flex" alignItems="center">
                                    <Typography variant="body1"><strong>Thuộc lĩnh vực:</strong></Typography>
                                    <Box mt={0.5}>
                                        {publications.categoryIds.map(category => (
                                            <Chip key={category._id} label={category.name} variant="outlined"
                                                color="primary" sx={{ ml: 1 }} />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {publications.authorIds.length > 0 && (
                                <Box mt={1} display="flex" alignItems="center">
                                    <Typography variant="body1"><strong>Tác giả:</strong></Typography>
                                    <Box mt={0.5}>
                                        {publications.authorIds.map(author => (
                                            <Chip key={author._id} label={author.name} variant="outlined"
                                                color="primary" sx={{ ml: 1 }} />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {publications.publisherIds.length > 0 && (
                                <Box mt={1} display="flex" alignItems="center">
                                    <Typography variant="body1"><strong>Nhà xuất bản:</strong></Typography>
                                    <Box mt={0.5}>
                                        {publications.publisherIds.map(publisher => (
                                            <Chip key={publisher._id} label={publisher.name} variant="outlined"
                                                color="primary" sx={{ ml: 1 }} />
                                        ))}
                                    </Box>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="body1">Không có thông tin chi tiết để hiển thị</Typography>
                )}
            </DialogContent>
            {/* <DialogActions>
                <Button onClick={onClose} color="primary">Đóng</Button>
            </DialogActions> */}
        </Dialog>
    );
};

export default PublicationsDetailsDialog;
