import axios from 'axios';

const apiLT = localStorage.getItem("apiLT");

const axiosServicesAdditional = axios.create({
  baseURL: apiLT || '',
});

axiosServicesAdditional.interceptors.response.use(
  (response) => response,
  (error) => {
    // return Promise.reject(error);
  }
);

export default axiosServicesAdditional;
