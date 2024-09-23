import { useCallback, useState } from "react";
import { USER_API } from "../../../../_apis/api-endpoint";
import { dispatch } from "../../../../store";
import { getContactWaiting } from "../../../../store/slices/libraryConnection";
import { openSnackbar } from "../../../../store/slices/snackbar";
import axios from "../../../../utils/axios";
import { getContactSchoolWaiting } from "../../../../store/slices/contactSchool";

export const useUpdateContact = () => {
  const [isUpdate, setUpdate] = useState(false);
  const hanldUpdateContact = useCallback(async (nameContact, nameContactEN, addressContact, phoneContact, hotline, facebook, zalo, map, email) => {
    setUpdate(false)
    const dataUpdate = {
      "nameContact": nameContact,
      "nameContactEN": nameContactEN,
      "addressContact": addressContact,
      "phoneContact":phoneContact,
      "hotline": hotline,
      "fax": "",
      "zaloContact": zalo,
      "emailContact": email,
      "facebookContact": facebook,
      "youtubeContact": "youtube.com",
      "urlContact": "",
      "urlGoogleMap": map,
      "ScriptFacebook": ""
    }

    await axios.patch(USER_API.Contact, dataUpdate);

    try {
      setUpdate(true)
      dispatch(getContactSchoolWaiting());
      dispatch(openSnackbar({
        open: true,
        message: 'Cập nhật thông tin trường thành công',
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
      setUpdate(true)
      dispatch(openSnackbar({
        open: true,
        message: 'Cập nhật thông tin trường thất bại',
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
    }
  }, [])


  return { hanldUpdateContact, isUpdate }
}
