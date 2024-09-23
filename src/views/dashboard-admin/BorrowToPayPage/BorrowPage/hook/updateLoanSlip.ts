import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getLoanSlipWaiting } from "../../../../../store/slices/loanSlip";
import axios from "../../../../../utils/axios";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useUpdateLoanSlip = () => {

  const [isUpdate, setUpdate] = useState(false);

  const hanldUpdateLoanSlip = useCallback(async (data, dataUpdate, valueProduct) => {

    setUpdate(false)
    let newProductDetail: any = []

    dataUpdate?.supplies.forEach((item: any, index) => {
      if (valueProduct[index] !== 0) {
        newProductDetail.push({
          supplyId: item?.supply?.supplyId,
          returned_qty: valueProduct[index],
          date: new Date()
        })
      }
    });

    let numberTotalSupply = 0;
    let numberDetail = 0;
    const sum = valueProduct.reduce((total, num) => total + num);

    for (let i = 0; i < dataUpdate?.supplies?.length; i++) {
      numberTotalSupply = numberTotalSupply + dataUpdate?.supplies[i]?.qty;
      for (let j = 0; j < dataUpdate?.supplies[i]?.detail?.length; j++) {
        numberDetail = numberDetail + dataUpdate?.supplies[i]?.detail[j]?.returned_qty;
      }
    }

    const dataSubmit = {
      loanSlipNumber: dataUpdate.loanSlipNumber,
      supplies: newProductDetail,
      limited_date : '',
      note: data.note,
      state: numberTotalSupply === numberDetail + sum ? true : false
    }
    const dataSubmitV2 = {
      loanSlipNumber: dataUpdate.loanSlipNumber,
      note: data.note,
      limited_date : '',
      state: numberTotalSupply === numberDetail + sum ? true : false
    }

    await axios.patch(USER_API.LoanSlip, newProductDetail?.length > 0 ? dataSubmit : dataSubmitV2);
    try {
      setUpdate(true)
      dispatch(getLoanSlipWaiting());
      dispatch(openSnackbar({
        open: true,
        message: 'Cập nhật phiếu mượn thành công',
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
        message: 'Cập nhật phiếu mượn thất bại',
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        close: true,
        autoHideDuration: 100,
        transition: 'SlideLeft'
      }))
      setUpdate(false)
    } finally {
    }
  }, [])


  return { hanldUpdateLoanSlip, isUpdate }
}
