import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, TextField } from "@mui/material";
import React from "react";
import ButtonGD from "../../../ui-component/ButtonGD";
import MainCard from "../../../ui-component/cards/MainCard";
import AnimateButton from "../../../ui-component/extended/AnimateButton";
import CreateAccount from "./components/formInput";
import UpdateSupply from "./components/formUpdate";
import EnhancedTable from "./components/tableSupply";
import { useDeleteSupplies } from "./hook/deleteSuply";
import { useImportExcelSupplies } from "./hook/importExcel";
// ==============================|| TABLE - STICKY HEADER ||============================== //
export default function StickyHeadTable(props: {
  [x: string]: any;
  dataSupplies: any;
  dataCabinet: any;
  dataAuthor: any;
  dataProducer: any;
  dataCategory: any;
  dataPrintedMatter: any;
  dataTypeSuply: any;
}) {

  const [keyFind, setKeyFind] = React.useState<string>('');
  const [isSelect, setSelect] = React.useState<number>(0);
  const [dataDele, setDatale] = React.useState([]);
  const [isCreate, setIsCreate] = React.useState<number>(0);
  const [isError, setIsError] = React.useState<any>(null);
  const [dataUpdate, setDataUpdate] = React.useState<any>([]);
  const [isSubmit, setSubmit] = React.useState<boolean>(false);

  const [itemAuthor, setItemAuthor] = React.useState<any>(null);
  const [itemProducer, setItemProducer] = React.useState<any>(null);
  const [itemCategory, setItemCategory] = React.useState<any>(null);
  const [itemMonHoc, setItemMonHoc] = React.useState<any>(null);
  // const [itemPrintedMatter, setItemPrintedMatter] = React.useState<any>(null);
  const [itemPrintedMatter, ] = React.useState<any>(null);

  const [valueAuthor, setValueAuthor] = React.useState<any>([]);
  const [valueProducer, setValueProducer] = React.useState<any>([]);
  const [valueCategory, setValueCategory] = React.useState<any>([]);
  const [, setValuePrintedMatter] = React.useState<any>([]);
  // const [valuePrintedMatter, setValuePrintedMatter] = React.useState<any>([]);
  const [valueMonhoc, setValueMonhoc] = React.useState<any>([]);

  const [, setDataSupplies] = React.useState<any>([]);
  const [dataAuthor, setDataAuthor] = React.useState<any>([]);
  const [dataCabinet, setDataCabinet] = React.useState<any>([]);
  const [dataCategory, setDataCategory] = React.useState<any>([]);
  const [dataMonhoc, setDataMonhoc] = React.useState<any>([]);
  const [dataPrintedMatter, setDataPrintedMatter] = React.useState<any>([]);
  const [dataProducer, setDataProducer] = React.useState<any>([]);

  const [dataSupplies, setDataSuppliesFilter] = React.useState<any>([]);

  React.useEffect(() => {
    setDataSupplies(props.dataSupplies);
    setDataAuthor(props.dataAuthor);
    setDataCabinet(props.dataCabinet);
    setDataCategory(props.dataCategory);
    setDataPrintedMatter(props.dataPrintedMatter);
    setDataProducer(props.dataProducer);
    setDataMonhoc(props.dataTypeSuply);
  }, [props.dataSupplies, props.dataAuthor, props.dataCabinet, props.dataCategory, props.dataPrintedMatter, props.dataProducer, props.dataTypeSuply]);

  React.useEffect(() => {
    let dataFilter = props.dataSupplies.filter(item => {
      return item.printedMatter?.printedMatterName !== props.dataPrintedMatter?.[0]?.printedMatterName;
    });

    if (itemCategory !== null) {
      dataFilter = props.dataSupplies.filter(item => {
        return item.printedMatter?.printedMatterName !== props.dataPrintedMatter?.[0]?.printedMatterName;
      });
    }

    if (itemMonHoc !== null) {
      dataFilter = dataFilter.filter(item => {
        return item.typeOfSupply?.some(type => type.id === itemMonHoc?.id);
      });
    }

    if (itemAuthor !== null) {
      dataFilter = dataFilter.filter(item => {
        return item.authors?.list?.some(author => author.authorId === itemAuthor?.id);
      });
    }

    if (itemProducer !== null) {
      dataFilter = dataFilter.filter(item => {
        return item.publisher?.publisherId === itemProducer?.id;
      });
    }

    if (itemPrintedMatter !== null) {
      dataFilter = dataFilter.filter(item => {
        return item.printedMatter?.printedMatterId === itemPrintedMatter?.id;
      });
    }

    setDataSuppliesFilter(dataFilter);

  }, [itemCategory, itemProducer, itemAuthor, itemPrintedMatter, props.dataSupplies, itemMonHoc, props.dataPrintedMatter]);

  const updateValues = React.useCallback(
    () => {
      const newAuthor = dataAuthor.filter(item => item.authorId !== null && item.authorName !== null).map(item => ({
        label: item.authorName,
        id: item.authorId
      }));

      const newCategory = dataCategory.filter(item => item.categoryId !== null && item.categoryName !== null).map(item => ({
        label: item.categoryName,
        id: item.categoryId,
        name: 'category'
      }));

      const newProducer = dataProducer.filter(item => item?.publisherId !== null && item?.publisherName !== null).map(item => ({
        label: item?.publisherName,
        id: item.publisherId
      }));

      const newPrintedMatter = dataPrintedMatter.filter(item => item.printedMatterId !== null && item.printedMatterName !== null).map(item => ({
        label: item.printedMatterName,
        id: item.printedMatterId
      }));

      const newMonHoc = dataMonhoc.filter(item => item.id !== null && item.name !== null).map(item => ({
        label: item.name,
        id: item.id
      }));

      setValueProducer(newProducer);
      setValueCategory(newCategory);
      setValueAuthor(newAuthor);
      setValuePrintedMatter(newPrintedMatter);
      setValueMonhoc(newMonHoc);
      // setVa(newPrintedMatter.slice(1));
    },
    [dataAuthor, dataProducer, dataCategory, dataPrintedMatter, dataMonhoc]
  );

  React.useEffect(() => {
    if (
      dataSupplies.length !== 0 ||
      dataCabinet.length !== 0 ||
      dataAuthor.length !== 0 ||
      dataProducer.length !== 0 ||
      dataCategory.length !== 0 ||
      dataPrintedMatter.length !== 0) {
      updateValues();
    }
  }, [dataSupplies, dataCabinet, dataAuthor, dataProducer, dataCategory, dataPrintedMatter, updateValues]);


  const { hanldDeleteSupplies, isDelete } = useDeleteSupplies()

  React.useEffect(() => {
    if (isSubmit || isDelete) {
      setIsCreate(0)
    }
  }, [isSubmit, isDelete]);

  React.useEffect(() => {
    if (isError === 422) {
      // setAlert(true)
      setIsCreate(0)
      setTimeout(() => setIsError(null), 3000)
    }
    if (isError === 200) {
      // setAlert(true)
      setIsCreate(0)
      setTimeout(() => setIsError(false), 3000)
    }

  }, [isError]);

  const handleTabCreate = () => {
    setIsCreate(1)
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleComform = (dataDele) => {
    hanldDeleteSupplies(dataDele)
    setOpen(false);
  };

  const { hanldImportExcelSupplies } = useImportExcelSupplies()

  const handleExcelInput = (e: any) => {
    const file = e.target.files[0];
    hanldImportExcelSupplies(file)
  }

  return (
    <>
      {isCreate === 0 &&
        <>
          {/* <IBreadcrumsCustom profile="TRANG CHỦ" mainProfile="QUẢN LÝ HỌC LIỆU" link="/trang-chu" /> */}
          <MainCard title="DANH SÁCH HỌC LIỆU">
            <Grid height='auto'>
              <Grid container justifyContent='space-between' width="100%" height="auto" gap={2}>
                <Grid width={{ lg: '300px', md: '250px', sm: '300px', xs: '100%' }}>
                  <FormControl fullWidth>
                    <TextField type="text" label="Tìm kiếm theo tên học liệu" variant="outlined" onChange={(e) => setKeyFind(e.target.value)} />
                  </FormControl>
                </Grid>
                {/* <Grid width={{ lg: '300px', md: '250px', sm: '300px', xs: '100%' }}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    id="combo-box-PrintedMatter"
                    options={valuePrintedMatter}
                    // multiple
                    onChange={(event, newValue) => setItemPrintedMatter(newValue)}
                    renderInput={(params) => <TextField {...params} label="Chọn Loại học liệu" />}
                  />
                </Grid> */}
                <Grid width={{ lg: '300px', md: '250px', sm: '300px', xs: '100%' }}>
                  <FormControl fullWidth>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      id="combo-box-Category"
                      options={valueCategory}
                      // multiple
                      onChange={(event, newValue) => setItemCategory(newValue)}
                      renderInput={(params) => <TextField {...params} label="Chọn Dạng học liệu" />}
                    />
                  </FormControl>
                </Grid>
                <Grid width={{ lg: '300px', md: '250px', sm: '300px', xs: '100%' }}>
                  <FormControl fullWidth>
                    <Autocomplete
                      fullWidth
                      disablePortal
                      id="combo-box-Category"
                      options={valueMonhoc}
                      // multiple
                      onChange={(event, newValue) => setItemMonHoc(newValue)}
                      renderInput={(params) => <TextField {...params} label="Chọn Lĩnh vực" />}
                    />
                  </FormControl>
                </Grid>
                <Grid width={{ lg: '300px', md: '250px', sm: '300px', xs: '100%' }}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    id="combo-box-Author"
                    options={valueAuthor}
                    // multiple
                    onChange={(event, newValue) => setItemAuthor(newValue)}
                    renderInput={(params) => <TextField {...params} label="Chọn Tác giả" />}
                  />
                </Grid>
                <Grid width={{ lg: '300px', md: '250px', sm: '300px', xs: '100%' }}>
                  <Autocomplete
                    fullWidth
                    disablePortal
                    id="combo-box-Producer"
                    options={valueProducer}
                    // multiple
                    onChange={(event, newValue) => setItemProducer(newValue)}
                    renderInput={(params) => <TextField {...params} label="Chọn Nhà xuất bản" />}
                  />
                </Grid>
              </Grid>
              <Grid container gap={3} mt={2} justifyContent={{ lg: 'flex-start', md: 'space-between' }}>
                <Grid lg={2} md={3.5} sm={12} xl={2} xs={12}>
                  <ButtonGD width="100%" title="Thêm mới" onClick={handleTabCreate}></ButtonGD>
                </Grid>
                <Grid lg={2} md={3.5} sm={12} xl={2} xs={12}>
                  <AnimateButton>
                    <Button
                      style={{ height: '50px', width: '100%', background: '#2196F2', border: 'none', borderRadius: '5px' }}
                    >
                      <a style={{ color: '#fff' }} href='https://drive.google.com/drive/folders/10LZEB_gqJvGW_IHXotONHVmAMWM-7i26?usp=sharing' target="_blank" rel="noreferrer">Tải xuống mẫu</a>
                    </Button>
                  </AnimateButton>
                </Grid>
                <Grid lg={2} md={3.5} sm={12} xl={2} xs={12}>
                  <AnimateButton>
                    <Button
                      variant="contained"
                      component="label"
                      sx={{ height: '50px', width: '100%' }}
                    >
                      Tải lên từ file Excel
                      <input
                        type="file"
                        hidden
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={handleExcelInput}
                      />
                    </Button>
                  </AnimateButton>

                </Grid>
                <Grid lg={2} md={3.5} sm={12} xl={2} xs={12}>
                  <ButtonGD width="100%" title="Xóa" isColor disabled={isSelect === 0} onClick={handleOpen}></ButtonGD>
                </Grid>
              </Grid>
              <Grid mt={2}>
                {dataSupplies !== undefined && dataSupplies?.length !== 0
                  && dataAuthor !== undefined && dataAuthor?.length !== 0
                  && dataProducer !== undefined && dataProducer?.length !== 0
                  && dataCategory !== undefined && dataCategory?.length !== 0
                  && dataPrintedMatter !== undefined && dataPrintedMatter?.length !== 0
                  ?
                  <EnhancedTable data={dataSupplies} keyFind={keyFind} setSelect={(newValue: any) => setSelect(newValue)} dataDelete={(data) => setDatale(data)} setIsCreate={(newIs) => setIsCreate(newIs)} dataUpdate={(newUp) => setDataUpdate(newUp)} />
                  :
                  <Grid container justifyContent='center' mt={5}>
                    <Grid container justifyContent='center' width='100%'>Chưa có dữ liệu</Grid>
                    {/* <CircularProgress /> */}
                  </Grid>
                }
              </Grid>
            </Grid>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="draggable-dialog-title"
            >
              <DialogTitle textAlign='center' style={{ cursor: 'move' }} id="draggable-dialog-title">
                Thông báo
              </DialogTitle>
              <DialogContent>
                <DialogContentText textAlign='center' sx={{ fontWeight: '700', color: '#AA0000', fontSize: '16px' }}>
                  Bạn chắc chắn muốn xóa?
                  <Grid mt={1} container gap={1} justifyContent='center'>
                    <DialogContentText sx={{ fontWeight: '600', color: '#000' }}>{dataDele?.length} </DialogContentText>
                    <DialogContentText sx={{ fontWeight: '600' }}>Ấn phẩm</DialogContentText>
                  </Grid>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <ButtonGD title="Chắn chắn" onClick={() => handleComform(dataDele)}></ButtonGD>
                <ButtonGD title="Hủy bỏ" isColor onClick={handleClose}></ButtonGD>
              </DialogActions>
            </Dialog>
          </MainCard>
        </>
      }

      {isCreate === 1 &&
        <>
          <CreateAccount
            dataCabinet={dataCabinet}
            dataAuthor={dataAuthor}
            dataProducer={dataProducer}
            dataCategory={dataCategory}
            dataPrintedMatter={dataPrintedMatter}
            dataTypeSuply={props.dataTypeSuply}
            isSubmit={(newValue: any) => setSubmit(newValue)} isCancel={(newCancel) => setIsCreate(newCancel)} />
        </>
      }

      {isCreate === 2 &&
        <>
          <UpdateSupply
            dataCabinet={dataCabinet}
            dataAuthor={dataAuthor}
            dataProducer={dataProducer}
            dataCategory={dataCategory}
            dataPrintedMatter={dataPrintedMatter}
            dataUpdate={dataUpdate}
            dataTypeSuply={props.dataTypeSuply}
            isSubmit={(newValue: any) => setSubmit(newValue)} isCancel={(newCancel) => setIsCreate(newCancel)} isError={(newError) => setIsError(newError)} />
        </>
      }
    </>
  );
}
