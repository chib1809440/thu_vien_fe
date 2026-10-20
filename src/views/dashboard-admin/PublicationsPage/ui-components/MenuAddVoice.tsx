import { Box, Divider, ListItemIcon, Menu, MenuItem, Typography, useMediaQuery } from "@mui/material";
import { IconFlag, IconPlus, IconVolume, IconVolumeOff } from "@tabler/icons-react";
import { FC, forwardRef, useMemo, useRef, useState, useImperativeHandle } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../contexts/JWTContext";
import { useAddVoice, useEditVoice } from "../../../../hooks/services/voice/voice-mutation";
import { useFetchVoiceLink, useReFetchVoice } from "../../../../hooks/services/voice/voice-query";
import { TPublications } from "../../../../types/models/publications.type";
import { TTypeVoice } from "../../../../types/models/type-voice";
import { TVoice, TVoiceCreate } from "../../../../types/models/voice";
import DialogAddEditVoice from "./DialogAddEditVoice";

type Props = {
    anchorEl?: HTMLElement | null;
    onClose?: () => void;
    voiceData: TVoice[];
    publicationsData?: TPublications;
    typeVoiceData?: TTypeVoice[];
    currentUserId?: string;
    userRole?: string;
};

export type MenuAddVoiceRef = {
    muteAudio: () => void;
};

const MenuAddVoice = forwardRef<MenuAddVoiceRef, Props>(
    ({ anchorEl, onClose, voiceData, publicationsData, typeVoiceData, currentUserId, userRole }, ref) => {
        const [selectedEdit, setSelectedEdit] = useState<TVoice | null>(null);
        const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
        const [openAddEdit, setOpenAddEdit] = useState(false);
        const mutationAdd = useAddVoice();
        const mutationEdit = useEditVoice();
        const revalidate = useReFetchVoice();
        const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
        // const [hoveredTypeId, setHoveredTypeId] = useState<string | null>(null);
        const [activeTypeVoiceId, setActiveTypeVoiceId] = useState<string | null>(null);
        const [openVoices, setOpenVoices] = useState<string | null>(null);
        const { user } = useAuth();
        const { data: voiceLinkData } = useFetchVoiceLink();
        const currentAudioRef = useRef<HTMLAudioElement | null>(null);
        // console.log(currentAudioRef.current);


        useImperativeHandle(
            ref,
            () => ({
                muteAudio() {
                    console.log(`muteAudio`);

                    if (!currentAudioRef.current) return;
                    currentAudioRef.current.muted = true;
                    currentAudioRef.current.pause();
                },
            }),
            [currentAudioRef.current]
        );

        const userId = useMemo(() => {
            if (!user) return null;
            const _user = { ...user } as any;
            return _user?.data?._id;
        }, [user]);

        const handleOpenAddVoice = () => {
            setOpenAddEdit(true);
        };

        const handleClose = () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                setCurrentAudio(null);
            }
            setOpenAddEdit(false);
            setSelectedEdit(null);
        };

        const handleSelectedVoice = (row: TVoice | null) => {
            setSelectedEdit(row);
        };

        const handleSubmit = (values: TVoiceCreate) => {
            if (selectedEdit) {
                mutationEdit.mutate(
                    { ...values, _id: selectedEdit._id },
                    {
                        onSuccess: () => {
                            revalidate();
                            toast.success("Chỉnh sửa thành công.");
                            // handleClose();
                        },
                    }
                );
                return;
            }

            mutationAdd.mutate(values, {
                onSuccess: (data) => {
                    revalidate();
                    toast.success("Thêm thành công.");
                    // setOpenAddEdit(false);
                },
            });
        };

        const initialValues = useMemo((): TVoiceCreate => {
            if (selectedEdit) {
                return {
                    note: selectedEdit.note,
                    isPublic: selectedEdit.isPublic,
                    isLink: selectedEdit.isLink,
                    publicationId: (selectedEdit.publicationId as TPublications)?._id || null,
                    typeVoiceId: (selectedEdit.typeVoiceId as TTypeVoice)?._id || null,
                    file: selectedEdit.file,
                    isPrivate: selectedEdit.isPrivate,
                    order: selectedEdit.order,
                    name: selectedEdit.name,
                };
            }

            return {
                note: "",
                isPublic: true,
                isLink: false,
                file: null,
                typeVoiceId: null,
                isPrivate: false,
                name: "",
                order: 0,
            };
        }, [selectedEdit]);

        const handleClickVoice = (audioUrl: string, voiceId: string, typeId: string) => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            const newAudio = new Audio(`${import.meta.env.REACT_APP_BASE_API_FILE_URL}/${audioUrl}`);

            currentAudioRef.current = newAudio;

            newAudio.play().catch((error) => {
                console.error("Error playing audio:", error);
                toast.error("Unable to play audio.");
            });

            setCurrentAudio(newAudio);
            setPlayingVoiceId(voiceId);
            setActiveTypeVoiceId(typeId);

            newAudio.onended = () => {
                setPlayingVoiceId(null);
                setCurrentAudio(null);
            };
        };

        const playVoicesSequentially = (voices) => {
            if (voices?.length === 0) return;

            let currentVoiceIndex = 0;

            const playNextVoice = () => {
                if (currentVoiceIndex < voices?.length) {
                    const voice = voices[currentVoiceIndex];
                    const newAudio = new Audio(
                        `${import.meta.env.REACT_APP_BASE_API_FILE_URL}/${voice.path}`
                    );

                    currentAudioRef.current = newAudio;

                    newAudio.play().catch((error) => {
                        console.error("Error playing audio:", error);
                        toast.error("Unable to play audio.");
                    });

                    setCurrentAudio(newAudio);
                    setPlayingVoiceId(voice.id);
                    currentVoiceIndex++;

                    newAudio.onended = () => {
                        setPlayingVoiceId(null);
                        playNextVoice();
                    };
                } else {
                    setCurrentAudio(null);
                    setPlayingVoiceId(null);
                }
            };

            playNextVoice();
        };

        const handleClickTypeVoice = (type) => {
            setActiveTypeVoiceId(type._id);
            setOpenVoices(openVoices === type._id ? null : type._id);

            const voicesToPlay = type.voices.map((child) => ({
                id: child._id,
                path: child.path,
            }));

            playVoicesSequentially(voicesToPlay);
        };

        const filterByTypeVoiceId = typeVoiceData?.map((typeVoice) => {
            const voices = voiceData?.filter((voice) =>
                publicationsData?.createBy === userId
                    ? (voice.typeVoiceId as TTypeVoice)?._id === (typeVoice as TTypeVoice)?._id
                    : (voice.typeVoiceId as TTypeVoice)?._id === (typeVoice as TTypeVoice)?._id &&
                    voice.isPublic === true
            );
            const sortedVoices = voices?.sort((a, b) => a.order - b.order);

            return {
                ...typeVoice,
                voices: sortedVoices,
            };
        });

        const filterByTypeVoiceIdPullLink = typeVoiceData?.map((typeVoice) => {
            const voices = voiceLinkData?.data?.result?.filter((voice) =>
                publicationsData?.createBy === userId
                    ? voice.typeVoiceId === (typeVoice as TTypeVoice)?._id
                    : voice.typeVoiceId === (typeVoice as TTypeVoice)?._id &&
                    voice.isPublic === true &&
                    voice.isLink === true
            );
            const sortedVoices = voices?.sort((a, b) => a.order - b.order);

            return {
                ...typeVoice,
                voices: sortedVoices,
            };
        });

        const canAddVoice = (
            publicationsData?.createBy === currentUserId || userRole === "Admin" || userRole === "Owner"
        );
        const currentPath = window.location.pathname;
        const isMd = useMediaQuery('(min-width: 900px)');

        return (
            <>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={onClose}
                    PaperProps={{
                        sx: {
                            overflow: "visible",
                            borderRadius: 0,
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: { xs: 0, sm: 0, md: 1 },
                        },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                    {canAddVoice && (
                        <MenuItem onClick={handleOpenAddVoice}>
                            <ListItemIcon sx={{ display: { xs: "none", sm: "none", md: "flex" } }}>
                                <IconPlus size={20} />
                            </ListItemIcon>
                            Thêm voice
                        </MenuItem>
                    )}

                    {canAddVoice && <Divider sx={{ margin: 0 }} />}

                    {
                        // currentPath === "/lien-thong" ? (
                        // filterByTypeVoiceIdPullLink?.length > 0 ? (
                        //     filterByTypeVoiceIdPullLink.map((type) => (
                        //         <li
                        //             key={type._id}
                        //         // onMouseEnter={() => setHoveredTypeId(type._id)}
                        //         // onMouseLeave={() => setHoveredTypeId(null)}
                        //         >
                        //             <Box
                        //                 sx={{
                        //                     display: "flex",
                        //                     justifyContent: "space-between",
                        //                     alignItems: "center",
                        //                     backgroundColor: "white",
                        //                 }}
                        //             >
                        //                 {type?.voices?.length > 0 && (
                        //                     <MenuItem
                        //                         onClick={() => handleClickTypeVoice(type)}
                        //                         key={type._id}
                        //                         selected={activeTypeVoiceId === type._id}
                        //                         sx={{
                        //                             '&:hover': {
                        //                                 color: "#1791e2",
                        //                                 backgroundColor: "rgba(248, 248, 248, 0.5)",
                        //                                 transition: "all 0.3s",
                        //                             },
                        //                             '&.Mui-selected': {
                        //                                 color: "#1791e2",
                        //                                 backgroundColor: "rgba(248, 248, 248, 0.5)",
                        //                                 transition: "all 0.3s",
                        //                             },
                        //                             '& .MuiListItemIcon-root': {
                        //                                 color: 'inherit',
                        //                             }
                        //                         }}
                        //                     >
                        //                         <ListItemIcon sx={{
                        //                             display: { xs: "none", sm: "none", md: "flex" },
                        //                         }}>
                        //                             <IconFlag />
                        //                         </ListItemIcon>
                        //                         {type.name}
                        //                     </MenuItem>
                        //                 )}
                        //                 {/* {hoveredTypeId === type._id && type?.voices?.length > 0 && ( */}
                        //                 {openVoices === type._id && type?.voices?.length > 0 && (
                        //                     <ul
                        //                         style={{
                        //                             position: "absolute",
                        //                             maxWidth: isMd ? "200px" : "300px",
                        //                             backgroundColor: "white",
                        //                             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        //                             zIndex: 10,
                        //                             right: "100%",
                        //                             top: canAddVoice ? "48%" : "90%",
                        //                             listStyle: "none",
                        //                             padding: 0,
                        //                             margin: 0,
                        //                         }}
                        //                     >
                        //                         {type?.voices?.map((child) => (
                        //                             <Box
                        //                                 key={child._id}
                        //                             // onMouseEnter={() => setHoveredTypeId(type._id)}
                        //                             // onMouseLeave={() => setHoveredTypeId(null)}
                        //                             >
                        //                                 <Box
                        //                                     sx={{
                        //                                         display: "flex",
                        //                                         justifyContent: "space-between",
                        //                                         alignItems: "center",
                        //                                         padding: { xs: 0.5, sm: 0.5, md: 1.5 },
                        //                                         backgroundColor: "white",
                        //                                     }}
                        //                                 >
                        //                                     <MenuItem
                        //                                         key={child._id}
                        //                                         onClick={() =>
                        //                                             handleClickVoice(
                        //                                                 child.path,
                        //                                                 child._id,
                        //                                                 type._id
                        //                                             )
                        //                                         }
                        //                                         selected={playingVoiceId === child._id}
                        //                                         sx={{
                        //                                             '&:hover': {
                        //                                                 color: "#1791e2",
                        //                                                 backgroundColor: "rgba(248, 248, 248, 0.5)",
                        //                                                 transition: "all 0.3s",
                        //                                             },
                        //                                             '&.Mui-selected': {
                        //                                                 color: "#1791e2",
                        //                                                 backgroundColor: "rgba(248, 248, 248, 0.5)",
                        //                                                 transition: "all 0.3s",
                        //                                             },
                        //                                             '& .MuiListItemIcon-root': {
                        //                                                 color: 'inherit',
                        //                                             }
                        //                                         }}
                        //                                     >
                        //                                         <ListItemIcon>
                        //                                             {playingVoiceId === child._id ? (
                        //                                                 <IconVolume
                        //                                                     fontSize="small"
                        //                                                     className="animate"
                        //                                                 />
                        //                                             ) : (
                        //                                                 <IconVolumeOff fontSize="small" />
                        //                                             )}
                        //                                         </ListItemIcon>
                        //                                         <Typography
                        //                                             sx={{
                        //                                                 overflow: "hidden",
                        //                                                 whiteSpace: "nowrap",
                        //                                                 textOverflow: "ellipsis",
                        //                                                 maxWidth: isMd ? "200px" : "120px",
                        //                                                 display: "inline-block"
                        //                                             }}
                        //                                         >
                        //                                             Hội thoại {child?.name}
                        //                                         </Typography>

                        //                                     </MenuItem>
                        //                                 </Box>
                        //                             </Box>
                        //                         ))}
                        //                     </ul>
                        //                 )}
                        //             </Box>


                        //         </li>
                        //     ))
                        // ) : (
                        //     <Typography p={1}>Không có âm thanh cho tranh</Typography>
                        // )
                        // ) : 
                        filterByTypeVoiceId?.length > 0 ? (
                            filterByTypeVoiceId.map((type) => (
                                <li key={type._id}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            backgroundColor: "white",
                                        }}
                                    >
                                        {type?.voices?.length > 0 && (
                                            <MenuItem
                                                onClick={() => handleClickTypeVoice(type)}
                                                key={type._id}
                                                selected={activeTypeVoiceId === type._id}
                                                sx={{
                                                    '&:hover': {
                                                        color: "#1791e2",
                                                        backgroundColor: "rgba(248, 248, 248, 0.5)",
                                                        transition: "all 0.3s",
                                                    },
                                                    '&.Mui-selected': {
                                                        color: "#1791e2",
                                                        backgroundColor: "rgba(248, 248, 248, 0.5)",
                                                        transition: "all 0.3s",
                                                    },
                                                    '& .MuiListItemIcon-root': {
                                                        color: 'inherit',
                                                    }
                                                }}
                                            >
                                                <ListItemIcon sx={{
                                                    display: { xs: "none", sm: "none", md: "flex" },
                                                }}>
                                                    <IconFlag />
                                                </ListItemIcon>
                                                {type.name}
                                            </MenuItem>
                                        )}
                                        {openVoices === type._id && type?.voices?.length > 0 && (
                                            <ul
                                                style={{
                                                    position: "absolute",
                                                    maxWidth: isMd ? "300px" : "200px",
                                                    backgroundColor: "white",
                                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                                    zIndex: 10,
                                                    right: "100%",
                                                    top: "20%",
                                                    listStyle: "none",
                                                    padding: 0,
                                                    margin: 0,
                                                }}
                                            >
                                                {type?.voices?.map((child) => (
                                                    <Box key={child._id}>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                padding: { xs: 0.5, sm: 0.5, md: 1.5 },
                                                                backgroundColor: "white",
                                                            }}
                                                        >
                                                            <MenuItem
                                                                key={child._id}
                                                                onClick={() =>
                                                                    handleClickVoice(
                                                                        child.path,
                                                                        child._id,
                                                                        type._id
                                                                    )
                                                                }
                                                                selected={playingVoiceId === child._id}
                                                                sx={{
                                                                    '&:hover': {
                                                                        color: "#1791e2",
                                                                        backgroundColor: "rgba(248, 248, 248, 0.5)",
                                                                        transition: "all 0.3s",
                                                                    },
                                                                    '&.Mui-selected': {
                                                                        color: "#1791e2",
                                                                        backgroundColor: "rgba(248, 248, 248, 0.5)",
                                                                        transition: "all 0.3s",
                                                                    },
                                                                    '& .MuiListItemIcon-root': {
                                                                        color: 'inherit',
                                                                    }
                                                                }}
                                                            >
                                                                <ListItemIcon>
                                                                    {playingVoiceId === child._id ? (
                                                                        <IconVolume
                                                                            fontSize="small"
                                                                            className="animate"
                                                                        />
                                                                    ) : (
                                                                        <IconVolumeOff fontSize="small" />
                                                                    )}
                                                                </ListItemIcon>
                                                                <Typography
                                                                    sx={{
                                                                        overflow: "hidden",
                                                                        whiteSpace: "nowrap",
                                                                        textOverflow: "ellipsis",
                                                                        maxWidth: isMd ? "200px" : "120px",
                                                                        display: "inline-block"
                                                                    }}
                                                                >
                                                                    Hội thoại {child?.name}
                                                                </Typography>
                                                            </MenuItem>
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </ul>
                                        )}
                                    </Box>


                                </li>
                            ))
                        ) : (
                            <Typography p={1}>Không có âm thanh cho tranh</Typography>
                        )}

                    {openAddEdit && (
                        <DialogAddEditVoice
                            open={openAddEdit}
                            onClose={handleClose}
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            onSelectedVoice={handleSelectedVoice}
                            isEditMode={selectedEdit ? true : false}
                            isFetching={mutationAdd.isPending || mutationEdit.isPending}
                            publicationsData={publicationsData}
                            filenameDefault={selectedEdit?.name}
                        />
                    )}
                </Menu>
            </>
        );
    }
);

export default MenuAddVoice;