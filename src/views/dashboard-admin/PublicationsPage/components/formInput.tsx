import React from "react";
import IBreadcrumsCustom from "../../../../ui-component/breadcrums";
import MainCard from "../../../../ui-component/cards/MainCard";
// material-ui
import {
    Autocomplete,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    Input,
    InputLabel,
    TextField,
    TextareaAutosize
} from '@mui/material';

// third party
import { Box } from "@mui/system";
import { Formik } from 'formik';
import * as Yup from 'yup';
import BookTruyenThong from "../../../../assets/images/books/book-truyenthong.jpg";
import { UN_AUTHORIZED } from "../../../../constant/authorization";
import useScriptRef from "../../../../hooks/useScriptRef";
import ButtonGD from "../../../../ui-component/ButtonGD";
import AnimateButton from "../../../../ui-component/extended/AnimateButton";
import { useCreateSupplies } from "../hook/createSuply";
import ModalHocLieu from "./modalAdd/addHoclieu";
import ModalLinhVuc from "./modalAdd/addLinhVuc";
import ModalMonHoc from "./modalAdd/addMonHoc";
import ModalNXB from "./modalAdd/addNXB";
import ModalTacGia from "./modalAdd/addTacGia";
import ModalTuKe from "./modalAdd/addTuKe";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function CreateAccount(props: {
    isSubmit: any;
    isCancel: any;
    dataCabinet: any;
    dataAuthor: any;
    dataProducer: any;
    dataCategory: any;
    dataPrintedMatter: any;
    dataTypeSuply: any;
}) {

    let newCabinet = [{
        label: '',
        id: ''
    }]
    let newAuthor = [{
        label: 'Khác',
        id: 'khac'
    }]
    let newProducer = [{
        label: '',
        id: ''
    }]
    let newCategory = [{
        label: '',
        id: ''
    }]
    let newTypeSuply = [{
        label: '',
        id: ''
    }]
    let newPrintedMatter = [{
        label: '',
        id: ''
    }]

    const scriptedRef = useScriptRef();
    const { hanldCreateSupplies, isSubmit } = useCreateSupplies()
    const [itemCabinet, setdataCabinet] = React.useState<any>([]);
    const [itemAuthor, setdataAuthor] = React.useState<any>([]);
    const [itemProducer, setdataProducer] = React.useState<any>([]);
    const [itemCategory, setdataCategory] = React.useState<any>([]);
    const [itemTypeSuply, setdataTypeSuply] = React.useState<any>([]);

    const [valueCabinet, setValueCabinet] = React.useState<any>([]);
    const [valueAuthor, setValueAuthor] = React.useState<any>([]);
    const [valueProducer, setValueProducer] = React.useState<any>([]);
    const [valueCategory, setValueCategory] = React.useState<any>([]);
    const [valueTypeSuply, setValueTypeSuply] = React.useState<any>([]);
    // const [valuePrintedMatter, setValuePrintedMatter] = React.useState<any>([]);
    const [, setValuePrintedMatter] = React.useState<any>([]);

    const [, setNewAuthor] = React.useState<boolean>(false);
    const [isNewCabin, setNewCabin] = React.useState<boolean>(false);

    const [isOpenTacGia, setOpenTacGia] = React.useState(false);
    const [isOpenLinhVuc, setOpenLinhVuc] = React.useState(false);
    const [isOpenMonHoc, setOpenMonHoc] = React.useState(false);
    const [isOpenLoaiHocLieu, setOpenLoaiHocLieu] = React.useState(false);
    const [isOpenNXB, setOpenNXB] = React.useState(false);
    const [isOpenTuKe, setOpenTuKe] = React.useState(false);


    React.useEffect(() => {
        setNewAuthor(false)
        itemAuthor.forEach((item) => {
            if (item.label === 'Khác') {
                setNewAuthor(true)
            }
        })
    }, [itemAuthor]);

    React.useEffect(() => {
        setNewCabin(false)
        if (itemCabinet?.length !== 0) {
            setNewCabin(true)
        }
        if (itemCabinet?.length === 0 || itemCabinet === null) {
            setNewCabin(false)
        }
    }, [itemCabinet]);

    React.useEffect(() => {
        props.isSubmit(isSubmit)
    }, [isSubmit]);

    const [selectedFile, setSelectedFile] = React.useState();
    const [preview, setPreview] = React.useState('');

    React.useEffect(() => {
        if (!selectedFile) {
            setPreview('');
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl)

    }, [selectedFile])

    const handleImageInput = (e: any) => {
        const file = e.target.files[0];
        const _5MB = 5242880;
        if (file.size > _5MB)
            setSelectedFile(file);
        else {
            setSelectedFile(file);
        }
    }

    React.useEffect(() => {
        props.dataCabinet.forEach((item) =>
            newCabinet.push({
                label: item.position,
                id: item.cabinetId
            }));
        props.dataAuthor.forEach((item) =>
            newAuthor.push({
                label: item.authorName,
                id: item.authorId
            }));
        props.dataCategory.forEach((item) =>
            newCategory.push({
                label: item.categoryName,
                id: item.categoryId
            }));
        props.dataTypeSuply.forEach((item) =>
            newTypeSuply.push({
                label: item.name,
                id: item.id
            }));
        props.dataProducer.forEach((item) =>
            newProducer.push({
                label: item.publisherName,
                id: item.publisherId
            }));
        props.dataPrintedMatter.forEach((item) =>
            newPrintedMatter.push({
                label: item.printedMatterName,
                id: item.printedMatterId
            }));
        setValueProducer(newProducer.slice(1))
        setValueCategory(newCategory.slice(1))
        setValueTypeSuply(newTypeSuply.slice(1))
        setValueAuthor(newAuthor.slice(1))
        setValueCabinet(newCabinet.slice(1))
        setValuePrintedMatter(newPrintedMatter.slice(1))
    }, [props.dataCabinet, props.dataAuthor, props.dataProducer, props.dataCategory, props.dataPrintedMatter, props.dataTypeSuply])

    function handleKeyDown(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    }

    return (
        <>
            <IBreadcrumsCustom profile="QUẢN LÝ ẤN PHẨM" mainProfile="THÊM MỚI ẤN PHẨM" link="/thu-vien/an-pham" />
            <MainCard >
                <Grid height='auto'>
                    <Formik
                        initialValues={{
                            supplyName: '',
                            newAuthor: '',
                            imageSupply: '',
                            supplyNote: '',
                            ISBN: '',
                            quantity: 1,
                            cabinet_quantity: 1,
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            supplyName: Yup.string().max(255).required('Tên ấn phẩm không đuợc trống'),
                            // ISBN: Yup.string().max(13).required('Mã ấn phẩm không đuợc trống'),
                            // newAuthor: Yup.string().max(255).required('Tên tác giả mới không đuợc trống'),
                            quantity: Yup.number().positive('Số lượng phải lớn hơn 0').required('Số lượng không thể để trống'),
                            // cabinet_quantity: Yup.number().positive('Số lượng phải lớn hơn 0').required('Số lượng không thể để trống')
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                await hanldCreateSupplies(values, selectedFile, itemCabinet, itemAuthor, itemProducer, itemCategory, props.dataPrintedMatter, itemTypeSuply)

                                if (scriptedRef.current) {
                                    setStatus({ success: true });
                                    setSubmitting(false);
                                }
                            } catch (err: any) {

                                const errMessage = err && err.message == UN_AUTHORIZED ?
                                    "Lỗi hệ thống !" :
                                    "Lỗi hệ thống";

                                if (scriptedRef.current) {
                                    setStatus({ success: false });
                                    setErrors({ submit: errMessage });
                                    setSubmitting(false);
                                }
                            }
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                            <form noValidate onSubmit={handleSubmit}>
                                <Grid container md={12}>
                                    <Grid md={2} container>
                                        <Grid md={11} sx={{ borderRadius: '10px' }}>
                                            <>
                                                {preview === '' ? <img alt='logo' style={{ borderRadius: '5px' }} width='100%' src={BookTruyenThong} /> : <img alt='logo' style={{ borderRadius: '5px' }} width='100%' src={preview} />}
                                            </>
                                        </Grid>
                                        <Grid md={12} container justifyContent='center'>

                                            <InputLabel sx={{ fontWeight: '700', fontSize: '16px' }} id="upload-photo"> Chọn hình ảnh
                                                <Input type="file" name="photo" id="upload-photo" sx={{ display: 'none' }}
                                                    inputProps={{ accept: 'image/*' }}
                                                    onChange={handleImageInput}
                                                />
                                            </InputLabel>
                                        </Grid>
                                    </Grid>
                                    <Grid md={10}>
                                        <Grid container md={12} gap={2} justifyContent='space-between'>
                                            <Grid md={3.5} xs={12}>
                                                <FormControl fullWidth error={Boolean(touched.supplyName && errors.supplyName)}>
                                                    <TextField
                                                        id="outlined-adornment-supplyName"
                                                        type="text"
                                                        value={values.supplyName}
                                                        name="supplyName"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        inputProps={{}}
                                                        label="Tên ấn phẩm"
                                                        variant="outlined"
                                                    />
                                                    {touched.supplyName && errors.supplyName && (
                                                        <FormHelperText error id="standard-weight-helper-text-supplyName">
                                                            {errors.supplyName}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                            <Grid md={3.5} xs={12}>
                                                <FormControl fullWidth error={Boolean(touched.ISBN && errors.ISBN)}>
                                                    <TextField
                                                        id="outlined-adornment-ISBN"
                                                        type="text"
                                                        value={values.ISBN}
                                                        name="ISBN"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        inputProps={{}}
                                                        label="Mã ấn phẩm ( ISBN )"
                                                        variant="outlined"
                                                    />
                                                    {touched.ISBN && errors.ISBN && (
                                                        <FormHelperText error id="standard-weight-helper-text-ISBN">
                                                            {errors.ISBN}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>

                                            <Grid md={3.5} xs={12} container alignItems='center' justifyContent='space-between'>
                                                <Grid md={9.7}>
                                                    {props.dataCategory?.length === 0 ?
                                                        // <CircularProgress />
                                                        <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
                                                        :
                                                        <FormControl fullWidth >
                                                            <Autocomplete
                                                                fullWidth
                                                                disablePortal
                                                                id="combo-box-Category"
                                                                options={valueCategory}
                                                                multiple
                                                                onChange={(event, newValue) => setdataCategory(newValue)}
                                                                renderInput={(params) => <TextField {...params} label="Chọn Dạng học liệu" />}
                                                            />
                                                        </FormControl>
                                                    }
                                                </Grid>
                                                <Grid md={2}>
                                                    <Button variant="outlined" onClick={() => setOpenLinhVuc(true)}>Thêm</Button>
                                                </Grid>
                                            </Grid>

                                            <Grid md={3.5} xs={12} container alignItems='center' justifyContent='space-between'>
                                                <Grid md={9.7}>
                                                    {props.dataCategory?.length === 0 ?
                                                        // <CircularProgress />
                                                        <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
                                                        :
                                                        <FormControl fullWidth >
                                                            <Autocomplete
                                                                fullWidth
                                                                disablePortal
                                                                id="combo-box-Category"
                                                                options={valueTypeSuply}
                                                                multiple
                                                                onChange={(event, newValue) => setdataTypeSuply(newValue)}
                                                                renderInput={(params) => <TextField {...params} label="Chọn Lĩnh vực" />}
                                                            />
                                                        </FormControl>
                                                    }
                                                </Grid>
                                                <Grid md={2}>
                                                    <Button variant="outlined" onClick={() => setOpenMonHoc(true)}>Thêm</Button>
                                                </Grid>
                                            </Grid>

                                            <Grid md={3.5} xs={12} container alignItems='center' justifyContent='space-between'>
                                                <Grid md={9.7}>
                                                    {props.dataAuthor?.length === 0 ?
                                                        // <CircularProgress />
                                                        <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
                                                        :
                                                        <FormControl fullWidth >
                                                            <Autocomplete
                                                                fullWidth
                                                                disablePortal
                                                                id="combo-box-Author"
                                                                options={valueAuthor}
                                                                multiple
                                                                onChange={(event, newValue) => setdataAuthor(newValue)}
                                                                renderInput={(params) => <TextField {...params} label="Chọn Tác giả" />}
                                                            />
                                                        </FormControl>
                                                    }
                                                </Grid>
                                                <Grid md={2}>
                                                    <Button variant="outlined" onClick={() => setOpenTacGia(true)}>Thêm</Button>
                                                </Grid>
                                            </Grid>
                                            <Grid md={3.5} xs={12} container alignItems='center' justifyContent='space-between'>
                                                <Grid md={9.7}>
                                                    {props.dataProducer?.length === 0 ?
                                                        // <CircularProgress />
                                                        <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
                                                        :
                                                        <FormControl fullWidth >
                                                            <Autocomplete
                                                                fullWidth
                                                                disablePortal
                                                                id="combo-box-Producer"
                                                                options={valueProducer}
                                                                // multiple
                                                                onChange={(event, newValue) => setdataProducer(newValue)}
                                                                renderInput={(params) => <TextField {...params} label="Chọn Nhà xuất bản" />}
                                                            />
                                                        </FormControl>
                                                    }
                                                </Grid>
                                                <Grid md={2}>
                                                    <Button variant="outlined" onClick={() => setOpenNXB(true)}>Thêm</Button>
                                                </Grid>
                                            </Grid>
                                            <Grid md={3.5} xs={12} container alignItems='center' justifyContent='space-between'>
                                                <Grid md={9.7}>
                                                    {props.dataCabinet?.length === 0 ?
                                                        // <CircularProgress />
                                                        <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
                                                        :
                                                        <FormControl fullWidth >
                                                            <Autocomplete
                                                                fullWidth
                                                                disablePortal
                                                                id="combo-box-Cabinet"
                                                                options={valueCabinet}
                                                                // multiple
                                                                onChange={(event, newValue) => setdataCabinet(newValue)}
                                                                renderInput={(params) => <TextField {...params} label="Chọn Tủ - Kệ" />}
                                                            />
                                                        </FormControl>
                                                    }
                                                </Grid>
                                                <Grid md={2}>
                                                    <Button variant="outlined" onClick={() => setOpenTuKe(true)}>Thêm</Button>
                                                </Grid>
                                            </Grid>

                                            <Grid md={3.5} xs={12}>
                                                <Grid container md={12} justifyContent='space-between'>
                                                    <Grid item md={isNewCabin ? 5 : 12}>
                                                        <FormControl fullWidth error={Boolean(touched.quantity && errors.quantity)}>
                                                            <TextField
                                                                id="outlined-adornment-quantity"
                                                                type="number"
                                                                value={values.quantity}
                                                                name="quantity"
                                                                onBlur={handleBlur}
                                                                onChange={handleChange}
                                                                inputProps={{ min: 1 }}
                                                                label="Tổng số lượng"
                                                                variant="outlined"
                                                            />
                                                            {touched.quantity && errors.quantity && (
                                                                <FormHelperText error id="standard-weight-helper-text-quantity">
                                                                    {errors.quantity}
                                                                </FormHelperText>
                                                            )}
                                                        </FormControl>
                                                    </Grid>
                                                    {isNewCabin &&
                                                        <Grid item md={5}>
                                                            <FormControl fullWidth error={Boolean(touched.cabinet_quantity && errors.cabinet_quantity)}>
                                                                <TextField
                                                                    id="outlined-adornment-cabinet_quantity"
                                                                    type="number"
                                                                    value={values.cabinet_quantity}
                                                                    name="cabinet_quantity"
                                                                    onBlur={handleBlur}
                                                                    onChange={handleChange}
                                                                    inputProps={{ min: 1 }}
                                                                    label="Số lượng trên kệ"
                                                                    variant="outlined"
                                                                />
                                                                {touched.cabinet_quantity && errors.cabinet_quantity && (
                                                                    <FormHelperText error id="standard-weight-helper-text-cabinet_quantity">
                                                                        {errors.cabinet_quantity}
                                                                    </FormHelperText>
                                                                )}
                                                            </FormControl>
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Grid>
                                            <Grid md={12} xs={12} mt={1}>
                                                <FormControl fullWidth error={Boolean(touched.supplyNote && errors.supplyNote)}>
                                                    <TextareaAutosize
                                                        id="outlined-adornment-supplyNote"
                                                        value={values.supplyNote}
                                                        name="supplyNote"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        minRows={5}
                                                        style={{ borderRadius: '10px', borderColor: '#616161', minWidth: '500px', padding: 10 }}
                                                        placeholder="   Mô tả"
                                                        aria-label="minimum height"
                                                        minLength={2}
                                                    />
                                                    {touched.supplyNote && errors.supplyNote && (
                                                        <FormHelperText error id="standard-weight-helper-text-supplyNote">
                                                            {errors.supplyNote}
                                                        </FormHelperText>
                                                    )}
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid md={12} xs={12} container sx={{ mt: 2 }} justifyContent='center' gap={3}>
                                    <Grid md={2}>
                                        <AnimateButton>
                                            <ButtonGD title="Thêm mới" color="secondary" disabled={isSubmitting || itemCategory?.length === 0 || itemAuthor?.length === 0 || itemProducer?.length === 0} onKeyDown={handleKeyDown} width="100%" type="submit" />
                                        </AnimateButton>
                                    </Grid>
                                    <Grid md={2}>
                                        <AnimateButton>
                                            <ButtonGD title="Huỷ" isColor disabled={isSubmitting} width="100%"
                                                onClick={() => props.isCancel(0)}
                                            >
                                            </ButtonGD>
                                        </AnimateButton>
                                    </Grid>
                                </Grid>
                                {errors.submit && (
                                    <Box sx={{ mt: 3 }}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Box>
                                )}
                            </form>
                        )}
                    </Formik>
                </Grid>
                <ModalHocLieu isOpen={isOpenLoaiHocLieu} isClose={(value) => setOpenLoaiHocLieu(value)} />
                <ModalTacGia isOpen={isOpenTacGia} isClose={(value) => setOpenTacGia(value)} />
                <ModalLinhVuc isOpen={isOpenLinhVuc} isClose={(value) => setOpenLinhVuc(value)} />
                <ModalMonHoc isOpen={isOpenMonHoc} isClose={(value) => setOpenMonHoc(value)} />
                <ModalNXB isOpen={isOpenNXB} isClose={(value) => setOpenNXB(value)} />
                <ModalTuKe isOpen={isOpenTuKe} isClose={(value) => setOpenTuKe(value)} />
            </MainCard>
        </>

    );
}
