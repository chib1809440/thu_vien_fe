import { useCallback, useState } from "react";
import { USER_API } from "../../../../_apis/api-endpoint";
import { dispatch } from "../../../../store";
import { getSuppliesWaiting } from "../../../../store/slices/supplies";
import axios from "../../../../utils/axios";
import { openSnackbar } from "../../../../store/slices/snackbar";

export const useUpdateSupplies = () => {

  const [isSubmit, setSubmit,] = useState(false);
  const [isError, setError,] = useState<any>(null);

  const hanldUpdateSupplies = useCallback(async (data, imageSupply, itemCabinet, itemAuthor, itemProducer, itemCategory, itemPrintedMatter, itemTypeSuply, itemAuthorDetail, itemCategoryDetail) => {

    let newAuthor: any = []
    let newCategory: any = []
    const formData = new FormData()
    formData.append('supplyId', data.supplyId)
    formData.append('supplyName', data.supplyName)
    formData.append('supplyDescription', data.supplyDescription)
    formData.append('quantity', data.quantity)
    formData.append('ISBN', data.ISBN)
    formData.append('supplyNote', data.supplyNote)

    if (imageSupply !== undefined) {
      formData.append('imageSupply', imageSupply)
    }

    if (itemProducer !== undefined && itemProducer !== data.publisher && itemProducer?.length !== 0) {
      formData.append('publisherId', itemProducer.id)
    }
    if (itemCabinet !== undefined && itemCabinet !== data.publisher && itemCabinet?.length !== 0) {
      formData.append('cabinetId', itemCabinet.id)
    }
    if (itemCabinet !== undefined && itemCabinet !== data.publisher && itemCabinet?.length !== 0) {
      formData.append('cabinet_quantity', data.cabinet_quantity)
    }

    if (itemPrintedMatter !== undefined && itemPrintedMatter !== data.printedMatter && itemPrintedMatter?.length !== 0) {
      formData.append('printedMatterId', itemPrintedMatter.id)
    }
    if (itemTypeSuply !== undefined && itemTypeSuply !== data.printedMatter && itemTypeSuply?.length !== 0) {
      formData.append('typeOfSupply', itemTypeSuply.id)
    }

    if (itemAuthor !== undefined && itemAuthor !== data.authors && itemAuthor?.length !== 0) {
      itemAuthor.forEach((item: any, index) => {
        newAuthor.push({
          id: item.id,
          detailId: item.idv2
        })
        if (newAuthor[index].id !== '') {
          formData.append(`authors[${index}][authorId]`, newAuthor[index].id)
        }
      });
    }
    if (itemAuthorDetail !== undefined && itemAuthorDetail !== data.authors && itemAuthorDetail?.length !== 0) {
      itemAuthorDetail.forEach((item: any, index) => {
        formData.append(`authors[${index}][detailAuthorId]`, item.detailAuthorId)
      });
    }
    // 
    // if (itemCabinet !== undefined && itemCabinet !== data.cabinets && itemCabinet?.length !== 0) {
    //   itemCategory.forEach((item: any, index) => {
    //     newCategory.push(item.id)
    //     formData.append(`cabinet[${index}][cabinetId]`, newCabinet[index])
    //   });
    //   formData.append('cabinet_quantity', data.cabinet_quantity)
    // }
    // if (itemCategory !== undefined &&  itemCategory?.length !== 0) {
    //   itemCategory.forEach((item: any, index) => {
    //     if (item.categoryId)
    //       formData.append(`category[${index}][categoryId]`, item.id)
    //   });
    // }
    // if (itemCategoryDetail !== undefined  && itemCategoryDetail?.length !== 0) {
    //   itemCategoryDetail.forEach((item: any, index) => {
    //     if (item.categoryDetailId)
    //       formData.append(`category[${index}][categoryDetailId]`, item.categoryDetailId)
    //   });
    // }

    if (itemCategory !== undefined && itemCategory !== data.Categorys && itemCategory?.length !== 0) {
      itemCategory.forEach((item: any, index) => {
        newCategory.push({
          id: item.id,
          detailId: item.idv2
        })
        if (newCategory[index].id !== '') {
          formData.append(`category[${index}][categoryId]`, newCategory[index].id)
        }
      });
    }
    if (itemCategoryDetail !== undefined && itemCategoryDetail !== data.Categorys && itemCategoryDetail?.length !== 0) {
      itemCategoryDetail.forEach((item: any, index) => {
        formData.append(`category[${index}][categoryDetailId]`, item.categoryDetailId)
      });
    }


    const respon = await axios.patch(USER_API.Supplies, formData);

    try {
      setSubmit(true)
      dispatch(getSuppliesWaiting());
      setError(respon.status)
      dispatch(openSnackbar({
        open: true,
        message: 'Cập nhật ấn phẩm thành công',
        variant: 'alert',
        alert: {
          color: 'info'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
    } catch (e) {
      dispatch(openSnackbar({
        open: true,
        message: 'Cập nhật ấn phẩm thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
      // setSubmit(false)
      setError(respon.status)
    } finally {
      dispatch(getSuppliesWaiting());
    }
  }, [])


  return { hanldUpdateSupplies, isSubmit, isError }
}
