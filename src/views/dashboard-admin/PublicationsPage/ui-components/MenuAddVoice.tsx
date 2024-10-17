import { Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { IconZoomReplace } from "@tabler/icons";
import { IconPlus } from '@tabler/icons-react';
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
    publicationsData?: TPublications,
}

const MenuAddVoice: FC<Props> = ({ anchorEl, onClose, voiceData, publicationsData }) => {
    const [selectedEdit, setSelectedEdit] = useState<TVoice | null>(null);
    const [openAddEdit, setOpenAddEdit] = useState(false);
    const mutationAdd = useAddVoice();
    const mutationEdit = useEditVoice();
    const revalidate = useReFetchVoice();

    const handleOpenAddVoiceToDialog = () => {
        setOpenAddEdit(true);
    };

    const handleClose = () => {
        setOpenAddEdit(false);
        setSelectedEdit(null);
    };

    const handleSubmit = (values: TVoiceCreate) => {
        console.log(values);
        
        if (selectedEdit) {
            mutationEdit.mutate(
                { ...values, _id: selectedEdit._id },
                {
                    onSuccess: () => {
                        revalidate();
                        toast.success('Chỉnh sửa thành công.');
                        handleClose();
                    },
                }
            );
            return;
        }

        mutationAdd.mutate(values, {
            onSuccess: (data) => {
                revalidate();
                toast.success('Thêm thành công.');
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
                file: selectedEdit.file || "",
            };
        }

        return {
            note: "",
            isPublic: true,
            isLink: false,
            file: "",
        };
    }, [selectedEdit]);

    return (
        <>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={onClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem
                    onClick={handleOpenAddVoiceToDialog}
                >
                    <ListItemIcon>
                        <IconPlus size={20} />
                    </ListItemIcon>
                    Thêm voice
                </MenuItem>
                {voiceData?.length > 0 && <Divider />}

                {
                    voiceData?.length > 0 && voiceData.map((voice) => (


                        <MenuItem
                            key={voice._id}
                        >
                            <ListItemIcon >
                                <IconZoomReplace />
                            </ListItemIcon>
                            {(voice?.typeVoiceId as TTypeVoice)?.name}
                        </MenuItem>
                    ))
                }
                {openAddEdit && (
                    <DialogAddEditVoice
                        open={openAddEdit}
                        onClose={handleClose}
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        isEditMode={selectedEdit ? true : false}
                        isFetching={mutationAdd.isPending || mutationEdit.isPending}
                        publicationsData={publicationsData}
                    />
                )}
            </Menu>
        </>
    )
}

export default MenuAddVoice