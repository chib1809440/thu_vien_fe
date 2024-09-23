// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';

// project imports
import SubCard from '../../../ui-component/cards/SubCard';
import MainCard from '../../../ui-component/cards/MainCard';
import SecondaryAction from '../../../ui-component/cards/CardSecondaryAction';
import navigation from '../../../menu-items';
import { gridSpacing } from '../../../store/constant';
// assets
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '../../../ui-component/extended/Breadcrumbs';

// =============================|| UI BREADCRUMB ||============================= //

const UIBreadcrumb = () => {
    const theme = useTheme();

    return (
        <MainCard title="Breadcrumb" secondary={<SecondaryAction link="https://next.material-ui.com/components/breadcrumbs/" />}>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={6}>
                    <SubCard title="Basic">
                        <Breadcrumbs
                            navigation={navigation}
                            sx={{
                                mb: '0px !important',
                                bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50'
                            }}
                        />
                    </SubCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SubCard title="Custom Separator">
                        <Breadcrumbs
                            navigation={navigation}
                            separator={NavigateNextIcon}
                            sx={{
                                mb: '0px !important',
                                bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50'
                            }}
                        />
                    </SubCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SubCard title="With Title">
                        <Breadcrumbs
                            title
                            navigation={navigation}
                            separator={NavigateNextIcon}
                            sx={{
                                mb: '0px !important',
                                bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50'
                            }}
                        />
                    </SubCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SubCard title="Title Bottom">
                        <Breadcrumbs
                            title
                            titleBottom
                            navigation={navigation}
                            separator={NavigateNextIcon}
                            sx={{
                                mb: '0px !important',
                                bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50'
                            }}
                        />
                    </SubCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SubCard title="With Icons">
                        <Breadcrumbs
                            title
                            icons
                            navigation={navigation}
                            separator={NavigateNextIcon}
                            sx={{
                                mb: '0px !important',
                                bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50'
                            }}
                        />
                    </SubCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SubCard title="Only Dashboard Icons">
                        <Breadcrumbs
                            title
                            icon
                            navigation={navigation}
                            separator={NavigateNextIcon}
                            sx={{
                                mb: '0px !important',
                                bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50'
                            }}
                        />
                    </SubCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SubCard title="Collapsed Breadcrumbs">
                        <Breadcrumbs
                            title
                            maxItems={2}
                            navigation={navigation}
                            separator={NavigateNextIcon}
                            sx={{
                                mb: '0px !important',
                                bgcolor: theme.palette.mode === 'dark' ? 'dark.main' : 'grey.50'
                            }}
                        />
                    </SubCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SubCard title="No Card with Divider">
                        <Breadcrumbs title navigation={navigation} separator={NavigateNextIcon} card={false} />
                    </SubCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SubCard title="No Card & No Divider">
                        <Breadcrumbs title navigation={navigation} separator={NavigateNextIcon} card={false} divider={false} />
                    </SubCard>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default UIBreadcrumb;
