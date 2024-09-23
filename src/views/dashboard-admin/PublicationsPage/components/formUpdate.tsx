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
import { UN_AUTHORIZED } from "../../../../constant/authorization";
import useScriptRef from "../../../../hooks/useScriptRef";
import ButtonGD from "../../../../ui-component/ButtonGD";
import AnimateButton from "../../../../ui-component/extended/AnimateButton";
import { useUpdateSupplies } from "../hook/updateSuply";
import ModalHocLieu from "./modalAdd/addHoclieu";
import ModalLinhVuc from "./modalAdd/addLinhVuc";
import ModalMonHoc from "./modalAdd/addMonHoc";
import ModalNXB from "./modalAdd/addNXB";
import ModalTacGia from "./modalAdd/addTacGia";
import ModalTuKe from "./modalAdd/addTuKe";
// ==============================|| TABLE - STICKY HEADER ||===========
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function CreateAccount(props: {
    isSubmit: any;
    isCancel: any;
    isError: any;
    dataUpdate: any;
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
        label: '',
        id: '',
        idv2: ''
    }]
    let newTypeSuply = [{
        label: '',
        id: ''
    }]
    let newProducer = [{
        label: '',
        id: ''
    }]
    let newCategory = [{
        label: '',
        id: '',
        idv2: ''
    }]
    let newPrintedMatter = [{
        label: '',
        id: ''
    }]

    let newCabinetV1 = [{
        label: '',
        id: ''
    }]
    let newAuthorV1 = [{
        label: '',
        id: '',
        idv2: ''
    }]

    let newProducerV1 = [{
        label: '',
        id: ''
    }]
    let newTypeSuplyV1 = [{
        label: '',
        id: ''
    }]
    let newCategoryV1 = [{
        label: '',
        id: '',
        idv2: ''
    }]
    let newPrintedMatterV1 = [{
        label: '',
        id: ''
    }]

    const scriptedRef = useScriptRef();
    const { hanldUpdateSupplies, isSubmit, isError } = useUpdateSupplies()
    const [itemCabinet, setdataCabinet] = React.useState<any>([]);
    const [itemAuthor, setdataAuthor] = React.useState<any>([]);
    const [itemTypeSuply, setdataTypeSuply] = React.useState<any>([]);
    const [itemProducer, setdataProducer] = React.useState<any>([]);
    const [itemCategory, setdataCategory] = React.useState<any>([]);
    const [itemPrintedMatter, setdataPrintedMatter] = React.useState<any>([]);

    const [valueCabinet, setValueCabinet] = React.useState<any>([]);
    const [valueAuthor, setValueAuthor] = React.useState<any>([]);
    const [valueTypeSuply, setValueTypeSuply] = React.useState<any>([]);
    const [valueProducer, setValueProducer] = React.useState<any>([]);
    const [valueCategory, setValueCategory] = React.useState<any>([]);
    // const [valuePrintedMatter, setValuePrintedMatter] = React.useState<any>([]);
    const [, setValuePrintedMatter] = React.useState<any>([]);
    const [isNewCabin, setNewCabin] = React.useState<boolean>(false);

    const [isOpenTacGia, setOpenTacGia] = React.useState(false);
    const [isOpenLinhVuc, setOpenLinhVuc] = React.useState(false);
    const [isOpenMonHoc, setOpenMonHoc] = React.useState(false);
    const [isOpenLoaiHocLieu, setOpenLoaiHocLieu] = React.useState(false);
    const [isOpenNXB, setOpenNXB] = React.useState(false);
    const [isOpenTuKe, setOpenTuKe] = React.useState(false);

    React.useEffect(() => {
        props.isSubmit(isSubmit)
    }, [isSubmit]);
    React.useEffect(() => {
        props.isError(isError)
    }, [isError]);

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
                id: item.authorId,
                idv2: item.detailAuthorId,
            }));
        props.dataTypeSuply.forEach((item) =>
            newTypeSuply.push({
                label: item.name,
                id: item.id,
            }));
        props.dataCategory.forEach((item) =>
            newCategory.push({
                label: item.categoryName,
                id: item.categoryId,
                idv2: item.categoryDetailId
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
        setValuePrintedMatter(newPrintedMatter)
    }, [props.dataCabinet, props.dataAuthor, props.dataProducer, props.dataCategory, props.dataPrintedMatter, props.dataUpdate, props.dataTypeSuply])

    React.useEffect(() => {

        if (props.dataUpdate?.category !== null) {
            props.dataUpdate?.category.list.forEach((item: any, index) => {
                newCategoryV1.push({
                    label: item['categoryName'],
                    id: item['categoryId'],
                    idv2: item['categoryId']
                })
            })
            setdataCategory(newCategoryV1.slice(1))
        }

        if (props.dataUpdate?.typeOfSupply !== null) {
            newTypeSuplyV1.push({
                label: props.dataUpdate?.typeOfSupply[0]?.name,
                id: props.dataUpdate?.typeOfSupply[0]?.id
            })
            setdataTypeSuply(newTypeSuplyV1[1])
        }

        if (props.dataUpdate?.printedMatter !== null) {
            newPrintedMatterV1.push({
                label: props.dataUpdate?.printedMatter['printedMatterName'],
                id: props.dataUpdate?.printedMatter['printedMatterId']
            })
            setdataPrintedMatter(newPrintedMatterV1[1])
        }
        if (props.dataUpdate?.publisher !== null) {
            newProducerV1.push({
                label: props.dataUpdate?.publisher['publisherName'],
                id: props.dataUpdate?.publisher['publisherId']
            })
            setdataProducer(newProducerV1[1])
        }
        if (props.dataUpdate?.authors !== null) {
            props.dataUpdate?.authors.list.forEach((item: any, index) => {
                newAuthorV1.push({
                    label: item['authorName'],
                    id: item['authorId'],
                    idv2: item['detailAuthorId']
                })
            })
            setdataAuthor(newAuthorV1.slice(1))
        }

        if (props.dataUpdate?.cabinets !== null) {
            newCabinetV1.push({
                label: props.dataUpdate?.cabinets?.position,
                id: props.dataUpdate?.cabinets?.cabinetId
            })
            setdataCabinet(newCabinetV1[1])
        }
    }, [props.dataUpdate])

    React.useEffect(() => {
        setNewCabin(false)
        if (itemCabinet?.length !== 0) {
            setNewCabin(true)
        }
        if (itemCabinet?.length === 0 || itemCabinet === null) {
            setNewCabin(false)
        }
    }, [itemCabinet]);

    return (
        <>
            <IBreadcrumsCustom profile="QUẢN LÝ ẤN PHẨM" mainProfile="CẬP NHẬT ẤN PHẨM" link="/thu-vien/an-pham" />
            <MainCard >
                <Grid height='auto'>
                    <Formik
                        initialValues={{
                            supplyId: props.dataUpdate.supplyId,
                            supplyName: props.dataUpdate.supplyName,
                            ISBN: props.dataUpdate.ISBN,
                            printedMatter: props.dataUpdate.printedMatter,
                            supplyNote: props.dataUpdate.supplyNote,
                            quantity: props.dataUpdate.quantity,
                            cabinet_quantity: props.dataUpdate.cabinet_quantity,
                            publisher: props.dataUpdate.publisher,
                            category: props.dataUpdate.category,
                            typeOfStorage: props.dataUpdate.typeOfStorage,
                            authors: props.dataUpdate.authors,
                            listMedia: props.dataUpdate.listMedia,
                            cabinets: props.dataUpdate.cabinets,
                            typeOfSupply: props.dataUpdate.typeOfSupply,
                            submit: null
                        }}
                        validationSchema={Yup.object().shape({
                            supplyName: Yup.string().max(255).required('Tên ấn phẩm không đuợc trống'),
                            // ISBN: Yup.string().max(13).required('Mã ấn phẩm không đuợc trống'),
                            // numberEpisodes: Yup.number().required('Số lượng phẩm không đuợc trống'),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                            try {
                                await hanldUpdateSupplies(values, selectedFile, itemCabinet, itemAuthor, itemProducer, itemCategory, itemPrintedMatter, itemTypeSuply, props.dataUpdate?.authors?.list, props.dataUpdate?.category?.list)

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
                                <Grid md={12} container justifyContent='space-between'>
                                    <Grid md={2} sm={12} container>
                                        <Grid md={12}>
                                            <>
                                                {preview === '' ?
                                                    <>
                                                        {props.dataUpdate?.listMedia !== null &&
                                                            <img alt='logo' style={{ borderRadius: '5px' }} width='100%' src={`${process.env.REACT_APP_BASE_API_URL}${props.dataUpdate?.listMedia[props.dataUpdate?.listMedia.length - 1]['url']}`} />}
                                                    </>
                                                    :
                                                    <img alt='logo' style={{ borderRadius: '5px' }} width='100%' src={preview} />}
                                            </>

                                        </Grid>
                                        <Grid md={12}>
                                            <InputLabel sx={{ fontWeight: '700', fontSize: '16px' }} id="upload-photo"> Chọn hình ảnh
                                                <Input type="file" name="photo" id="upload-photo" sx={{ display: 'none' }}
                                                    inputProps={{ accept: 'image/*' }}
                                                    onChange={handleImageInput}
                                                />
                                            </InputLabel>
                                        </Grid>
                                    </Grid>
                                    <Grid md={9.5} sm={12} container>
                                        <Grid md={12} container gap={2} justifyContent='space-between'>
                                            <Grid md={3.5} sm={12} xs={12}>
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
                                            <Grid md={3.5} sm={12} xs={12}>
                                                <FormControl fullWidth error={Boolean(touched.ISBN && errors.ISBN)}>
                                                    <TextField
                                                        id="outlined-adornment-ISBN"
                                                        type="text"
                                                        value={values.ISBN}
                                                        name="ISBN"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        inputProps={{}}
                                                        label="Mã ấn phẩm"
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
                                                                value={itemCategory}
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
                                                                id="combo-box-TypeSuply"
                                                                options={valueTypeSuply}
                                                                onChange={(event, newValue) => setdataTypeSuply(newValue)}
                                                                value={itemTypeSuply}
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
                                                                value={itemAuthor}
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
                                                                value={itemProducer}
                                                                onChange={(event, newValue) => setdataProducer(newValue)}
                                                                renderInput={(params) => <TextField {...params} label="Chọn nhà xuất bản" />}
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
                                                                value={itemCabinet}
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
                                            <Grid container justifyContent='space-between' md={3.5} sm={12} xs={12}>
                                                <Grid md={isNewCabin ? 5 : 12} sm={12} xs={12}>
                                                    <FormControl fullWidth error={Boolean(touched.quantity && errors.quantity)}>
                                                        <TextField
                                                            id="outlined-adornment-quantity"
                                                            type="number"
                                                            value={values.quantity}
                                                            name="quantity"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            inputProps={{}}
                                                            label="Số lượng"
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
                                                    <Grid item md={5} sm={12} xs={12} mt={{ md: 0, sm: 2, xs: 2 }}>
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
                                        <Grid md={12} xs={12} mt={2}>
                                            <FormControl fullWidth error={Boolean(touched.supplyNote && errors.supplyNote)}>
                                                <TextareaAutosize
                                                    id="outlined-adornment-supplyNote"
                                                    value={values.supplyNote}
                                                    name="supplyNote"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    minRows={5}
                                                    style={{ borderRadius: '10px', borderColor: '#616161', minWidth: 100 }}
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

                                <Grid container sx={{ mt: 2 }} justifyContent='center' gap={3}>
                                    <Grid lg={1.2} md={2} xs={5}>
                                        <AnimateButton>
                                            <ButtonGD title="Cập nhật" color="secondary" disabled={isSubmitting} width="100%" type="submit" />

                                        </AnimateButton>
                                    </Grid>
                                    <Grid lg={1.2} md={2} xs={5}>
                                        <AnimateButton>
                                            <ButtonGD isColor title="Huỷ" disabled={isSubmitting} width="100%"
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
