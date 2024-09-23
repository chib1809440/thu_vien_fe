import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Button, CardActions, CardContent, Divider, Grid, Menu, MenuItem, Skeleton, Typography } from '@mui/material';

// project imports
// import BajajAreaChartCard from './BajajAreaChartCard';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import MainCard from '../../../../../ui-component/cards/MainCard';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const SchoolCard = ({ isLoading, dataSchool }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <>
      {isLoading ? (
        <Skeleton variant="rectangular" width='100%' height={500} sx={{ borderRadius: 5 }} />
      ) : (
        <MainCard content={false}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container alignContent="center" justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h4">DANH SÁCH CÁC TRƯỜNG</Typography>
                  </Grid>
                  {/* <Grid item>
                    <MoreHorizOutlinedIcon
                      fontSize="small"
                      sx={{
                        color: theme.palette.primary[200],
                        cursor: 'pointer'
                      }}
                      aria-controls="menu-popular-card"
                      aria-haspopup="true"
                      onClick={handleClick}
                    /> 
                  </Grid> */}
                </Grid>
              </Grid>
     
              {dataSchool?.map((item, index) => (
                <Grid item xs={12}>
                  <Grid container direction="column">
                    <Grid item>
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                          <Typography variant="subtitle1" color="inherit">
                            {item?.object.schoolName} 
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                              <Typography variant="subtitle1" color="inherit">
                              {item?.count} bộ
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Avatar
                                variant="rounded"
                                sx={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: '5px',
                                  backgroundColor: theme.palette.success.light,
                                  color: theme.palette.success.dark,
                                  ml: 2
                                }}
                              >
                                <KeyboardArrowUpOutlinedIcon fontSize="small" color="inherit" />
                              </Avatar>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* <Grid item>
                      <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>
                        10% Profit
                      </Typography>
                    </Grid> */}
                  </Grid>
                  <Divider sx={{ my: 1.5 }} />

                </Grid>
              ))}

            </Grid>
          </CardContent>
          {/* <CardActions sx={{ p: 1.25, pt: 0, justifyContent: 'center' }}>
            <Button size="small" disableElevation>
              Xem tất cả
              <ChevronRightOutlinedIcon />
            </Button>
          </CardActions> */}
        </MainCard>
      )}
    </>
  );
};

SchoolCard.propTypes = {
  isLoading: PropTypes.bool
};

export default SchoolCard;
