import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, IconButton, Typography } from "@mui/material";
import {
    ChangeEvent,
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

type UploadAvatarProps = {
    defaultImage?: string;
    onChange?: (file: File) => void;
    typeHardPublications?: boolean;
    fileName?: string;
};

export type UploadAvatarRefProps = {
    clearState: () => void;
};

export const getBlobImg = (file: File): Promise<{ url: string; id: number }> =>
    new Promise((resolve, reject) => {
        try {
            if (!file) return;

            const reader = new FileReader();
            const objURL = URL.createObjectURL(file);

            reader.readAsDataURL(file);

            reader.onload = () => {
                resolve({
                    url: objURL,
                    id: file.lastModified,
                });
            };
        } catch (error) {
            reject(error);
        }
    });

const SPACING = 230;
const SPACING_CHILD = 230 - 16;

const Uploadimage = forwardRef<UploadAvatarRefProps, UploadAvatarProps>(
    ({ defaultImage, onChange, typeHardPublications, fileName }, ref) => {
        const imageRef = useRef<HTMLInputElement | null>(null);
        const [imageBlob, setImageBlob] = useState<string>("");
        useEffect(() => {
            if (!defaultImage) {
                return;
            }
            setImageBlob(defaultImage);
        }, [defaultImage, imageRef]);

        const handleChangeImage = useCallback(
            async (event: ChangeEvent<HTMLInputElement>) => {
                const {
                    target: { files },
                } = event;

                if (!files || !files?.length) return;

                const { url } = await getBlobImg(files[0]);

                setImageBlob(url);

                if (!onChange) return;

                onChange(files[0]);
            },
            [onChange]
        );

        const handleClickUpload = useCallback(() => {
            if (!imageRef.current) return;
            imageRef.current.click();
        }, [imageRef.current]);

        const clearState = () => {
            setImageBlob("");
        };

        useImperativeHandle(ref, () => ({ clearState }), [clearState]);

        return (
            <Box
                width={SPACING}
                height={SPACING}
                borderRadius={3}
                border={(theme) => `1px dashed ${theme.palette.grey[300]}`}
                p={1}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Box
                    textAlign={"center"}
                    width={SPACING_CHILD}
                    height={SPACING_CHILD}
                    borderRadius="12px"
                    sx={{
                        background: (theme) =>
                            theme.palette.mode === "dark"
                                ? theme.palette.grey[900]
                                : theme.palette.grey[300],
                        cursor: "pointer",
                    }}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDirection={"column"}
                    onClick={handleClickUpload}
                >
                    <input
                        accept="image/*"
                        multiple={false}
                        type="file"
                        tabIndex={-1}
                        style={{ display: "none" }}
                        ref={imageRef}
                        onChange={handleChangeImage}
                    />
                    {typeHardPublications ? (
                        imageBlob ? (
                            <img
                                src={imageBlob}
                                alt="Uploaded"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "12px",
                                    objectFit: "cover",
                                }}
                            />
                        ) : (
                            <>
                                <IconButton aria-label="upload photo">
                                    <AddAPhotoIcon color="inherit" />
                                </IconButton>
                                <Typography color={"inherit"}>Chọn ảnh</Typography>
                            </>
                        )
                    ) : (
                        <>
                            {imageBlob && !fileName ? (
                                <img
                                    src={imageBlob}
                                    alt="Uploaded"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "12px",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <Box sx={{ width: "100%" }}>
                                    <Box
                                        sx={{
                                            height: { xs: "80px", md: "220px" },
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "100%",
                                            borderRadius: 2,
                                        }}
                                    >
                                        <IconButton aria-label="upload file">
                                            <CloudUploadIcon color="inherit" />
                                        </IconButton>
                                        {!fileName && (
                                            <Typography color={"inherit"}>Chọn file</Typography>
                                        )}

                                        <Typography variant="body2" color="inherit" mt={1} px={1}>
                                            {fileName}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>
        );
    }
);

export default Uploadimage;
