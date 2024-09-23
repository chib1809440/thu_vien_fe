// material-ui
import { styled } from '@mui/material/styles';

// project imports
import ContactCard from './ContactCard';

// assets
import headerBackground from '../../../../assets/images/landing/header-bg.jpg';
import AppBar from '../../../ui-component/extended/AppBar';

const HeaderWrapper = styled('div')(({ theme }) => ({
    backgroundImage: `url(${headerBackground})`,
    backgroundSize: '100% 600px',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    textAlign: 'center',
    paddingTop: 30,
    [theme.breakpoints.down('md')]: {
        paddingTop: 0
    }
}));

// ============================|| CONTACT US MAIN ||============================ //

const ContactUsPage = () => (
    <HeaderWrapper>
        <AppBar />
        <ContactCard />
    </HeaderWrapper>
);

export default ContactUsPage;
