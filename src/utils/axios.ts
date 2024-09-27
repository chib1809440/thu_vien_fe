// import axios from 'axios';

// const axiosServices = axios.create({
// 	baseURL: process.env.REACT_APP_BASE_API_URL
// });

// axiosServices.interceptors.response.use(response => {
// 	return response;
// }, error => {
// 	const { pathname } = window.location;
// 	if (error.response.status === 401 && pathname !== '/login') {
// 		localStorage.removeItem("serviceToken");
// 		window.location.href = "/login";
// 	}
// 	return error.response;
// });

// export default axiosServices;

import axios from 'axios';
import { dispatch } from '../store';
import { LOGIN, LOGOUT } from '../store/actions';

// Tạo instance axios
const axiosServices = axios.create({
	baseURL: process.env.REACT_APP_BASE_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Token refresh logic
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Thêm access token vào header nếu tồn tại
axiosServices.interceptors.request.use((config) => {
	const token = localStorage.getItem('serviceToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
}, (error) => Promise.reject(error));

// Xử lý việc refresh token
axiosServices.interceptors.response.use((response) => {
	return response;
}, async (error) => {
	const { pathname } = window.location;
	const originalRequest = error.config;

	// Kiểm tra xem lỗi có phải do token hết hạn và không phải là đường dẫn /login
	if (error.response && error.response.status === 401 && pathname !== '/login') {
		// Kiểm tra xem đã refresh token hay chưa
		if (!isRefreshing) {
			isRefreshing = true;

			try {
				const refreshToken = localStorage.getItem('refreshToken');

				// Gửi yêu cầu refresh token
				const { data } = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/auth/refresh-token`, {
					refreshToken,
				});

				const newToken = data.data.accessToken;
				const newRefreshToken = data.data.refreshToken;

				// Cập nhật token mới vào localStorage
				localStorage.setItem('serviceToken', newToken);
				localStorage.setItem('refreshToken', newRefreshToken);

				// Cập nhật token cho yêu cầu gốc
				originalRequest.headers.Authorization = `Bearer ${newToken}`;

				// Dispatch action LOGIN khi token được refresh thành công
				dispatch({
					type: LOGIN,
					payload: {
						isLoggedIn: true,
						user: data.data // Giả sử API trả về thông tin user
					}
				});

				// Thông báo tất cả các yêu cầu đang chờ rằng token đã được cập nhật
				onRrefreshed(newToken);
				isRefreshing = false;

				// Thực hiện lại yêu cầu ban đầu với token mới
				return axiosServices(originalRequest);
			} catch (refreshError) {
				localStorage.removeItem('serviceToken');
				localStorage.removeItem('refreshToken');
				localStorage.removeItem('dataUser');
				window.location.href = '/login';
				dispatch({
					type: LOGOUT
				});
				return Promise.reject(refreshError);
			}
		}

		// Thêm yêu cầu đang chờ vào hàng đợi
		return new Promise((resolve) => {
			subscribeTokenRefresh((token: string) => {
				originalRequest.headers.Authorization = `Bearer ${token}`;
				resolve(axiosServices(originalRequest));
			});
		});
	}
	return Promise.reject(error.response.data);
});


// Hàm để thêm các yêu cầu vào hàng đợi khi refresh token
const subscribeTokenRefresh = (cb: (token: string) => void) => {
	refreshSubscribers.push(cb);
};

// Gọi tất cả các yêu cầu sau khi refresh token thành công
const onRrefreshed = (token: string) => {
	refreshSubscribers.forEach((cb) => cb(token)); // Sử dụng forEach thay vì map để không trả về mảng
	refreshSubscribers = []; // Xóa danh sách subscribers sau khi gọi
};

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
