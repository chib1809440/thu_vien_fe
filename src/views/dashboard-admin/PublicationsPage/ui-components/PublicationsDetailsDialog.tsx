import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Chip, Grid, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { IconFileWord, IconPdf, IconPhoto, IconPresentation, IconVideo } from '@tabler/icons-react';
import { useState } from 'react';
import Barcode from 'react-barcode';
import StyledButton from '../../../../components/default/button/StyledButton';
import { StyledHeading } from '../../../../components/default/typography';
import { capitalizeFirstLetter } from '../../../../helpers/capitalizeFirstLetter';
import { TPublications } from '../../../../types/models/publications.type';
import { TShelves } from '../../../../types/models/shelves';
import { getRandomPastelGradient, statusOptions, typeOptions } from '../../../../utils/constants.utils';
import { getLabelFromOptions } from '../../../../utils/object';
import ImageDetailPage from '../ImageDetailPage';
import VideoDetailPage from '../VideoDetailPage';
import WordDetailPage from '../WordDetailPage';
import BookViewDialog from './BookViewDialog';
import CoverCard from '../../../../components/custom/card/CoverCard';

const PublicationsDetailsDialog = ({ open, onClose, publications, openLT }: { open: boolean; onClose: () => void; publications: TPublications | null, openLT?: boolean }) => {
    const [showBook, setShowBook] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [showWord, setShowWord] = useState(false);
    const numberPage = publications?.images?.length;
    const theme = useTheme();
    const isSM = useMediaQuery('(min-width: 850px)');    

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
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
                            {
                                isSM ?
                                    // <Grid item xs={12}>
                                    //     <CoverCard
                                    //         mimetype={publications?.mimetype}
                                    //         title={publications?.name}
                                    //         subtitle={publications?.type}
                                    //         barcode={publications?.barcode}
                                    //         status={publications?.status}
                                    //         materialNames={publications?.materialIds?.length > 0 ? publications?.materialIds.map(material => material?.name) : []}
                                    //         categoryNames={publications?.categoryIds?.length > 0 ? publications?.categoryIds.map(category => category?.name) : []}
                                    //         authorNames={publications?.authorIds?.length > 0 ? publications?.authorIds.map(author => author?.name) : []}
                                    //         publisherNames={publications?.publisherIds?.length > 0 ? publications?.publisherIds.map(publisher => publisher?.name) : []}
                                    //         photo={publications?.priviewImage ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.priviewImage}` : `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`}
                                    //         handleOpenView={handleOpenView}
                                    //         nameShelves={(publications?.shelvesId as TShelves)?.name}
                                    //         quantityShelves={publications?.shelvesQuantity > 0 ? publications?.shelvesQuantity : 0}
                                    //         handleOpenVideo={handleOpenVideo}
                                    //         handleOpenImage={handleOpenImage}
                                    //         handleOpenWord={handleOpenWord}
                                    //         path={`${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`}
                                    //         openLT={openLT}
                                    //     />

                                    // </Grid>
                                    <Grid item container spacing={3}>
                                        <Grid item xs={5} display={"flex"} justifyContent={"center"}>
                                            <img
                                                src={publications?.priviewImage ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.priviewImage}` : `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`}
                                                alt="Uploaded"
                                                style={{
                                                    width: "100%",
                                                    borderRadius: "12px",
                                                    objectFit: "cover",

                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={7}>
                                            <Grid item xs={12} my={2} mt={publications?.mimetype === "application/pdf" ? 3 : 0}>
                                                <Box display={"flex"} flexDirection={"column"} >
                                                    <Typography variant="h4" display={"flex"}>
                                                        Tên ấn phẩm:
                                                        <StyledHeading ml={1} variant="h4">
                                                            {publications?.name}
                                                        </StyledHeading>
                                                    </Typography>
                                                    {publications?.barcode && (
                                                        <div style={{ textAlign: "center" }}>
                                                            <Typography variant="h4" display={"flex"} alignItems={"center"}>
                                                                Barcode:
                                                                <Barcode
                                                                    value={publications?.barcode}
                                                                    width={1}
                                                                    height={30}
                                                                    fontSize={10}
                                                                />
                                                            </Typography>
                                                        </div>
                                                    )}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} my={2}>
                                                {publications?.status && (
                                                    <Box display={"flex"} flexDirection={"column"}>
                                                        <Typography variant="h4" display={"flex"}>
                                                            Trạng thái:
                                                            <StyledHeading ml={1} variant="h4">
                                                                {getLabelFromOptions(statusOptions, publications?.status)}
                                                            </StyledHeading>
                                                        </Typography>
                                                        {(publications?.shelvesId as TShelves)?.name && (
                                                            <Typography variant="h4" display={"flex"} mt={1}>
                                                                Tên kệ - tủ:
                                                                <StyledHeading ml={1} variant="h4" textTransform={"capitalize"}>
                                                                    {(publications?.shelvesId as TShelves)?.name}
                                                                </StyledHeading>
                                                            </Typography>
                                                        )}
                                                        {publications?.shelvesQuantity > 0 && (
                                                            <Typography variant="h4" display={"flex"} mt={1}>
                                                                Số lượng ấn phẩm trên kệ:
                                                                <StyledHeading ml={1} variant="h4" textTransform={"capitalize"}>
                                                                    {publications?.shelvesQuantity}
                                                                </StyledHeading>
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                )}
                                            </Grid>
                                            <Grid item xs={12} my={2}>
                                                {publications?.type?.length > 0 && (
                                                    <Box display="flex" alignItems="center">
                                                        <Typography variant="h4" >
                                                            Loại:
                                                        </Typography>
                                                        <Chip
                                                            variant="filled"
                                                            label={getLabelFromOptions(typeOptions, publications?.type)}
                                                            sx={{
                                                                ml: 2,
                                                                color: "black",
                                                                fontSize: 14,
                                                                fontWeight: 500,
                                                            }}
                                                        />
                                                    </Box>
                                                )}
                                            </Grid>
                                            <Grid item xs={12} my={2}>
                                                {publications?.materialIds?.length > 0 && (
                                                    <Box display="flex" alignItems="center">
                                                        <Typography variant="h4">
                                                            Dạng học liệu:
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                flexWrap: "wrap",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            {publications?.materialIds?.slice(0, 1).map((item, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    variant="filled"
                                                                    label={capitalizeFirstLetter(item.name)}
                                                                    sx={{
                                                                        color: "black",
                                                                        fontSize: 14,
                                                                        fontWeight: 500,
                                                                        ml: 2,
                                                                        mb: 1,
                                                                    }}
                                                                />
                                                            ))}
                                                            {publications?.materialIds?.length > 2 && (
                                                                <Chip
                                                                    variant="filled"
                                                                    label={`+${publications?.materialIds?.length - 1} học liệu khác`}
                                                                    sx={{
                                                                        color: "black",
                                                                        fontSize: 14,
                                                                        fontWeight: 500,
                                                                        ml: 2,
                                                                        mb: 1,
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Grid>
                                            <Grid item xs={12} my={2}>
                                                {publications?.categoryIds?.length > 0 && (
                                                    <Box display="flex" alignItems="center">
                                                        <Typography variant="h4">
                                                            Lĩnh vực:
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                flexWrap: "wrap",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            {publications?.categoryIds?.slice(0, 1).map((item, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    variant="filled"
                                                                    label={capitalizeFirstLetter(item.name)}
                                                                    sx={{
                                                                        color: "black",
                                                                        fontSize: 14,
                                                                        fontWeight: 500,
                                                                        ml: 2,
                                                                        mb: 1,
                                                                    }}
                                                                />
                                                            ))}
                                                            {publications?.categoryIds?.length > 2 && (
                                                                <Chip
                                                                    variant="filled"
                                                                    label={`+${publications?.categoryIds?.length - 1} lĩnh vực khác`}
                                                                    sx={{
                                                                        color: "black",
                                                                        fontSize: 14,
                                                                        fontWeight: 500,
                                                                        ml: 2,
                                                                        mb: 1,
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Grid>
                                            <Grid item xs={12} my={2}>
                                                {publications?.authorIds?.length > 0 && (
                                                    <Box display="flex" alignItems="center">
                                                        <Typography variant="h4">
                                                            Tác giả:
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                flexWrap: "wrap",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            {publications?.authorIds?.slice(0, 1).map((item, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    variant="filled"
                                                                    label={capitalizeFirstLetter(item.name)}
                                                                    sx={{
                                                                        color: "black",
                                                                        fontSize: 14,
                                                                        fontWeight: 500,
                                                                        ml: 2,
                                                                        mb: 1,
                                                                    }}
                                                                />
                                                            ))}
                                                            {publications?.authorIds?.length > 2 && (
                                                                <Chip
                                                                    variant="filled"
                                                                    label={`+${publications?.authorIds?.length - 1} tác giả khác`}
                                                                    sx={{
                                                                        color: "black",
                                                                        fontSize: 14,
                                                                        fontWeight: 500,
                                                                        ml: 2,
                                                                        mb: 1,
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Grid>
                                            <Grid item xs={12} my={2}>
                                                {publications?.publisherIds?.length > 0 && (
                                                    <Box display="flex" alignItems="center">
                                                        <Typography variant="h4">
                                                            Nhà xuất bản:
                                                        </Typography>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                flexWrap: "wrap",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            {publications?.publisherIds?.slice(0, 1).map((item, index) => (
                                                                <Chip
                                                                    key={index}
                                                                    variant="filled"
                                                                    label={capitalizeFirstLetter(item.name)}
                                                                    sx={{
                                                                        color: "black",
                                                                        fontSize: 14,
                                                                        fontWeight: 500,
                                                                        ml: 2,
                                                                        mb: 1,
                                                                    }}
                                                                />
                                                            ))}
                                                            {publications?.publisherIds?.length > 2 && (
                                                                <Chip
                                                                    variant="filled"
                                                                    label={`+${publications?.publisherIds?.length - 1} nhà xuất bản khác`}
                                                                    sx={{
                                                                        color: "black",
                                                                        fontWeight: 500,
                                                                        fontSize: 14,
                                                                        ml: 2,
                                                                        mb: 1,
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Grid>
                                            <Grid item xs={12}>
                                                {publications?.type === "ấn phẩm mềm" && (
                                                    <Box>
                                                        {publications?.mimetype === "application/pdf" && (
                                                            <Box sx={{ gap: 2 }}>
                                                                <StyledButton
                                                                    color="primary"
                                                                    size="small"
                                                                    startIcon={<IconPdf stroke={2} />}
                                                                    variant="contained"
                                                                    sx={{ marginTop: 1, width: "150px" }}
                                                                    onClick={handleOpenView}
                                                                >
                                                                    Xem sách
                                                                </StyledButton>
                                                            </Box>
                                                        )}
                                                        {[
                                                            "application/msword",
                                                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                                        ].includes(publications?.mimetype) && (
                                                                <>
                                                                    {
                                                                        <StyledButton
                                                                            color="primary"
                                                                            size="small"
                                                                            startIcon={<IconFileWord stroke={2} />}
                                                                            variant="contained"
                                                                            sx={{ marginTop: 1, width: "150px" }}
                                                                        >
                                                                            <a href={`${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`} download style={{ color: "white" }}>
                                                                                Tải xuống
                                                                            </a>
                                                                        </StyledButton>
                                                                    }
                                                                </>
                                                            )}
                                                        {[
                                                            "video/mp4",
                                                            "video/x-matroska",
                                                            "video/webm",
                                                            "video/x-msvideo",
                                                        ].includes(publications?.mimetype) && (
                                                                <StyledButton
                                                                    color="primary"
                                                                    size="small"
                                                                    startIcon={<IconVideo stroke={2} />}
                                                                    variant="contained"
                                                                    sx={{ marginTop: 1, width: "150px" }}
                                                                    onClick={handleOpenVideo}
                                                                >
                                                                    Xem video
                                                                </StyledButton>
                                                            )}
                                                        {[
                                                            "application/vnd.ms-powerpoint",
                                                            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                                        ].includes(publications?.mimetype) && (
                                                                <>
                                                                    {<StyledButton
                                                                        color="primary"
                                                                        size="small"
                                                                        startIcon={<IconPresentation stroke={2} />}
                                                                        variant="contained"
                                                                        sx={{ marginTop: 1, width: "150px" }}
                                                                    >
                                                                        <a href={`${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`} download style={{ color: "white" }}>
                                                                            Tải xuống
                                                                        </a>
                                                                    </StyledButton>
                                                                    }
                                                                </>
                                                            )}
                                                        {[
                                                            "image/jpeg",
                                                            "image/png",
                                                            "image/gif",
                                                            "image/bmp",
                                                            "image/webp",
                                                        ].includes(publications?.mimetype) && (
                                                                <StyledButton
                                                                    color="primary"
                                                                    size="small"
                                                                    startIcon={<IconPhoto stroke={2} />}
                                                                    variant="contained"
                                                                    sx={{ marginTop: 1, width: "150px" }}
                                                                    onClick={handleOpenImage}
                                                                >
                                                                    Xem hình ảnh
                                                                </StyledButton>
                                                            )}
                                                    </Box>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    :
                                    <Grid item container spacing={1}>
                                        <Grid item xs={12} display={"flex"} justifyContent={"center"}>
                                            <img
                                                src={publications?.priviewImage ? `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.priviewImage}` : `${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`}
                                                alt="Uploaded"
                                                style={{
                                                    width: publications?.mimetype === "application/pdf" ? "65%" : "100%",
                                                    borderRadius: "12px",
                                                    objectFit: "cover",

                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} mx={2} mt={publications?.mimetype === "application/pdf" ? 3 : 0}>
                                            <Box display={"flex"} flexDirection={"column"} >
                                                <Typography variant="h4" display={"flex"}>
                                                    Tên ấn phẩm:
                                                    <StyledHeading ml={1} variant="h4">
                                                        {publications?.name}
                                                    </StyledHeading>
                                                </Typography>
                                                {publications?.barcode && (
                                                    <div style={{ textAlign: "center" }}>
                                                        <Typography variant="h4" display={"flex"} alignItems={"center"}>
                                                            Barcode:
                                                            <Barcode
                                                                value={publications?.barcode}
                                                                width={1}
                                                                height={30}
                                                                fontSize={10}
                                                            />
                                                        </Typography>
                                                    </div>
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} mx={2}>
                                            {publications?.status && (
                                                <Box display={"flex"} flexDirection={"column"}>
                                                    <Typography variant="h4" display={"flex"}>
                                                        Trạng thái:
                                                        <StyledHeading ml={1} variant="h4">
                                                            {getLabelFromOptions(statusOptions, publications?.status)}
                                                        </StyledHeading>
                                                    </Typography>
                                                    {(publications?.shelvesId as TShelves)?.name && (
                                                        <Typography variant="h4" display={"flex"} mt={1}>
                                                            Tên kệ - tủ:
                                                            <StyledHeading ml={1} variant="h4" textTransform={"capitalize"}>
                                                                {(publications?.shelvesId as TShelves)?.name}
                                                            </StyledHeading>
                                                        </Typography>
                                                    )}
                                                    {publications?.shelvesQuantity > 0 && (
                                                        <Typography variant="h4" display={"flex"} mt={1}>
                                                            Số lượng ấn phẩm trên kệ:
                                                            <StyledHeading ml={1} variant="h4" textTransform={"capitalize"}>
                                                                {publications?.shelvesQuantity}
                                                            </StyledHeading>
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} mx={2}>
                                            {publications?.type?.length > 0 && (
                                                <Box display="flex" alignItems="center">
                                                    <Typography variant="h4" >
                                                        Loại:
                                                    </Typography>
                                                    <Chip
                                                        variant="filled"
                                                        label={getLabelFromOptions(typeOptions, publications?.type)}
                                                        sx={{
                                                            ml: 2,
                                                            color: theme.palette.text.dark,
                                                            background:
                                                                "linear-gradient(90deg, rgba(255, 159, 0, 1) 0%, rgba(255, 109, 0, 1) 100%)",
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} mx={2}>
                                            {publications?.materialIds?.length > 0 && (
                                                <Box display="flex" alignItems="center">
                                                    <Typography variant="h4">
                                                        Dạng học liệu:
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        {publications?.materialIds?.slice(0, 1).map((item, index) => (
                                                            <Chip
                                                                key={index}
                                                                variant="filled"
                                                                label={capitalizeFirstLetter(item.name)}
                                                                sx={{
                                                                    color: theme.palette.text.dark,
                                                                    background: getRandomPastelGradient(),
                                                                    ml: 2,
                                                                    mb: 1,
                                                                }}
                                                            />
                                                        ))}
                                                        {publications?.materialIds?.length > 2 && (
                                                            <Chip
                                                                variant="filled"
                                                                label={`+${publications?.materialIds?.length - 1} học liệu khác`}
                                                                sx={{
                                                                    color: theme.palette.text.dark,
                                                                    background: getRandomPastelGradient(),
                                                                    ml: 2,
                                                                    mb: 1,
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} mx={2}>
                                            {publications?.categoryIds?.length > 0 && (
                                                <Box display="flex" alignItems="center">
                                                    <Typography variant="h4">
                                                        Lĩnh vực:
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        {publications?.categoryIds?.slice(0, 1).map((item, index) => (
                                                            <Chip
                                                                key={index}
                                                                variant="filled"
                                                                label={capitalizeFirstLetter(item.name)}
                                                                sx={{
                                                                    color: theme.palette.text.dark,
                                                                    background: getRandomPastelGradient(),
                                                                    ml: 2,
                                                                    mb: 1,
                                                                }}
                                                            />
                                                        ))}
                                                        {publications?.categoryIds?.length > 2 && (
                                                            <Chip
                                                                variant="filled"
                                                                label={`+${publications?.categoryIds?.length - 1} lĩnh vực khác`}
                                                                sx={{
                                                                    color: theme.palette.text.dark,
                                                                    background: getRandomPastelGradient(),
                                                                    ml: 2,
                                                                    mb: 1,
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} mx={2}>
                                            {publications?.authorIds?.length > 0 && (
                                                <Box display="flex" alignItems="center">
                                                    <Typography variant="h4">
                                                        Tác giả:
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        {publications?.authorIds?.slice(0, 1).map((item, index) => (
                                                            <Chip
                                                                key={index}
                                                                variant="filled"
                                                                label={capitalizeFirstLetter(item.name)}
                                                                sx={{
                                                                    color: theme.palette.text.dark,
                                                                    background: getRandomPastelGradient(),
                                                                    ml: 2,
                                                                    mb: 1,
                                                                }}
                                                            />
                                                        ))}
                                                        {publications?.authorIds?.length > 2 && (
                                                            <Chip
                                                                variant="filled"
                                                                label={`+${publications?.authorIds?.length - 1} tác giả khác`}
                                                                sx={{
                                                                    color: theme.palette.text.dark,
                                                                    background: getRandomPastelGradient(),
                                                                    ml: 2,
                                                                    mb: 1,
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} mx={2}>
                                            {publications?.publisherIds?.length > 0 && (
                                                <Box display="flex" alignItems="center">
                                                    <Typography variant="h4">
                                                        Nhà xuất bản:
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        {publications?.publisherIds?.slice(0, 1).map((item, index) => (
                                                            <Chip
                                                                key={index}
                                                                variant="filled"
                                                                label={capitalizeFirstLetter(item.name)}
                                                                sx={{
                                                                    color: theme.palette.text.dark,
                                                                    background: getRandomPastelGradient(),
                                                                    ml: 2,
                                                                    mb: 1,
                                                                }}
                                                            />
                                                        ))}
                                                        {publications?.publisherIds?.length > 2 && (
                                                            <Chip
                                                                variant="filled"
                                                                label={`+${publications?.publisherIds?.length - 1} nhà xuất bản khác`}
                                                                sx={{
                                                                    color: theme.palette.text.dark,
                                                                    background: getRandomPastelGradient(),
                                                                    ml: 2,
                                                                    mb: 1,
                                                                }}
                                                            />
                                                        )}
                                                    </Box>
                                                </Box>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            {publications?.type === "ấn phẩm mềm" && (
                                                <Box>
                                                    {publications?.mimetype === "application/pdf" && (
                                                        <Box sx={{ gap: 2 }}>
                                                            <StyledButton
                                                                color="primary"
                                                                size="small"
                                                                startIcon={<IconPdf stroke={2} />}
                                                                variant="contained"
                                                                sx={{ marginTop: 1, width: "150px" }}
                                                                onClick={handleOpenView}
                                                            >
                                                                Xem sách
                                                            </StyledButton>
                                                        </Box>
                                                    )}
                                                    {[
                                                        "application/msword",
                                                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                                    ].includes(publications?.mimetype) && (
                                                            <>
                                                                {
                                                                    openLT === false ?
                                                                        <StyledButton
                                                                            color="primary"
                                                                            size="small"
                                                                            startIcon={<IconFileWord stroke={2} />}
                                                                            variant="contained"
                                                                            sx={{ marginTop: 1, width: "150px" }}
                                                                        >
                                                                            <a href={`${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`} download style={{ color: "white" }}>
                                                                                Tải xuống
                                                                            </a>
                                                                        </StyledButton>

                                                                        : ""
                                                                }
                                                            </>
                                                        )}
                                                    {[
                                                        "video/mp4",
                                                        "video/x-matroska",
                                                        "video/webm",
                                                        "video/x-msvideo",
                                                    ].includes(publications?.mimetype) && (
                                                            <StyledButton
                                                                color="primary"
                                                                size="small"
                                                                startIcon={<IconVideo stroke={2} />}
                                                                variant="contained"
                                                                sx={{ marginTop: 1, width: "150px" }}
                                                                onClick={handleOpenVideo}
                                                            >
                                                                Xem video
                                                            </StyledButton>
                                                        )}
                                                    {[
                                                        "application/vnd.ms-powerpoint",
                                                        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                                    ].includes(publications?.mimetype) && (
                                                            <>
                                                                {
                                                                    openLT === false ? <StyledButton
                                                                        color="primary"
                                                                        size="small"
                                                                        startIcon={<IconPresentation stroke={2} />}
                                                                        variant="contained"
                                                                        sx={{ marginTop: 1, width: "150px" }}
                                                                    >
                                                                        <a href={`${process.env.REACT_APP_BASE_API_FILE_URL}/${publications?.path}`} download style={{ color: "white" }}>
                                                                            Tải xuống
                                                                        </a>
                                                                    </StyledButton>
                                                                        : ""
                                                                }
                                                            </>
                                                        )}
                                                    {[
                                                        "image/jpeg",
                                                        "image/png",
                                                        "image/gif",
                                                        "image/bmp",
                                                        "image/webp",
                                                    ].includes(publications?.mimetype) && (
                                                            <StyledButton
                                                                color="primary"
                                                                size="small"
                                                                startIcon={<IconPhoto stroke={2} />}
                                                                variant="contained"
                                                                sx={{ marginTop: 1, width: "150px" }}
                                                                onClick={handleOpenImage}
                                                            >
                                                                Xem hình ảnh
                                                            </StyledButton>
                                                        )}
                                                </Box>
                                            )}
                                        </Grid>
                                    </Grid>
                            }
                        </Grid>

                    ) : (
                        <Typography variant="body1">Không có thông tin chi tiết để hiển thị</Typography>
                    )}


                </DialogContent>
            </Dialog >
        </>
    );
};

export default PublicationsDetailsDialog;
