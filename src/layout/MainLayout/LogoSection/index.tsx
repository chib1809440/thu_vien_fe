import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Link } from '@mui/material';

// project imports
import { DEFAULT_PAGE_PATH } from '../../../config';
import Logo from '../../../ui-component/Logo';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
    <Link component={RouterLink} to={DEFAULT_PAGE_PATH}>
        <Logo />
    </Link>
);

export default LogoSection;
