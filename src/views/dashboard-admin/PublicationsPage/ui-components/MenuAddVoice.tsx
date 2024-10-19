import { Box, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { IconFlag, IconPlus, IconVolume, IconVolumeOff } from "@tabler/icons-react";
import { FC, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAddVoice, useEditVoice } from "../../../../hooks/services/voice/voice-mutation";
import { useReFetchVoice } from "../../../../hooks/services/voice/voice-query";
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
};

const MenuAddVoice: FC<Props> = ({
    anchorEl,
    onClose,
    voiceData,
    publicationsData,
    typeVoiceData,
}) => {
    const [selectedEdit, setSelectedEdit] = useState<TVoice | null>(null);
    const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const mutationAdd = useAddVoice();
    const mutationEdit = useEditVoice();
    const revalidate = useReFetchVoice();
    const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
    const [hoveredTypeId, setHoveredTypeId] = useState<string | null>(null);

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
                name: selectedEdit.name,
            };
        }

        return {
            note: "",
            isPublic: true,
            isLink: false,
            file: null,
            typeVoiceId: null,
            isPrivate: "false" as unknown as boolean,
            name: "",
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

    const filterByTypeVoiceId = typeVoiceData?.map((typeVoice) => {
        return {
            ...typeVoice,
            voices: voiceData.filter((voice) => (voice.typeVoiceId as TTypeVoice)?._id === (typeVoice as TTypeVoice)?._id),
        };
    });

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
                        mt: 1.5,
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
                {filterByTypeVoiceId?.length > 0 && <Divider sx={{ margin: 0 }} />}

                {filterByTypeVoiceId?.map((type) => (
                    <li
                        key={type._id}
                        onMouseEnter={() => setHoveredTypeId(type._id)}
                        onMouseLeave={() => setHoveredTypeId(null)}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: 1,
                                backgroundColor: "white",
                                transition: "all 0.3s",
                                "&:hover": {
                                    color: "#1791e2",
                                    backgroundColor: "rgba(248, 248, 248, 0.5)",
                                },
                            }}
                        >
                            <MenuItem key={type._id} selected={playingVoiceId === type._id}>
                                <ListItemIcon>
                                    <IconFlag />
                                </ListItemIcon>
                                {type?.name}
                            </MenuItem>
                        </Box>

                        {hoveredTypeId === type._id && type?.voices?.length > 0 && (
                            <ul
                                style={{
                                    position: "absolute",
                                    minWidth: "300px",
                                    backgroundColor: "white",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    zIndex: 10,
                                    right: "100%",
                                    top: "29%",
                                    listStyle: "none",
                                    padding: 0,
                                    margin: 0,
                                }}
                            >
                                {type?.voices?.map((child) => (
                                    <Box
                                        key={child._id}
                                        onMouseEnter={() => setHoveredTypeId(type._id)}
                                        onMouseLeave={() => setHoveredTypeId(null)}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: 1.5,
                                                backgroundColor: "white",
                                                transition: "all 0.3s",
                                                "&:hover": {
                                                    color: "#1791e2",
                                                    backgroundColor: "rgba(248, 248, 248, 0.5)",
                                                },
                                            }}
                                        >
                                            <MenuItem
                                                key={child._id}
                                                onClick={() =>
                                                    handleClickVoice(child.path, child._id)
                                                }
                                                selected={playingVoiceId === child._id}
                                            >
                                                <ListItemIcon>
                                                    {playingVoiceId === child._id ? (
                                                        <IconVolume fontSize="small" className="animate" />
                                                    ) : (
                                                        <IconVolumeOff fontSize="small" />
                                                    )}
                                                </ListItemIcon>
                                                Hội thoại {child.name}
                                            </MenuItem>
                                        </Box>
                                    </Box>
                                ))}
                            </ul>
                        )}
                    </li>
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
            </Menu>
        </>
    );
};

export default MenuAddVoice;
