import ReplayIcon from '@mui/icons-material/Replay';
import { Button, Grid, Pagination, Typography } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { dispatch, useSelector } from "../../../store";
import { getSuppliesWaiting } from "../../../store/slices/supplies";
import MainCard from "../../../ui-component/cards/MainCard";
import usePagination from "./hook/usePagination";
import sachSimple from './sach-simple.png';

// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function DetailProduct() {

  const location = useLocation()
  const navigate = useNavigate();

  let dataCategoryFilter: any = []
  let dataCabinetFilter: any = []
  let dataProducerFilter: any = []
  let dataTypeOfSupplyFilter: any = []
  let dataPrintedMatterFilter: any = []
  let dataAuthorFilter: any = []

  const [dataDetails, setDataDetails] = React.useState<any>([]);
  const [url, setUrl] = React.useState('');
  const [dataSupplies, setDataSupplies] = React.useState<any>([]);
  let [page, setPage] = React.useState(1);
  const PER_PAGE = 24;

  const { getSupplies } = useSelector((state) => state.getSupplies);
  React.useEffect(() => {
    dispatch(getSuppliesWaiting());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    setDataSupplies(getSupplies);
  }, [getSupplies, location, url]);

  React.useEffect(() => {
    if (location?.state.categoryId !== undefined) {
      setUrl('quan-ly-danh-muc/dang-hoc-lieu')
    }
    if (location?.state.cabinetId !== undefined) {
      setUrl('/quan-ly-danh-muc/tu-ke')
    }
    if (location?.state.authorId !== undefined) {
      setUrl('/quan-ly-danh-muc/tac-gia')
    }
    if (location?.state.printedMatterId !== undefined) {
      setUrl('/quan-ly-danh-muc/dang-hoc-lieu')
    }
    if (location?.state.publisherId !== undefined) {
      setUrl('/quan-ly-danh-muc/nha-san-xuat')
    }
    if (location?.state.categoryId === undefined && location?.state.cabinetId === undefined && location?.state.authorId === undefined && location?.state.printedMatterId === undefined && location?.state.publisherId === undefined) {
      setUrl('/trang-chu')
    }
  }, [location]);

  React.useEffect(() => {
    if (location?.state.categoryId !== undefined) {
      for (let i = 0; i < dataSupplies?.length; i++) {
        for (let j = 0; j < dataSupplies[i]?.category?.list?.length; j++) {
          if (dataSupplies[i]?.category?.list[j]?.categoryId === location?.state.categoryId) {
            dataCategoryFilter.push(dataSupplies[i])
          }
        }
      }
      setDataDetails(dataCategoryFilter)
    }
    // 
    if (location?.state.cabinetId !== undefined) {
      for (let i = 0; i < dataSupplies?.length; i++) {
        if (dataSupplies[i]?.cabinets?.cabinetId === location?.state.cabinetId) {
          dataCabinetFilter.push(dataSupplies[i])
        }
      }
      setDataDetails(dataCabinetFilter)
    }
    // 
    if (location?.state.publisherId !== undefined) {
      for (let i = 0; i < dataSupplies?.length; i++) {
        if (dataSupplies[i]?.publisher?.publisherId === location?.state.publisherId) {
          dataProducerFilter.push(dataSupplies[i])
        }
      }
      setDataDetails(dataProducerFilter)
    }
    // if (location?.state !== undefined) {
    //   for (let i = 0; i < dataSupplies?.length; i++) {
    //     if (dataSupplies[i]?.typeOfSupply?.id === location?.state.id) {
    //       dataTypeOfSupplyFilter.push(dataSupplies[i])
    //     }
    //   }
    //   setDataDetails(dataTypeOfSupplyFilter)
    // }
    // 
    if (location?.state.printedMatterId !== undefined) {
      for (let i = 0; i < dataSupplies?.length; i++) {
        if (dataSupplies[i]?.printedMatter?.printedMatterId === location?.state.printedMatterId) {
          dataPrintedMatterFilter.push(dataSupplies[i])
        }
      }
      setDataDetails(dataPrintedMatterFilter)
    }
    // 
    if (location?.state.authorId !== undefined && location?.state.authorId !== null) {
      for (let i = 0; i < dataSupplies?.length; i++) {
        for (let j = 0; j < dataSupplies[i]?.authors?.list?.length; j++) {
          if (dataSupplies[i]?.authors?.list[j]?.authorId === location?.state.authorId) {
            dataAuthorFilter.push(dataSupplies[i])
          }
        }
      }
      setDataDetails(dataAuthorFilter)
    }
    // 
    if (location?.state.id !== undefined && location?.state.id !== null) {
      for (let i = 0; i < dataSupplies?.length; i++) {
        for (let j = 0; j < dataSupplies[i]?.typeOfSupply?.length; j++) {
          if (dataSupplies[i]?.typeOfSupply?.[j]?.id === location?.state.id) {
            dataTypeOfSupplyFilter.push(dataSupplies[i])
          }
        }
      }
      setDataDetails(dataTypeOfSupplyFilter)
    }

  }, [location, getSupplies, url, dataSupplies])

  const count = Math.ceil(dataDetails?.length / PER_PAGE);

  const _DATA = usePagination(dataDetails, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <>
      {
        dataDetails?.length !== 0 ?
          <>
            {/* <IBreadcrumsCustom profile="Ấn phẩm" mainProfile="Chi tiết ấn phẩm" link="/thu-vien/an-pham" /> */}
            <MainCard title="Chi tiết danh mục">
              <Grid container md={12} xs={12} justifyContent='space-around' flexWrap='wrap' position='relative' gap={3}>
                {_DATA.currentData()?.map((items) => (
                  <Grid container lg={2} md={3.3} justifyContent='center' alignItems='center' gap={2} padding={2} sx={{
                    '&:hover': {
                      transform: 'scale(1.01)',
                      cursor: 'pointer',
                    },
                    boxShadow: 'rgba(0, 0, 0, 0.15) 0px 5px 5px'
                  }}
                    onClick={() => navigate('/chi-tiet-hoc-lieu', { state: items })}
                  >
                    <Grid xs={12} container justifyContent='center' alignItems='center'>
                      {items.listMedia !== null ?
                        <img width='100%' style={{borderRadius:'5px'}} src={`${process.env.REACT_APP_BASE_API_URL}/${items?.listMedia[items?.listMedia.length - 1]['url']}`} alt="ảnh ấn phẩm" />
                        :
                        <img width='100%' style={{borderRadius:'5px'}} src={sachSimple} alt="ảnh ấn phẩm" />
                      }
                    </Grid>
                    <Grid xs={12}>
                      <Typography textAlign='center' fontSize='20px' fontWeight={900}>{items?.supplyName}</Typography>
                      <Typography fontSize='16px' fontWeight={500}>Tác giả: {items?.authors?.list.map((authorItem) => (authorItem?.authorName))}</Typography>
                      <Typography fontSize='16px' fontWeight={500}>Nguồn: {items?.printedMatter?.printedMatterName}</Typography>
                    </Grid>
                  </Grid>
                ))}
                <Button variant="outlined" endIcon={<ReplayIcon />} onClick={() => navigate(-1)} sx={{ position: 'absolute', top: -80, right: 0 }}>
                  Quay lại
                </Button>

              </Grid>
              <Grid container justifyContent='center' mt={2}>
                <Pagination count={count}
                  size="large"
                  page={page}
                  variant="outlined"
                  shape="rounded"
                  onChange={handleChange} />
              </Grid>
            </MainCard>
          </>
          :
          <>
            <Grid container justifyContent='center' mt={5}>
              <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
              {/* <CircularProgress /> */}
              <Grid width='100%' container justifyContent='center' mt={3}>
                <Button variant="outlined" endIcon={<ReplayIcon />} onClick={() => navigate(-1)} >
                  Quay lại
                </Button>
              </Grid>
            </Grid>
          </>
      }
    </>
  );
}
