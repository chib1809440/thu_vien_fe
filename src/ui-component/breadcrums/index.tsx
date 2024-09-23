import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
export interface IBreadcrumsCustomProps {
    mainProfile?: any;
    profile?: string;
    link?:string;
}

export default function IBreadcrumsCustom({ mainProfile, profile, link, ...props }: IBreadcrumsCustomProps) {
    return (
        <Container>
            <BreadcrumsHeader>
                <Box color="inherit" sx={{ fontSize: '16px', fontWeight: '500', color: '#212121' }}>
                    {mainProfile}
                </Box> 
            </BreadcrumsHeader>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} maxItems={3} aria-label="breadcrumb" sx={{
                background: 'white',
                padding: '3px 25px',
                borderRadius: '12px',
            }}>
                <Link underline="hover" color="inherit" href="#">
                    <HomeIcon />
                </Link>
                <CustomLink underline="hover" color="inherit" href={link}>
                    {profile}
                </CustomLink>
                <Typography color="text.primary">{mainProfile}</Typography>
            </Breadcrumbs>
        </Container>
    );
}
const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    background-color: white;
    padding: 12px 25px;
    border-radius: 12px;
    margin-bottom: 15px;
    align-items: center;
`
const BreadcrumsHeader = styled.div`
  display: flex;
`
const CustomLink = styled(Link)`
    font-weight: 500;
    font-size: 16px;
    line-height: 14px;
    color: #212121;
`