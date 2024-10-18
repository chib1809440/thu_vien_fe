import { Box, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { IconZoomReplace } from "@tabler/icons";
import { IconPlus, IconVolume, IconVolumeOff } from "@tabler/icons-react";
import { FC, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAddVoice, useEditVoice } from "../../../../hooks/services/voice/voice-mutation";
import { useReFetchVoice } from "../../../../hooks/services/voice/voice-query";
import { TPublications } from "../../../../types/models/publications.type";
import { TTypeVoice } from "../../../../types/models/type-voice";
import { TVoice, TVoiceCreate } from "../../../../types/models/voice";
import DialogAddEditVoice from "./DialogAddEditVoice";
import { ChevronRight } from "@mui/icons-material";
import { TApiMultipleRecords } from "../../../../types/api/api.type";

type Props = {
    anchorEl?: HTMLElement | null;
    onClose?: () => void;
    voiceData: TVoice[];
    publicationsData?: TPublications;
    typeVoiceData?: TApiMultipleRecords<TTypeVoice>;
};

const MenuAddVoice: FC<Props> = ({ anchorEl, onClose, voiceData, publicationsData }) => {
    const [selectedEdit, setSelectedEdit] = useState<TVoice | null>(null);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const mutationAdd = useAddVoice();
    const mutationEdit = useEditVoice();
    const revalidate = useReFetchVoice();
    const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

    const handleOpenAddVoice = () => {
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSelectedVoice = (row: TVoice) => {
        setSelectedEdit(row);
    };

    const handleSubmit = (values: TVoiceCreate) => {
        console.log(values);

        if (selectedEdit) {
            mutationEdit.mutate(
                { ...values, _id: selectedEdit._id },
                {
                    onSuccess: () => {
                        revalidate();
                        toast.success("Chỉnh sửa thành công.");
                        handleClose();
                    },
                }
            );
            return;
        }

        mutationAdd.mutate(values, {
            onSuccess: (data) => {
                revalidate();
                toast.success("Thêm thành công.");
                setOpenAddEdit(false);
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
                name: selectedEdit.name
            };
        }

        return {
            note: "",
            isPublic: true,
            isLink: false,
            file: null,
            typeVoiceId: null,
            isPrivate: "false" as unknown as boolean,
            name: ""
        };
    }, [selectedEdit]);

    const handleClickVoice = (audioUrl: string, voiceId: string) => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        const newAudio = new Audio(`${process.env.REACT_APP_BASE_API_FILE_URL}/${audioUrl}`);
        newAudio.play();
        setCurrentAudio(newAudio);
        setPlayingVoiceId(voiceId);
    };

    const privateVoices = voiceData.filter(voice => voice.isPrivate);
    const publicVoices = voiceData.filter(voice => !voice.isPrivate);

    const [isHover, setIsHover] = useState<boolean>(false);

    const handleMouseEnter = () => setIsHover(true);
    const handleMouseLeave = () => setIsHover(false);

    console.log(voiceData);

    const filterByTypeVoiceId = (typeVoiceId: TTypeVoice | string) => {
        return voiceData.filter(voice => voice.typeVoiceId === typeVoiceId);
    };

    return (
        <>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={onClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleOpenAddVoice}>
                    <ListItemIcon>
                        <IconPlus size={20} />
                    </ListItemIcon>
                    Thêm voice
                </MenuItem>
                {voiceData?.length > 0 && <Divider />}

                {voiceData?.length > 0 &&
                    voiceData.map((voice) => (
                        <MenuItem
                            key={voice._id}
                            selected={playingVoiceId === voice._id}
                        >
                            <ListItemIcon>
                                <IconZoomReplace />
                            </ListItemIcon>
                            {(voice?.typeVoiceId as TTypeVoice)?.name}
                        </MenuItem>
                    ))}
                {voiceData?.length > 0 && <Divider />}

                {privateVoices.map((x, index) => (
                    <MenuItem key={x._id} onClick={() => handleClickVoice(x.path, x._id)} selected={playingVoiceId === x._id}>
                        <ListItemIcon>
                            {playingVoiceId === x._id ? (
                                <IconVolume fontSize="small" className="animate" />
                            ) : (
                                <IconVolumeOff fontSize="small" />
                            )}
                        </ListItemIcon>
                        Hội thoại riêng {index + 1}
                    </MenuItem>
                ))}

                {privateVoices.length > 0 && <Divider />}

                {publicVoices.map((x, index) => (
                    <MenuItem key={x._id} onClick={() => handleClickVoice(x.path, x._id)} selected={playingVoiceId === x._id}>
                        <ListItemIcon>
                            {playingVoiceId === x._id ? (
                                <IconVolume fontSize="small" className="animate" />
                            ) : (
                                <IconVolumeOff fontSize="small" />
                            )}
                        </ListItemIcon>
                        Hội thoại chung {index + 1}
                    </MenuItem>
                ))}
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
                {
                    voiceData?.length > 0 && voiceData.map((voice) => {
                        const typeVoiceId = voice.typeVoiceId as TTypeVoice;
                        const filteredVoices = filterByTypeVoiceId(typeVoiceId);

                        return (
                            <li key={voice._id} style={{ position: 'relative' }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: 1.5,
                                        backgroundColor: 'white',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            color: '#db0006',
                                            backgroundColor: 'rgba(219, 0, 6, 0.1)',
                                        },
                                    }}
                                >
                                    <MenuItem
                                        key={voice._id}
                                        selected={playingVoiceId === voice._id}
                                    >
                                        <ListItemIcon>
                                            <IconZoomReplace />
                                        </ListItemIcon>
                                        {typeVoiceId?.name || typeVoiceId}
                                    </MenuItem>
                                    {filteredVoices.length > 0 && <ChevronRight />}
                                </Box>

                                {filteredVoices.length > 0 && (
                                    <ul
                                        style={{
                                            position: 'absolute',
                                            width: '300px',
                                            backgroundColor: 'white',
                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                            zIndex: 10,
                                            right: '100%',
                                            top: 0,
                                            display: isHover ? 'block' : 'none',
                                        }}
                                    >
                                        {filteredVoices.map((child) => (

                                            <li key={child._id} style={{ position: 'relative' }}
                                                onMouseEnter={handleMouseEnter}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        padding: 1.5,
                                                        backgroundColor: 'white',
                                                        transition: 'all 0.3s',
                                                        '&:hover': {
                                                            color: '#db0006',
                                                            backgroundColor: 'rgba(219, 0, 6, 0.1)',
                                                        },
                                                    }}
                                                >
                                                    <span>{child?.name || child}</span>
                                                </Box>
                                            </li>

                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}

            </Menu>
        </>
    );
};

export default MenuAddVoice;