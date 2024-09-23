import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getSuppliesWaiting } from "../../../../../store/slices/supplies";
import axios from "../../../../../utils/axios";
import { getStateOfBookWaiting } from "../../../../../store/slices/stateOfBook";
import { openSnackbar } from "../../../../../store/slices/snackbar";

export const useUpdateTypeProduct = () => {
  const [isUpdate, setUpdate] = useState(false);

  const hanldUpdateStateOfBook = useCallback(async (data, qtyDAMAGED, qtyLIQUIDATED) => {

    const arrFilter = data?.idLIQUIDATED.filter((item) => item.supply?.supplyId === data?.supplyId);
    const damagedFilter = arrFilter.filter((status) => status.state === 'DAMAGED');
    const liquidated = arrFilter.filter((status) => status.state === 'LIQUIDATED');

    const liquidatedPromises = liquidated.map((item) => (
      axios.patch(USER_API.StateOfBook, {
        id: item.id,
        state: 'LIQUIDATED',
        qty: qtyLIQUIDATED / liquidated.length,
      })
    ));
    const damagedPromises = damagedFilter.map((item) => (
      axios.patch(USER_API.StateOfBook, {
        id: item.id,
        state: 'DAMAGED',
        qty: damagedFilter.length !== 0 ? qtyDAMAGED / damagedFilter.length : qtyDAMAGED,
      })
    ));

    try {
      const damagedResults = await Promise.all(damagedPromises);
      const liquidatedResults = await Promise.all(liquidatedPromises);

      // Check if all promises have status 200
      const allPromisesSucceeded = [...liquidatedResults, ...damagedResults].every(result => result.status === 200 || result.status === 201);

      if (allPromisesSucceeded) {
        // Set isUpdate to true only if all promises have status 200
        setUpdate(true);
        dispatch(openSnackbar({
          open: true,
          message: 'Cập nhật thành công',
          variant: 'alert',
          alert: {
            color: 'info'
          },
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
          close: true,
          autoHideDuration: 100,
          transition: 'SlideLeft'
        }))
        dispatch(getStateOfBookWaiting())
        // Rest of your code...
      } else {
        dispatch(openSnackbar({
          open: true,
          message: 'Cập nhật thất bại',
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

    } catch (error) {
      // Handle errors...
    } finally {
      // Reset isUpdate to false
      setUpdate(false);
    }
  }, []);

  return { isUpdate, hanldUpdateStateOfBook };
};
