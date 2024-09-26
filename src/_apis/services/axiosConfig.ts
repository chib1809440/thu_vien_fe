import axios from "axios";

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    headers: { "Content-Type": "application/json" },
});

console.log("api", process.env.REACT_APP_BASE_API_URL);

axiosClient.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("serviceToken");
        if (accessToken) {
            config.headers!["Authorization"] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // const { pathname } = window.location;
        // if (error.response.status === 401 && pathname !== '/login') {
        //     localStorage.removeItem('accessToken');
        //     window.location.href = '/login';
        // }
        return Promise.reject(error);
    }
);

export default axiosClient;
