import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getAuthorWaiting } from "../../../../../store/slices/author";
import axios from "../../../../../utils/axios";

export const useCreateTypeProduct = () => {

  const [isSubmit, setSubmit] = useState(false);
  const hanldCreateTypeProduct = useCallback(async (data) => {
    const dataSubmit = {
      authorName: data.authorName,
      authorDescription: data.authorDescription,
    }

    const reponse = await axios.post(USER_API.Author, dataSubmit);

    try {
      setSubmit(true)
      dispatch(getAuthorWaiting());

    } catch (e) {
      setSubmit(false)
    } finally {
    }
  }, [])


  return { hanldCreateTypeProduct, isSubmit }
}
