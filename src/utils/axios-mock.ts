/**
 * axios setup to use mock service
 */

 import axios from 'axios';
 
 const axiosMock = axios.create();
 
 // interceptor for http
 axiosMock.interceptors.response.use(
     (response) => response,
     (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
 );
 
 export default axiosMock;
 