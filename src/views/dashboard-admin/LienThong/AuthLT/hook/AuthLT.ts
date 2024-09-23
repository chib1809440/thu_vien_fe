import axios from "axios";
import React from "react";
import axiosServicesLT from "../../../../../utils/axiosV2";
import { dispatch } from "../../../../../store";
import { isLoginWaiting } from "../../../../../store/slices/isLoginLT";

export const AuthLT = () => {

  const loginLT = React.useCallback(async (username, password, itemApi) => {

    const data = {
      "username": username,
      "password": password,
    }

    const reponse = await axios.post(`${itemApi.id}/auth/login`, data);
    const serviceTokenLT = reponse?.data?.access_token

    try {
      localStorage.setItem("apiLT", itemApi.id);
      localStorage.setItem("reactR", reponse?.data?.role);
      localStorage.setItem('serviceTokenLT', serviceTokenLT);
      dispatch(isLoginWaiting());

    } catch (e) {
      localStorage.removeItem('serviceTokenLT');
      delete axiosServicesLT.defaults.headers.common.Authorization;
      dispatch(isLoginWaiting());
    } finally {
    }
  }, [])


  return { loginLT }
}
