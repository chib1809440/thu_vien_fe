import { Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { IconBrandRedux, IconPlus, IconVolume, IconZoomReplace } from '@tabler/icons-react';


type Props = {}

const MenuAddVoice = (props: Props) => {
  return (
    <Menu
    // anchorEl={anchorEl}
    id="account-menu"
    open={true}
    // onClose={handleClose}
    //  onClick={handleClose}
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
    // onClick={handleOpenAddVoiceToDialog}
    >
        <ListItemIcon>
            <IconPlus />
        </ListItemIcon>
        Thêm voice
    </MenuItem>
    <Divider />
    {/* {
    typeVoices?.data?.data?.map((x) => ( */}
    <MenuItem
    // key={x.id}
    // onClick={() => handleChangeVoice(x.id)}
    // style={
    //     x.id === filterTypeVoiceId
    //         ? { backgroundColor: theme.palette.primary.dark, color: 'white' }
    //         : undefined
    // }
    >
        <ListItemIcon
        // style={{
        //     color: x.id === filterTypeVoiceId ? 'white' : 'inherit'
        // }}
        >
            <IconZoomReplace />
        </ListItemIcon>
        Anh - Mỹ
    </MenuItem>
    <Divider />
    {/* {
    myFile?.voices?.filter(x => x.isGeneral === false && x.typeVoiceId === filterTypeVoiceId).map((x, index) => ( */}
    <>
        <MenuItem
        // onClick={() => handleClickVoice(x.link)}
        >

            <ListItemIcon>
                <IconVolume fontSize="small" />
            </ListItemIcon>
            Hội thoại
        </MenuItem>
    </>

    {/* ))
} */}
    {/* {myFile?.voices?.filter(x => x.isGeneral === true && x.typeVoiceId === filterTypeVoiceId).map((x) => ( */}
    <MenuItem
    // key={x.id} onClick={() => handleClickVoice(x.link)}
    >
        <ListItemIcon>
            <IconBrandRedux fontSize="small" />
        </ListItemIcon>
        Chung
    </MenuItem>
    {/* ))} */}
</Menu>
  )
}

export default MenuAddVoice