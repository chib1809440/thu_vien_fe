import ReplayIcon from '@mui/icons-material/Replay';
import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainCard from "../../../ui-component/cards/MainCard";
import sachSimple from '../../../assets/images/books/book-truyenthong.jpg';
import ModalViewDetails from './ModalView';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import ButtonGD from '../../../ui-component/ButtonGD';

// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function DetailProduct() {
  const history = useNavigate();
  const location = useLocation()
  const [dataDetails, setDataDetails] = React.useState<any>(null);

  React.useEffect(() => {
    setDataDetails(location?.state)
  }, [location])

  React.useEffect(() => {
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      video.setAttribute('controlsList', 'nodownload');
    });
  }, []); // Chạy chỉ một lần sau khi component được mount

  const typeFile = dataDetails?.listMedia?.[0]?.['url'].slice(-3);

  const docs = [
    {
      uri: `${process.env.REACT_APP_BASE_API_URL}${dataDetails?.listMedia?.[0]?.['url']}`,
      fileType: typeFile,
      fileName: `${process.env.REACT_APP_BASE_API_URL}/${dataDetails?.listMedia?.[0]?.['url']}`
    },
  ];

  const [isOpen, setOpen] = React.useState<any>(false);

  function checkUrl() {
    if (dataDetails?.listMedia !== null || dataDetails !== null) {
      let lastChar = dataDetails?.listMedia?.[0]?.['url'].slice(-4);

      if (lastChar === '.mp4') {
        return <video controls width='500px' style={{ borderRadius: '5px' }}>
          <source src={`${process.env.REACT_APP_BASE_API_URL}/${dataDetails?.listMedia?.[0]?.['url']}?autoplay=1`} type="video/mp4" />
        </video >
        // <iframe width='100%' height='auto' style={{ minHeight: '515px' }} src={`${process.env.REACT_APP_BASE_API_URL}/${dataDetails?.listMedia[0]['url']}?autoplay=1`} allowFullScreen allow='autoplay' title="Video" />
      }
      if (lastChar === '.mp3') {
        return <audio controls style={{ borderRadius: '5px' }}>
          <source src={`${process.env.REACT_APP_BASE_API_URL}/${dataDetails?.listMedia?.[0]?.['url']}?autoplay=1`} type="video/mp4" />
        </audio >
      }
      if (lastChar === '.pdf') {
        return <>
          <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} style={{ height: 325 }}
           config={{
            header: {
                disableHeader: true,
            },
            csvDelimiter: ",", // "," as default,
            pdfZoom: {
                defaultZoom: 5.5, // 1 as default.
                zoomJump: 0.1 // 0.1 as default,
            },
            pdfVerticalScrollByDefault: false, // false as default
        }}/>
        </>
      }
      // if (lastChar === '.ppt') {
      //   return <>
      //     <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} style={{ height: 325 }}
      //       config={{
      //         header: {
      //           disableHeader: true,
      //         }
      //       }} />
      //   </>
      // }
      if (lastChar === 'docx') {
        return <>
          <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} style={{ height: 325 }}
            config={{
              header: {
                disableHeader: true,
              }
            }} />
        </>
      }
      if (lastChar === '.png' || lastChar === '.jpg' || lastChar === '.jpeg') {
        return <img style={{ borderRadius: '5px', maxWidth: '400px' }} width='100%' src={`${process.env.REACT_APP_BASE_API_URL}/${dataDetails?.listMedia?.[0]?.['url']}`} alt="ảnh ấn phẩm" />
      }
    } else {
      return <img style={{ borderRadius: '5px' }} width='100%' src={sachSimple} alt="ảnh ấn phẩm" />
    }
  }

  return (
    <>
      {/* <IBreadcrumsCustom profile="Ấn phẩm" mainProfile="Chi tiết ấn phẩm" link="/thu-vien/an-pham" /> */}
      <MainCard title="Chi tiết ấn phẩm">
        <ModalViewDetails isOpen={isOpen} isClose={(e) => setOpen(e)} docs={docs} />
        <Grid container md={12} xs={12} justifyContent='space-around' position='relative'>
          <Grid md='auto' xs={12}>
            <Grid paddingBottom='1rem'>
              {dataDetails?.listMedia !== null && dataDetails !== null ?
                checkUrl()
                :
                // <img style={{ borderRadius: '5px' }} width='100%' src={sachSimple} alt="ảnh ấn phẩm" />
                <img style={{ borderRadius: '5px', maxWidth: '400px' }} width='100%' src={sachSimple} alt="ảnh ấn phẩm" />
              }
            </Grid>
            {typeFile === 'pdf' &&
              <ButtonGD title='Xem Chi tiết' onClick={() => setOpen(true)} />
            }
          </Grid>
          <Grid md={5} xs={12}>
            <Typography fontSize='32px' fontWeight={900}>{dataDetails?.supplyName}</Typography>
            <Grid container gap={2} mt={2}>
              <Typography fontSize='20px' fontWeight={500} width='130px'>Dạng học liệu: </Typography>
              {dataDetails?.category?.list.map((item) => (
                <Typography fontSize='20px'>{item?.categoryName} </Typography>
              ))}
            </Grid>
            <Grid container gap={2}>
              <Typography fontSize='20px' fontWeight={500} width='130px' >Tác giả: </Typography>
              {dataDetails?.authors?.list.map((item) => (
                <Typography fontSize='20px'>{item?.authorName} </Typography>
              ))}
            </Grid>
            <Grid container gap={2}>
              <Typography fontSize='20px' fontWeight={500} width='130px' >Nhà xuất bản: </Typography>
              <Typography fontSize='20px'>{dataDetails?.publisher?.publisherName} </Typography>
            </Grid>
            <Grid container gap={2}>
              <Typography fontSize='20px' fontWeight={500} width='130px' >Số lượng: </Typography>
              <Typography fontSize='20px'>{dataDetails?.quantity} </Typography>
            </Grid>
            <Grid container gap={2} mt={2}>
              <Typography fontSize='22px' fontWeight={500} width='130px' >Giới thiệu: </Typography>
              <Typography fontSize='20px'>{dataDetails?.supplyNote}</Typography>
            </Grid>
          </Grid>
          <Button variant="outlined" endIcon={<ReplayIcon />} onClick={() => history(-1)} sx={{ position: 'absolute', bottom: -10, right: 0 }}>
            Quay lại
          </Button>
        </Grid>
        {/* <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} style={{height:925}}/> */}

      </MainCard>
    </>

  );
}
