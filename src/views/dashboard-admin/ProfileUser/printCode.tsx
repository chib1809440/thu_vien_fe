import { Grid, Typography } from '@mui/material';
import React, { useRef } from 'react';
import Barcode from 'react-barcode';
import ReactToPrint from 'react-to-print';
import AnimateButton from '../../../ui-component/extended/AnimateButton';
// import logo from 'assets/logoGDVN.png'
import ButtonGD from '../../../ui-component/ButtonGD';
// import logoNam from './nam.png';


export default function Invoice(props: {
    [x: string]: any;
    data: any;
    selectUser: any;
    isCancel: any;
    getContactSchool: any;
}) {
    const componentRef: React.Ref<HTMLDivElement> = useRef(null);

    const [data, setData] = React.useState<any>(null);

    React.useEffect(() => {
        let newData: any[] = []; // add type annotation here
        props.selectUser.forEach((item: any) => {
            newData.push(props.data.find((item2: any) => item2.userID === item));
        });
        if (props.selectUser?.length === 0) {
            setData(props.data);

        } else {
            setData(newData);
        }
    }, [props.data, props.selectUser]);

    function handleClose() {
        props.isCancel(0);
    }

    return (
        <Grid container justifyContent="center">
            <Grid container xs={12} md={12} ref={componentRef}>
                <Grid height='70px' mt={1} ml={1}>
                    <Typography variant="h4" sx={{ textAlign: 'center' }}>Mã vạch thành viên</Typography>
                </Grid>
                {data !== null &&
                    <Grid container md={12} justifyContent='space-around' gap={6}>
                        {data.map((item: any, index: number) => (
                            <Grid container justifyContent='center' alignItems='center' xs={5} sx={{ border: '1px dotted gray' }} p={2} height='200px'>
                                <Grid md={10} xs={10} container alignItems='center' gap={2} height='50px'>
                                    <Grid md={2} xs={2}>
                                        {props.getContactSchool?.imageLogo !== undefined ?
                                            <img src={`${process.env.REACT_APP_BASE_API_URL}/${props.getContactSchool?.imageLogo}`} width='50px' alt="logo trường" />
                                            :
                                            <img src={`${process.env.REACT_APP_BASE_API_URL}/default-logo.png`} width='50px' alt="logo trường" />
                                        }
                                    </Grid>
                                    <Grid md={9} xs={9} container justifyContent='center'>
                                        <Typography width='100%' textAlign='center' fontSize={16} fontWeight={900}>{props.getContactSchool?.nameContact}</Typography>
                                        {/* <Typography width='100%' textAlign='center' fontSize={16} fontWeight={900}>PHẦN MỀM THƯ VIỆN</Typography> */}
                                        {/* <Typography width='100%' textAlign='center' fontSize={16} fontWeight={900}>{props.getContactSchool?.nameContact}</Typography> */}
                                        <Typography width='100%' textAlign='center' fontSize={14} fontWeight={700}>THẺ THƯ VIỆN</Typography>
                                    </Grid>
                                </Grid>
                                <Grid mt={2} md={10} xs={10} container height='150px'>
                                    <Grid md={4} xs={4}>
                                        {/* {item?.imageUser !== null && item?.imageUser !== 'default_image.jpg' ?
                                            <img style={{ borderRadius: '5px', maxHeight: '110px' }} width='80px' src={`${process.env.REACT_APP_BASE_API_URL}/${item?.imageUser}`} alt="ảnh thành viên" />
                                            :
                                            // <img src='https://tiemanhsky.com/wp-content/uploads/2020/03/61103071_2361422507447925_6222318223514140672_n_1.jpg' width='80px' />
                                            <>
                                                {item?.gender === '0' ?
                                                    <img style={{ borderRadius: '5px' }} width='80px' src={logoNam} alt="ảnh thành viên" />
                                                    :
                                                    <img style={{ borderRadius: '5px' }} width='80px' src={logoNu} alt="ảnh thành viên" />
                                                }
                                            </>
                                        } */}
                                        <Grid container justifyContent='center' alignItems='center' width='90px' height='110px' sx={{ border: '1px solid gray' }}>
                                            Ảnh 3X4
                                        </Grid>
                                    </Grid>
                                    <Grid md={8} xs={8} container justifyContent='center' height='100px'>
                                        <Typography height='25px' textAlign='center' width='100%' fontSize={18} fontWeight={900}>{item?.fullName}</Typography>
                                        <Typography height='25px' textAlign='center' width='100%' fontSize={18} fontWeight={900}>{item?.class}</Typography>
                                        <Barcode value={item?.userID} width={1} height={40} fontSize={10} background='none' marginTop={2} />
                                    </Grid>
                                </Grid>

                                {/* <Typography variant="h4" sx={{ textAlign: 'center', width: '100%' }}>{item?.fullName}</Typography>
                                <Barcode value={item?.userID} /> */}
                            </Grid>
                        ))}
                    </Grid>
                }

            </Grid>
            <Grid item xs={12} md={10} lg={8}>
                <Grid
                    container
                    spacing={1}
                    justifyContent="center"
                    sx={{
                        maxWidth: 850,
                        mx: 'auto',
                        mt: 0,
                        mb: 2.5,
                        '& > .MuiCardContent-root': {
                            py: { xs: 3.75, md: 5.5 },
                            px: { xs: 2.5, md: 5 }
                        }
                    }}
                >
                    <Grid container justifyContent='center' gap={3} mt={2}>
                        <AnimateButton>
                            <ReactToPrint trigger={() => <ButtonGD title='In mã vạch'></ButtonGD>} content={() => componentRef.current} />
                        </AnimateButton>
                        <ButtonGD title='Quay lại' onClick={handleClose} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>

    );
};
