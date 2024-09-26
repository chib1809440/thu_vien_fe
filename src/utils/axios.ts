import axios from 'axios';

const axiosServices = axios.create({
	baseURL: process.env.REACT_APP_BASE_API_URL
});

axiosServices.interceptors.response.use(response => {
	return response.data;
}, error => {
	const { pathname } = window.location;
	if (error.response.status === 401 && pathname !== '/login') {
		localStorage.removeItem("serviceToken");
		window.location.href = "/login";		
	}
	return Promise.reject(error);
});

export default axiosServices;

// export const axiosServicesAdditional = axios.create({
// 	baseURL: 'YOUR_ADDITIONAL_API_URL',
// });

// axiosServicesAdditional.interceptors.response.use(response => {
// 	return response;
// }, error => {
// 	// Handle additional instance errors if needed
// 	return Promise.reject(error);
// });
