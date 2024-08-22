import axios from 'axios'
import { getToken } from './AuthService';
const BASE_URL=import.meta.env.VITE_BASE_REST_API_URL ;
const BASE_REST_API_URL=BASE_URL+"/auth";

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  config.headers['Authorization'] = getToken();
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

export const updatePassword=(userId:any,userDto:any)=>axios.put(BASE_REST_API_URL+'/updatePassword/'+userId,userDto);

export const userListAPI=(page:any,size:any)=>axios.get(BASE_REST_API_URL+'/userList?page='+page+'&size='+size);

export const departmentListAPI=()=>axios.get(BASE_REST_API_URL+'/departmentList');

export const findProfile=(userId:any)=>axios.get(BASE_REST_API_URL+'/findProfile/'+userId);

export const updateProfile=(userId:any,userDto:any)=>axios.put(BASE_REST_API_URL+'/updateProfile/'+userId,userDto);

export const findUserIdByUsernameAPI=()=>axios.get(BASE_URL+"/users/find-user-id");
