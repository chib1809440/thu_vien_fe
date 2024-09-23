import { useCallback, useState } from "react";
import { USER_API } from "../../../../../_apis/api-endpoint";
import { dispatch } from "../../../../../store";
import { getAuthorWaiting } from "../../../../../store/slices/author";
import axios from "../../../../../utils/axios";

export const useDeleteTypeProduct = () =>{

    const [isDelete, setDelete] = useState(false);
    
    const hanldDeleteTypeProduct = useCallback(async (authorId) => {
      
      await axios.delete(USER_API.Author, {data: {"authorId": authorId}});
        try {
          setDelete(true)
          dispatch(getAuthorWaiting());
            
        } catch (e) {
          setDelete(false)
        } finally {
        }
      }, [])


    return { hanldDeleteTypeProduct, isDelete }
}
