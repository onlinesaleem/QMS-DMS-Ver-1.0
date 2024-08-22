import axios from 'axios'
import { getToken } from './AuthService';

const BASE_URL=import.meta.env.VITE_BASE_REST_API_URL ;
const BASE_REST_API_URL = BASE_URL+"/user-module-permissions";

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    config.headers['Authorization'] = getToken();
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});



export const getUserPermissionApi = (userId) => {
    if (!userId) {
      return Promise.reject(new Error("Invalid user ID"));
    }
    return axios.get(`${BASE_REST_API_URL}/user/${userId}/permissions`);
  };