import { useCallback, useState } from "react";
import { dispatch } from "../../../../store";
import { getSuppliesWaiting } from "../../../../store/slices/supplies";
import axios from "../../../../utils/axios";
import { USER_API } from "../../../../_apis/api-endpoint";
import { openSnackbar } from "../../../../store/slices/snackbar";

export const useCreateSupplies = () => {

  const [isSubmit, setSubmit] = useState(false);
  const [reponses, setReponse] = useState(0);

  const hanldCreateSupplies = useCallback(async (data, imageSupply, itemCabinet, itemAuthor, itemProducer, itemCategory, itemPrintedMatter, itemTypeSuply) => {
    setReponse(0)
    let newAuthor: any = []
    let newCategory: any = []
    let newTypeSuply: any = []

    const newItemAuthor = itemAuthor?.filter(item => item?.id !== 'khac')

    const formData = new FormData()

    if (itemCabinet !== undefined && itemCabinet !== data.cabinets && itemCabinet?.length !== 0) {
      formData.append('cabinetId', itemCabinet?.id)
      formData.append('cabinet_quantity', data.cabinet_quantity)
    }
    if (itemAuthor !== undefined && itemAuthor !== data.authors && itemAuthor?.length !== 0) {
      newItemAuthor.forEach((item: any, index) => {
        newAuthor.push(item?.id)
        formData.append('authorId', newAuthor[index])
      });
    }
    if (itemCategory !== undefined && itemCategory !== data.authors && itemCategory?.length !== 0) {
      itemCategory.forEach((item: any, index) => {
        newCategory.push(item?.id)
        formData.append('categoryId', newCategory[index])
      });
    }
    if (itemTypeSuply !== undefined && itemTypeSuply !== data.authors && itemTypeSuply?.length !== 0) {
      itemTypeSuply.forEach((item: any, index) => {
        newTypeSuply.push(item?.id)
        formData.append('typeOfSupply', newTypeSuply[index])
      });
    }

    formData.append('supplyName', data.supplyName)
    formData.append('printedMatterId', itemPrintedMatter?.[1]?.printedMatterId)
    formData.append('publisherId', itemProducer.id)
    formData.append('quantity', data.quantity)
    formData.append('supplyDescription', data.supplyDescription)
    formData.append('imageSupply', imageSupply)
    formData.append('ISBN', data.ISBN)
    formData.append('supplyNote', data.supplyNote)

    const dataSubmit = {
      authorName: data.newAuthor,
      authorDescription: '',
    }

    if (data.newAuthor !== '') {
      const reponse = await axios.post(USER_API.Author, dataSubmit);
      newAuthor.push(reponse?.data?.identifiers[0].authorId)
      formData.append('authorId', reponse?.data?.identifiers[0].authorId)
      if (reponse.status === 201) {
        const reponseSupply = await axios.post(USER_API.Supplies, formData);
        setReponse(reponseSupply.status)
      }
    } else {
      const reponseSupply = await axios.post(USER_API.Supplies, formData);
      setReponse(reponseSupply.status)
      if (reponseSupply.status === 200 || reponseSupply.status === 201) {
        setSubmit(true)
        dispatch(getSuppliesWaiting());
        dispatch(openSnackbar({
          open: true,
          message: 'Thêm ấn phẩm thành công',
          variant: 'alert',
          alert: {
            color: 'info'
          },
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          close: true,
          autoHideDuration: 100,
          transition: 'SlideLeft'
        }))
      }
    }

    try {
      if (reponses === 200 || reponses === 201) {
        setSubmit(true)
        dispatch(getSuppliesWaiting());
        // dispatch(openSnackbar({
        //   open: true,
        //   message: 'Thêm ấn phẩm thành công',
        //   variant: 'alert',
        //   alert: {
        //     color: 'info'
        //   },
        //   anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        //   close: true,
        //   autoHideDuration: 100,
        //   transition: 'SlideLeft'
        // }))
      } else {
        setSubmit(true)
        // dispatch(openSnackbar({
        //   open: true,
        //   message: 'Thêm ấn phẩm thất bại',
        //   variant: 'alert',
        //   alert: {
        //     color: 'error'
        //   },
        //   anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        //   close: true,
        //   autoHideDuration: 100,
        //   transition: 'SlideLeft'
        // }))
      }

    } catch (e) {
      dispatch(openSnackbar({
        open: true,
        message: 'Thêm ấn phẩm thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
    } finally {
      dispatch(getSuppliesWaiting());
    }
  }, [])


  return { hanldCreateSupplies, isSubmit }
}
