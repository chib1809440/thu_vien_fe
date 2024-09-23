import { useEffect, useRef, useState } from 'react';

// material-ui
import {
    Button,
    Grid
} from '@mui/material';

// project imports
import useAuth from '../../../../hooks/useAuth';

// assets
import { IconLogout } from '@tabler/icons';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
    const { logout } = useAuth();
    const [open] = useState(false);
    /**
     * anchorRef is used on different components and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef<any>(null);
    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('serviceTokenLT');
        } catch (err) {
            console.error(err);
        }
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Grid item>
                <Button variant="outlined" onClick={handleLogout} startIcon={<IconLogout />}>
                    Đăng xuất
                </Button>
            </Grid>
        </>
    );
};

export default ProfileSection;
